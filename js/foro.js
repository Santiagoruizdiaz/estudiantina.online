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

    // Modal Onboarding / Registro Completo
    this.modalOnboarding = document.getElementById("modal-onboarding-registro");
    this.formOnboarding = document.getElementById("form-onboarding-registro");
    this.onboardingUsername = document.getElementById("onboarding-username");
    this.onboardingUsernameStatus = document.getElementById("onboarding-username-status");
    this.onboardingName = document.getElementById("onboarding-name");
    this.onboardingSchool = document.getElementById("onboarding-school");
    this.onboardingRole = document.getElementById("onboarding-role");
    this.onboardingGrade = document.getElementById("onboarding-grade");
    this.onboardingPhotoPreview = document.getElementById("onboarding-photo-preview");
    this.onboardingPhotoFile = document.getElementById("onboarding-photo-file");
    this.btnOnboardingRestoreGoogle = document.getElementById("btn-onboarding-restore-google");
    this.btnSubmitOnboarding = document.getElementById("btn-submit-onboarding");
    this.btnCloseOnboarding = document.getElementById("btn-close-onboarding");
    this.btnCancelOnboarding = document.getElementById("btn-cancel-onboarding");
    this._pendingGoogleAuth = null;
    this._pendingOnboardingPhoto = null;
    this._pendingEditPhoto = null;
    this._restoreGoogleAvatar = false;

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
    this.threadOpHandle = document.getElementById("thread-op-handle");
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
    // Modal Sanción Usuario
    this.modalSanctionUser = document.getElementById("modal-sanction-user");
    this.btnCloseSanctionModal = document.getElementById("btn-close-sanction-modal");
    this.btnCancelSanction = document.getElementById("btn-cancel-sanction");
    this.formSanctionUser = document.getElementById("form-sanction-user");
    this.sanctionTargetGoogleId = document.getElementById("sanction-target-google-id");
    this.sanctionUserAvatar = document.getElementById("sanction-user-avatar");
    this.sanctionUserName = document.getElementById("sanction-user-name");
    this.sanctionUserSchool = document.getElementById("sanction-user-school");
    this.sanctionUserStatus = document.getElementById("sanction-user-status");
    this.sanctionDurationGroup = document.getElementById("sanction-duration-group");
    this.sanctionDurationSelect = document.getElementById("sanction-duration-select");
    this.sanctionReasonText = document.getElementById("sanction-reason-text");

    // Modal Confirmación Admin
    this.modalAdminConfirm = document.getElementById("modal-admin-confirm-foro");
    this.confirmModalTitle = document.getElementById("confirm-modal-title");
    this.confirmModalDesc = document.getElementById("confirm-modal-desc");
    this.btnCloseConfirmModal = document.getElementById("btn-close-confirm-modal");
    this.btnCancelConfirmAction = document.getElementById("btn-cancel-confirm-action");
    this.btnProceedConfirmAction = document.getElementById("btn-proceed-confirm-action");
    this._pendingConfirmCallback = null;

    // Modal Perfil de Usuario Unificado
    this.modalUserProfile = document.getElementById("modal-user-profile");
    this.btnCloseProfileModal = document.getElementById("btn-close-profile-modal");
    this.profileHeroBanner = document.getElementById("profile-hero-banner");
    this.profileAvatarImg = document.getElementById("profile-avatar-img");
    this.profileUserName = document.getElementById("profile-user-name");
    this.profileUserHandle = document.getElementById("profile-user-handle");
    this.profileUserBadge = document.getElementById("profile-user-badge");
    this.profileSchoolPill = document.getElementById("profile-school-pill");
    this.profileRolePill = document.getElementById("profile-role-pill");
    this.profileGradePill = document.getElementById("profile-grade-pill");
    this.profileUserBio = document.getElementById("profile-user-bio");
    this.profileSocialRow = document.getElementById("profile-social-row");
    this.profileInstagramLink = document.getElementById("profile-instagram-link");
    this.profileInstagramText = document.getElementById("profile-instagram-text");
    this.btnOpenEditProfile = document.getElementById("btn-open-edit-profile");
    this.btnProfileShare = document.getElementById("btn-profile-share");
    this.btnProfileModerate = document.getElementById("btn-profile-moderate");
    this.profileStatKarma = document.getElementById("profile-stat-karma");
    this.profileStatThreads = document.getElementById("profile-stat-threads");
    this.profileStatReplies = document.getElementById("profile-stat-replies");
    this.profileBadgesList = document.getElementById("profile-badges-list");

    // Pestañas del perfil unificado
    this.tabBtnProfileView = document.getElementById("tab-btn-profile-view");
    this.tabBtnProfileEdit = document.getElementById("tab-btn-profile-edit");
    this.tabBtnProfileThreads = document.getElementById("tab-btn-profile-threads");
    this.tabBtnProfileReplies = document.getElementById("tab-btn-profile-replies");
    this.tabLabelProfileView = document.getElementById("tab-label-profile-view");

    this.profileTabView = document.getElementById("profile-tab-view");
    this.profileTabEdit = document.getElementById("profile-tab-edit");
    this.profileTabThreads = document.getElementById("profile-tab-threads");
    this.profileTabReplies = document.getElementById("profile-tab-replies");

    this.profileThreadsList = document.getElementById("profile-threads-list");
    this.profileRepliesList = document.getElementById("profile-replies-list");
    this.profileCountTabThreads = document.getElementById("profile-count-tab-threads");
    this.profileCountTabReplies = document.getElementById("profile-count-tab-replies");

    // Formulario Editar Perfil (integrado en pestaña)
    this.btnCancelEditProfile = document.getElementById("btn-cancel-edit-profile");
    this.formEditProfile = document.getElementById("form-edit-profile");
    this.editProfileUsername = document.getElementById("edit-profile-username");
    this.editProfileUsernameStatus = document.getElementById("edit-profile-username-status");
    this.editProfileName = document.getElementById("edit-profile-name");
    this.editProfileSchool = document.getElementById("edit-profile-school");
    this.editProfileRole = document.getElementById("edit-profile-role");
    this.editProfileGrade = document.getElementById("edit-profile-grade");
    this.editProfileBio = document.getElementById("edit-profile-bio");
    this.editBioCounter = document.getElementById("edit-bio-counter");
    this.editProfileInstagram = document.getElementById("edit-profile-instagram");
    this.editProfilePhotoPreview = document.getElementById("edit-profile-photo-preview");
    this.editProfilePhotoFile = document.getElementById("edit-profile-photo-file");
    this.btnEditRestoreGoogle = document.getElementById("btn-edit-restore-google");

    // Toast
    this.toastEl = document.getElementById("toast-notification");
    this.toastTimer = null;
  }

  // ========== MODO OSCURO ==========
  initDarkMode() {
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');

    // Cargar preferencia guardada universal o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('estudiantina_theme') || localStorage.getItem('foro_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
      this.enableLightMode();
    } else if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else if (prefersDark) {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }

    // Listener para el botón
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleDarkMode());
    }

    // Listener para cambios en preferencia del sistema
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('estudiantina_theme') && !localStorage.getItem('foro_theme')) {
          if (e.matches) {
            this.enableDarkMode();
          } else {
            this.enableLightMode();
          }
        }
      });
    }
  }

  toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
      this.enableLightMode();
      try {
        localStorage.setItem('estudiantina_theme', 'light');
        localStorage.setItem('foro_theme', 'light');
      } catch(e){}
    } else {
      this.enableDarkMode();
      try {
        localStorage.setItem('estudiantina_theme', 'dark');
        localStorage.setItem('foro_theme', 'dark');
      } catch(e){}
    }
    window.dispatchEvent(new CustomEvent("estudiantina:themechange", {
      detail: { theme: document.body.classList.contains('light-mode') ? 'light' : 'dark' }
    }));
    if (this.currentUser && this.currentUser.colegioId) {
      this.applySchoolTheme(this.currentUser.colegioId);
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    document.documentElement.classList.remove('light-mode');
    document.documentElement.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
    if (this.themeIcon) {
      this.themeIcon.textContent = '☀️';
    }
    if (this.themeToggleBtn) {
      this.themeToggleBtn.setAttribute('title', 'Cambiar a modo claro');
      this.themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
    }
  }

  enableLightMode() {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    document.documentElement.setAttribute('data-theme', 'light');
    if (this.themeIcon) {
      this.themeIcon.textContent = '🌙';
    }
    if (this.themeToggleBtn) {
      this.themeToggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
      this.themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
  }
  // ========== FIN MODO OSCURO ==========

  async init() {
    // Inicializar modo oscuro
    this.initDarkMode();

    this.populateSchools();
    this.initGoogleAuth();
    if (this.currentUser && this.currentUser.colegioId) {
      this.applySchoolTheme(this.currentUser.colegioId);
    }
    this.updateUserBar();

    // Comprobar parámetros de la URL (?canal=..., ?hilo=..., ?token=..., ?usuario=...)
    const params = new URLSearchParams(window.location.search);
    const canalParam = params.get("canal");
    if (canalParam) {
      this.activeCanal = canalParam;
    }

    // Acceso oculto por Token en la URL
    const urlToken = (params.get("token") || params.get("admin_token") || params.get("admin") || "").trim();
    if (urlToken) {
      this.adminToken = urlToken;
      params.delete("token");
      params.delete("admin_token");
      params.delete("admin");
      const newSearch = params.toString() ? `?${params.toString()}` : "";
      window.history.replaceState({}, document.title, window.location.pathname + newSearch + window.location.hash);
      await this.verifyAdminSession();
    } else {
      this.updateAdminBar();
    }

    this.bindEvents();

    // Cargar Canales y Debates Iniciales
    this.loadChannels();
    this.loadThreads(false);

    // Deep link a hilo específico
    const hiloParam = params.get("hilo");
    if (hiloParam) {
      this.openThread(hiloParam);
    }

    // Deep link a perfil de usuario específico
    const perfilParam = params.get("usuario") || params.get("perfil");
    if (perfilParam) {
      this.openUserProfile(perfilParam);
    }
  }

  async verifyAdminSession() {
    if (!this.adminToken) {
      this.updateAdminBar();
      return;
    }
    try {
      const res = await fetch("/api/admin?action=verificar", {
        headers: { "Authorization": `Bearer ${this.adminToken}` }
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.adminUser = data.admin?.usuario || this.adminUser || "admin";
        localStorage.setItem("comunidad_admin_token", this.adminToken);
        localStorage.setItem("comunidad_admin_user", this.adminUser);
        this.updateAdminBar();
        this.showToast(`¡Modo Administrador activado (${this.adminUser})! 🔐`);
      } else {
        this.adminToken = null;
        localStorage.removeItem("comunidad_admin_token");
        localStorage.removeItem("comunidad_admin_user");
        this.updateAdminBar();
      }
    } catch (e) {
      this.updateAdminBar();
    }
  }

  getColegio(id) {
    if (!id) return { id: "", nombre: "Colegio de Posadas", escudo: "🥁", color: "#0284c7" };
    const found = COLEGIOS.find(c => c.id === id);
    if (!found) return { id, nombre: id, escudo: "🥁", color: "#0284c7" };
    const primary = (found.colores && found.colores.primary) || "#0284c7";
    return {
      ...found,
      color: primary
    };
  }

  applySchoolTheme(colegioId, targetEl = document.documentElement) {
    if (!colegioId) {
      if (targetEl === document.documentElement) {
        const schoolProps = [
          "--school-primary", "--school-secondary", "--school-accent", "--school-glow",
          "--school-collar", "--school-text-contrast", "--school-surface", "--school-border",
          "--school-gradient", "--school-gradient-subtle"
        ];
        schoolProps.forEach(p => targetEl.style.removeProperty(p));
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) themeMeta.setAttribute("content", "#090a0f");
      }
      return;
    }

    const col = this.getColegio(colegioId);
    if (!col || !col.colores) return;
    const colors = col.colores;
    const primary = colors.primary || "#0284c7";
    const secondary = colors.secondary || "#0ea5e9";
    const accent = colors.accent || primary;
    const glow = colors.glow || "rgba(2, 132, 199, 0.4)";
    const collar = colors.collar || secondary;
    const textContrast = colors.textContrast || "#ffffff";
    const isLight = document.body && document.body.classList.contains("light-mode");
    const surface = isLight ? this.hexToRgba(primary, 0.07) : (colors.surface || this.hexToRgba(primary, 0.12));
    const border = isLight ? this.hexToRgba(primary, 0.3) : (colors.border || this.hexToRgba(primary, 0.35));
    const gradient = colors.gradient || `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
    const gradientSubtle = `linear-gradient(180deg, ${surface} 0%, transparent 100%)`;

    targetEl.style.setProperty("--school-primary", primary);
    targetEl.style.setProperty("--school-secondary", secondary);
    targetEl.style.setProperty("--school-accent", accent);
    targetEl.style.setProperty("--school-glow", glow);
    targetEl.style.setProperty("--school-collar", collar);
    targetEl.style.setProperty("--school-text-contrast", textContrast);
    targetEl.style.setProperty("--school-surface", surface);
    targetEl.style.setProperty("--school-border", border);
    targetEl.style.setProperty("--school-gradient", gradient);
    targetEl.style.setProperty("--school-gradient-subtle", gradientSubtle);

    if (targetEl === document.documentElement) {
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute("content", primary);
    }
  }

  hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
      return `rgba(56, 189, 248, ${alpha})`;
    }
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
    if (isNaN(bigint)) return `rgba(56, 189, 248, ${alpha})`;
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  populateSchools() {
    const options = (COLEGIOS || []).map(c =>
      `<option value="${c.id}">${c.escudo || "🥁"} ${c.nombre}</option>`
    ).join("");

    if (this.topicSchool) this.topicSchool.innerHTML = options;
    if (this.authSelectSchool) this.authSelectSchool.innerHTML = options;
    if (this.onboardingSchool) this.onboardingSchool.innerHTML = options;
    if (this.editProfileSchool) this.editProfileSchool.innerHTML = options;
  }

  processImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        return reject(new Error("El archivo seleccionado no es una imagen válida."));
      }
      if (file.size > 8 * 1024 * 1024) {
        return reject(new Error("La imagen supera los 8MB. Seleccioná una foto más liviana."));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 360;
          let width = img.width;
          let height = img.height;

          // Crop centrado cuadrado 1:1
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);

          let dataUrl = canvas.toDataURL("image/webp", 0.85);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          }
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Error al procesar la imagen."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo del dispositivo."));
      reader.readAsDataURL(file);
    });
  }

  setupUsernameValidator(inputEl, statusEl, getGoogleId) {
    if (!inputEl || !statusEl) return;
    let debounceTimer = null;

    inputEl.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      // Limpiar caracteres: forzar minúsculas y solo a-z, 0-9, _
      const clean = inputEl.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (inputEl.value !== clean) {
        inputEl.value = clean;
      }

      const username = clean.trim();
      if (!username) {
        statusEl.textContent = "";
        statusEl.className = "username-status-badge";
        return;
      }

      if (username.length < 3) {
        statusEl.textContent = "Mín. 3 caracteres";
        statusEl.className = "username-status-badge invalid";
        return;
      }

      statusEl.textContent = "Comprobando...";
      statusEl.className = "username-status-badge checking";

      debounceTimer = setTimeout(async () => {
        try {
          const googleId = typeof getGoogleId === "function" ? getGoogleId() : (getGoogleId || "");
          const res = await fetch(`/api/foro?action=check_username&username=${encodeURIComponent(username)}&googleId=${encodeURIComponent(googleId)}`);
          const json = await res.json();
          if (json.available) {
            statusEl.textContent = "✓ Disponible";
            statusEl.className = "username-status-badge available";
          } else {
            statusEl.textContent = json.message || "✗ No disponible";
            statusEl.className = "username-status-badge taken";
          }
        } catch (e) {
          statusEl.textContent = "";
          statusEl.className = "username-status-badge";
        }
      }, 300);
    });
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

  async handleGoogleCredential(response) {
    if (!response || !response.credential) return;
    try {
      const payloadBase64 = response.credential.split(".")[1];
      const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
      const schoolId = (this.authSelectSchool && this.authSelectSchool.value) || "janssen";
      const googleId = decoded.sub;
      const nombre = decoded.name || "Hincha de Posadas";
      const email = decoded.email || "";
      const avatarUrl = decoded.picture || "";

      const res = await fetch("/api/foro?action=auth_google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId,
          nombre,
          email,
          avatarUrl,
          colegioId: schoolId
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.remove("active");

        if (json.needsOnboarding) {
          this.openOnboardingModal({
            googleId,
            nombre,
            email,
            avatarOriginal: avatarUrl,
            colegioId: schoolId
          });
        } else {
          this.saveUser(json.usuario);
        }
      } else {
        this.showToast(json.message || "Error al autenticar con Google");
      }
    } catch (e) {
      console.error("Error al autenticar con Google:", e);
      this.showToast("Error de conexión al autenticar");
    }
  }

  openOnboardingModal(data) {
    this._pendingGoogleAuth = data;
    this._pendingOnboardingPhoto = null;

    if (this.onboardingName) this.onboardingName.value = data.nombre || "";
    if (this.onboardingSchool) this.onboardingSchool.value = data.colegioId || "janssen";
    if (this.onboardingPhotoPreview) {
      this.onboardingPhotoPreview.src = data.avatarOriginal || "assets/avatar-default.webp";
    }

    // Sugerir usuario inicial limpio
    const baseSource = (data.email ? data.email.split("@")[0] : data.nombre) || "hincha";
    const suggested = baseSource.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 18);
    if (this.onboardingUsername) {
      this.onboardingUsername.value = suggested;
      // Disparar chequeo de disponibilidad en tiempo real
      this.onboardingUsername.dispatchEvent(new Event("input"));
    }

    if (this.modalOnboarding) {
      this.modalOnboarding.classList.add("active");
      this.modalOnboarding.setAttribute("aria-hidden", "false");
    }
  }

  closeOnboardingModal() {
    if (this.modalOnboarding) {
      this.modalOnboarding.classList.remove("active");
      this.modalOnboarding.setAttribute("aria-hidden", "true");
    }
    this._pendingGoogleAuth = null;
    this._pendingOnboardingPhoto = null;
  }

  async handleOnboardingSubmit(e) {
    e.preventDefault();
    if (!this._pendingGoogleAuth) return;

    const username = (this.onboardingUsername && this.onboardingUsername.value.trim().toLowerCase()) || "";
    const nombre = (this.onboardingName && this.onboardingName.value.trim()) || this._pendingGoogleAuth.nombre;
    const colegioId = (this.onboardingSchool && this.onboardingSchool.value) || this._pendingGoogleAuth.colegioId;
    const rolEstudiantil = (this.onboardingRole && this.onboardingRole.value) || "Hincha de Tribuna";
    const anoEscolar = (this.onboardingGrade && this.onboardingGrade.value) || "5° Año (Promo)";
    const avatarUrl = this._pendingOnboardingPhoto || this._pendingGoogleAuth.avatarOriginal || "";

    if (!username || username.length < 3) {
      this.showToast("El nombre de usuario debe tener al menos 3 caracteres");
      if (this.onboardingUsername) this.onboardingUsername.focus();
      return;
    }

    try {
      const res = await fetch("/api/foro?action=completar_registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId: this._pendingGoogleAuth.googleId,
          username,
          nombre,
          colegioId,
          rolEstudiantil,
          anoEscolar,
          avatarUrl
        })
      });

      const json = await res.json();
      if (json.status === "ok" && json.usuario) {
        this.closeOnboardingModal();
        this.saveUser(json.usuario);
        this.showToast(`🎉 ¡Bienvenido a la comunidad, @${json.usuario.username}!`);
      } else {
        this.showToast(json.message || "Error al completar registro");
      }
    } catch (err) {
      console.error("Error al completar registro:", err);
      this.showToast("Error de conexión al registrarse");
    }
  }

  async saveUser(user) {
    this.currentUser = user;
    localStorage.setItem("comunidad_google_user", JSON.stringify(user));
    if (user.colegioId) {
      this.applySchoolTheme(user.colegioId);
    }
    this.updateUserBar();

    if (this.modalGoogleAuth) this.modalGoogleAuth.classList.remove("active");

    const col = this.getColegio(user.colegioId);
    const handleText = user.username ? ` (@${user.username})` : "";
    this.showToast(`¡Conectado como ${user.nombre}${handleText}!`);

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
      document.body.classList.add("has-admin-bar");
      requestAnimationFrame(() => {
        const h = this.adminTopBar.offsetHeight || 44;
        document.documentElement.style.setProperty("--admin-bar-height", `${h}px`);
      });
    } else if (this.adminTopBar) {
      this.adminTopBar.style.display = "none";
      document.body.classList.remove("has-admin-bar");
      document.documentElement.style.setProperty("--admin-bar-height", "0px");
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      if (this.adminToken && this.adminTopBar && this.adminTopBar.style.display !== "none") {
        const h = this.adminTopBar.offsetHeight || 44;
        document.documentElement.style.setProperty("--admin-bar-height", `${h}px`);
      }
    });

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

    // Modal Onboarding / Registro Completo
    if (this.btnCloseOnboarding) {
      this.btnCloseOnboarding.addEventListener("click", () => this.closeOnboardingModal());
    }
    if (this.btnCancelOnboarding) {
      this.btnCancelOnboarding.addEventListener("click", () => this.closeOnboardingModal());
    }
    if (this.formOnboarding) {
      this.formOnboarding.addEventListener("submit", (e) => this.handleOnboardingSubmit(e));
    }
    if (this.onboardingUsername && this.onboardingUsernameStatus) {
      this.setupUsernameValidator(
        this.onboardingUsername,
        this.onboardingUsernameStatus,
        () => (this._pendingGoogleAuth ? this._pendingGoogleAuth.googleId : "")
      );
    }
    if (this.onboardingPhotoFile) {
      this.onboardingPhotoFile.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          const dataUri = await this.processImageFile(file);
          this._pendingOnboardingPhoto = dataUri;
          if (this.onboardingPhotoPreview) this.onboardingPhotoPreview.src = dataUri;
        } catch (err) {
          this.showToast(err.message || "Error al procesar la imagen");
        }
      });
    }
    if (this.btnOnboardingRestoreGoogle) {
      this.btnOnboardingRestoreGoogle.addEventListener("click", () => {
        const gPic = this._pendingGoogleAuth && this._pendingGoogleAuth.avatarOriginal;
        if (gPic) {
          this._pendingOnboardingPhoto = gPic;
          if (this.onboardingPhotoPreview) this.onboardingPhotoPreview.src = gPic;
          this.showToast("Foto original de Google seleccionada");
        }
      });
    }

    if (this.btnLogout) {
      this.btnLogout.addEventListener("click", () => {
        this.currentUser = null;
        localStorage.removeItem("comunidad_google_user");
        this.applySchoolTheme(null);
        this.updateUserBar();
        this.showToast("Sesión cerrada");
      });
    }

    // Previsualización dinámica de colores institucionales en selectores
    if (this.onboardingSchool) {
      this.onboardingSchool.addEventListener("change", (e) => {
        this.applySchoolTheme(e.target.value);
      });
    }

    if (this.editProfileSchool) {
      this.editProfileSchool.addEventListener("change", (e) => {
        if (this.modalUserProfile) {
          this.applySchoolTheme(e.target.value, this.modalUserProfile);
        }
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
    const btnCloseThreadX = document.getElementById("btn-close-thread-x");
    if (btnCloseThreadX) {
      btnCloseThreadX.addEventListener("click", () => this.closeThreadModal());
    }
    if (this.modalThread) {
      this.modalThread.addEventListener("click", (e) => {
        if (e.target === this.modalThread) this.closeThreadModal();
      });
    }

    // Cerrar modales con tecla Escape
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

    // Acceso Admin (disparador en footer si existiera)
    if (this.btnFooterAdmin) {
      this.btnFooterAdmin.addEventListener("click", () => {
        if (this.modalAdminLogin) this.modalAdminLogin.classList.add("active");
      });
    }

    // Atajo oculto de teclado: Ctrl + Shift + A o Alt + Shift + A
    window.addEventListener("keydown", (e) => {
      const isAKey = e.key === "A" || e.key === "a" || e.code === "KeyA";
      const isShiftModifier = (e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey;
      const isAltOnly = e.altKey && !e.ctrlKey && !e.metaKey;
      if (isAKey && (isShiftModifier || isAltOnly)) {
        e.preventDefault();
        if (this.modalAdminLogin) {
          this.modalAdminLogin.classList.add("active");
          const inp = document.getElementById("admin-login-token");
          if (inp) setTimeout(() => inp.focus(), 100);
        }
      }
    });

    // Easter egg de 5 clics en el pie de página
    const copyTextEl = document.getElementById("foro-footer-copy-text");
    if (copyTextEl) {
      let copyClicks = 0;
      let copyClickTimer = null;
      copyTextEl.addEventListener("click", () => {
        copyClicks++;
        clearTimeout(copyClickTimer);
        copyClickTimer = setTimeout(() => { copyClicks = 0; }, 2200);
        if (copyClicks >= 5) {
          copyClicks = 0;
          if (this.modalAdminLogin) {
            this.modalAdminLogin.classList.add("active");
            const inp = document.getElementById("admin-login-token");
            if (inp) setTimeout(() => inp.focus(), 100);
          }
        }
      });
    }

    // Toggle para ver/ocultar token secreto
    const toggleBtn = document.getElementById("btn-toggle-admin-password");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const inp = document.getElementById("admin-login-token");
        if (!inp) return;
        const isPwd = inp.type === "password";
        inp.type = isPwd ? "text" : "password";
        toggleBtn.textContent = isPwd ? "🙈" : "👁️";
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

    // Modal Sanción Usuario: eventos
    if (this.btnCloseSanctionModal) {
      this.btnCloseSanctionModal.addEventListener("click", () => {
        if (this.modalSanctionUser) this.modalSanctionUser.classList.remove("active");
      });
    }
    if (this.btnCancelSanction) {
      this.btnCancelSanction.addEventListener("click", () => {
        if (this.modalSanctionUser) this.modalSanctionUser.classList.remove("active");
      });
    }
    if (this.formSanctionUser) {
      this.formSanctionUser.addEventListener("submit", (e) => this.handleSanctionSubmit(e));
      // Cambiar visibilidad de select de duración según tipo
      const radios = this.formSanctionUser.querySelectorAll('input[name="tipo-sancion"]');
      radios.forEach(r => {
        r.addEventListener("change", () => {
          if (this.sanctionDurationGroup) {
            this.sanctionDurationGroup.style.display = r.value === "suspender" ? "block" : "none";
          }
        });
      });
    }

    // Modal Confirmación Admin: eventos
    if (this.btnCloseConfirmModal) {
      this.btnCloseConfirmModal.addEventListener("click", () => {
        if (this.modalAdminConfirm) this.modalAdminConfirm.classList.remove("active");
        this._pendingConfirmCallback = null;
      });
    }
    if (this.btnCancelConfirmAction) {
      this.btnCancelConfirmAction.addEventListener("click", () => {
        if (this.modalAdminConfirm) this.modalAdminConfirm.classList.remove("active");
        this._pendingConfirmCallback = null;
      });
    }
    if (this.btnProceedConfirmAction) {
      this.btnProceedConfirmAction.addEventListener("click", () => {
        if (typeof this._pendingConfirmCallback === "function") {
          const cb = this._pendingConfirmCallback;
          this._pendingConfirmCallback = null;
          cb();
        }
        if (this.modalAdminConfirm) this.modalAdminConfirm.classList.remove("active");
      });
    }

    // Modal Perfil de Usuario: eventos de navegación y pestañas
    if (this.btnCloseProfileModal) {
      this.btnCloseProfileModal.addEventListener("click", () => this.closeUserProfileModal());
    }
    if (this.modalUserProfile) {
      this.modalUserProfile.addEventListener("click", (e) => {
        if (e.target === this.modalUserProfile) this.closeUserProfileModal();
      });
    }

    if (this.tabBtnProfileView) {
      this.tabBtnProfileView.addEventListener("click", () => this.switchProfileTab("view"));
    }
    if (this.tabBtnProfileEdit) {
      this.tabBtnProfileEdit.addEventListener("click", () => this.switchProfileTab("edit"));
    }
    if (this.tabBtnProfileThreads) {
      this.tabBtnProfileThreads.addEventListener("click", () => this.switchProfileTab("threads"));
    }
    if (this.tabBtnProfileReplies) {
      this.tabBtnProfileReplies.addEventListener("click", () => this.switchProfileTab("replies"));
    }

    if (this.btnOpenEditProfile) {
      this.btnOpenEditProfile.addEventListener("click", () => this.switchProfileTab("edit"));
    }
    if (this.btnCancelEditProfile) {
      this.btnCancelEditProfile.addEventListener("click", () => this.switchProfileTab("view"));
    }

    if (this.btnProfileShare) {
      this.btnProfileShare.addEventListener("click", () => {
        const userId = this.btnProfileShare.dataset.userId;
        if (!userId) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}?usuario=${encodeURIComponent(userId)}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          this.showToast("🔗 Enlace al perfil copiado al portapapeles");
        }).catch(() => {
          this.showToast(shareUrl);
        });
      });
    }

    if (this.btnProfileModerate) {
      this.btnProfileModerate.addEventListener("click", () => {
        const user = this._currentViewingProfileUser;
        if (user) {
          this.closeUserProfileModal();
          this.openSanctionModal({
            googleId: user.googleId,
            nombre: user.nombre,
            avatarUrl: user.avatarUrl,
            colegioId: user.colegioId
          });
        }
      });
    }

    if (this.editProfileUsername && this.editProfileUsernameStatus) {
      this.setupUsernameValidator(
        this.editProfileUsername,
        this.editProfileUsernameStatus,
        () => (this.currentUser ? this.currentUser.googleId : "")
      );
    }
    if (this.editProfilePhotoFile) {
      this.editProfilePhotoFile.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          const dataUri = await this.processImageFile(file);
          this._pendingEditPhoto = dataUri;
          this._restoreGoogleAvatar = false;
          if (this.editProfilePhotoPreview) this.editProfilePhotoPreview.src = dataUri;
        } catch (err) {
          this.showToast(err.message || "Error al procesar la imagen");
        }
      });
    }
    if (this.btnEditRestoreGoogle) {
      this.btnEditRestoreGoogle.addEventListener("click", () => {
        const orig = (this.currentUser && this.currentUser.avatarOriginal) || (this.currentUser && this.currentUser.avatarUrl);
        this._restoreGoogleAvatar = true;
        this._pendingEditPhoto = null;
        if (this.editProfilePhotoPreview && orig) {
          this.editProfilePhotoPreview.src = orig;
        }
        this.showToast("Foto original de Google seleccionada");
      });
    }

    if (this.editProfileBio) {
      this.editProfileBio.addEventListener("input", () => {
        if (this.editBioCounter) {
          this.editBioCounter.textContent = `(${this.editProfileBio.value.length}/160)`;
        }
      });
    }
    if (this.formEditProfile) {
      this.formEditProfile.addEventListener("submit", (e) => this.handleEditProfileSubmit(e));
    }

    // Clic en avatar de perfil de usuario en header (abre perfil con pestaña de edición accesible)
    if (this.userProfile) {
      this.userProfile.addEventListener("click", (e) => {
        if (e.target.closest("#btn-logout")) return;
        if (this.currentUser && this.currentUser.googleId) {
          this.openUserProfile(this.currentUser.googleId, "view");
        }
      });
    }

    // Tecla ESC para cerrar modales
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.modalUserProfile && this.modalUserProfile.classList.contains("open")) {
          this.closeUserProfileModal();
        }
        if (this.modalOnboarding && this.modalOnboarding.classList.contains("active")) {
          this.closeOnboardingModal();
        }
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
        if (this.modalSanctionUser && this.modalSanctionUser.classList.contains("active")) {
          this.modalSanctionUser.classList.remove("active");
        }
        if (this.modalAdminConfirm && this.modalAdminConfirm.classList.contains("active")) {
          this.modalAdminConfirm.classList.remove("active");
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
      const googleIdParam = this.currentUser ? `&googleId=${encodeURIComponent(this.currentUser.googleId)}` : "";
      const url = `/api/foro?action=hilos&canal=${encodeURIComponent(this.activeCanal)}&sort=${this.activeSort}&q=${q}&limit=${this.pageSize}&offset=${offset}${googleIdParam}`;

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
      const isVoted = (t.user_voted === 1) || this.userVotes.has(t.id) || this.userVotes.has(String(t.id)) || this.userVotes.has(`hilo_${t.id}`);
      const isPinned = t.fijado === 1 || t.fijado === true;
      const dateText = timeAgo(t.creado_en);
      const votosCount = (t.votos !== undefined && t.votos !== null) ? t.votos : 0;
      const respuestasCount = t.respuestas_count ?? t.comentarios_count ?? 0;

      const card = document.createElement("article");
      card.className = `thread-card ${isPinned ? "is-pinned" : ""}`;
      card.dataset.id = t.id;

      card.innerHTML = `
        <div class="thread-card-header">
          <div class="thread-author-wrap" data-author-id="${escapeHtml(t.autor_google_id)}" style="cursor:pointer;" title="Ver perfil de ${escapeHtml(t.autor_nombre || "Hincha")}">
            <img class="thread-author-avatar" src="${escapeHtml(t.autor_avatar || "assets/avatar-default.webp")}" alt="Avatar" loading="lazy" />
            <div class="thread-author-meta">
              <div class="thread-author-row">
                <span class="thread-school-badge" style="border-left: 3px solid ${col.color || "#38bdf8"}">
                  ${col.escudo || "🥁"} ${escapeHtml(col.nombre)}
                </span>
                <span class="meta-dot">&bull;</span>
                <span class="thread-author-name">${escapeHtml(t.autor_nombre || "Hincha")}</span>
                ${t.autor_username ? `<span class="thread-author-handle">@${escapeHtml(t.autor_username)}</span>` : ""}
                <span class="meta-dot">&bull;</span>
                <span class="thread-time">${dateText}</span>
                ${isPinned ? `<span class="pinned-badge">📌 Fijado</span>` : ""}
              </div>
              <div class="thread-sub-meta">
                <span class="thread-channel-badge">${escapeHtml(t.canal_titulo || t.canal_id)}</span>
              </div>
            </div>
          </div>
          ${this.adminToken ? `
            <div class="thread-admin-bar">
              <button type="button" class="btn-mod-action btn-mod-pin ${isPinned ? "pinned-active" : ""}" data-thread-id="${t.id}" data-is-pinned="${isPinned ? "1" : "0"}" title="${isPinned ? "Desfijar de la parte superior" : "Fijar arriba"}">
                ${isPinned ? "📌 Desfijar" : "📌 Fijar"}
              </button>
              <button type="button" class="btn-mod-action btn-mod-del" data-thread-id="${t.id}" data-thread-title="${escapeHtml(t.titulo)}" title="Eliminar debate">
                🗑️ Borrar
              </button>
              <button type="button" class="btn-mod-action btn-mod-sanction" data-author-id="${escapeHtml(t.autor_google_id)}" data-author-name="${escapeHtml(t.autor_nombre)}" data-author-avatar="${escapeHtml(t.autor_avatar || "")}" data-author-school="${escapeHtml(t.colegio_id || "janssen")}" title="Sancionar autor">
                🚫 Moderar
              </button>
            </div>
          ` : `
            <button type="button" class="btn-report-thread-sm" title="Reportar debate" data-thread-id="${t.id}">
              🚩
            </button>
          `}
        </div>
        <h3 class="thread-title">${escapeHtml(t.titulo)}</h3>
        <p class="thread-excerpt">${escapeHtml(t.contenido)}</p>
        <div class="thread-card-footer reddit-action-bar">
          <div class="reddit-vote-capsule ${isVoted ? "voted" : ""}" data-thread-id="${t.id}">
            <button type="button" class="btn-vote-arrow btn-vote-up" data-thread-id="${t.id}" aria-label="Upvote">▲</button>
            <span class="vote-count">${votosCount}</span>
          </div>
          <button type="button" class="reddit-action-pill btn-open-replies" data-thread-id="${t.id}">
            <span class="pill-icon">💬</span>
            <span>${respuestasCount}</span>
          </button>
          <button type="button" class="reddit-action-pill btn-share-thread-card" data-thread-id="${t.id}" data-thread-title="${escapeHtml(t.titulo)}" title="Compartir enlace">
            <span class="pill-icon">↗</span>
            <span>Compartir</span>
          </button>
        </div>
      `;

      // Eventos de la tarjeta
      card.addEventListener("click", (e) => {
        const authorEl = e.target.closest(".thread-author-wrap");
        if (authorEl && authorEl.dataset.authorId) {
          e.stopPropagation();
          this.openUserProfile(authorEl.dataset.authorId);
          return;
        }
        if (e.target.closest(".reddit-vote-capsule") || e.target.closest(".btn-share-thread-card") || e.target.closest(".thread-admin-bar") || e.target.closest(".btn-report-thread-sm")) {
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

      // Moderación de hilo en tarjeta
      const pinBtn = card.querySelector(".btn-mod-pin");
      if (pinBtn) {
        pinBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.adminTogglePinThread(t.id, isPinned);
        });
      }

      const delBtn = card.querySelector(".btn-mod-del");
      if (delBtn) {
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.adminDeleteThread(t.id, t.titulo);
        });
      }

      const sanctionBtn = card.querySelector(".btn-mod-sanction");
      if (sanctionBtn) {
        sanctionBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openSanctionModal({
            googleId: t.autor_google_id,
            nombre: t.autor_nombre,
            avatarUrl: t.autor_avatar,
            colegioId: t.colegio_id
          });
        });
      }

      const repBtn = card.querySelector(".btn-report-thread-sm");
      if (repBtn) {
        repBtn.addEventListener("click", (e) => {
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

      if (this.threadModalTitle) this.threadModalTitle.textContent = decodeEntities(h.titulo);
      if (this.threadModalChannel) this.threadModalChannel.textContent = h.canal_titulo || h.canal_id;
      if (this.threadModalDate) this.threadModalDate.textContent = timeAgo(h.creado_en);
      if (this.threadOpAvatar) {
        this.threadOpAvatar.src = h.autor_avatar || "assets/avatar-default.webp";
        this.threadOpAvatar.dataset.authorId = h.autor_google_id;
        this.threadOpAvatar.style.cursor = "pointer";
        this.threadOpAvatar.title = `Ver perfil de ${h.autor_nombre || "Hincha"}`;
        this.threadOpAvatar.onclick = () => {
          if (this.threadOpAvatar.dataset.authorId) {
            this.openUserProfile(this.threadOpAvatar.dataset.authorId);
          }
        };
      }
      if (this.threadOpName) {
        this.threadOpName.textContent = h.autor_nombre || "Hincha";
        this.threadOpName.dataset.authorId = h.autor_google_id;
        this.threadOpName.style.cursor = "pointer";
        this.threadOpName.title = `Ver perfil de ${h.autor_nombre || "Hincha"}`;
        this.threadOpName.onclick = () => {
          if (this.threadOpName.dataset.authorId) {
            this.openUserProfile(this.threadOpName.dataset.authorId);
          }
        };
      }
      if (this.threadOpHandle) {
        this.threadOpHandle.textContent = h.autor_username ? `@${h.autor_username}` : "";
        this.threadOpHandle.style.display = h.autor_username ? "inline-block" : "none";
      }
      if (this.threadOpSchool) {
        this.threadOpSchool.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
      }
      if (this.threadOpContent) {
        this.threadOpContent.innerHTML = `<p>${escapeHtml(h.contenido).replace(/\n/g, "<br>")}</p>`;
      }
      if (this.threadModalVotes) {
        this.threadModalVotes.textContent = (h.votos !== undefined && h.votos !== null) ? h.votos : 0;
      }

      const isVoted = (h.user_voted === 1) || this.userVotes.has(h.id) || this.userVotes.has(String(h.id)) || this.userVotes.has(`hilo_${h.id}`);
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
      const isVoted = (r.user_voted === 1) || this.userVotes.has(r.id) || this.userVotes.has(String(r.id)) || this.userVotes.has(`comentario_${r.id}`);
      const dateText = timeAgo(r.creado_en);
      const rVotos = (r.votos !== undefined && r.votos !== null) ? r.votos : 0;

      return `
        <div class="reply-card" data-comment-id="${r.id}">
          <div class="reply-author-row" data-author-id="${escapeHtml(r.autor_google_id)}" style="cursor:pointer;" title="Ver perfil de ${escapeHtml(r.autor_nombre || "Hincha")}">
            <img class="reply-avatar" src="${escapeHtml(r.autor_avatar || "assets/avatar-default.webp")}" alt="Avatar" loading="lazy" />
            <div class="reply-author-meta">
              <span class="reply-author-name">${escapeHtml(r.autor_nombre || "Hincha")}</span>
              ${r.autor_username ? `<span class="reply-author-handle">@${escapeHtml(r.autor_username)}</span>` : ""}
              <span class="reply-author-school">${col.escudo || "🥁"} ${escapeHtml(col.nombre)}</span>
            </div>
            <span class="reply-time">${dateText}</span>
          </div>
          <div class="reply-content">${escapeHtml(r.contenido).replace(/\n/g, "<br>")}</div>
          <div class="reply-actions">
            <button type="button" class="reply-vote-btn ${isVoted ? "voted" : ""}" data-comment-id="${r.id}" aria-label="Votar comentario">
              <span class="vote-icon">▲</span>
              <span class="vote-count">${rVotos}</span>
            </button>
            <button type="button" class="reply-report-btn" data-comment-id="${r.id}" title="Reportar">
              🚩
            </button>
            ${this.adminToken ? `
              <div class="reply-admin-bar">
                <button type="button" class="btn-reply-mod-del" data-comment-id="${r.id}" title="Eliminar comentario">
                  🗑️ Borrar
                </button>
                <button type="button" class="btn-reply-mod-sanction" data-author-id="${escapeHtml(r.autor_google_id)}" data-author-name="${escapeHtml(r.autor_nombre)}" data-author-avatar="${escapeHtml(r.autor_avatar || "")}" data-author-school="${escapeHtml(r.colegio_id || "janssen")}" title="Sancionar usuario">
                  🚫 Sancionar
                </button>
              </div>
            ` : ""}
          </div>
        </div>
      `;
    }).join("");

    this.threadRepliesList.innerHTML = html;

    // Listeners para abrir perfil desde comentarios
    this.threadRepliesList.querySelectorAll(".reply-author-row").forEach(row => {
      row.addEventListener("click", () => {
        if (row.dataset.authorId) {
          this.openUserProfile(row.dataset.authorId);
        }
      });
    });

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

    // Listeners de moderación en comentarios
    if (this.adminToken) {
      this.threadRepliesList.querySelectorAll(".btn-reply-mod-del").forEach(btn => {
        btn.addEventListener("click", () => {
          const commentId = btn.dataset.commentId;
          this.adminDeleteComment(commentId, this.activeThreadId);
        });
      });

      this.threadRepliesList.querySelectorAll(".btn-reply-mod-sanction").forEach(btn => {
        btn.addEventListener("click", () => {
          this.openSanctionModal({
            googleId: btn.dataset.authorId,
            nombre: btn.dataset.authorName,
            avatarUrl: btn.dataset.authorAvatar,
            colegioId: btn.dataset.authorSchool
          });
        });
      });
    }
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
      this.showToast("Iniciá sesión con Google para votar");
      return;
    }

    const targetType = isComment ? "comentario" : "hilo";
    const rawTargetId = isComment ? commentId : (id || this.activeThreadId);
    const targetId = parseInt(rawTargetId, 10);

    if (!targetId || isNaN(targetId)) return;

    // Elemento visual que disparó la acción
    const targetBtn = btnEl || (!isComment ? this.btnVoteThread : null);
    if (targetBtn) {
      targetBtn.classList.add("vote-pulse");
      setTimeout(() => targetBtn.classList.remove("vote-pulse"), 350);
    }

    try {
      const res = await fetch("/api/foro?action=votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: targetType,
          itemId: targetId,
          id: targetId,
          googleId: this.currentUser.googleId
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        const voted = json.voted !== undefined ? json.voted : (json.data && json.data.voted);
        const total = json.votos !== undefined ? json.votos : (json.data && json.data.votos);

        const key = `${targetType}_${targetId}`;
        if (voted) {
          this.userVotes.add(key);
          this.userVotes.add(targetId);
          this.userVotes.add(String(targetId));
        } else {
          this.userVotes.delete(key);
          this.userVotes.delete(targetId);
          this.userVotes.delete(String(targetId));
        }
        localStorage.setItem("comunidad_voted_threads", JSON.stringify(Array.from(this.userVotes)));

        if (isComment) {
          // Comentario: sincronizar todos los botones de este comentario
          const commentBtns = document.querySelectorAll(`.reply-vote-btn[data-comment-id="${targetId}"]`);
          commentBtns.forEach(b => {
            b.classList.toggle("voted", voted);
            const countSpan = b.querySelector(".vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          });
        } else {
          // Hilo: sincronizar modal si está abierto
          if (this.btnVoteThread && (this.activeThreadId == targetId)) {
            this.btnVoteThread.classList.toggle("voted", voted);
          }
          if (this.threadModalVotes && (this.activeThreadId == targetId) && total !== undefined) {
            this.threadModalVotes.textContent = total;
          }
          // Y sincronizar tarjetas en el feed
          const feedCapsules = document.querySelectorAll(`.reddit-vote-capsule[data-thread-id="${targetId}"]`);
          feedCapsules.forEach(cap => {
            cap.classList.toggle("voted", voted);
            const countSpan = cap.querySelector(".vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          });
        }

        this.showToast(voted ? "¡Voto registrado! ▲" : "Voto retirado");
      } else {
        this.showToast(json.message || "No se pudo registrar el voto");
      }
    } catch (err) {
      console.error("Error al votar:", err);
      this.showToast("Error de conexión al votar");
    }
  }

  shareThread(id, title) {
    const url = `${window.location.origin}/foro.html?hilo=${id}`;
    if (navigator.share) {
      navigator.share({
        title: `${decodeEntities(title)} | Estudiantina.online`,
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
      const targetId = parseInt(id, 10);
      const res = await fetch("/api/foro?action=reportar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, itemId: targetId, id: targetId, motivo })
      });
      const json = await res.json();
      if (json.status === "ok") {
        this.showToast("Publicación reportada para revisión de moderación. Gracias 🛡️");
      } else {
        this.showToast(json.message || "No se pudo enviar el reporte");
      }
    } catch (e) {
      this.showToast("Error de red al enviar el reporte");
    }
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    const tokenEl = document.getElementById("admin-login-token");
    const token = tokenEl ? tokenEl.value.trim() : "";
    const user = (document.getElementById("admin-login-user")?.value || "").trim();
    const pass = document.getElementById("admin-login-password")?.value || "";
    const errEl = document.getElementById("admin-login-error");
    if (errEl) errEl.style.display = "none";

    if (!token && (!user || !pass)) return;

    try {
      let res, json;
      if (token) {
        res = await fetch("/api/admin?action=login_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        json = await res.json();
      } else {
        res = await fetch("/api/admin?action=login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario: user, password: pass })
        });
        json = await res.json();
      }

      if (json.status === "ok" && (json.token || json.data?.token)) {
        this.adminToken = json.token || json.data.token;
        this.adminUser = json.usuario || json.data?.usuario || "admin";
        localStorage.setItem("comunidad_admin_token", this.adminToken);
        localStorage.setItem("comunidad_admin_user", this.adminUser);
        if (this.modalAdminLogin) this.modalAdminLogin.classList.remove("active");
        this.updateAdminBar();
        this.showToast(`🔓 Sesión de moderador iniciada (${this.adminUser})`);
        this.loadThreads(false);
      } else {
        if (errEl) {
          errEl.textContent = json.message || "Token inválido o no reconocido";
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

  // Moderación Admin: Diálogo de Confirmación
  confirmAdminAction(title, desc, callback) {
    if (this.confirmModalTitle) this.confirmModalTitle.textContent = title;
    if (this.confirmModalDesc) this.confirmModalDesc.textContent = desc;
    this._pendingConfirmCallback = callback;
    if (this.modalAdminConfirm) {
      this.modalAdminConfirm.classList.add("active");
    } else {
      if (confirm(`${title}\n${desc}`)) {
        callback();
      }
    }
  }

  // Moderación Admin: Fijar / Desfijar Hilo
  async adminTogglePinThread(id, isPinned) {
    if (!this.adminToken) return;
    try {
      const res = await fetch("/api/admin?action=fijar_hilo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ hiloId: id, id: id, fijar: isPinned ? 0 : 1 })
      });
      const json = await res.json();
      if (json.status === "ok") {
        this.showToast(json.fijado === 1 ? "📌 Hilo fijado en la cima" : "📌 Hilo desfijado");
        this.loadThreads(false);
      } else {
        this.showToast(json.message || "Error al fijar hilo");
      }
    } catch (e) {
      this.showToast("Error de conexión al fijar hilo");
    }
  }

  // Moderación Admin: Borrar Hilo
  adminDeleteThread(id, title = "este debate") {
    if (!this.adminToken) return;
    this.confirmAdminAction(
      "Eliminar Debate",
      `¿Confirmás la eliminación permanente de "${title}" y todos sus comentarios asociados?`,
      async () => {
        try {
          const res = await fetch("/api/admin?action=borrar_hilo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.adminToken}`
            },
            body: JSON.stringify({ hiloId: id, id: id })
          });
          const json = await res.json();
          if (json.status === "ok") {
            this.showToast("🗑️ Debate eliminado con éxito");
            if (this.activeThreadId == id) {
              this.closeThreadModal();
            }
            this.loadThreads(false);
          } else {
            this.showToast(json.message || "Error al eliminar debate");
          }
        } catch (e) {
          this.showToast("Error de conexión al eliminar debate");
        }
      }
    );
  }

  // Moderación Admin: Borrar Comentario
  adminDeleteComment(commentId, threadId) {
    if (!this.adminToken) return;
    this.confirmAdminAction(
      "Eliminar Comentario",
      "¿Confirmás la eliminación permanente de este comentario?",
      async () => {
        try {
          const res = await fetch("/api/admin?action=borrar_comentario", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.adminToken}`
            },
            body: JSON.stringify({ comentarioId: commentId, id: commentId })
          });
          const json = await res.json();
          if (json.status === "ok") {
            this.showToast("🗑️ Comentario eliminado");
            if (threadId) {
              this.openThread(threadId); // refrescar comentarios en modal
            }
            this.loadThreads(false); // refrescar contador en feed
          } else {
            this.showToast(json.message || "Error al eliminar comentario");
          }
        } catch (e) {
          this.showToast("Error de conexión al eliminar comentario");
        }
      }
    );
  }

  // Moderación Admin: Abrir Modal de Sanción
  openSanctionModal(user) {
    if (!this.adminToken || !user) return;
    const col = this.getColegio(user.colegioId);

    if (this.sanctionTargetGoogleId) this.sanctionTargetGoogleId.value = user.googleId || "";
    if (this.sanctionUserName) this.sanctionUserName.textContent = user.nombre || "Usuario";
    if (this.sanctionUserSchool) this.sanctionUserSchool.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
    if (this.sanctionUserAvatar) {
      this.sanctionUserAvatar.src = user.avatarUrl || "assets/avatar-default.webp";
    }
    if (this.sanctionUserStatus) {
      const st = user.estado || "activo";
      this.sanctionUserStatus.textContent = st.toUpperCase();
      this.sanctionUserStatus.className = `user-status-pill status-${st}`;
    }
    if (this.sanctionReasonText) this.sanctionReasonText.value = "";
    if (this.sanctionDurationGroup) this.sanctionDurationGroup.style.display = "block";

    // Marcar "suspender" por defecto
    if (this.formSanctionUser) {
      const radioSusp = this.formSanctionUser.querySelector('input[name="tipo-sancion"][value="suspender"]');
      if (radioSusp) radioSusp.checked = true;
    }

    if (this.modalSanctionUser) this.modalSanctionUser.classList.add("active");
  }

  // Moderación Admin: Aplicar Sanción
  async handleSanctionSubmit(e) {
    e.preventDefault();
    if (!this.adminToken) return;

    const googleId = (this.sanctionTargetGoogleId && this.sanctionTargetGoogleId.value.trim()) || "";
    if (!googleId) {
      this.showToast("Identificador de usuario inválido");
      return;
    }

    const selectedRadio = this.formSanctionUser.querySelector('input[name="tipo-sancion"]:checked');
    const tipoSancion = selectedRadio ? selectedRadio.value : "suspender";
    const duracionHoras = parseInt((this.sanctionDurationSelect && this.sanctionDurationSelect.value) || "24", 10);
    const motivo = (this.sanctionReasonText && this.sanctionReasonText.value.trim()) || "";

    try {
      const res = await fetch("/api/admin?action=sancionar_usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({
          googleId,
          tipoSancion,
          duracionHoras,
          motivo
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        this.showToast(`🛡️ ${json.message}`);
        if (this.modalSanctionUser) this.modalSanctionUser.classList.remove("active");
      } else {
        this.showToast(json.message || "Error al aplicar sanción");
      }
    } catch (err) {
      console.error("Error al sancionar usuario:", err);
      this.showToast("Error de conexión con el servidor");
    }
  }

  closeUserProfileModal() {
    if (this.modalUserProfile) {
      this.modalUserProfile.classList.remove("open", "active");
      this.modalUserProfile.setAttribute("aria-hidden", "true");
      const schoolProps = [
        "--school-primary", "--school-secondary", "--school-accent", "--school-glow",
        "--school-collar", "--school-text-contrast", "--school-surface", "--school-border",
        "--school-gradient", "--school-gradient-subtle"
      ];
      schoolProps.forEach(prop => this.modalUserProfile.style.removeProperty(prop));
    }
    // Limpiar parámetro usuario de la URL
    const url = new URL(window.location);
    if (url.searchParams.has("usuario") || url.searchParams.has("perfil")) {
      url.searchParams.delete("usuario");
      url.searchParams.delete("perfil");
      window.history.replaceState({}, "", url);
    }
  }

  switchProfileTab(tabName) {
    const tabs = [
      { name: "view", btn: this.tabBtnProfileView, panel: this.profileTabView },
      { name: "edit", btn: this.tabBtnProfileEdit, panel: this.profileTabEdit },
      { name: "threads", btn: this.tabBtnProfileThreads, panel: this.profileTabThreads },
      { name: "replies", btn: this.tabBtnProfileReplies, panel: this.profileTabReplies }
    ];

    tabs.forEach(t => {
      const isActive = t.name === tabName;
      if (t.btn) {
        t.btn.classList.toggle("active", isActive);
        t.btn.setAttribute("aria-selected", isActive ? "true" : "false");
      }
      if (t.panel) {
        t.panel.style.display = isActive ? (t.name === "view" || t.name === "edit" ? "flex" : "block") : "none";
      }
    });

    if (tabName === "edit" && this.editProfileName) {
      setTimeout(() => this.editProfileName.focus(), 100);
    }
  }

  async openUserProfile(googleId, initialTab = "view") {
    if (!googleId) return;

    // Actualizar URL sin recargar para soportar compartir
    const url = new URL(window.location);
    url.searchParams.set("usuario", googleId);
    window.history.replaceState({}, "", url);

    try {
      const res = await fetch(`/api/foro?action=perfil&id=${encodeURIComponent(googleId)}`);
      const json = await res.json();

      if (json.status !== "ok" || !json.usuario) {
        this.showToast("El usuario solicitado no fue encontrado.");
        return;
      }

      const u = json.usuario;
      const m = json.metricas || { totalHilos: 0, totalComentarios: 0, karmaTotal: 0 };
      const insignias = json.insignias || [];
      const hilos = json.hilosRecientes || [];
      const comentarios = json.comentariosRecientes || [];

      this._currentViewingProfileUser = u;

      // Determinar si es el propio perfil del usuario autenticado
      const isOwner = !!(this.currentUser && this.currentUser.googleId === u.googleId);

      // Colores institucionales para banner y scoping temático del modal
      const col = this.getColegio(u.colegioId);
      if (this.modalUserProfile) {
        this.applySchoolTheme(u.colegioId, this.modalUserProfile);
      }
      if (this.profileHeroBanner) {
        const primary = (col && col.colores && col.colores.primary) || "#1d4ed8";
        const secondary = (col && col.colores && col.colores.secondary) || primary;
        this.profileHeroBanner.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
      }

      // Avatar
      if (this.profileAvatarImg) {
        this.profileAvatarImg.src = u.avatarUrl || "assets/avatar-default.webp";
      }

      // Nombre y Rol/Badge
      if (this.profileUserName) {
        this.profileUserName.textContent = u.nombre || "Hincha";
      }
      if (this.profileUserHandle) {
        this.profileUserHandle.textContent = u.username ? `@${u.username}` : "";
        this.profileUserHandle.style.display = u.username ? "block" : "none";
      }
      if (this.profileUserBadge) {
        if (u.rol === "admin" || u.rol === "superadmin") {
          this.profileUserBadge.textContent = "⚡ Moderador Oficial";
          this.profileUserBadge.style.display = "inline-flex";
        } else if (u.estado === "suspendido") {
          this.profileUserBadge.textContent = "⏳ Suspendido";
          this.profileUserBadge.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
          this.profileUserBadge.style.display = "inline-flex";
        } else if (u.estado === "baneado") {
          this.profileUserBadge.textContent = "⛔ Baneado";
          this.profileUserBadge.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
          this.profileUserBadge.style.display = "inline-flex";
        } else {
          this.profileUserBadge.style.display = "none";
        }
      }

      // Tags de Colegio, Rol Estudiantil y Año
      if (this.profileSchoolPill) {
        this.profileSchoolPill.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
      }
      if (this.profileRolePill) {
        this.profileRolePill.textContent = u.rolEstudiantil || "Hincha de Tribuna";
      }
      if (this.profileGradePill) {
        this.profileGradePill.textContent = u.anoEscolar || "Secundaria";
      }

      // Biografía
      if (this.profileUserBio) {
        if (u.bio && u.bio.trim()) {
          this.profileUserBio.textContent = u.bio;
          this.profileUserBio.style.fontStyle = "normal";
          this.profileUserBio.style.display = "block";
          this.profileUserBio.style.removeProperty("color");
        } else {
          this.profileUserBio.textContent = isOwner
            ? "Aún no escribiste tu biografía. ¡Hacé click en 'Editar Perfil' para agregarla!"
            : "Este hincha aún no ha escrito una biografía.";
          this.profileUserBio.style.fontStyle = "italic";
          this.profileUserBio.style.display = "block";
          this.profileUserBio.style.removeProperty("color");
        }
      }

      // Instagram
      if (this.profileSocialRow && this.profileInstagramLink && this.profileInstagramText) {
        if (u.instagram && u.instagram.trim()) {
          const cleanInsta = u.instagram.trim().replace(/^@/, "");
          this.profileInstagramText.textContent = `@${cleanInsta}`;
          this.profileInstagramLink.href = `https://instagram.com/${encodeURIComponent(cleanInsta)}`;
          this.profileSocialRow.style.display = "block";
        } else {
          this.profileSocialRow.style.display = "none";
        }
      }

      // Pestaña y Botón Editar (SOLO si es el dueño del perfil)
      if (this.tabLabelProfileView) {
        this.tabLabelProfileView.textContent = isOwner ? "Mi Perfil" : "Perfil";
      }

      if (this.tabBtnProfileEdit) {
        this.tabBtnProfileEdit.style.display = isOwner ? "inline-flex" : "none";
      }

      if (this.btnOpenEditProfile) {
        this.btnOpenEditProfile.style.display = isOwner ? "inline-flex" : "none";
      }

      // Botón Compartir
      if (this.btnProfileShare) {
        this.btnProfileShare.dataset.userId = u.googleId;
      }

      // Botón Moderar (visible solo para admin y no moderarse a sí mismo)
      if (this.btnProfileModerate) {
        this.btnProfileModerate.style.display = this.adminToken && !isOwner ? "inline-flex" : "none";
      }

      // Pre-cargar datos en el formulario de edición si es el dueño
      if (isOwner) {
        if (this.editProfileUsername) {
          this.editProfileUsername.value = u.username || "";
          if (this.editProfileUsernameStatus) {
            this.editProfileUsernameStatus.textContent = "";
            this.editProfileUsernameStatus.className = "username-status-badge";
          }
        }
        if (this.editProfileName) this.editProfileName.value = u.nombre || "";
        if (this.editProfileSchool) this.editProfileSchool.value = u.colegioId || "janssen";
        if (this.editProfileRole) this.editProfileRole.value = u.rolEstudiantil || "Hincha de Tribuna";
        if (this.editProfileGrade) this.editProfileGrade.value = u.anoEscolar || "5° Año (Promo)";
        if (this.editProfileBio) {
          this.editProfileBio.value = u.bio || "";
          if (this.editBioCounter) {
            this.editBioCounter.textContent = `(${(u.bio || "").length}/160)`;
          }
        }
        if (this.editProfileInstagram) {
          this.editProfileInstagram.value = (u.instagram || "").replace(/^@/, "");
        }

        this._pendingEditPhoto = null;
        this._restoreGoogleAvatar = false;
        if (this.editProfilePhotoPreview) {
          this.editProfilePhotoPreview.src = u.avatarUrl || "assets/avatar-default.webp";
        }
      }

      // Métricas
      if (this.profileStatKarma) this.profileStatKarma.textContent = m.karmaTotal || 0;
      if (this.profileStatThreads) this.profileStatThreads.textContent = m.totalHilos || 0;
      if (this.profileStatReplies) this.profileStatReplies.textContent = m.totalComentarios || 0;

      if (this.profileCountTabThreads) this.profileCountTabThreads.textContent = m.totalHilos || 0;
      if (this.profileCountTabReplies) this.profileCountTabReplies.textContent = m.totalComentarios || 0;

      // Insignias
      if (this.profileBadgesList) {
        if (insignias.length === 0) {
          this.profileBadgesList.innerHTML = `<span style="font-size:0.8rem;color:var(--foro-text-muted);">Sin insignias por el momento.</span>`;
        } else {
          this.profileBadgesList.innerHTML = insignias.map(b => `
            <div class="badge-item-pill" title="${escapeHtml(b.desc)}" style="border-color: ${b.color || "rgba(255,255,255,0.1)"}">
              <span class="badge-icon">${b.icono || "⭐"}</span>
              <span class="badge-title">${escapeHtml(b.titulo)}</span>
            </div>
          `).join("");
        }
      }

      // Pestaña Debates Creados
      if (this.profileThreadsList) {
        if (hilos.length === 0) {
          this.profileThreadsList.innerHTML = `<div style="font-size:0.82rem;color:var(--foro-text-muted);padding:10px 0;">No ha publicado debates todavía.</div>`;
        } else {
          this.profileThreadsList.innerHTML = hilos.map(h => `
            <div class="profile-activity-item" data-thread-id="${h.id}">
              <span class="activity-item-title">${escapeHtml(h.titulo)}</span>
              <div class="activity-item-meta">
                <span class="activity-meta-metric">▲ ${h.votos || 0}</span>
                <span class="activity-meta-metric">💬 ${h.respuestas_count || 0}</span>
                <span>${timeAgo(h.creado_en)}</span>
              </div>
            </div>
          `).join("");

          this.profileThreadsList.querySelectorAll(".profile-activity-item").forEach(item => {
            item.addEventListener("click", () => {
              const threadId = item.dataset.threadId;
              this.closeUserProfileModal();
              this.openThread(threadId);
            });
          });
        }
      }

      // Pestaña Comentarios / Respuestas
      if (this.profileRepliesList) {
        if (comentarios.length === 0) {
          this.profileRepliesList.innerHTML = `<div style="font-size:0.82rem;color:var(--foro-text-muted);padding:10px 0;">No ha participado en comentarios todavía.</div>`;
        } else {
          this.profileRepliesList.innerHTML = comentarios.map(c => `
            <div class="profile-activity-item" data-thread-id="${c.hilo_id}">
              <span style="font-size:0.75rem;color:var(--foro-cyan);font-weight:700;">En: ${escapeHtml(c.hilo_titulo || "Debate #" + c.hilo_id)}</span>
              <span class="activity-item-title" style="font-weight:400;">${escapeHtml(c.contenido)}</span>
              <div class="activity-item-meta">
                <span class="activity-meta-metric">▲ ${c.votos || 0}</span>
                <span>${timeAgo(c.creado_en)}</span>
              </div>
            </div>
          `).join("");

          this.profileRepliesList.querySelectorAll(".profile-activity-item").forEach(item => {
            item.addEventListener("click", () => {
              const threadId = item.dataset.threadId;
              this.closeUserProfileModal();
              this.openThread(threadId);
            });
          });
        }
      }

      // Activar pestaña solicitada
      const targetTab = (!isOwner && initialTab === "edit") ? "view" : initialTab;
      this.switchProfileTab(targetTab);

      // Abrir modal
      if (this.modalUserProfile) {
        this.modalUserProfile.classList.add("open", "active");
        this.modalUserProfile.setAttribute("aria-hidden", "false");
      }
    } catch (err) {
      console.error("Error al cargar perfil de usuario:", err);
      this.showToast("Error de conexión al cargar el perfil");
    }
  }

  async handleEditProfileSubmit(e) {
    e.preventDefault();
    if (!this.currentUser) return;

    const username = (this.editProfileUsername && this.editProfileUsername.value.trim().toLowerCase()) || "";
    const nombre = (this.editProfileName && this.editProfileName.value.trim()) || this.currentUser.nombre;
    const colegioId = (this.editProfileSchool && this.editProfileSchool.value) || this.currentUser.colegioId;
    const rolEstudiantil = (this.editProfileRole && this.editProfileRole.value) || "Hincha de Tribuna";
    const anoEscolar = (this.editProfileGrade && this.editProfileGrade.value) || "5° Año (Promo)";
    const bio = (this.editProfileBio && this.editProfileBio.value.trim()) || "";
    const instagram = (this.editProfileInstagram && this.editProfileInstagram.value.trim().replace(/^@/, "")) || "";

    if (username && username.length < 3) {
      this.showToast("El usuario debe tener al menos 3 caracteres");
      if (this.editProfileUsername) this.editProfileUsername.focus();
      return;
    }

    const payload = {
      googleId: this.currentUser.googleId,
      username,
      nombre,
      colegioId,
      rolEstudiantil,
      anoEscolar,
      bio,
      instagram
    };

    if (this._restoreGoogleAvatar) {
      payload.restoreGoogleAvatar = true;
    } else if (this._pendingEditPhoto) {
      payload.avatarUrl = this._pendingEditPhoto;
    }

    try {
      const res = await fetch("/api/foro?action=editar_perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.status === "ok" && json.usuario) {
        // Actualizar currentUser
        this.currentUser.username = json.usuario.username || "";
        this.currentUser.nombre = json.usuario.nombre;
        this.currentUser.colegioId = json.usuario.colegioId;
        this.currentUser.bio = json.usuario.bio;
        this.currentUser.rolEstudiantil = json.usuario.rolEstudiantil;
        this.currentUser.anoEscolar = json.usuario.anoEscolar;
        this.currentUser.instagram = json.usuario.instagram;
        this.currentUser.avatarUrl = json.usuario.avatarUrl;

        localStorage.setItem("comunidad_google_user", JSON.stringify(this.currentUser));

        this._pendingEditPhoto = null;
        this._restoreGoogleAvatar = false;

        if (this.currentUser.colegioId) {
          this.applySchoolTheme(this.currentUser.colegioId);
        }

        this.updateUserBar();
        this.showToast("✨ ¡Perfil actualizado con éxito!");

        // Refrescar modal de perfil directamente en la pestaña "view"
        this.openUserProfile(this.currentUser.googleId, "view");

        // Recargar hilos para reflejar cambios de nombre/avatar/username en feed
        this.loadThreads(false);
      } else {
        this.showToast(json.message || "Error al actualizar perfil");
      }
    } catch (err) {
      console.error("Error al editar perfil:", err);
      this.showToast("Error de conexión al guardar cambios");
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
