/**
 * FORO DE DEBATE ESTUDIANTIL - APLICACIÓN DEDICADA FULL-PAGE
 * estudiantina.online - Módulo ES nativo
 */

import { COLEGIOS } from "./colegios.js";

function decodeEntities(str) {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function escapeHtml(str) {
  if (!str) return "";
  const decoded = decodeEntities(String(str));
  return decoded
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function timeAgo(dateStr) {
  if (!dateStr) return "Reciente";
  try {
    let clean = String(dateStr).trim();
    if (clean.includes(" ") && !clean.includes("T")) {
      clean = clean.replace(" ", "T") + "Z";
    }
    let d = new Date(clean);
    if (isNaN(d.getTime())) {
      d = new Date(dateStr);
    }
    if (isNaN(d.getTime())) return "Reciente";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (diffMs < 0) return "Hace un momento";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 45) return "Ahora";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `hace ${diffMin}m`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "ayer";
    if (diffDays < 7) return `hace ${diffDays}d`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} sem`;
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  } catch (e) {
    return "Reciente";
  }
}

class ForoApp {
  constructor() {
    this.activeCanal = "todos";
    this.activeSort = "top";
    this.searchQuery = "";
    this.activeThreadId = null;

    // Paginación
    this.page = 0;
    this.pageSize = 10;
    this.hasMore = false;
    this.isLoading = false;

    // Usuario y sesión compartida con el portal
    this.currentUser = JSON.parse(localStorage.getItem("comunidad_google_user") || "null");
    this.userVotes = new Set(JSON.parse(localStorage.getItem("comunidad_voted_threads") || "[]"));

    // Moderador / Admin
    this.adminToken = localStorage.getItem("comunidad_admin_token") || null;
    this.adminUser = localStorage.getItem("comunidad_admin_user") || null;

    // Elementos del DOM
    this.channelsGrid = document.getElementById("channels-grid");
    this.threadsContainer = document.getElementById("threads-container");
    this.threadsCountBadge = document.getElementById("forum-threads-count");
    this.activeChannelPill = document.getElementById("forum-active-channel-name");
    this.statChannelsCount = document.getElementById("stat-channels-count");
    this.statThreadsCount = document.getElementById("stat-threads-count");
    this.searchInput = document.getElementById("forum-search-input");
    this.searchClearBtn = document.getElementById("btn-forum-search-clear");
    this.loadMoreWrap = document.getElementById("forum-load-more-wrap");
    this.loadMoreBtn = document.getElementById("btn-load-more-threads");

    // Barra de usuario
    this.authUnregistered = document.getElementById("auth-unregistered-wrap");
    this.userProfile = document.getElementById("forum-user-profile");
    this.userAvatarImg = document.getElementById("user-avatar-img");
    this.userProfileName = document.getElementById("user-profile-name");
    this.userSchoolBadge = document.getElementById("user-profile-school-badge");
    this.btnLogout = document.getElementById("btn-logout");
    this.btnGoogleLogin = document.getElementById("btn-google-login");
    this.btnProposeTopic = document.getElementById("btn-propose-topic");

    // Modales
    this.modalThread = document.getElementById("modal-thread");
    this.btnCloseThread = document.getElementById("btn-close-thread");
    this.modalTopic = document.getElementById("modal-topic");
    this.btnCloseTopic = document.getElementById("btn-close-topic");
    this.formTopic = document.getElementById("form-topic");
    this.topicSchool = document.getElementById("topic-school");
    this.topicCanal = document.getElementById("topic-canal");
    this.topicTitle = document.getElementById("topic-title");
    this.topicDesc = document.getElementById("topic-desc");

    // Modal Auth
    this.modalGoogleAuth = document.getElementById("modal-google-auth");
    this.btnCloseAuthModal = document.getElementById("btn-close-auth-modal");
    this.authSelectSchool = document.getElementById("auth-select-school");
    this.googleGisContainer = document.getElementById("google-gis-container");
    this.btnQuickLogin = document.getElementById("btn-quick-login");

    // Modal Admin
    this.modalAdminLogin = document.getElementById("modal-admin-login");
    this.btnCloseAdminLogin = document.getElementById("btn-close-admin-login");
    this.formAdminLogin = document.getElementById("form-admin-login");
    this.adminTopBar = document.getElementById("admin-top-bar");
    this.adminBarUser = document.getElementById("admin-bar-user");
    this.btnAdminLogout = document.getElementById("btn-admin-logout");
    this.btnFooterAdmin = document.getElementById("btn-footer-admin-trigger");

    // Vista de Hilo / Modal
    this.threadModalTitle = document.getElementById("thread-modal-title");
    this.threadModalChannel = document.getElementById("thread-modal-channel");
    this.threadModalDate = document.getElementById("thread-modal-date");
    this.threadOpAvatar = document.getElementById("thread-op-avatar");
    this.threadOpName = document.getElementById("thread-op-name");
    this.threadOpSchool = document.getElementById("thread-op-school");
    this.threadOpContent = document.getElementById("thread-op-content");
    this.threadModalVotes = document.getElementById("thread-modal-votes");
    this.threadModalRepliesCount = document.getElementById("thread-modal-replies-count");
    this.btnVoteThread = document.getElementById("btn-vote-thread");
    this.btnShareThreadModal = document.getElementById("btn-share-thread-modal");
    this.btnReportThread = document.getElementById("btn-report-thread");
    this.threadRepliesList = document.getElementById("thread-replies-list");
    this.formReply = document.getElementById("form-reply");
    this.replyInputContent = document.getElementById("reply-input-content");
    this.replyUserAvatar = document.getElementById("reply-user-avatar");
    this.replySchoolHint = document.getElementById("reply-school-hint");

    // Toast
    this.toastEl = document.getElementById("toast-notification");
    this.toastTimer = null;
  }

  init() {
    this.populateSchools();
    this.initGoogleAuth();
    this.updateUserBar();
    this.updateAdminBar();
    this.bindEvents();

    // Comprobar parámetros de la URL (?canal=..., ?hilo=...)
    const params = new URLSearchParams(window.location.search);
    const canalParam = params.get("canal");
    if (canalParam) {
      this.activeCanal = canalParam;
    }

    // Cargar Canales y Debates Iniciales
    this.loadChannels();
    this.loadThreads(false);

    // Deep link a hilo específico
    const hiloParam = params.get("hilo");
    if (hiloParam) {
      this.openThread(hiloParam);
    }
  }

  getColegio(id) {
    if (!id) return { nombre: "Colegio de Posadas", escudo: "🥁", color: "#38bdf8" };
    return COLEGIOS.find(c => c.id === id) || { nombre: id, escudo: "🥁", color: "#38bdf8" };
  }

  populateSchools() {
    const options = (COLEGIOS || []).map(c => 
      `<option value="${c.id}">${c.escudo || "🥁"} ${c.nombre}</option>`
    ).join("");

    if (this.topicSchool) this.topicSchool.innerHTML = options;
    if (this.authSelectSchool) this.authSelectSchool.innerHTML = options;
  }

  initGoogleAuth() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: "835470646102-o3cek7j04044toj84llkr6867du14mj8.apps.googleusercontent.com",
          callback: this.handleGoogleCredential.bind(this),
          auto_select: false
        });

        if (this.googleGisContainer) {
          window.google.accounts.id.renderButton(this.googleGisContainer, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular"
          });
        }
      } catch (e) {
        console.warn("Google GIS init:", e);
      }
    }
  }

  handleGoogleCredential(response) {
    if (!response || !response.credential) return;
    try {
      const payloadBase64 = response.credential.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
      const schoolId = (this.authSelectSchool && this.authSelectSchool.value) || "janssen";

      const user = {
        googleId: decoded.sub,
        nombre: decoded.name || "Hincha de Posadas",
        email: decoded.email || "",
        avatarUrl: decoded.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${decoded.sub}`,
        colegioId: schoolId
      };

      this.saveUser(user);
    } catch (e) {
      console.error("Error al decodificar credencial de Google:", e);
    }
  }

  quickLogin() {
    const schoolId = (this.authSelectSchool && this.authSelectSchool.value) || "janssen";
    const demoNames = ["Pasista Costanera", "Redoblante de Oro", "Hincha de la Tribuna", "Bastonera Central", "Director de Banda"];
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
    const randomId = "google_user_" + Math.floor(Math.random() * 89999 + 10000);

    const user = {
      googleId: randomId,
      nombre: randomName,
      email: `${randomId}@gmail.com`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${randomId}`,
      colegioId: schoolId
    };

    this.saveUser(user);
  }

  async saveUser(user) {
    this.currentUser = user;
    localStorage.setItem("comunidad_google_user", JSON.stringify(user));
    this.updateUserBar();

    if (this.modalGoogleAuth) this.modalGoogleAuth.classList.remove("active");

    const col = this.getColegio(user.colegioId);
    this.showToast(`¡Conectado como ${user.nombre} (${col.nombre})!`);

    try {
      await fetch("/api/foro?action=auth_google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.warn("Error sincronizando usuario:", err);
    }

    if (this.activeThreadId) {
      this.openThread(this.activeThreadId);
    }
  }

  updateUserBar() {
    const isLogged = !!this.currentUser;
    document.body.classList.toggle("has-user", isLogged);

    const userBarEl = document.getElementById("forum-user-bar");
    if (userBarEl) {
      userBarEl.classList.toggle("is-authenticated", isLogged);
    }

    if (this.btnGoogleLogin) {
      this.btnGoogleLogin.classList.toggle("is-hidden", isLogged);
      if (isLogged) {
        this.btnGoogleLogin.setAttribute("hidden", "hidden");
        this.btnGoogleLogin.style.setProperty("display", "none", "important");
      } else {
        this.btnGoogleLogin.removeAttribute("hidden");
        this.btnGoogleLogin.style.setProperty("display", "inline-flex", "important");
      }
    }

    if (this.authUnregistered) {
      this.authUnregistered.style.setProperty("display", isLogged ? "none" : "flex", "important");
    }

    if (this.userProfile) {
      this.userProfile.classList.toggle("is-hidden", !isLogged);
      if (isLogged) {
        this.userProfile.removeAttribute("hidden");
        this.userProfile.style.setProperty("display", "flex", "important");
      } else {
        this.userProfile.setAttribute("hidden", "hidden");
        this.userProfile.style.setProperty("display", "none", "important");
      }
    }

    if (isLogged) {
      if (this.userAvatarImg) this.userAvatarImg.src = this.currentUser.avatarUrl;
      if (this.userProfileName) this.userProfileName.textContent = this.currentUser.nombre;

      const col = this.getColegio(this.currentUser.colegioId);
      if (this.userSchoolBadge) {
        this.userSchoolBadge.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
      }
      if (this.topicSchool) this.topicSchool.value = this.currentUser.colegioId;
      if (this.replyUserAvatar) this.replyUserAvatar.src = this.currentUser.avatarUrl;
      if (this.replySchoolHint) {
        this.replySchoolHint.textContent = `📍 Comentando como hincha de ${col.nombre}`;
      }
    } else {
      if (this.replySchoolHint) {
        this.replySchoolHint.textContent = "📍 Comentando como hincha anónimo";
      }
    }
  }

  updateAdminBar() {
    if (this.adminToken && this.adminTopBar) {
      this.adminTopBar.style.display = "block";
      if (this.adminBarUser) this.adminBarUser.textContent = this.adminUser || "admin";
    } else if (this.adminTopBar) {
      this.adminTopBar.style.display = "none";
    }
  }

  bindEvents() {
    // Auth Google Login
    if (this.btnGoogleLogin) {
      this.btnGoogleLogin.addEventListener("click", () => {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
        this.initGoogleAuth();
      });
    }
    if (this.btnCloseAuthModal) {
      this.btnCloseAuthModal.addEventListener("click", () => {
        this.modalGoogleAuth.classList.remove("active");
      });
    }
    if (this.btnQuickLogin) {
      this.btnQuickLogin.addEventListener("click", () => this.quickLogin());
    }
    if (this.btnLogout) {
      this.btnLogout.addEventListener("click", () => {
        this.currentUser = null;
        localStorage.removeItem("comunidad_google_user");
        this.updateUserBar();
        this.showToast("Sesión cerrada");
      });
    }

    // Iniciar debate (botón de hero y FAB)
    const handleOpenCreateModal = () => {
      if (!this.currentUser) {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
        this.showToast("Por favor identificate para iniciar un debate");
        return;
      }
      if (this.modalTopic) this.modalTopic.classList.add("active");
    };

    if (this.btnProposeTopic) {
      this.btnProposeTopic.addEventListener("click", handleOpenCreateModal);
    }
    const btnFab = document.getElementById("btn-fab-topic");
    if (btnFab) {
      btnFab.addEventListener("click", handleOpenCreateModal);
    }
    if (this.btnCloseTopic) {
      this.btnCloseTopic.addEventListener("click", () => {
        this.modalTopic.classList.remove("active");
      });
    }
    if (this.formTopic) {
      this.formTopic.addEventListener("submit", (e) => this.handleCreateTopic(e));
    }

    // Modal Hilo
    if (this.btnCloseThread) {
      this.btnCloseThread.addEventListener("click", () => this.closeThreadModal());
    }
    if (this.modalThread) {
      this.modalThread.addEventListener("click", (e) => {
        if (e.target === this.modalThread) this.closeThreadModal();
      });
    }
    if (this.formReply) {
      this.formReply.addEventListener("submit", (e) => this.handleSubmitReply(e));
    }
    if (this.btnVoteThread) {
      this.btnVoteThread.addEventListener("click", () => {
        if (this.activeThreadId) this.toggleVote(this.activeThreadId);
      });
    }
    if (this.btnShareThreadModal) {
      this.btnShareThreadModal.addEventListener("click", () => {
        if (this.activeThreadId) {
          this.shareThread(this.activeThreadId, this.threadModalTitle.textContent);
        }
      });
    }
    if (this.btnReportThread) {
      this.btnReportThread.addEventListener("click", () => {
        if (this.activeThreadId) this.reportContent("hilo", this.activeThreadId);
      });
    }

    // Búsqueda con debounce (soportando input desktop y mobile)
    let searchTimer = null;
    const searchInputs = [
      this.searchInput,
      document.getElementById("forum-search-input-mobile")
    ].filter(Boolean);

    searchInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        const val = e.target.value.trim();
        // Sincronizar el otro input si existe
        searchInputs.forEach(other => {
          if (other !== input) other.value = e.target.value;
        });
        if (this.searchClearBtn) {
          this.searchClearBtn.style.display = val ? "inline-flex" : "none";
        }
        searchTimer = setTimeout(() => {
          this.searchQuery = val;
          this.page = 0;
          this.loadThreads(false);
        }, 320);
      });
    });

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener("click", () => {
        searchInputs.forEach(input => input.value = "");
        this.searchClearBtn.style.display = "none";
        this.searchQuery = "";
        this.page = 0;
        this.loadThreads(false);
      });
    }

    // Ordenamiento (Más Votados / Recientes)
    const tabSortTop = document.getElementById("tab-sort-top");
    const tabSortRecent = document.getElementById("tab-sort-recent");
    if (tabSortTop && tabSortRecent) {
      tabSortTop.addEventListener("click", () => {
        tabSortTop.classList.add("active");
        tabSortTop.setAttribute("aria-selected", "true");
        tabSortRecent.classList.remove("active");
        tabSortRecent.setAttribute("aria-selected", "false");
        this.activeSort = "top";
        this.page = 0;
        this.loadThreads(false);
      });
      tabSortRecent.addEventListener("click", () => {
        tabSortRecent.classList.add("active");
        tabSortRecent.setAttribute("aria-selected", "true");
        tabSortTop.classList.remove("active");
        tabSortTop.setAttribute("aria-selected", "false");
        this.activeSort = "recientes";
        this.page = 0;
        this.loadThreads(false);
      });
    }

    // Cargar más debates
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener("click", () => {
        if (this.hasMore && !this.isLoading) {
          this.page++;
          this.loadThreads(true);
        }
      });
    }

    // Acceso Admin
    if (this.btnFooterAdmin) {
      this.btnFooterAdmin.addEventListener("click", () => {
        if (this.modalAdminLogin) this.modalAdminLogin.classList.add("active");
      });
    }
    if (this.btnCloseAdminLogin) {
      this.btnCloseAdminLogin.addEventListener("click", () => {
        this.modalAdminLogin.classList.remove("active");
      });
    }
    if (this.formAdminLogin) {
      this.formAdminLogin.addEventListener("submit", (e) => this.handleAdminLogin(e));
    }
    if (this.btnAdminLogout) {
      this.btnAdminLogout.addEventListener("click", () => {
        this.adminToken = null;
        this.adminUser = null;
        localStorage.removeItem("comunidad_admin_token");
        localStorage.removeItem("comunidad_admin_user");
        this.updateAdminBar();
        this.showToast("Sesión de moderador cerrada");
        this.loadThreads(false);
      });
    }

    // Tecla ESC para cerrar modales
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.modalThread && this.modalThread.classList.contains("active")) {
          this.closeThreadModal();
        }
        if (this.modalTopic && this.modalTopic.classList.contains("active")) {
          this.modalTopic.classList.remove("active");
        }
        if (this.modalGoogleAuth && this.modalGoogleAuth.classList.contains("active")) {
          this.modalGoogleAuth.classList.remove("active");
        }
        if (this.modalAdminLogin && this.modalAdminLogin.classList.contains("active")) {
          this.modalAdminLogin.classList.remove("active");
        }
      }
    });
  }

  async loadChannels() {
    try {
      const res = await fetch("/api/foro?action=canales");
      const json = await res.json();
      const canales = json.canales || json.data;
      if (json.status !== "ok" || !Array.isArray(canales)) return;
      if (this.statChannelsCount) this.statChannelsCount.textContent = canales.length;

      let totalHilos = canales.reduce((acc, c) => acc + (parseInt(c.hilos_count, 10) || 0), 0);

      const html = [
        `<button type="button" class="channel-chip ${this.activeCanal === "todos" ? "active" : ""}" data-canal="todos">
          <span>🌟 Todos los Canales</span>
          <span class="channel-count">${totalHilos}</span>
        </button>`
      ];

      canales.forEach(c => {
        const isAct = this.activeCanal === c.id;
        html.push(
          `<button type="button" class="channel-chip ${isAct ? "active" : ""}" data-canal="${escapeHtml(c.id)}">
            <span>${c.icono || "💬"} ${escapeHtml(c.titulo)}</span>
            <span class="channel-count">${c.hilos_count || 0}</span>
          </button>`
        );
      });

      if (this.channelsGrid) {
        this.channelsGrid.innerHTML = html.join("");
        this.channelsGrid.querySelectorAll(".channel-chip").forEach(btn => {
          btn.addEventListener("click", () => {
            this.channelsGrid.querySelectorAll(".channel-chip").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            this.activeCanal = btn.dataset.canal;
            this.page = 0;
            this.loadThreads(false);
          });
        });
      }
    } catch (e) {
      console.warn("Error al cargar canales del foro:", e);
    }
  }

  async loadThreads(append = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    if (!append && this.threadsContainer) {
      this.threadsContainer.innerHTML = `
        <div class="forum-loading-state">
          <div class="loading-spinner"></div>
          <span>Cargando debates de la Costanera...</span>
        </div>`;
    }

    try {
      const offset = this.page * this.pageSize;
      const q = encodeURIComponent(this.searchQuery);
      const url = `/api/foro?action=hilos&canal=${encodeURIComponent(this.activeCanal)}&sort=${this.activeSort}&q=${q}&limit=${this.pageSize}&offset=${offset}`;

      const res = await fetch(url);
      const json = await res.json();
      this.isLoading = false;

      const threads = json.hilos || json.data;
      if (json.status !== "ok" || !Array.isArray(threads)) {
        if (!append && this.threadsContainer) {
          this.threadsContainer.innerHTML = `<div class="empty-state">No se pudieron cargar los debates.</div>`;
        }
        return;
      }
      this.hasMore = threads.length === this.pageSize;
      if (this.loadMoreWrap) {
        this.loadMoreWrap.style.display = this.hasMore ? "block" : "none";
      }

      if (this.activeChannelPill) {
        this.activeChannelPill.textContent = this.activeCanal === "todos" ? "Todos los canales" : `Canal: ${this.activeCanal}`;
      }

      if (!append) {
        if (this.threadsCountBadge) {
          this.threadsCountBadge.textContent = `${threads.length} debates`;
        }
        if (this.statThreadsCount) {
          this.statThreadsCount.textContent = threads.length;
        }

        if (threads.length === 0) {
          this.threadsContainer.innerHTML = `
            <div class="empty-state">
              <span class="empty-state-icon">🥁</span>
              <h3>No se encontraron debates</h3>
              <p>Sé el primero en iniciar un debate sobre este tema o probá con otra búsqueda.</p>
            </div>`;
          return;
        }
        this.threadsContainer.innerHTML = "";
      }

      this.renderThreadsList(threads, append);
    } catch (err) {
      this.isLoading = false;
      console.error("Error al cargar hilos:", err);
      if (!append && this.threadsContainer) {
        this.threadsContainer.innerHTML = `<div class="empty-state">Error de conexión al cargar el foro.</div>`;
      }
    }
  }

  renderThreadsList(threads, append = false) {
    const fragment = document.createDocumentFragment();

    threads.forEach(t => {
      const col = this.getColegio(t.colegio_id);
      const isVoted = this.userVotes.has(t.id);
      const dateText = timeAgo(t.creado_en);

      const card = document.createElement("article");
      card.className = "thread-card";
      card.dataset.id = t.id;

      card.innerHTML = `
        <div class="thread-card-header">
          <div class="thread-author-wrap">
            <img class="thread-author-avatar" src="${escapeHtml(t.autor_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${t.id}`)}" alt="Avatar" loading="lazy" />
            <div class="thread-author-meta">
              <div class="thread-author-row">
                <span class="thread-school-badge" style="border-left: 3px solid ${col.color || "#38bdf8"}">
                  ${col.escudo || "🥁"} ${escapeHtml(col.nombre)}
                </span>
                <span class="meta-dot">&bull;</span>
                <span class="thread-author-name">${escapeHtml(t.autor_nombre || "Hincha")}</span>
                <span class="meta-dot">&bull;</span>
                <span class="thread-time">${dateText}</span>
              </div>
              <div class="thread-sub-meta">
                <span class="thread-channel-badge">${escapeHtml(t.canal_titulo || t.canal_id)}</span>
              </div>
            </div>
          </div>
          ${this.adminToken ? `
            <button type="button" class="btn-admin-thread-mod" title="Moderar debate" data-thread-id="${t.id}">
              ⚙️
            </button>` : ""}
        </div>
        <h3 class="thread-title">${escapeHtml(t.titulo)}</h3>
        <p class="thread-excerpt">${escapeHtml(t.contenido)}</p>
        <div class="thread-card-footer reddit-action-bar">
          <div class="reddit-vote-capsule ${isVoted ? "voted" : ""}" data-thread-id="${t.id}">
            <button type="button" class="btn-vote-arrow btn-vote-up" data-thread-id="${t.id}" aria-label="Upvote">▲</button>
            <span class="vote-count">${t.votos || 0}</span>
          </div>
          <button type="button" class="reddit-action-pill btn-open-replies" data-thread-id="${t.id}">
            <span class="pill-icon">💬</span>
            <span>${t.comentarios_count || 0}</span>
          </button>
          <button type="button" class="reddit-action-pill btn-share-thread-card" data-thread-id="${t.id}" data-thread-title="${escapeHtml(t.titulo)}" title="Compartir enlace">
            <span class="pill-icon">↗</span>
            <span>Compartir</span>
          </button>
        </div>
      `;

      // Eventos de la tarjeta
      card.addEventListener("click", (e) => {
        if (e.target.closest(".reddit-vote-capsule") || e.target.closest(".btn-share-thread-card") || e.target.closest(".btn-admin-thread-mod")) {
          return;
        }
        this.openThread(t.id);
      });

      const voteCapsule = card.querySelector(".reddit-vote-capsule");
      if (voteCapsule) {
        voteCapsule.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleVote(t.id, false, null, voteCapsule);
        });
      }

      const shareBtn = card.querySelector(".btn-share-thread-card");
      if (shareBtn) {
        shareBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.shareThread(t.id, t.titulo);
        });
      }

      const modBtn = card.querySelector(".btn-admin-thread-mod");
      if (modBtn) {
        modBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.reportContent("hilo", t.id);
        });
      }

      fragment.appendChild(card);
    });

    if (append) {
      this.threadsContainer.appendChild(fragment);
    } else {
      this.threadsContainer.innerHTML = "";
      this.threadsContainer.appendChild(fragment);
    }
  }

  async openThread(id) {
    this.activeThreadId = id;
    if (this.modalThread) this.modalThread.classList.add("active");

    // Actualizar URL limpia con ?hilo=ID
    const url = new URL(window.location);
    url.searchParams.set("hilo", id);
    window.history.replaceState({}, "", url);

    if (this.threadOpContent) {
      this.threadOpContent.innerHTML = `<div class="loading-spinner"></div> Cargando debate...`;
    }
    if (this.threadRepliesList) {
      this.threadRepliesList.innerHTML = `<div class="loading-spinner"></div> Cargando comentarios...`;
    }

    try {
      const googleIdParam = this.currentUser ? `&googleId=${encodeURIComponent(this.currentUser.googleId)}` : "";
      const res = await fetch(`/api/foro?action=hilo&id=${encodeURIComponent(id)}${googleIdParam}`);
      const json = await res.json();

      const h = json.hilo || (json.data && json.data.hilo);
      if (json.status !== "ok" || !h) {
        this.showToast("El debate solicitado no existe o fue eliminado");
        this.closeThreadModal();
        return;
      }
      const col = this.getColegio(h.colegio_id);

      if (this.threadModalTitle) this.threadModalTitle.textContent = h.titulo;
      if (this.threadModalChannel) this.threadModalChannel.textContent = h.canal_titulo || h.canal_id;
      if (this.threadModalDate) this.threadModalDate.textContent = timeAgo(h.creado_en);
      if (this.threadOpAvatar) this.threadOpAvatar.src = h.autor_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${h.id}`;
      if (this.threadOpName) this.threadOpName.textContent = h.autor_nombre || "Hincha";
      if (this.threadOpSchool) {
        this.threadOpSchool.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
      }
      if (this.threadOpContent) {
        this.threadOpContent.innerHTML = `<p>${escapeHtml(h.contenido).replace(/\n/g, "<br>")}</p>`;
      }
      if (this.threadModalVotes) this.threadModalVotes.textContent = h.votos || 0;

      const isVoted = h.user_voted === 1 || this.userVotes.has(h.id);
      if (this.btnVoteThread) {
        this.btnVoteThread.classList.toggle("voted", isVoted);
      }

      const replies = json.comentarios || (json.data && json.data.comentarios) || [];
      if (this.threadModalRepliesCount) {
        this.threadModalRepliesCount.textContent = `💬 ${replies.length} respuestas`;
      }

      this.renderReplies(replies);
    } catch (err) {
      console.error("Error al abrir hilo:", err);
      this.showToast("Error de conexión al abrir el debate");
    }
  }

  renderReplies(replies) {
    if (!this.threadRepliesList) return;

    if (replies.length === 0) {
      this.threadRepliesList.innerHTML = `
        <div class="empty-state-small">
          <span>🥁</span>
          <p>Aún no hay comentarios en este debate. ¡Sé el primero en aportar!</p>
        </div>`;
      return;
    }

    const html = replies.map(r => {
      const col = this.getColegio(r.colegio_id);
      const isVoted = r.user_voted === 1;
      const dateText = timeAgo(r.creado_en);

      return `
        <div class="reply-card" data-comment-id="${r.id}">
          <div class="reply-author-row">
            <img class="reply-avatar" src="${escapeHtml(r.autor_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.id}`)}" alt="Avatar" loading="lazy" />
            <div class="reply-author-meta">
              <span class="reply-author-name">${escapeHtml(r.autor_nombre || "Hincha")}</span>
              <span class="reply-author-school">${col.escudo || "🥁"} ${escapeHtml(col.nombre)}</span>
            </div>
            <span class="reply-time">${dateText}</span>
          </div>
          <div class="reply-content">${escapeHtml(r.contenido).replace(/\n/g, "<br>")}</div>
          <div class="reply-actions">
            <button type="button" class="reply-vote-btn ${isVoted ? "voted" : ""}" data-comment-id="${r.id}" aria-label="Votar comentario">
              <span class="vote-icon">▲</span>
              <span class="vote-count">${r.votos || 0}</span>
            </button>
            <button type="button" class="reply-report-btn" data-comment-id="${r.id}" title="Reportar">
              🚩
            </button>
          </div>
        </div>
      `;
    }).join("");

    this.threadRepliesList.innerHTML = html;

    // Listeners de voto y reporte en comentarios
    this.threadRepliesList.querySelectorAll(".reply-vote-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const commentId = btn.dataset.commentId;
        this.toggleVote(this.activeThreadId, true, commentId, btn);
      });
    });

    this.threadRepliesList.querySelectorAll(".reply-report-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const commentId = btn.dataset.commentId;
        this.reportContent("comentario", commentId);
      });
    });
  }

  closeThreadModal() {
    if (this.modalThread) this.modalThread.classList.remove("active");
    this.activeThreadId = null;

    // Restaurar URL limpia
    const url = new URL(window.location);
    url.searchParams.delete("hilo");
    window.history.replaceState({}, "", url);
  }

  async handleSubmitReply(e) {
    e.preventDefault();
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      this.showToast("Debés identificarte para responder");
      return;
    }

    const content = (this.replyInputContent && this.replyInputContent.value.trim()) || "";
    if (content.length < 2) {
      this.showToast("El comentario es demasiado corto");
      return;
    }

    try {
      const res = await fetch("/api/foro?action=comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiloId: this.activeThreadId,
          googleId: this.currentUser.googleId,
          autorNombre: this.currentUser.nombre,
          autorAvatar: this.currentUser.avatarUrl,
          colegioId: this.currentUser.colegioId,
          contenido: content
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        this.replyInputContent.value = "";
        this.showToast("¡Comentario publicado!");
        this.openThread(this.activeThreadId); // Refrescar comentarios
        this.loadThreads(false); // Refrescar contador en feed
      } else {
        this.showToast(json.message || "No se pudo publicar el comentario");
      }
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      this.showToast("Error de conexión al comentar");
    }
  }

  async handleCreateTopic(e) {
    e.preventDefault();
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      this.showToast("Debés identificarte para publicar un debate");
      return;
    }

    const canalId = this.topicCanal.value;
    const schoolId = this.topicSchool.value || this.currentUser.colegioId;
    const title = this.topicTitle.value.trim();
    const desc = this.topicDesc.value.trim();

    if (title.length < 5) {
      this.showToast("El título debe tener al menos 5 caracteres");
      return;
    }
    if (desc.length < 10) {
      this.showToast("El contenido debe tener al menos 10 caracteres");
      return;
    }

    try {
      const res = await fetch("/api/foro?action=crear_hilo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canalId,
          colegioId: schoolId,
          titulo: title,
          contenido: desc,
          googleId: this.currentUser.googleId,
          autorNombre: this.currentUser.nombre,
          autorAvatar: this.currentUser.avatarUrl
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        this.formTopic.reset();
        this.modalTopic.classList.remove("active");
        this.showToast("🚀 ¡Debate creado con éxito!");
        this.loadChannels();
        this.loadThreads(false);
        const newId = json.hiloId || json.id || (json.data && json.data.id);
        if (newId) {
          this.openThread(newId);
        }
      } else {
        this.showToast(json.message || "Error al crear debate");
      }
    } catch (err) {
      console.error("Error al crear debate:", err);
      this.showToast("Error de conexión al crear debate");
    }
  }

  async toggleVote(id, isComment = false, commentId = null, btnEl = null) {
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      this.showToast("Iniciá sesión para votar");
      return;
    }

    const targetType = isComment ? "comentario" : "hilo";
    const targetId = isComment ? commentId : id;

    // Optimismo táctil
    if (btnEl) {
      btnEl.classList.add("vote-pulse");
      setTimeout(() => btnEl.classList.remove("vote-pulse"), 350);
    }

    try {
      const res = await fetch("/api/foro?action=votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: targetType,
          id: targetId,
          googleId: this.currentUser.googleId
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        const voted = json.voted !== undefined ? json.voted : (json.data && json.data.voted);
        const total = json.votos !== undefined ? json.votos : (json.data && json.data.votos);

        if (isComment) {
          if (btnEl) {
            btnEl.classList.toggle("voted", voted);
            const countSpan = btnEl.querySelector(".vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          }
        } else {
          if (voted) {
            this.userVotes.add(targetId);
          } else {
            this.userVotes.delete(targetId);
          }
          localStorage.setItem("comunidad_voted_threads", JSON.stringify(Array.from(this.userVotes)));

          if (this.btnVoteThread) {
            this.btnVoteThread.classList.toggle("voted", voted);
          }
          if (this.threadModalVotes && total !== undefined) {
            this.threadModalVotes.textContent = total;
          }
          if (btnEl) {
            btnEl.classList.toggle("voted", voted);
            const countSpan = btnEl.querySelector(".vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          }
        }
      } else {
        this.showToast(json.message || "No se pudo registrar el voto");
      }
    } catch (err) {
      console.error("Error al votar:", err);
      this.showToast("Error de conexión al votar");
    }
  }

  shareThread(id, title) {
    const url = `${window.location.origin}/foro?hilo=${id}`;
    if (navigator.share) {
      navigator.share({
        title: `${title} | Estudiantina.online`,
        text: "Sumate al debate en el Foro de la Estudiantina de Posadas:",
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast("¡Enlace directo al debate copiado al portapapeles! 📋");
      }).catch(() => {
        prompt("Copiá este enlace para compartir el debate:", url);
      });
    }
  }

  async reportContent(tipo, id) {
    const motivo = prompt("¿Por qué deseás reportar esta publicación? (ej: agresiones, lenguaje ofensivo, spam)");
    if (!motivo) return;

    try {
      const res = await fetch("/api/foro?action=reportar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, id, motivo })
      });
      const json = await res.json();
      if (json.status === "ok") {
        this.showToast("Publicación reportada para revisión de moderación. Gracias.");
      } else {
        this.showToast(json.message || "No se pudo enviar el reporte");
      }
    } catch (e) {
      this.showToast("Error de red al enviar el reporte");
    }
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById("admin-login-user").value.trim();
    const pass = document.getElementById("admin-login-password").value;
    const errEl = document.getElementById("admin-login-error");
    if (errEl) errEl.style.display = "none";

    try {
      const res = await fetch("/api/admin?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: user, password: pass })
      });
      const json = await res.json();
      if (json.status === "ok" && json.data && json.data.token) {
        this.adminToken = json.data.token;
        this.adminUser = user;
        localStorage.setItem("comunidad_admin_token", this.adminToken);
        localStorage.setItem("comunidad_admin_user", this.adminUser);
        if (this.modalAdminLogin) this.modalAdminLogin.classList.remove("active");
        this.updateAdminBar();
        this.showToast("🔓 Sesión de moderador iniciada");
        this.loadThreads(false);
      } else {
        if (errEl) {
          errEl.textContent = json.message || "Usuario o contraseña inválidos";
          errEl.style.display = "block";
        }
      }
    } catch (err) {
      if (errEl) {
        errEl.textContent = "Error de conexión con el servidor";
        errEl.style.display = "block";
      }
    }
  }

  showToast(msg) {
    if (!this.toastEl) return;
    this.toastEl.textContent = msg;
    this.toastEl.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove("show");
    }, 3200);
  }
}

// Inicializar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const app = new ForoApp();
  app.init();
});
