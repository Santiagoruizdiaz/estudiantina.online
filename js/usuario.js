/**
 * Estudiantina.online — Servicio Centralizado de Usuarios Únicos
 * 
 * Gestiona el perfil y sesión única del usuario en toda la plataforma:
 * - Single Source of Truth (SST) para identidad estudiantil (@username único)
 * - Sincronización reactiva entre pestañas y páginas (storage event & CustomEvents)
 * - Auto-revalidación y sincronización con el backend SQLite
 * - Helper unificado para avatares, handles y badges de autor
 */

const STORAGE_KEY_USER = "comunidad_google_user";
const STORAGE_KEY_ADMIN_TOKEN = "comunidad_admin_token";
const STORAGE_KEY_ADMIN_USER = "comunidad_admin_user";

class UsuarioServiceClass {
  constructor() {
    this._user = null;
    this._listeners = new Set();
    this._syncPromise = null;

    // Cargar del storage inicial
    this._loadFromStorage();

    // Sincronización reactiva entre pestañas
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY_USER) {
          this._loadFromStorage();
          this._notifyListeners();
        }
      });
    }
  }

  /**
   * Carga y normaliza el usuario desde localStorage
   */
  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      if (!raw) {
        this._user = null;
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && (parsed.googleId || parsed.google_id)) {
        this._user = this.normalizeUser(parsed);
      } else {
        this._user = null;
      }
    } catch (e) {
      console.warn("[UsuarioService] Error leyendo usuario del storage:", e);
      this._user = null;
    }
  }

  /**
   * Normaliza la estructura del usuario para garantizar consistencia total
   */
  normalizeUser(data) {
    if (!data) return null;
    const googleId = String(data.googleId || data.google_id || "").trim();
    if (!googleId) return null;

    let username = String(data.username || data.autor_username || "").trim().toLowerCase();
    // Limpiar caracteres inválidos
    username = username.replace(/[^a-z0-9_]/g, "");

    const nombre = String(data.nombre || data.autor_nombre || "Hincha de Posadas").trim();
    const email = String(data.email || "").trim();
    const avatarUrl = String(data.avatarUrl || data.avatar_url || data.avatar || "").trim();
    const avatarPersonalizado = String(data.avatarPersonalizado || data.avatar_personalizado || "").trim();
    const colegioId = String(data.colegioId || data.colegio_id || "janssen").trim().toLowerCase();
    const rolEstudiantil = String(data.rolEstudiantil || data.rol_estudiantil || data.rol || "Hincha de Tribuna").trim();
    const anoEscolar = String(data.anoEscolar || data.ano_escolar || "5° Año (Promo)").trim();
    const bio = String(data.bio || "").trim();
    const instagram = String(data.instagram || "").trim();
    const estado = String(data.estado || "activo").trim();

    return {
      googleId,
      username,
      nombre,
      email,
      avatarUrl,
      avatarPersonalizado,
      colegioId,
      rolEstudiantil,
      anoEscolar,
      bio,
      instagram,
      estado
    };
  }

  /**
   * Retorna el usuario autenticado actual o null
   */
  getUser() {
    if (!this._user) {
      this._loadFromStorage();
    }
    return this._user;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isLoggedIn() {
    const u = this.getUser();
    return !!(u && u.googleId);
  }

  /**
   * Verifica si el usuario tiene un @username único asignado
   */
  hasUsername() {
    const u = this.getUser();
    return !!(u && u.username && u.username.length >= 3);
  }

  /**
   * Guarda o actualiza el usuario en localStorage y notifica a la web
   */
  setUser(userData) {
    const normalized = this.normalizeUser(userData);
    if (!normalized) {
      this.clearUser();
      return;
    }

    this._user = normalized;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(normalized));
    } catch (e) {
      console.error("[UsuarioService] Error guardando usuario:", e);
    }

    this._notifyListeners();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("estudiantina:user-changed", { detail: normalized }));
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  clearUser() {
    this._user = null;
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {}

    this._notifyListeners();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("estudiantina:user-changed", { detail: null }));
    }
  }

  /**
   * Suscribe un callback a cambios en la identidad del usuario
   */
  onChange(callback) {
    if (typeof callback === "function") {
      this._listeners.add(callback);
      // Notificar estado actual de inmediato
      callback(this.getUser());
    }
    return () => {
      this._listeners.delete(callback);
    };
  }

  _notifyListeners() {
    const current = this.getUser();
    for (const cb of this._listeners) {
      try {
        cb(current);
      } catch (e) {
        console.error("[UsuarioService] Error en listener:", e);
      }
    }
  }

  /**
   * Sincroniza el usuario con el servidor SQLite para asegurar consistencia
   */
  async syncWithServer(force = false) {
    const current = this.getUser();
    if (!current || !current.googleId) return null;

    if (this._syncPromise && !force) {
      return this._syncPromise;
    }

    this._syncPromise = (async () => {
      try {
        const res = await fetch(`/api/foro?action=perfil&id=${encodeURIComponent(current.googleId)}`, {
          cache: "no-cache"
        });
        if (!res.ok) return current;

        const data = await res.json();
        if (data && data.status === "ok" && data.usuario) {
          const srvUser = data.usuario;
          const merged = {
            ...current,
            username: srvUser.username || current.username,
            nombre: srvUser.nombre || current.nombre,
            colegioId: srvUser.colegio_id || current.colegioId,
            rolEstudiantil: srvUser.rol_estudiantil || current.rolEstudiantil,
            anoEscolar: srvUser.ano_escolar || current.anoEscolar,
            bio: srvUser.bio !== undefined ? srvUser.bio : current.bio,
            instagram: srvUser.instagram !== undefined ? srvUser.instagram : current.instagram,
            avatarPersonalizado: srvUser.avatar_personalizado !== undefined ? srvUser.avatar_personalizado : current.avatarPersonalizado,
            avatarUrl: srvUser.avatar_url || current.avatarUrl,
            estado: srvUser.estado || current.estado
          };

          this.setUser(merged);
          return merged;
        }
      } catch (e) {
        // En caso de estar offline o sin red, mantener datos locales
        console.warn("[UsuarioService] No se pudo sincronizar perfil con servidor:", e.message);
      } finally {
        this._syncPromise = null;
      }
      return current;
    })();

    return this._syncPromise;
  }

  /**
   * Retorna la mejor URL de avatar para un usuario
   */
  getAvatar(user) {
    const u = user || this.getUser();
    if (!u) return "assets/avatar-default.webp";
    if (u.avatarPersonalizado) return u.avatarPersonalizado;
    if (u.avatar_personalizado) return u.avatar_personalizado;
    if (u.avatarUrl) return u.avatarUrl;
    if (u.avatar_url) return u.avatar_url;
    if (u.avatar) return u.avatar;
    return "assets/avatar-default.webp";
  }

  /**
   * Retorna el handle con arroba (ej: @sonta)
   */
  getHandle(user) {
    const u = user || this.getUser();
    if (!u) return "@hincha";
    const raw = u.username || u.autor_username || "";
    if (raw) return `@${raw.toLowerCase().replace(/[^a-z0-9_]/g, "")}`;
    const fallback = (u.nombre || u.autor_nombre || "hincha").toLowerCase().replace(/[^a-z0-9_]/g, "_");
    return `@${fallback}`;
  }

  /**
   * Retorna el nombre visible (ej: "Santy Ruiz Diaz")
   */
  getDisplayName(user) {
    const u = user || this.getUser();
    if (!u) return "Hincha";
    return u.nombre || u.autor_nombre || "Hincha";
  }

  /**
   * Inicializa o renderiza el componente de usuario en cualquier navbar
   * @param {Object} options
   * @param {HTMLElement|string} options.container - Elemento contenedor o ID
   * @param {string} options.sourcePage - Nombre de la página para redirecciones ('home', 'foro', 'noticia', 'comunidad')
   */
  initGlobalNavUser(options = {}) {
    const container = typeof options.container === "string" 
      ? document.getElementById(options.container) 
      : options.container;

    if (!container) return;

    const sourcePage = options.sourcePage || "home";

    const render = (user) => {
      if (!user) {
        // Estado NO LOGUEADO
        container.innerHTML = `
          <a href="foro.html?login=1" class="btn-global-nav-login" title="Iniciá sesión para participar en debates y personalizar tu perfil">
            <span class="nav-login-icon">👤</span>
            <span class="nav-login-text">Ingresar</span>
          </a>
        `;
        return;
      }

      // Estado LOGUEADO
      const avatarSrc = this.getAvatar(user);
      const handle = this.getHandle(user);
      const displayName = this.getDisplayName(user);
      const schoolId = user.colegioId || "janssen";
      const profileUrl = `foro.html?user=${encodeURIComponent(user.googleId)}`;

      container.innerHTML = `
        <a href="${profileUrl}" class="global-nav-user-pill" title="Tu perfil de Estudiantina (${handle})">
          <img class="global-nav-user-avatar" src="${avatarSrc}" alt="${displayName}" onerror="this.src='assets/avatar-default.webp'" />
          <div class="global-nav-user-info">
            <span class="global-nav-user-name">${displayName}</span>
            <span class="global-nav-user-handle">${handle}</span>
          </div>
        </a>
      `;
    };

    // Suscribir y renderizar de inmediato
    this.onChange(render);

    // Disparar sincronización con servidor en segundo plano
    this.syncWithServer();
  }
}

export const UsuarioService = new UsuarioServiceClass();
