/**
 * MÓDULO INTERACTIVO DE COMUNIDAD & FORO - ESTUDIANTINA ONLINE
 * Portal estilo diario digital + Foro completo en SQLite con autenticación Google
 */

import { COLEGIOS } from "./colegios.js";

class ComunidadApp {
  constructor() {
    this.data = null;
    this.activeCategory = "todas";
    this.searchQuery = "";
    this.activeCanal = "todos";
    this.activeSort = "top";
    this.activeThreadId = null;
    this.editingNewsId = null;

    // Usuario y Votos
    this.currentUser = JSON.parse(localStorage.getItem("comunidad_google_user") || "null");
    this.userVotes = new Set(JSON.parse(localStorage.getItem("comunidad_voted_threads") || "[]"));

    // Modo Administrador
    this.adminToken = localStorage.getItem("comunidad_admin_token") || null;
    this.adminUser = localStorage.getItem("comunidad_admin_user") || null;

    this.cacheDom();
    this.initEvents();
    this.initGoogleAuth();
    this.initAdmin();
    this.populateSchoolSelects();
    this.loadData();
    this.loadForum();
  }

  getColegio(id) {
    const found = (COLEGIOS || []).find(c => c.id === id);
    return found || { id: "general", nombre: "Colegio", escudo: "🥁", apodo: "Colegio" };
  }

  cacheDom() {
    this.heroArticle     = document.getElementById("hero-article");
    this.newsGrid        = document.getElementById("news-grid");
    this.newsCount       = document.getElementById("news-count");
    this.trendingList    = document.getElementById("trending-list");
    this.searchInput     = document.getElementById("search-input");
    this.categoryPills   = document.querySelectorAll(".filter-chip");

    // Dynamic sections & site elements
    this.cronogramaGrid        = document.getElementById("cronograma-grid");
    this.faqList               = document.getElementById("faq-list");
    this.breakingTicker        = document.getElementById("breaking-ticker");
    this.tickerTrack           = document.getElementById("ticker-track");
    this.mastheadTagline       = document.querySelector(".masthead-tagline");

    // Drawer de Filtros Mobile (3 rayitas)
    this.btnFilterToggle     = document.getElementById("btn-filter-drawer-toggle");
    this.filterDrawerOverlay = document.getElementById("filter-drawer-overlay");
    this.filterDrawer        = document.getElementById("filter-drawer");
    this.btnCloseDrawer      = document.getElementById("btn-close-filter-drawer");
    this.btnApplyFilters     = document.getElementById("btn-apply-filters");
    this.btnResetFilters     = document.getElementById("btn-reset-filters");
    this.drawerChips         = document.querySelectorAll(".drawer-chip");
    this.activeFilterBadge   = document.getElementById("active-filter-badge");

    // Modal Lector de Noticias
    this.modalReader          = document.getElementById("modal-reader");
    this.readerCategory       = document.getElementById("reader-category");
    this.readerTitle          = document.getElementById("reader-title");
    this.readerMeta           = document.getElementById("reader-meta");
    this.readerBody           = document.getElementById("reader-body");
    this.btnCloseReader       = document.getElementById("btn-close-reader");
    this.btnCloseReaderAction = document.getElementById("btn-close-reader-action");
    this.btnShareArticle      = document.getElementById("btn-share-article");
    this.readerCoverWrap      = document.getElementById("reader-cover-wrap");
    this.readerCoverImg       = document.getElementById("reader-cover-img");
    this.btnReaderAdminDel    = document.getElementById("btn-reader-admin-del");
    this.btnReaderAdminEdit   = document.getElementById("btn-reader-admin-edit");

    // Foro: Barra de Usuario y Autenticación
    this.btnGoogleLogin        = document.getElementById("btn-google-login");
    this.forumUserProfile      = document.getElementById("forum-user-profile");
    this.userAvatarImg         = document.getElementById("user-avatar-img");
    this.userProfileName       = document.getElementById("user-profile-name");
    this.userProfileSchoolBadge= document.getElementById("user-profile-school-badge");
    this.btnLogout             = document.getElementById("btn-logout");

    // Foro: Componentes
    this.channelsGrid          = document.getElementById("channels-grid");
    this.threadsContainer      = document.getElementById("threads-container");
    this.btnProposeTopic       = document.getElementById("btn-propose-topic");
    this.tabSortTop            = document.getElementById("tab-sort-top");
    this.tabSortRecent         = document.getElementById("tab-sort-recent");
    this.forumActiveChannelName= document.getElementById("forum-active-channel-name");
    this.forumThreadsCount     = document.getElementById("forum-threads-count");

    // Modal Crear Debate
    this.modalTopic            = document.getElementById("modal-topic");
    this.btnCloseTopic         = document.getElementById("btn-close-topic");
    this.formTopic             = document.getElementById("form-topic");
    this.topicCanal            = document.getElementById("topic-canal");
    this.topicSchool           = document.getElementById("topic-school");
    this.topicTitle            = document.getElementById("topic-title");
    this.topicDesc             = document.getElementById("topic-desc");

    // Modal Detalle de Hilo & Comentarios
    this.modalThread           = document.getElementById("modal-thread");
    this.btnCloseThreadModal   = document.getElementById("btn-close-thread-modal");
    this.threadModalChannel    = document.getElementById("thread-modal-channel");
    this.threadModalTitle      = document.getElementById("thread-modal-title");
    this.threadModalAvatar     = document.getElementById("thread-modal-avatar");
    this.threadModalAuthor     = document.getElementById("thread-modal-author");
    this.threadModalSchool     = document.getElementById("thread-modal-school");
    this.threadModalDate       = document.getElementById("thread-modal-date");
    this.threadModalContent    = document.getElementById("thread-modal-content");
    this.btnVoteMainThread     = document.getElementById("btn-vote-main-thread");
    this.threadModalVotesCount = document.getElementById("thread-modal-votes-count");
    this.btnReportMainThread   = document.getElementById("btn-report-main-thread");
    this.threadModalRepliesCount = document.getElementById("thread-modal-replies-count");
    this.threadRepliesList     = document.getElementById("thread-replies-list");
    this.threadReplyUnauth     = document.getElementById("thread-reply-unauth");
    this.btnReplyGoogleAuth    = document.getElementById("btn-reply-google-auth");
    this.formThreadReply       = document.getElementById("form-thread-reply");
    this.replyUserAvatar       = document.getElementById("reply-user-avatar");
    this.replyInputContent     = document.getElementById("reply-input-content");
    this.replySchoolHint       = document.getElementById("reply-school-hint");

    // Modal Login Google & Selección de Colegio
    this.modalGoogleAuth       = document.getElementById("modal-google-auth");
    this.btnCloseAuthModal     = document.getElementById("btn-close-auth-modal");
    this.authSelectSchool      = document.getElementById("auth-select-school");
    this.btnQuickLogin         = document.getElementById("btn-quick-login");
    this.googleGisContainer    = document.getElementById("google-gis-container");

    // FAQ
    this.faqItems = document.querySelectorAll(".faq-item");

    // Toast
    this.toastNotification = document.getElementById("toast-notification");

    // -------------------------------------------------------------
    // ELEMENTOS DEL MODO ADMINISTRADOR
    // -------------------------------------------------------------
    // Barra superior flotante y toolbar
    this.adminBar               = document.getElementById("admin-bar");
    this.adminBarUser           = document.getElementById("admin-bar-user");
    this.btnAdminOpenComposer   = document.getElementById("btn-admin-open-composer");
    this.btnAdminOpenThreads    = document.getElementById("btn-admin-open-threads");
    this.btnAdminOpenCronograma = document.getElementById("btn-admin-open-cronograma");
    this.btnAdminOpenGuia       = document.getElementById("btn-admin-open-guia");
    this.btnAdminOpenSettings   = document.getElementById("btn-admin-open-settings");
    this.btnAdminOpenPanel      = document.getElementById("btn-admin-open-panel");
    this.adminReportsBadge      = document.getElementById("admin-reports-badge");
    this.btnAdminLogout         = document.getElementById("btn-admin-logout");
    this.adminNewsToolbar       = document.getElementById("admin-news-toolbar");
    this.btnAdminComposeNewsInline = document.getElementById("btn-admin-compose-news-inline");
    this.btnFooterAdminTrigger  = document.getElementById("btn-footer-admin-trigger");
    this.btnAdminManageCronograma = document.getElementById("btn-admin-manage-cronograma");
    this.btnAdminManageGuia     = document.getElementById("btn-admin-manage-guia");

    // Modal Login Admin
    this.modalAdminLogin        = document.getElementById("modal-admin-login");
    this.btnCloseAdminLogin     = document.getElementById("btn-close-admin-login");
    this.formAdminLogin         = document.getElementById("form-admin-login");
    this.adminLoginUser         = document.getElementById("admin-login-user");
    this.adminLoginPassword     = document.getElementById("admin-login-password");
    this.btnToggleAdminPassword = document.getElementById("btn-toggle-admin-password");
    this.adminLoginError        = document.getElementById("admin-login-error");
    this.btnSubmitAdminLogin    = document.getElementById("btn-submit-admin-login");

    // Modal Editor Noticia
    this.modalAdminEditorNoticia = document.getElementById("modal-admin-editor-noticia");
    this.btnCloseAdminEditor    = document.getElementById("btn-close-admin-editor");
    this.formAdminNoticia       = document.getElementById("form-admin-noticia");
    this.newsInputRubro         = document.getElementById("news-input-rubro");
    this.newsInputBadge         = document.getElementById("news-input-badge");
    this.newsInputTitle         = document.getElementById("news-input-title");
    this.newsInputResumen       = document.getElementById("news-input-resumen");
    this.newsInputContenido     = document.getElementById("news-input-contenido");
    this.newsInputTags          = document.getElementById("news-input-tags");
    this.newsInputAutor         = document.getElementById("news-input-autor");
    this.newsInputImage         = document.getElementById("news-input-image");
    this.newsInputFile          = document.getElementById("news-input-file");
    this.newsImagePreviewWrap   = document.getElementById("news-image-preview-wrap");
    this.newsImagePreview       = document.getElementById("news-image-preview");
    this.btnRemoveNewsImg       = document.getElementById("btn-remove-news-img");
    this.btnSubmitCreateNews    = document.getElementById("btn-submit-create-news");

    // Modal Admin Panel y Pestañas
    this.modalAdminPanel        = document.getElementById("modal-admin-panel");
    this.btnCloseAdminPanel     = document.getElementById("btn-close-admin-panel");
    this.adminPanelTabs         = document.querySelectorAll(".admin-panel-tab");
    this.tabReportsBadge        = document.getElementById("tab-reports-badge");
    this.adminTabReports        = document.getElementById("admin-tab-reports");
    this.adminTabNews           = document.getElementById("admin-tab-news");
    this.adminTabThreads        = document.getElementById("admin-tab-threads");
    this.adminTabCronograma     = document.getElementById("admin-tab-cronograma");
    this.adminTabGuia           = document.getElementById("admin-tab-guia");
    this.adminTabSite           = document.getElementById("admin-tab-site");
    this.adminTabPassword       = document.getElementById("admin-tab-password");

    this.adminReportsContainer  = document.getElementById("admin-reports-container");
    this.adminNewsTableWrap     = document.getElementById("admin-news-table-wrap");
    this.btnAdminAddNewsFromPanel = document.getElementById("btn-admin-add-news-from-panel");

    // Tab Threads
    this.adminThreadsTableWrap   = document.getElementById("admin-threads-table-wrap");
    this.adminThreadsSearchInput = document.getElementById("admin-threads-search-input");

    // Tab Cronograma
    this.adminCronogramaListWrap = document.getElementById("admin-cronograma-list-wrap");
    this.btnAdminAddPhase        = document.getElementById("btn-admin-add-phase");
    this.btnSaveAdminCronograma  = document.getElementById("btn-save-admin-cronograma");

    // Tab Guías
    this.adminGuiaListWrap       = document.getElementById("admin-guia-list-wrap");
    this.btnAdminAddFaq          = document.getElementById("btn-admin-add-faq");
    this.btnSaveAdminGuia        = document.getElementById("btn-save-admin-guia");

    // Tab Ajustes
    this.formAdminSiteSettings   = document.getElementById("form-admin-site-settings");
    this.siteSettingTickerActive = document.getElementById("site-setting-ticker-active");
    this.siteSettingTickerLines  = document.getElementById("site-setting-ticker-lines");
    this.siteSettingTagline      = document.getElementById("site-setting-tagline");
    this.siteSettingInstagram    = document.getElementById("site-setting-instagram");
    this.siteSettingEmail        = document.getElementById("site-setting-email");

    this.formAdminChangePwd     = document.getElementById("form-admin-change-pwd");
    this.pwdActual              = document.getElementById("pwd-actual");
    this.pwdNueva               = document.getElementById("pwd-nueva");
    this.pwdConfirmar           = document.getElementById("pwd-confirmar");
    this.btnSubmitChangePwd     = document.getElementById("btn-submit-change-pwd");

    // Botón borrar hilo en modal de debate
    this.btnAdminDelMainThread  = document.getElementById("btn-admin-del-main-thread");

    // Modal Confirmación Administrativa
    this.modalAdminConfirm      = document.getElementById("modal-admin-confirm");
    this.adminConfirmTitle      = document.getElementById("admin-confirm-title");
    this.adminConfirmMsg        = document.getElementById("admin-confirm-msg");
    this.btnCancelAdminConfirm  = document.getElementById("btn-cancel-admin-confirm");
    this.btnOkAdminConfirm      = document.getElementById("btn-ok-admin-confirm");

    // New Reader elements (professional fullscreen)
    this.readerProgressBar      = document.getElementById("reader-progress-bar");
    this.readerCategoryTop      = document.getElementById("reader-category-top");
    this.readerBadgeLabel       = document.getElementById("reader-badge-label");
    this.readerResumenLead      = document.getElementById("reader-resumen-lead");
    this.readerAuthorAvatar     = document.getElementById("reader-author-avatar");
    this.readerAuthorName       = document.getElementById("reader-author-name");
    this.readerReadTime         = document.getElementById("reader-read-time");
    this.btnReaderOpenTab       = document.getElementById("btn-reader-open-tab");
    this.btnReaderFooterOpenTab = document.getElementById("btn-reader-footer-open-tab");
    this.readerGalleryGrid      = document.getElementById("reader-gallery-grid");
    this.readerRelatedGrid      = document.getElementById("reader-related-grid");
    this.readerTagsRow          = document.getElementById("reader-tags-row");
    this.readerTabs             = document.querySelectorAll(".reader-tab");
    this.readerTabPanels        = document.querySelectorAll(".reader-tab-panel");
    this.readerTabArticulo      = document.getElementById("reader-tab-articulo");
    this.readerTabGaleria       = document.getElementById("reader-tab-galeria");
    this.readerTabRelacionadas  = document.getElementById("reader-tab-relacionadas");

    // New Editor elements (multi-tab block editor)
    this.editorTabs             = document.querySelectorAll(".editor-tab");
    this.editorTabPanels        = document.querySelectorAll(".editor-tab-panel");
    this.editorTabContenido     = document.getElementById("editor-tab-contenido");
    this.editorTabPortada       = document.getElementById("editor-tab-portada");
    this.editorTabPreview       = document.getElementById("editor-tab-preview");
    this.editorBlocksList       = document.getElementById("editor-blocks-list");
    this.editorBlocksCount      = document.getElementById("editor-blocks-count");
    this.editorStatusLabel      = document.getElementById("editor-status-label");
    this.editorPreviewContent   = document.getElementById("editor-preview-content");
    this.btnAddTextBlock        = document.getElementById("btn-add-text-block");
    this.btnAddImageBlock       = document.getElementById("btn-add-image-block");
    this.btnAddQuoteBlock       = document.getElementById("btn-add-quote-block");
    this.btnEditorPreviewQuick  = document.getElementById("btn-editor-preview-quick");
    this.editorCoverNoImg       = document.getElementById("editor-cover-no-img");

    // Block editor state
    this._editorBlocks = [];
  }

  populateSchoolSelects() {
    const optionsHtml = (COLEGIOS || []).map(c => 
      `<option value="${c.id}">${c.escudo || "🥁"} ${c.nombre}</option>`
    ).join("");

    if (this.topicSchool) this.topicSchool.innerHTML = optionsHtml;
    if (this.authSelectSchool) this.authSelectSchool.innerHTML = optionsHtml;
  }

  initGoogleAuth() {
    this.updateUserBar();

    // Intentar inicializar Google Identity Services si está disponible
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: "77491039824-demo.apps.googleusercontent.com", // Reemplazable con Client ID de Google Cloud
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
        console.warn("Google GIS Client not configured:", e);
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
    const col = this.getColegio(schoolId);
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

    // Sincronizar en el servidor SQLite
    try {
      await fetch("/api/foro?action=auth_google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.warn("Error sincronizando usuario:", err);
    }

    // Actualizar vista de hilos/respuestas
    if (this.activeThreadId) {
      this.openThread(this.activeThreadId);
    }
  }

  updateUserBar() {
    if (this.currentUser) {
      if (this.btnGoogleLogin) this.btnGoogleLogin.style.display = "none";
      if (this.forumUserProfile) this.forumUserProfile.style.display = "flex";
      if (this.userAvatarImg) this.userAvatarImg.src = this.currentUser.avatarUrl;
      if (this.userProfileName) this.userProfileName.textContent = this.currentUser.nombre;

      const col = this.getColegio(this.currentUser.colegioId);
      if (this.userProfileSchoolBadge) {
        this.userProfileSchoolBadge.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
      }
      if (this.topicSchool) this.topicSchool.value = this.currentUser.colegioId;
    } else {
      if (this.btnGoogleLogin) this.btnGoogleLogin.style.display = "inline-flex";
      if (this.forumUserProfile) this.forumUserProfile.style.display = "none";
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("comunidad_google_user");
    this.updateUserBar();
    this.showToast("Sesión cerrada.");
    if (this.activeThreadId) {
      this.openThread(this.activeThreadId);
    }
  }

  formatTimeAgo(dateStr) {
    if (!dateStr) return "recientemente";
    const date = new Date(dateStr.replace(" ", "T"));
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (isNaN(diffSec) || diffSec < 60) return "hace un momento";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `hace ${diffHoras} h`;
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 30) return `hace ${diffDias} d`;
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  }

  initEvents() {
    // Buscador de noticias
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderNews();
      });
    }

    // Helper de categoría compartida (desktop pills + mobile drawer)
    const setCategory = (cat) => {
      this.activeCategory = cat || "todas";

      this.categoryPills.forEach(p => {
        const isMatch = (p.dataset.category || "todas") === this.activeCategory;
        p.classList.toggle("active", isMatch);
        p.setAttribute("aria-selected", isMatch ? "true" : "false");
      });

      this.drawerChips.forEach(chip => {
        const isMatch = (chip.dataset.category || "todas") === this.activeCategory;
        chip.classList.toggle("active", isMatch);
      });

      if (this.activeFilterBadge) {
        const catMap = {
          "todas": "Todas",
          "noches-de-calle": "Calle",
          "baile": "Baile",
          "banda": "Banda",
          "simulador": "Juego",
          "informacion": "Info"
        };
        this.activeFilterBadge.textContent = catMap[this.activeCategory] || "Filtro";
      }

      this.renderNews();
    };

    this.categoryPills.forEach(pill => {
      pill.addEventListener("click", () => setCategory(pill.dataset.category));
    });

    // Control de Drawer de Filtros Mobile (3 rayitas)
    const openDrawer = () => {
      if (this.filterDrawerOverlay) {
        this.filterDrawerOverlay.classList.add("active");
        this.filterDrawerOverlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (this.btnFilterToggle) this.btnFilterToggle.setAttribute("aria-expanded", "true");
      }
    };

    const closeDrawer = () => {
      if (this.filterDrawerOverlay) {
        this.filterDrawerOverlay.classList.remove("active");
        this.filterDrawerOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (this.btnFilterToggle) this.btnFilterToggle.setAttribute("aria-expanded", "false");
      }
    };

    this.drawerChips.forEach(chip => {
      chip.addEventListener("click", () => {
        setCategory(chip.dataset.category);
        closeDrawer();
      });
    });

    if (this.btnFilterToggle) this.btnFilterToggle.addEventListener("click", openDrawer);
    if (this.btnCloseDrawer)  this.btnCloseDrawer.addEventListener("click", closeDrawer);
    if (this.btnApplyFilters) this.btnApplyFilters.addEventListener("click", closeDrawer);
    if (this.btnResetFilters) {
      this.btnResetFilters.addEventListener("click", () => {
        setCategory("todas");
        closeDrawer();
      });
    }
    if (this.filterDrawerOverlay) {
      this.filterDrawerOverlay.addEventListener("click", (e) => {
        if (e.target === this.filterDrawerOverlay) closeDrawer();
      });
    }

    // Modal Lector de Noticias
    const closeReader = () => {
      if (this.modalReader) this.modalReader.classList.remove("active");
      // Clean up scroll listener
      if (this._readerScrollListener && this.modalReader) {
        this.modalReader.querySelector(".article-modal-card")?.removeEventListener("scroll", this._readerScrollListener);
      }
    };
    if (this.btnCloseReader) this.btnCloseReader.addEventListener("click", closeReader);
    if (this.btnCloseReaderAction) this.btnCloseReaderAction.addEventListener("click", closeReader);
    if (this.modalReader) {
      this.modalReader.addEventListener("click", (e) => {
        if (e.target === this.modalReader) closeReader();
      });
    }

    // Reader tabs
    if (this.readerTabs) {
      this.readerTabs.forEach(tab => {
        tab.addEventListener("click", () => {
          const target = tab.dataset.readerTab;
          this.readerTabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const panels = {
            articulo: this.readerTabArticulo,
            galeria: this.readerTabGaleria,
            relacionadas: this.readerTabRelacionadas
          };
          Object.values(panels).forEach(p => p && (p.style.display = "none"));
          if (panels[target]) panels[target].style.display = "block";
        });
      });
    }

    // Editor tabs
    if (this.editorTabs) {
      this.editorTabs.forEach(tab => {
        tab.addEventListener("click", () => {
          const target = tab.dataset.editorTab;
          this.editorTabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const panels = {
            contenido: this.editorTabContenido,
            portada: this.editorTabPortada,
            preview: this.editorTabPreview
          };
          Object.values(panels).forEach(p => p && (p.style.display = "none"));
          if (panels[target]) panels[target].style.display = "block";
          if (target === "preview") this.updateEditorPreview();
        });
      });
    }

    // Block editor add-block buttons
    if (this.btnAddTextBlock)  this.btnAddTextBlock.addEventListener("click",  () => this.addEditorBlock("text"));
    if (this.btnAddImageBlock) this.btnAddImageBlock.addEventListener("click", () => this.addEditorBlock("image"));
    if (this.btnAddQuoteBlock) this.btnAddQuoteBlock.addEventListener("click", () => this.addEditorBlock("quote"));
    if (this.btnEditorPreviewQuick) {
      this.btnEditorPreviewQuick.addEventListener("click", () => {
        // Switch to preview tab
        this.editorTabs.forEach(t => t.classList.remove("active"));
        const previewTab = [...this.editorTabs].find(t => t.dataset.editorTab === "preview");
        if (previewTab) previewTab.classList.add("active");
        Object.values({ c: this.editorTabContenido, p: this.editorTabPortada, v: this.editorTabPreview }).forEach(p => p && (p.style.display = "none"));
        if (this.editorTabPreview) this.editorTabPreview.style.display = "block";
        this.updateEditorPreview();
      });
    }

    // Compartir Noticia
    if (this.btnShareArticle) {
      this.btnShareArticle.addEventListener("click", () => {
        const title = this.readerTitle ? this.readerTitle.textContent : "Noticia de la Estudiantina";
        if (navigator.share) {
          navigator.share({ title, text: `${title} — Lé la cobertura en estudiantina.online/comunidad`, url: window.location.href }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          this.showToast("Enlace copiado al portapapeles");
        }
      });
    }

    // FAQ Accordion
    this.faqItems.forEach(item => {
      const q = item.querySelector(".faq-question");
      if (q) {
        q.addEventListener("click", () => {
          const isOpen = item.classList.contains("active");
          this.faqItems.forEach(i => i.classList.remove("active"));
          if (!isOpen) item.classList.add("active");
        });
      }
    });

    // -------------------------------------------------------------
    // EVENTOS DEL FORO
    // -------------------------------------------------------------
    // Login con Google
    if (this.btnGoogleLogin) {
      this.btnGoogleLogin.addEventListener("click", () => {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      });
    }
    if (this.btnReplyGoogleAuth) {
      this.btnReplyGoogleAuth.addEventListener("click", () => {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      });
    }
    if (this.btnCloseAuthModal) {
      this.btnCloseAuthModal.addEventListener("click", () => {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.remove("active");
      });
    }
    if (this.btnQuickLogin) {
      this.btnQuickLogin.addEventListener("click", () => this.quickLogin());
    }
    if (this.btnLogout) {
      this.btnLogout.addEventListener("click", () => this.logout());
    }

    // Orden de hilos (Más Votados vs Recientes)
    if (this.tabSortTop) {
      this.tabSortTop.addEventListener("click", () => {
        this.activeSort = "top";
        this.tabSortTop.classList.add("active");
        if (this.tabSortRecent) this.tabSortRecent.classList.remove("active");
        this.loadThreads();
      });
    }
    if (this.tabSortRecent) {
      this.tabSortRecent.addEventListener("click", () => {
        this.activeSort = "recientes";
        this.tabSortRecent.classList.add("active");
        if (this.tabSortTop) this.tabSortTop.classList.remove("active");
        this.loadThreads();
      });
    }

    // Proponer Tema / Iniciar Debate
    const openTopicModal = () => {
      if (!this.currentUser) {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
        return;
      }
      if (this.modalTopic) this.modalTopic.classList.add("active");
    };
    const closeTopicModal = () => {
      if (this.modalTopic) this.modalTopic.classList.remove("active");
    };

    if (this.btnProposeTopic) this.btnProposeTopic.addEventListener("click", openTopicModal);
    if (this.btnCloseTopic)   this.btnCloseTopic.addEventListener("click", closeTopicModal);
    if (this.modalTopic) {
      this.modalTopic.addEventListener("click", (e) => {
        if (e.target === this.modalTopic) closeTopicModal();
      });
    }

    // Envío del Formulario Nuevo Debate
    if (this.formTopic) {
      this.formTopic.addEventListener("submit", (e) => this.submitNewTopic(e));
    }

    // Modal Detalle de Hilo
    const closeThreadModal = () => {
      if (this.modalThread) this.modalThread.classList.remove("active");
      this.activeThreadId = null;
    };
    if (this.btnCloseThreadModal) this.btnCloseThreadModal.addEventListener("click", closeThreadModal);
    if (this.modalThread) {
      this.modalThread.addEventListener("click", (e) => {
        if (e.target === this.modalThread) closeThreadModal();
      });
    }

    // Envío de Respuesta a Hilo
    if (this.formThreadReply) {
      this.formThreadReply.addEventListener("submit", (e) => this.submitReply(e));
    }

    // Voto del post principal en modal
    if (this.btnVoteMainThread) {
      this.btnVoteMainThread.addEventListener("click", () => {
        if (this.activeThreadId) {
          this.toggleVote("hilo", this.activeThreadId, this.btnVoteMainThread, this.threadModalVotesCount);
        }
      });
    }

    // Reporte del hilo
    if (this.btnReportMainThread) {
      this.btnReportMainThread.addEventListener("click", async () => {
        if (!this.activeThreadId) return;
        if (confirm("¿Deseas reportar esta publicación por contenido inapropiado?")) {
          try {
            await fetch("/api/foro?action=reportar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tipo: "hilo", itemId: this.activeThreadId })
            });
            this.showToast("Reporte enviado. Gracias por colaborar.");
            closeThreadModal();
            this.loadThreads();
          } catch (e) {
            console.error(e);
          }
        }
      });
    }

    // Tecla Escape para cerrar cualquier modal abierto
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeReader();
        closeTopicModal();
        closeThreadModal();
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.remove("active");
        this.closeAdminLogin();
        this.closeNewsEditor();
        this.closeAdminPanel();
      }
    });

    // -------------------------------------------------------------
    // EVENTOS DEL MODO ADMINISTRADOR
    // -------------------------------------------------------------
    // Atajo de teclado: Ctrl + Shift + A (o Cmd + Shift + A)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        if (this.adminToken) {
          this.openAdminPanel();
        } else {
          this.openAdminLogin();
        }
      }
    });

    // Disparador discreto en el pie de página
    if (this.btnFooterAdminTrigger) {
      this.btnFooterAdminTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.adminToken) {
          this.openAdminPanel();
        } else {
          this.openAdminLogin();
        }
      });
    }

    // Modal Login Admin: ver/ocultar contraseña
    if (this.btnToggleAdminPassword && this.adminLoginPassword) {
      this.btnToggleAdminPassword.addEventListener("click", () => {
        const isPwd = this.adminLoginPassword.type === "password";
        this.adminLoginPassword.type = isPwd ? "text" : "password";
        this.btnToggleAdminPassword.textContent = isPwd ? "🙈" : "👁️";
      });
    }

    // Modal Login Admin: cerrar y enviar
    if (this.btnCloseAdminLogin) {
      this.btnCloseAdminLogin.addEventListener("click", () => this.closeAdminLogin());
    }
    if (this.modalAdminLogin) {
      this.modalAdminLogin.addEventListener("click", (e) => {
        if (e.target === this.modalAdminLogin) this.closeAdminLogin();
      });
    }
    if (this.formAdminLogin) {
      this.formAdminLogin.addEventListener("submit", (e) => this.submitAdminLogin(e));
    }

    // Botones de la barra de administración
    if (this.btnAdminLogout) {
      this.btnAdminLogout.addEventListener("click", () => this.adminLogout());
    }
    if (this.btnAdminOpenComposer) {
      this.btnAdminOpenComposer.addEventListener("click", () => this.openNewsEditor());
    }
    if (this.btnAdminComposeNewsInline) {
      this.btnAdminComposeNewsInline.addEventListener("click", () => this.openNewsEditor());
    }
    if (this.btnAdminOpenPanel) {
      this.btnAdminOpenPanel.addEventListener("click", () => this.openAdminPanel());
    }
    if (this.btnAdminOpenThreads) {
      this.btnAdminOpenThreads.addEventListener("click", () => {
        this.openAdminPanel();
        this.switchAdminTab("threads");
      });
    }
    if (this.btnAdminOpenCronograma) {
      this.btnAdminOpenCronograma.addEventListener("click", () => {
        this.openAdminPanel();
        this.switchAdminTab("cronograma");
      });
    }
    if (this.btnAdminOpenGuia) {
      this.btnAdminOpenGuia.addEventListener("click", () => {
        this.openAdminPanel();
        this.switchAdminTab("guia");
      });
    }
    if (this.btnAdminOpenSettings) {
      this.btnAdminOpenSettings.addEventListener("click", () => {
        this.openAdminPanel();
        this.switchAdminTab("site");
      });
    }

    // Botones de edición en cabeceras de secciones
    if (this.btnAdminManageCronograma) {
      this.btnAdminManageCronograma.addEventListener("click", () => {
        this.openAdminPanel();
        this.switchAdminTab("cronograma");
      });
    }
    if (this.btnAdminManageGuia) {
      this.btnAdminManageGuia.addEventListener("click", () => {
        this.openAdminPanel();
        this.switchAdminTab("guia");
      });
    }

    // Modal Editor de Noticias: cerrar y enviar
    if (this.btnCloseAdminEditor) {
      this.btnCloseAdminEditor.addEventListener("click", () => this.closeNewsEditor());
    }
    if (this.modalAdminEditorNoticia) {
      this.modalAdminEditorNoticia.addEventListener("click", (e) => {
        if (e.target === this.modalAdminEditorNoticia) this.closeNewsEditor();
      });
    }
    if (this.formAdminNoticia) {
      this.formAdminNoticia.addEventListener("submit", (e) => this.submitCreateNews(e));
    }

    // Modal Panel de Administración: pestañas y cerrar
    if (this.btnCloseAdminPanel) {
      this.btnCloseAdminPanel.addEventListener("click", () => this.closeAdminPanel());
    }
    if (this.modalAdminPanel) {
      this.modalAdminPanel.addEventListener("click", (e) => {
        if (e.target === this.modalAdminPanel) this.closeAdminPanel();
      });
    }
    if (this.adminPanelTabs) {
      this.adminPanelTabs.forEach(tab => {
        tab.addEventListener("click", () => {
          const tabKey = tab.dataset.tab;
          this.switchAdminTab(tabKey);
        });
      });
    }
    if (this.btnAdminAddNewsFromPanel) {
      this.btnAdminAddNewsFromPanel.addEventListener("click", () => {
        this.closeAdminPanel();
        this.openNewsEditor();
      });
    }
    if (this.formAdminChangePwd) {
      this.formAdminChangePwd.addEventListener("submit", (e) => this.submitChangePassword(e));
    }

    // Búsqueda en vivo de debates en el panel
    if (this.adminThreadsSearchInput) {
      this.adminThreadsSearchInput.addEventListener("input", () => {
        this.filterAdminThreadsTable(this.adminThreadsSearchInput.value);
      });
    }

    // Botones de tab Cronograma
    if (this.btnAdminAddPhase) {
      this.btnAdminAddPhase.addEventListener("click", () => this.addCronogramaPhaseUI());
    }
    if (this.btnSaveAdminCronograma) {
      this.btnSaveAdminCronograma.addEventListener("click", () => this.saveAdminCronograma());
    }

    // Botones de tab Guía & FAQ
    if (this.btnAdminAddFaq) {
      this.btnAdminAddFaq.addEventListener("click", () => this.addGuiaFaqUI());
    }
    if (this.btnSaveAdminGuia) {
      this.btnSaveAdminGuia.addEventListener("click", () => this.saveAdminGuia());
    }

    // Formulario de tab Ajustes
    if (this.formAdminSiteSettings) {
      this.formAdminSiteSettings.addEventListener("submit", (e) => this.submitSaveSiteSettings(e));
    }

    // Botón de eliminar hilo dentro del modal de debate (usando modal de confirmación)
    if (this.btnAdminDelMainThread) {
      this.btnAdminDelMainThread.addEventListener("click", () => {
        if (!this.activeThreadId) return;
        const title = this.threadModalTitle ? this.threadModalTitle.textContent : "";
        this.confirmDeleteThread(this.activeThreadId, title);
      });
    }

    // Botón editar noticia en lector modal
    if (this.btnReaderAdminEdit) {
      this.btnReaderAdminEdit.addEventListener("click", () => {
        const id = this.btnReaderAdminEdit.dataset.newsId;
        if (id) {
          if (this.modalReader) this.modalReader.classList.remove("active");
          this.openEditNews(id);
        }
      });
    }

    // Input de imagen y previsualización en vivo
    if (this.newsInputImage) {
      this.newsInputImage.addEventListener("input", () => {
        this.updateNewsImagePreview(this.newsInputImage.value);
      });
    }

    // Subida de imagen desde el dispositivo (FileReader + compresión canvas)
    if (this.newsInputFile) {
      this.newsInputFile.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        this.handleNewsFileUpload(file);
      });
    }

    // Botones de presets rápidos de imagen
    document.querySelectorAll(".btn-preset-img").forEach(btn => {
      btn.addEventListener("click", () => {
        const url = btn.dataset.img;
        if (this.newsInputImage) {
          this.newsInputImage.value = url;
          this.updateNewsImagePreview(url);
        }
      });
    });

    // Quitar imagen seleccionada
    if (this.btnRemoveNewsImg) {
      this.btnRemoveNewsImg.addEventListener("click", () => {
        if (this.newsInputImage) this.newsInputImage.value = "";
        if (this.newsInputFile) this.newsInputFile.value = "";
        this.updateNewsImagePreview("");
      });
    }

    // Botón borrar noticia dentro del lector modal
    if (this.btnReaderAdminDel) {
      this.btnReaderAdminDel.addEventListener("click", () => {
        const id = this.btnReaderAdminDel.dataset.newsId;
        const title = this.btnReaderAdminDel.dataset.newsTitle;
        if (id) {
          this.confirmDeleteNews(id, title);
        }
      });
    }

    // Modal de confirmación administrativa
    if (this.btnCancelAdminConfirm) {
      this.btnCancelAdminConfirm.addEventListener("click", () => this.closeAdminConfirm());
    }
    if (this.modalAdminConfirm) {
      this.modalAdminConfirm.addEventListener("click", (e) => {
        if (e.target === this.modalAdminConfirm) this.closeAdminConfirm();
      });
    }

    // DELEGACIÓN GLOBAL DE EVENTOS DE BORRADO DE NOTICIAS
    document.addEventListener("click", (e) => {
      const delBtn = e.target.closest(".btn-admin-del-card, .btn-admin-del-table");
      if (delBtn) {
        e.preventDefault();
        e.stopPropagation();
        const newsId = delBtn.dataset.newsId || delBtn.dataset.id;
        const newsTitle = delBtn.dataset.newsTitle || delBtn.dataset.title || "";
        if (newsId) {
          this.confirmDeleteNews(newsId, newsTitle);
        }
      }
    });

    this.initScrollSpy();
  }

  initScrollSpy() {
    const sections = ["noticias", "cronograma", "guia", "foro"];
    const links = document.querySelectorAll(".section-nav-link");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => l.classList.remove("active"));
          const active = document.querySelector(`.section-nav-link[href="#${id}"]`);
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // -------------------------------------------------------------
  // NOTICIAS (Editorial)
  // -------------------------------------------------------------
  async loadData() {
    const endpoints = ["/api/comunidad", "api/comunidad.php", "data/comunidad.json?v=" + Date.now()];
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { cache: "no-store" });
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json") || ep.includes(".json")) {
            const parsed = await res.json();
            if (parsed && (Array.isArray(parsed.noticias) || Array.isArray(parsed.cronograma))) {
              this.data = parsed;
              break;
            }
          }
        }
      } catch (e) {
        // Continuar al siguiente endpoint
      }
    }
    if (!this.data) {
      console.warn("Cargando datos fallback.");
      this.data = this.getFallbackData();
    }

    this.renderNews();
    this.renderTrending();
    this.renderCronograma();
    this.renderGuia();
    this.applySiteSettings();

    // Deep linking desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const editNewsId = urlParams.get("editNews");
    if (editNewsId && this.adminToken) {
      setTimeout(() => this.openEditNews(editNewsId), 300);
    }
    const noticiaId = urlParams.get("noticia");
    if (noticiaId && this.data && Array.isArray(this.data.noticias)) {
      const target = this.data.noticias.find(n => String(n.id) === String(noticiaId));
      if (target) setTimeout(() => this.openReader(target), 300);
    }
  }

  renderCronograma() {
    if (!this.cronogramaGrid || !this.data) return;
    const items = Array.isArray(this.data.cronograma) && this.data.cronograma.length > 0 ? this.data.cronograma : null;
    if (!items) return;

    this.cronogramaGrid.innerHTML = items.map((item, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      const icon = item.icono || "🥁";
      const isFeatured = idx === 0 ? "featured" : "";
      const statusLower = (item.estado || "").toLowerCase();
      const statusClass = statusLower.includes("desarrollo") || statusLower.includes("curso") ? "status-live" : (statusLower.includes("próxim") || statusLower.includes("proxim") ? "status-upcoming" : "");

      return `
        <article class="cronograma-card ${isFeatured}">
          <div class="cronograma-card-number">${num}</div>
          <div class="cronograma-card-icon">${icon}</div>
          <h3>${item.fase || "Fase Oficial"}</h3>
          <div class="cronograma-meta">
            ${item.fecha ? `<span>📅 ${item.fecha}</span>` : ""}
            ${item.lugar ? `<span>📍 ${item.lugar}</span>` : ""}
            ${item.horario ? `<span>⏰ ${item.horario}</span>` : ""}
          </div>
          ${item.descripcion ? `<p>${item.descripcion}</p>` : (item.fase ? `<p>Encuentro oficial en el marco de la Estudiantina de Posadas 2026.</p>` : "")}
          ${item.estado ? `<div class="cronograma-card-status ${statusClass}">${item.estado}</div>` : ""}
        </article>
      `;
    }).join("");
  }

  renderGuia() {
    if (!this.faqList || !this.data) return;
    const faqs = (Array.isArray(this.data.faq) && this.data.faq.length > 0) ? this.data.faq : ((Array.isArray(this.data.guia) && this.data.guia.length > 0) ? this.data.guia : null);
    if (!faqs) return;

    this.faqList.innerHTML = faqs.map((f, idx) => `
      <div class="faq-item ${idx === 0 ? "active" : ""}">
        <button class="faq-question" type="button">
          <span>${f.pregunta || ""}</span>
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-answer">${f.respuesta || ""}</div>
      </div>
    `).join("");

    this.faqList.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const wasActive = item.classList.contains("active");
        this.faqList.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
        if (!wasActive) item.classList.add("active");
      });
    });
  }

  applySiteSettings() {
    if (!this.data || !this.data.ajustes) return;
    const a = this.data.ajustes;

    if (a.tickerActivo !== undefined && this.breakingTicker) {
      this.breakingTicker.style.display = a.tickerActivo === false ? "none" : "";
    }

    if (Array.isArray(a.tickerLines) && a.tickerLines.length > 0 && this.tickerTrack) {
      this.tickerTrack.innerHTML = a.tickerLines.map(line => `<span>${line}</span>`).join("");
    }

    if (a.tagline && this.mastheadTagline) {
      this.mastheadTagline.textContent = a.tagline;
    }
  }

  renderNews() {
    if (!this.data || !Array.isArray(this.data.noticias)) return;

    const filtered = this.data.noticias.filter(n => {
      const matchesCat =
        this.activeCategory === "todas" ||
        n.categoriaSlug === this.activeCategory ||
        (this.activeCategory === "noches-de-calle" && n.categoria.toLowerCase().includes("calle")) ||
        (this.activeCategory === "baile"            && n.categoria.toLowerCase().includes("baile")) ||
        (this.activeCategory === "banda"            && n.categoria.toLowerCase().includes("banda"));

      const matchesSearch =
        !this.searchQuery ||
        n.titulo.toLowerCase().includes(this.searchQuery) ||
        n.resumen.toLowerCase().includes(this.searchQuery) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(this.searchQuery)));

      return matchesCat && matchesSearch;
    });

    if (this.newsCount) {
      this.newsCount.textContent = `${filtered.length} noticia${filtered.length === 1 ? "" : "s"}`;
    }

    if (filtered.length === 0) {
      if (this.heroArticle) this.heroArticle.innerHTML = "";
      if (this.newsGrid) this.newsGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem 1rem; color:#475569;">
          <span style="font-size:2.5rem; display:block; margin-bottom:0.5rem;">🔍</span>
          <p style="font-size:1.05rem; font-weight:700; color:#fff;">No se encontraron noticias</p>
          <p style="font-size:0.85rem;">Proba con otros terminos o selecciona otra categoria.</p>
        </div>`;
      return;
    }

    const [heroNews, ...restNews] = filtered;

    if (this.heroArticle) {
      this.heroArticle.innerHTML = `
        <div class="hero-article-inner" data-id="${heroNews.id}">
          ${this.adminToken ? `
            <div class="news-card-admin-bar">
              <button class="btn-admin-edit-card" data-news-id="${heroNews.id}" type="button">✏️ Editar Noticia (Admin)</button>
              <button class="btn-admin-del-card" data-news-id="${heroNews.id}" data-news-title="${(heroNews.titulo || '').replace(/"/g, '&quot;')}" type="button">🗑️ Borrar Noticia (Admin)</button>
            </div>
          ` : ""}
          ${(heroNews.imagen || heroNews.imagenUrl) ? `
            <div class="hero-cover-wrap">
              <img src="${heroNews.imagen || heroNews.imagenUrl}" alt="${(heroNews.titulo || '').replace(/"/g, '&quot;')}" class="hero-cover-img" loading="lazy">
            </div>
          ` : ""}
          <div class="hero-badge-row">
            ${heroNews.badge ? `<span class="hero-breaking-badge">${heroNews.badge}</span>` : ""}
            <span class="hero-cat-badge">${heroNews.categoria}</span>
          </div>
          <h2 class="hero-title">${heroNews.titulo}</h2>
          <p class="hero-resumen">${heroNews.resumen}</p>
          <div class="hero-footer-row">
            <span class="hero-meta">📅 ${heroNews.fecha} • <strong>${heroNews.autor}</strong> • ${heroNews.tiempoLectura}</span>
            <a href="noticia.html?id=${encodeURIComponent(heroNews.id)}" class="hero-read-btn" title="Leer nota completa">Leer nota completa ↗</a>
          </div>
        </div>`;

      const heroInner = this.heroArticle.querySelector(".hero-article-inner");
      if (heroInner) {
        heroInner.addEventListener("click", (e) => {
          if (e.target.closest(".btn-admin-del-card, .btn-admin-edit-card")) return;
          window.location.href = `noticia.html?id=${encodeURIComponent(heroNews.id)}`;
        });
      }
    }

    if (this.newsGrid) {
      this.newsGrid.innerHTML = restNews.map(n => {
        const tags = (n.tags || []).map(t => `<span class="news-tag">#${t}</span>`).join("");
        const imgUrl = n.imagen || n.imagenUrl;
        return `
          <article class="news-card" data-id="${n.id}">
            ${this.adminToken ? `
              <div class="news-card-admin-bar">
                <button class="btn-admin-edit-card" data-news-id="${n.id}" type="button">✏️ Editar</button>
                <button class="btn-admin-del-card" data-news-id="${n.id}" data-news-title="${(n.titulo || '').replace(/"/g, '&quot;')}" type="button">🗑️ Borrar</button>
              </div>
            ` : ""}
            ${imgUrl ? `
              <div class="news-card-thumb-wrap">
                <img src="${imgUrl}" alt="${(n.titulo || '').replace(/"/g, '&quot;')}" class="news-card-thumb" loading="lazy">
              </div>
            ` : ""}
            <div class="news-card-header">
              <span class="news-category-badge">${n.categoria}</span>
              <span class="news-read-time">${n.tiempoLectura}</span>
            </div>
            <h3 class="news-title">${n.titulo}</h3>
            <p class="news-resumen">${n.resumen}</p>
            <div class="news-tags-row">${tags}</div>
            <div class="news-card-footer">
              <span>📅 ${n.fecha} • ${n.autor}</span>
              <a href="noticia.html?id=${encodeURIComponent(n.id)}" class="news-read-more-btn" title="Leer nota">Leer nota ↗</a>
            </div>
          </article>`;
      }).join("");

      this.newsGrid.querySelectorAll(".news-card").forEach(card => {
        card.addEventListener("click", (e) => {
          if (e.target.closest(".btn-admin-del-card, .btn-admin-edit-card")) return;
          window.location.href = `noticia.html?id=${encodeURIComponent(card.dataset.id)}`;
        });
      });
    }

    // Eventos de botones admin en las tarjetas
    if (this.adminToken) {
      document.querySelectorAll(".btn-admin-edit-card").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const newsId = btn.dataset.newsId;
          if (newsId) this.openEditNews(newsId);
        });
      });
      document.querySelectorAll(".btn-admin-del-card").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const newsId = btn.dataset.newsId;
          const newsTitle = btn.dataset.newsTitle;
          if (newsId) this.confirmDeleteNews(newsId, newsTitle);
        });
      });
    }
  }

  renderTrending() {
    if (!this.trendingList || !this.data || !Array.isArray(this.data.noticias)) return;
    this.trendingList.innerHTML = this.data.noticias.slice(0, 4).map((n, i) => `
      <div class="trending-item" data-id="${n.id}">
        <span class="trending-num">0${i + 1}</span>
        <div class="trending-content">
          <span class="trending-category">${n.categoria}</span>
          <h4 class="trending-title">${n.titulo}</h4>
          <span class="trending-meta">📅 ${n.fecha}</span>
        </div>
      </div>`).join("");

    this.trendingList.querySelectorAll(".trending-item").forEach(item => {
      item.addEventListener("click", () => {
        window.location.href = `noticia.html?id=${encodeURIComponent(item.dataset.id)}`;
      });
    });
  }

  openReader(art) {
    if (!this.modalReader) return;

    // Reset reader tabs to "Artículo"
    this.readerTabs && this.readerTabs.forEach(t => t.classList.remove("active"));
    const artTab = [...(this.readerTabs || [])].find(t => t.dataset.readerTab === "articulo");
    if (artTab) artTab.classList.add("active");
    if (this.readerTabArticulo) this.readerTabArticulo.style.display = "block";
    if (this.readerTabGaleria) this.readerTabGaleria.style.display = "none";
    if (this.readerTabRelacionadas) this.readerTabRelacionadas.style.display = "none";

    // Header info
    if (this.readerCategory) this.readerCategory.textContent = art.categoria;
    if (this.readerCategoryTop) this.readerCategoryTop.textContent = art.categoria;
    if (this.readerTitle) this.readerTitle.textContent = art.titulo;
    if (this.readerResumenLead) this.readerResumenLead.textContent = art.resumen || "";
    if (this.readerMeta) {
      this.readerMeta.textContent = `Publicado el ${art.fecha} · Posadas, Misiones`;
    }
    if (this.readerAuthorName) this.readerAuthorName.textContent = art.autor || "Redacción";
    if (this.readerReadTime) this.readerReadTime.textContent = art.tiempoLectura || "3 min";

    // Enlaces a la pestaña completa dedicada
    const tabUrl = `noticia.html?id=${encodeURIComponent(art.id)}`;
    if (this.btnReaderOpenTab) this.btnReaderOpenTab.href = tabUrl;
    if (this.btnReaderFooterOpenTab) this.btnReaderFooterOpenTab.href = tabUrl;

    // Badge
    if (this.readerBadgeLabel) {
      if (art.badge) {
        this.readerBadgeLabel.textContent = art.badge;
        this.readerBadgeLabel.style.display = "inline-block";
      } else {
        this.readerBadgeLabel.style.display = "none";
      }
    }

    // Cover image
    const imgUrl = art.imagen || art.imagenUrl;
    if (this.readerCoverWrap && this.readerCoverImg) {
      if (imgUrl) {
        this.readerCoverImg.src = imgUrl;
        this.readerCoverWrap.style.display = "block";
      } else {
        this.readerCoverWrap.style.display = "none";
        this.readerCoverImg.src = "";
      }
    }

    // Admin buttons
    if (this.btnReaderAdminDel) {
      if (this.adminToken) {
        this.btnReaderAdminDel.style.display = "inline-flex";
        this.btnReaderAdminDel.dataset.newsId = art.id;
        this.btnReaderAdminDel.dataset.newsTitle = (art.titulo || "").replace(/"/g, '&quot;');
      } else {
        this.btnReaderAdminDel.style.display = "none";
      }
    }
    if (this.btnReaderAdminEdit) {
      if (this.adminToken) {
        this.btnReaderAdminEdit.style.display = "inline-flex";
        this.btnReaderAdminEdit.dataset.newsId = art.id;
      } else {
        this.btnReaderAdminEdit.style.display = "none";
      }
    }

    // Article body: render blocks
    if (this.readerBody) {
      this.readerBody.innerHTML = this.renderArticleBlocks(art);
    }

    // Gallery tab
    if (this.readerGalleryGrid) {
      this.readerGalleryGrid.innerHTML = this.renderGallery(art);
    }

    // Related articles tab
    if (this.readerRelatedGrid) {
      this.readerRelatedGrid.innerHTML = this.renderRelated(art);
    }

    // Tags
    if (this.readerTagsRow) {
      const tags = Array.isArray(art.tags) ? art.tags : [];
      this.readerTagsRow.innerHTML = tags.map(t =>
        `<span class="reader-tag-item">#${t}</span>`
      ).join("");
    }

    this.modalReader.classList.add("active");

    // Scroll to top of modal card
    const card = this.modalReader.querySelector(".article-modal-card");
    if (card) card.scrollTop = 0;

    // Reading progress bar
    this.initReadingProgress(card);
  }

  renderArticleBlocks(art) {
    // Use bloques if available, else build from contenido
    let bloques = art.bloques;
    if (!bloques || !Array.isArray(bloques) || bloques.length === 0) {
      const contenido = Array.isArray(art.contenido) ? art.contenido : [art.resumen || ""];
      bloques = contenido.map(p => ({ type: "text", value: p }));
    }

    return bloques.map((block, i) => {
      if (block.type === "image" && block.value) {
        const caption = block.caption ? `<div class="article-image-caption">${block.caption}</div>` : "";
        return `<div class="article-image-block"><img src="${block.value}" alt="${block.caption || 'Imagen del artículo'}" loading="lazy"/>${caption}</div>`;
      }
      if (block.type === "quote" && block.value) {
        return `<blockquote class="article-pullquote">${block.value}</blockquote>`;
      }
      if (block.type === "text" && block.value) {
        return `<p>${block.value.replace(/\n/g, '<br>')}</p>`;
      }
      return "";
    }).join("");
  }

  renderGallery(art) {
    const images = [];
    const mainImg = art.imagen || art.imagenUrl;
    if (mainImg) images.push({ src: mainImg, caption: "Imagen de portada" });

    const bloques = art.bloques || [];
    bloques.forEach(b => {
      if (b.type === "image" && b.value) {
        images.push({ src: b.value, caption: b.caption || "" });
      }
    });

    if (images.length === 0) {
      return `<div class="reader-gallery-empty">Esta noticia no tiene imágenes adicionales.</div>`;
    }

    return images.map(img => `
      <div class="reader-gallery-item">
        <img src="${img.src}" alt="${img.caption}" loading="lazy"/>
        ${img.caption ? `<div class="reader-gallery-caption">${img.caption}</div>` : ""}
      </div>
    `).join("");
  }

  renderRelated(art) {
    if (!this.data || !Array.isArray(this.data.noticias)) return "<p style='color:var(--text-muted)'>Sin artículos relacionados.</p>";

    const related = this.data.noticias
      .filter(n => n.id !== art.id && (n.categoriaSlug === art.categoriaSlug || n.categoria === art.categoria))
      .slice(0, 4);

    if (related.length === 0) {
      return `<p style='color:var(--text-muted);font-style:italic;padding:1rem 0'>No hay más artículos en esta categoría por el momento.</p>`;
    }

    return related.map(n => {
      const imgSrc = n.imagen || n.imagenUrl;
      const thumb = imgSrc
        ? `<img class="reader-related-thumb" src="${imgSrc}" alt="${n.titulo}" loading="lazy">`
        : `<div class="reader-related-thumb-placeholder">📰</div>`;
      return `
        <div class="reader-related-item" data-related-id="${n.id}">
          ${thumb}
          <div class="reader-related-info">
            <span class="reader-related-cat">${n.categoria}</span>
            <span class="reader-related-title">${n.titulo}</span>
            <span class="reader-related-date">📅 ${n.fecha}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  initReadingProgress(scrollContainer) {
    if (!this.readerProgressBar || !scrollContainer) return;
    if (this._readerScrollListener) {
      scrollContainer.removeEventListener("scroll", this._readerScrollListener);
    }
    this._readerScrollListener = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      this.readerProgressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
    };
    this.readerProgressBar.style.width = "0%";
    scrollContainer.addEventListener("scroll", this._readerScrollListener, { passive: true });

    // Click on related articles
    scrollContainer.addEventListener("click", (e) => {
      const relItem = e.target.closest(".reader-related-item");
      if (relItem) {
        const relId = relItem.dataset.relatedId;
        const relArt = this.data?.noticias?.find(n => n.id === relId);
        if (relArt) this.openReader(relArt);
      }
    });
  }

  // -------------------------------------------------------------
  // FORO DE DEBATE EN TIEMPO REAL (SQLITE)
  // -------------------------------------------------------------
  async loadForum() {
    await this.loadChannels();
    await this.loadThreads();
  }

  async loadChannels() {
    try {
      const res = await fetch("/api/foro?action=canales");
      const data = await res.json();
      if (data.status === "ok" && Array.isArray(data.canales)) {
        this.renderChannels(data.canales);
      }
    } catch (e) {
      console.warn("Error cargando canales:", e);
    }
  }

  renderChannels(canales) {
    if (!this.channelsGrid) return;

    // Agregar opción "Todos" al principio
    const allChannels = [
      { id: "todos", titulo: "Todos los Temas", descripcion: "Explorá todas las publicaciones de la comunidad.", icono: "⭐", hilos_count: canales.reduce((acc, c) => acc + (c.hilos_count || 0), 0) },
      ...canales
    ];

    this.channelsGrid.innerHTML = allChannels.map(ch => `
      <div class="channel-card ${this.activeCanal === ch.id ? "active" : ""}" data-channel-id="${ch.id}">
        <div class="channel-header">
          <span class="channel-icon">${ch.icono || "💬"}</span>
          <h4 class="channel-title">${ch.titulo}</h4>
        </div>
        <p class="channel-desc">${ch.descripcion || ""}</p>
        <div class="channel-stats">
          <span>&#x1F4DD; ${ch.hilos_count || 0} debates</span>
          <span style="color:var(--gold-bright); font-weight:700;">Ver &rarr;</span>
        </div>
      </div>
    `).join("");

    this.channelsGrid.querySelectorAll(".channel-card").forEach(card => {
      card.addEventListener("click", () => {
        this.activeCanal = card.dataset.channelId;
        this.channelsGrid.querySelectorAll(".channel-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        if (this.forumActiveChannelName) {
          const match = allChannels.find(c => c.id === this.activeCanal);
          this.forumActiveChannelName.textContent = match ? match.titulo : "Canal";
        }

        this.loadThreads();
      });
    });
  }

  async loadThreads() {
    if (!this.threadsContainer) return;
    this.threadsContainer.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--text-muted)">
        <span>&#x23F3; Cargando debates de la comunidad...</span>
      </div>`;

    try {
      const res = await fetch(`/api/foro?action=hilos&canal=${this.activeCanal}&sort=${this.activeSort}`);
      const data = await res.json();
      if (data.status === "ok" && Array.isArray(data.hilos)) {
        this.renderThreads(data.hilos);
      }
    } catch (e) {
      console.warn("Error cargando hilos:", e);
      this.threadsContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted)">
          <p>No se pudieron cargar los debates. Verificá tu conexión.</p>
        </div>`;
    }
  }

  renderThreads(hilos) {
    if (!this.threadsContainer) return;

    if (this.forumThreadsCount) {
      this.forumThreadsCount.textContent = `${hilos.length} debate${hilos.length === 1 ? "" : "s"}`;
    }

    if (hilos.length === 0) {
      this.threadsContainer.innerHTML = `
        <div style="text-align:center; padding:3rem 1.5rem; background:var(--bg-card); border-radius:var(--r-md); border:1px dashed var(--border-soft)">
          <span style="font-size:2.2rem; display:block; margin-bottom:0.5rem">&#x1F4AC;</span>
          <h4 style="color:#fff; font-family:var(--font-title); font-size:1.1rem; margin-bottom:0.3rem">Todavia no hay debates en este canal</h4>
          <p style="color:var(--text-mid); font-size:0.85rem; margin-bottom:1rem">¡Se el primero en encender la discusion!</p>
          <button type="button" class="btn-propose-topic" id="btn-empty-create-thread">✍ Iniciar Primer Debate</button>
        </div>`;

      const btnEmpty = document.getElementById("btn-empty-create-thread");
      if (btnEmpty) {
        btnEmpty.addEventListener("click", () => {
          if (!this.currentUser) {
            if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
          } else {
            if (this.modalTopic) this.modalTopic.classList.add("active");
          }
        });
      }
      return;
    }

    this.threadsContainer.innerHTML = hilos.map(h => {
      const col = this.getColegio(h.colegio_id);
      const hasVoted = this.userVotes.has(`hilo_${h.id}`);
      const avatarSrc = h.autor_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${h.autor_google_id}`;
      const timeAgo = this.formatTimeAgo(h.creado_en);

      return `
        <article class="thread-item ${h.fijado ? "pinned" : ""}" data-thread-id="${h.id}">
          <div class="thread-left">
            <div class="vote-box ${hasVoted ? "voted" : ""}" data-item-id="${h.id}" data-item-type="hilo" title="Votar positivo">
              <span class="vote-arrow">&#x25B2;</span>
              <span class="vote-count">${h.votos || 0}</span>
            </div>
            <div class="thread-content-block">
              <div class="thread-meta-top">
                ${h.fijado ? `<span class="thread-pinned-badge">📌 FIJADO</span>` : ""}
                <img class="thread-author-avatar-mini" src="${avatarSrc}" alt="${h.autor_nombre}" />
                <span class="thread-author-name-text">${h.autor_nombre}</span>
                <span class="thread-school-badge">${col.escudo || "🥁"} ${col.nombre}</span>
                <span class="thread-channel-tag">${h.canal_id}</span>
                <span class="thread-time-ago">${timeAgo}</span>
              </div>
              <h4 class="thread-title">${h.titulo}</h4>
              <p class="thread-snippet">${h.contenido}</p>
              ${this.adminToken ? `
                <div class="thread-admin-controls">
                  <button type="button" class="btn-admin-action-sm btn-admin-pin" data-thread-id="${h.id}" data-pinned="${h.fijado ? 1 : 0}">
                    ${h.fijado ? "📌 Desfijar" : "📌 Fijar"}
                  </button>
                  <button type="button" class="btn-admin-action-sm btn-admin-del-thread" data-thread-id="${h.id}">
                    🗑️ Borrar Hilo
                  </button>
                </div>
              ` : ""}
            </div>
          </div>
          <div class="thread-comments-badge">
            <span>&#x1F4AC;</span>
            <span>${h.respuestas_count || 0}</span>
          </div>
        </article>
      `;
    }).join("");

    // Eventos de apertura de hilo
    this.threadsContainer.querySelectorAll(".thread-item").forEach(item => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".vote-box") || e.target.closest(".thread-admin-controls")) return;
        const threadId = item.dataset.threadId;
        this.openThread(threadId);
      });
    });

    // Eventos de votos en la lista
    this.threadsContainer.querySelectorAll(".vote-box").forEach(box => {
      box.addEventListener("click", (e) => {
        e.stopPropagation();
        const threadId = box.dataset.itemId;
        const countSpan = box.querySelector(".vote-count");
        this.toggleVote("hilo", threadId, box, countSpan);
      });
    });

    // Eventos de moderación admin en lista de hilos
    if (this.adminToken) {
      this.threadsContainer.querySelectorAll(".btn-admin-pin").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tid = btn.dataset.threadId;
          const currentPinned = parseInt(btn.dataset.pinned, 10) === 1;
          this.adminTogglePinThread(tid, currentPinned ? 0 : 1);
        });
      });
      this.threadsContainer.querySelectorAll(".btn-admin-del-thread").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const tid = btn.dataset.threadId;
          const card = btn.closest(".thread-item");
          const title = card ? (card.querySelector(".thread-title")?.textContent || "") : "";
          this.confirmDeleteThread(tid, title);
        });
      });
    }
  }

  async openThread(id) {
    this.activeThreadId = id;
    if (!this.modalThread) return;

    this.modalThread.classList.add("active");
    if (this.threadModalTitle) this.threadModalTitle.textContent = "Cargando debate...";
    if (this.threadModalContent) this.threadModalContent.textContent = "";
    if (this.threadRepliesList) this.threadRepliesList.innerHTML = "<p style='color:var(--text-muted); font-size:0.85rem'>Cargando respuestas...</p>";

    try {
      const res = await fetch(`/api/foro?action=hilo&id=${id}`);
      const data = await res.json();
      if (data.status !== "ok" || !data.hilo) {
        this.showToast("No se pudo cargar el debate");
        this.modalThread.classList.remove("active");
        return;
      }

      const h = data.hilo;
      const col = this.getColegio(h.colegio_id);
      const comments = data.comentarios || [];

      if (this.threadModalChannel) this.threadModalChannel.textContent = h.canal_id;
      if (this.threadModalTitle)   this.threadModalTitle.textContent = h.titulo;
      if (this.threadModalAvatar)  this.threadModalAvatar.src = h.autor_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${h.autor_google_id}`;
      if (this.threadModalAuthor)  this.threadModalAuthor.textContent = h.autor_nombre;
      if (this.threadModalSchool)  this.threadModalSchool.textContent = `${col.escudo || "🥁"} ${col.nombre}`;
      if (this.threadModalDate)    this.threadModalDate.textContent = this.formatTimeAgo(h.creado_en);
      if (this.threadModalContent) this.threadModalContent.textContent = h.contenido;
      if (this.threadModalVotesCount) this.threadModalVotesCount.textContent = h.votos || 0;
      if (this.threadModalRepliesCount) this.threadModalRepliesCount.textContent = comments.length;

      // Estado del botón admin de borrar hilo principal
      if (this.btnAdminDelMainThread) {
        this.btnAdminDelMainThread.style.display = this.adminToken ? "inline-flex" : "none";
      }

      // Estado del botón de voto principal
      if (this.btnVoteMainThread) {
        const hasVoted = this.userVotes.has(`hilo_${h.id}`);
        this.btnVoteMainThread.classList.toggle("voted", hasVoted);
      }

      // Renderizar Respuestas
      if (this.threadRepliesList) {
        if (comments.length === 0) {
          this.threadRepliesList.innerHTML = `
            <div style="padding:1.5rem; text-align:center; background:var(--bg-surface); border-radius:var(--r-sm); color:var(--text-mid); font-size:0.85rem;">
              No hay respuestas todavia. ¡Se el primero en responder!
            </div>`;
        } else {
          this.threadRepliesList.innerHTML = comments.map(c => {
            const colC = this.getColegio(c.colegio_id);
            const avatarC = c.autor_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.autor_google_id}`;
            const timeC = this.formatTimeAgo(c.creado_en);
            return `
              <div class="reply-item" data-comment-id="${c.id}">
                <img class="reply-avatar" src="${avatarC}" alt="${c.autor_nombre}" />
                <div class="reply-body">
                  <div class="reply-header">
                    <strong class="reply-author">${c.autor_nombre}</strong>
                    <span class="reply-school">${colC.escudo || "🥁"} ${colC.nombre}</span>
                    <span class="reply-time">${timeC}</span>
                    ${this.adminToken ? `
                      <button type="button" class="btn-admin-action-sm btn-admin-del-comment" data-comment-id="${c.id}" style="margin-left:auto; font-size:0.75rem; padding:2px 8px;">
                        🗑️ Eliminar
                      </button>
                    ` : ""}
                  </div>
                  <p class="reply-text">${c.contenido}</p>
                </div>
              </div>`;
          }).join("");

          if (this.adminToken) {
            this.threadRepliesList.querySelectorAll(".btn-admin-del-comment").forEach(btn => {
              btn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.adminDeleteComment(btn.dataset.commentId);
              });
            });
          }
        }
      }

      // Configurar caja de respuesta según si el usuario está autenticado
      if (this.currentUser) {
        if (this.threadReplyUnauth) this.threadReplyUnauth.style.display = "none";
        if (this.formThreadReply)   this.formThreadReply.style.display = "flex";
        if (this.replyUserAvatar)   this.replyUserAvatar.src = this.currentUser.avatarUrl;
        if (this.replySchoolHint) {
          const userCol = this.getColegio(this.currentUser.colegioId);
          this.replySchoolHint.textContent = `📍 Comentando como hincha de ${userCol.nombre}`;
        }
      } else {
        if (this.threadReplyUnauth) this.threadReplyUnauth.style.display = "block";
        if (this.formThreadReply)   this.formThreadReply.style.display = "none";
      }

    } catch (e) {
      console.error("Error abriendo hilo:", e);
    }
  }

  async submitReply(e) {
    e.preventDefault();
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      return;
    }
    if (!this.activeThreadId) return;

    const content = (this.replyInputContent && this.replyInputContent.value || "").trim();
    if (!content) {
      this.showToast("El comentario no puede estar vacío");
      return;
    }

    if (this.btnSubmitReply) this.btnSubmitReply.disabled = true;

    try {
      const res = await fetch("/api/foro?action=comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiloId: this.activeThreadId,
          contenido: content,
          googleId: this.currentUser.googleId,
          autorNombre: this.currentUser.nombre,
          autorAvatar: this.currentUser.avatarUrl,
          colegioId: this.currentUser.colegioId
        })
      });

      const data = await res.json();
      if (data.status === "ok") {
        if (this.replyInputContent) this.replyInputContent.value = "";
        this.showToast("¡Respuesta publicada!");
        // Recargar el hilo con el nuevo comentario
        await this.openThread(this.activeThreadId);
        // Actualizar conteo en la lista de hilos
        this.loadThreads();
      } else {
        this.showToast(data.message || "Error al responder");
      }
    } catch (err) {
      console.error(err);
      this.showToast("Error de conexión al enviar respuesta");
    } finally {
      if (this.btnSubmitReply) this.btnSubmitReply.disabled = false;
    }
  }

  async submitNewTopic(e) {
    e.preventDefault();
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      return;
    }

    const canalId = (this.topicCanal && this.topicCanal.value) || "general";
    const colegioId = (this.topicSchool && this.topicSchool.value) || this.currentUser.colegioId;
    const titulo = (this.topicTitle && this.topicTitle.value || "").trim();
    const contenido = (this.topicDesc && this.topicDesc.value || "").trim();

    if (!titulo || titulo.length < 5) {
      this.showToast("El título debe tener al menos 5 caracteres");
      return;
    }
    if (!contenido || contenido.length < 10) {
      this.showToast("La descripción debe tener al menos 10 caracteres");
      return;
    }

    try {
      const res = await fetch("/api/foro?action=crear_hilo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canalId,
          titulo,
          contenido,
          googleId: this.currentUser.googleId,
          autorNombre: this.currentUser.nombre,
          autorAvatar: this.currentUser.avatarUrl,
          colegioId
        })
      });

      const data = await res.json();
      if (data.status === "ok" && data.hiloId) {
        if (this.modalTopic) this.modalTopic.classList.remove("active");
        if (this.formTopic) this.formTopic.reset();
        this.showToast("¡Debate publicado con éxito!");
        await this.loadForum();
        this.openThread(data.hiloId);
      } else {
        this.showToast(data.message || "Error al publicar");
      }
    } catch (err) {
      console.error(err);
      this.showToast("Error de conexión al publicar debate");
    }
  }

  async toggleVote(tipo, itemId, btnElem, countElem) {
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      return;
    }

    try {
      const res = await fetch("/api/foro?action=votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          itemId,
          googleId: this.currentUser.googleId
        })
      });

      const data = await res.json();
      if (data.status === "ok") {
        const key = `${tipo}_${itemId}`;
        if (data.voted) {
          this.userVotes.add(key);
          if (btnElem) btnElem.classList.add("voted");
          this.showToast("¡Voto registrado!");
        } else {
          this.userVotes.delete(key);
          if (btnElem) btnElem.classList.remove("voted");
        }
        localStorage.setItem("comunidad_voted_threads", JSON.stringify([...this.userVotes]));

        if (countElem) {
          countElem.textContent = data.votos;
        }
      }
    } catch (err) {
      console.error("Error al votar:", err);
    }
  }

  // -------------------------------------------------------------
  // MÉTODOS DEL MODO ADMINISTRADOR (AUTENTICACIÓN, GESTIÓN & MODERACIÓN)
  // -------------------------------------------------------------
  async initAdmin() {
    if (!this.adminToken) return;

    try {
      const res = await fetch("/api/admin?action=verificar", {
        headers: { "Authorization": `Bearer ${this.adminToken}` }
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.activateAdminMode(data.admin?.usuario || this.adminUser || "admin");
      } else {
        this.adminLogout(false);
      }
    } catch (err) {
      console.warn("No se pudo verificar token admin con el servidor:", err);
      // Mantener modo admin offline si ya tenía token
      this.activateAdminMode(this.adminUser || "admin");
    }
  }

  activateAdminMode(username) {
    this.adminUser = username;
    document.body.classList.add("has-admin-bar");
    if (this.adminBar) this.adminBar.style.display = "flex";
    if (this.adminNewsToolbar) this.adminNewsToolbar.style.display = "flex";
    if (this.adminBarUser) this.adminBarUser.textContent = `👤 Administrador (${username})`;

    if (this.btnAdminManageCronograma) this.btnAdminManageCronograma.style.display = "inline-flex";
    if (this.btnAdminManageGuia) this.btnAdminManageGuia.style.display = "inline-flex";

    this.checkAdminReportsBadge();
    this.renderNews();
    this.loadThreads();
  }

  adminLogout(showNotice = true) {
    this.adminToken = null;
    this.adminUser = null;
    localStorage.removeItem("comunidad_admin_token");
    localStorage.removeItem("comunidad_admin_user");

    document.body.classList.remove("has-admin-bar");
    if (this.adminBar) this.adminBar.style.display = "none";
    if (this.adminNewsToolbar) this.adminNewsToolbar.style.display = "none";
    if (this.btnAdminManageCronograma) this.btnAdminManageCronograma.style.display = "none";
    if (this.btnAdminManageGuia) this.btnAdminManageGuia.style.display = "none";

    this.closeAdminPanel();
    this.closeNewsEditor();
    this.closeAdminLogin();

    if (showNotice) this.showToast("Sesión de administrador cerrada.");

    this.renderNews();
    this.loadThreads();
  }

  openAdminLogin() {
    if (this.modalAdminLogin) {
      if (this.adminLoginError) this.adminLoginError.style.display = "none";
      this.modalAdminLogin.classList.add("active");
      if (this.adminLoginUser) setTimeout(() => this.adminLoginUser.focus(), 100);
    }
  }

  closeAdminLogin() {
    if (this.modalAdminLogin) this.modalAdminLogin.classList.remove("active");
  }

  async submitAdminLogin(e) {
    e.preventDefault();
    const user = (this.adminLoginUser && this.adminLoginUser.value || "").trim();
    const pwd = (this.adminLoginPassword && this.adminLoginPassword.value || "").trim();
    if (!user || !pwd) return;

    if (this.btnSubmitAdminLogin) {
      this.btnSubmitAdminLogin.disabled = true;
      this.btnSubmitAdminLogin.textContent = "Verificando...";
    }
    if (this.adminLoginError) this.adminLoginError.style.display = "none";

    try {
      const res = await fetch("/api/admin?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: user, password: pwd })
      });
      const data = await res.json();
      if (data.status === "ok" && data.token) {
        this.adminToken = data.token;
        this.adminUser = data.usuario;
        localStorage.setItem("comunidad_admin_token", data.token);
        localStorage.setItem("comunidad_admin_user", data.usuario);

        this.closeAdminLogin();
        if (this.formAdminLogin) this.formAdminLogin.reset();
        this.activateAdminMode(data.usuario);
        this.showToast(`¡Bienvenido al Modo Administrador (${data.usuario})! 🔐`);
      } else {
        if (this.adminLoginError) {
          this.adminLoginError.textContent = data.message || "Usuario o contraseña incorrectos.";
          this.adminLoginError.style.display = "block";
        }
      }
    } catch (err) {
      console.error("Error en login admin:", err);
      if (this.adminLoginError) {
        this.adminLoginError.textContent = "Error de conexión con el servidor.";
        this.adminLoginError.style.display = "block";
      }
    } finally {
      if (this.btnSubmitAdminLogin) {
        this.btnSubmitAdminLogin.disabled = false;
        this.btnSubmitAdminLogin.innerHTML = '<span>Ingresar al Modo Administrador</span> <span>➔</span>';
      }
    }
  }

  updateNewsImagePreview(url) {
    const trimmed = (url || "").trim();
    if (trimmed && this.newsImagePreview && this.newsImagePreviewWrap) {
      this.newsImagePreview.src = trimmed;
      this.newsImagePreviewWrap.style.display = "block";
    } else if (this.newsImagePreviewWrap) {
      this.newsImagePreviewWrap.style.display = "none";
      if (this.newsImagePreview) this.newsImagePreview.src = "";
    }
  }

  handleNewsFileUpload(file) {
    if (!file.type.startsWith("image/")) {
      this.showToast("Por favor selecciona un archivo de imagen válido.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        if (this.newsInputImage) {
          this.newsInputImage.value = dataUrl;
        }
        this.updateNewsImagePreview(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  openNewsEditor() {
    if (!this.adminToken) {
      this.openAdminLogin();
      return;
    }
    this.editingNewsId = null;
    const modalTitle = document.getElementById("admin-editor-title");
    if (modalTitle) modalTitle.textContent = "Publicar Nueva Noticia";

    if (this.btnSubmitCreateNews) {
      this.btnSubmitCreateNews.innerHTML = '<span>Publicar Noticia</span> <span>🚀</span>';
    }
    if (this.formAdminNoticia) this.formAdminNoticia.reset();
    this.updateNewsImagePreview("");

    // Reset block editor with one empty text block
    this._editorBlocks = [];
    this.addEditorBlock("text");

    // Switch to content tab
    this.switchEditorTab("contenido");
    if (this.editorStatusLabel) this.editorStatusLabel.textContent = "Nueva noticia";

    if (this.modalAdminEditorNoticia) {
      this.modalAdminEditorNoticia.classList.add("active");
      if (this.newsInputTitle) setTimeout(() => this.newsInputTitle.focus(), 150);
    }
  }

  openEditNews(newsId) {
    if (!this.adminToken) {
      this.openAdminLogin();
      return;
    }
    const news = (this.data?.noticias || []).find(n => String(n.id) === String(newsId));
    if (!news) {
      this.showToast("Noticia no encontrada.");
      return;
    }

    this.editingNewsId = news.id;

    const modalTitle = document.getElementById("admin-editor-title");
    if (modalTitle) modalTitle.textContent = "✏️ Editar Noticia";

    if (this.btnSubmitCreateNews) {
      this.btnSubmitCreateNews.innerHTML = '<span>Guardar Cambios</span> <span>💾</span>';
    }

    if (this.newsInputRubro) {
      for (let i = 0; i < this.newsInputRubro.options.length; i++) {
        const opt = this.newsInputRubro.options[i];
        if (opt.value === news.categoria || opt.dataset.slug === news.categoriaSlug) {
          this.newsInputRubro.selectedIndex = i;
          break;
        }
      }
    }
    if (this.newsInputBadge) this.newsInputBadge.value = news.badge || "NOTICIA";
    if (this.newsInputTitle) this.newsInputTitle.value = news.titulo || "";
    if (this.newsInputResumen) this.newsInputResumen.value = news.resumen || "";
    if (this.newsInputTags) this.newsInputTags.value = Array.isArray(news.tags) ? news.tags.join(", ") : (news.tags || "");
    if (this.newsInputAutor) this.newsInputAutor.value = news.autor || "Redacción Oficial";

    const imgUrl = news.imagen || news.imagenUrl || "";
    if (this.newsInputImage) this.newsInputImage.value = imgUrl;
    this.updateNewsImagePreview(imgUrl);

    // Load blocks from article
    this._editorBlocks = [];
    const blocksToLoad = news.bloques && Array.isArray(news.bloques) && news.bloques.length > 0
      ? news.bloques
      : (Array.isArray(news.contenido) ? news.contenido.map(p => ({ type: "text", value: p })) : [{ type: "text", value: news.resumen || "" }]);
    blocksToLoad.forEach(b => this.addEditorBlock(b.type || "text", b.value || "", b.caption || ""));

    // Switch to content tab
    this.switchEditorTab("contenido");
    if (this.editorStatusLabel) this.editorStatusLabel.textContent = "Editando";

    if (this.modalAdminEditorNoticia) {
      this.modalAdminEditorNoticia.classList.add("active");
      if (this.newsInputTitle) setTimeout(() => this.newsInputTitle.focus(), 150);
    }
  }

  switchEditorTab(tabName) {
    if (this.editorTabs) {
      this.editorTabs.forEach(t => t.classList.remove("active"));
      const targetTab = [...this.editorTabs].find(t => t.dataset.editorTab === tabName);
      if (targetTab) targetTab.classList.add("active");
    }
    const panels = {
      contenido: this.editorTabContenido,
      portada: this.editorTabPortada,
      preview: this.editorTabPreview
    };
    Object.values(panels).forEach(p => p && (p.style.display = "none"));
    if (panels[tabName]) panels[tabName].style.display = "block";
  }

  // ── Block Editor System ──
  addEditorBlock(type = "text", value = "", caption = "") {
    const idx = this._editorBlocks.length;
    const block = { type, value, caption };
    this._editorBlocks.push(block);
    this.renderEditorBlocks();
    // Focus the last textarea if text block
    if (type === "text" && this.editorBlocksList) {
      const textareas = this.editorBlocksList.querySelectorAll(".editor-block-textarea");
      const last = textareas[textareas.length - 1];
      if (last) setTimeout(() => last.focus(), 50);
    }
  }

  removeEditorBlock(idx) {
    this._editorBlocks.splice(idx, 1);
    this.renderEditorBlocks();
  }

  moveEditorBlock(idx, direction) {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= this._editorBlocks.length) return;
    // Sync values before moving
    this.syncEditorBlockValues();
    const tmp = this._editorBlocks[idx];
    this._editorBlocks[idx] = this._editorBlocks[newIdx];
    this._editorBlocks[newIdx] = tmp;
    this.renderEditorBlocks();
  }

  syncEditorBlockValues() {
    if (!this.editorBlocksList) return;
    this.editorBlocksList.querySelectorAll(".editor-block").forEach((el, i) => {
      if (i >= this._editorBlocks.length) return;
      const b = this._editorBlocks[i];
      if (b.type === "text") {
        const ta = el.querySelector(".editor-block-textarea");
        if (ta) b.value = ta.value;
      } else if (b.type === "image") {
        const url = el.querySelector(".editor-block-url-input");
        const cap = el.querySelector(".editor-block-caption-input");
        if (url) b.value = url.value;
        if (cap) b.caption = cap.value;
      } else if (b.type === "quote") {
        const ta = el.querySelector(".editor-block-quote-input");
        if (ta) b.value = ta.value;
      }
    });
  }

  renderEditorBlocks() {
    if (!this.editorBlocksList) return;
    const total = this._editorBlocks.length;

    this.editorBlocksList.innerHTML = this._editorBlocks.map((block, i) => {
      const typeLabels = { text: "¶ Párrafo", image: "🖼️ Imagen", quote: "💬 Cita" };
      const label = typeLabels[block.type] || "Bloque";
      const upDisabled = i === 0 ? "disabled" : "";
      const downDisabled = i === total - 1 ? "disabled" : "";

      const toolbar = `
        <div class="editor-block-toolbar">
          <span class="editor-block-type-label">${label}</span>
          <div class="editor-block-controls">
            <button type="button" class="btn-block-ctrl" title="Subir" data-action="up" data-idx="${i}" ${upDisabled}>↑</button>
            <button type="button" class="btn-block-ctrl" title="Bajar" data-action="down" data-idx="${i}" ${downDisabled}>↓</button>
            <button type="button" class="btn-block-ctrl btn-block-del" title="Eliminar bloque" data-action="del" data-idx="${i}">✕</button>
          </div>
        </div>`;

      let content = "";
      if (block.type === "text") {
        content = `<textarea class="editor-block-textarea" placeholder="Escribí el párrafo..." rows="4">${block.value || ""}</textarea>`;
      } else if (block.type === "image") {
        const hasImg = block.value ? "has-img" : "";
        content = `
          <div class="editor-block-image-wrap">
            <img class="editor-block-img-preview ${hasImg}" src="${block.value || ""}" alt="Preview">
            <input type="url" class="editor-block-url-input" placeholder="https://url-de-la-imagen.jpg" value="${block.value || ""}"> 
            <input type="text" class="editor-block-caption-input" placeholder="Descripción de la imagen (opcional)" value="${block.caption || ""}">
          </div>`;
      } else if (block.type === "quote") {
        content = `<textarea class="editor-block-quote-input" placeholder="Escribí la cita o pullquote destacada..." rows="3">${block.value || ""}</textarea>`;
      }

      return `<div class="editor-block" data-block-idx="${i}">${toolbar}${content}</div>`;
    }).join("");

    // Update counter
    if (this.editorBlocksCount) {
      this.editorBlocksCount.textContent = `${total} bloque${total !== 1 ? "s" : ""}`;
    }

    // Wire events on newly rendered blocks
    this.editorBlocksList.querySelectorAll(".btn-block-ctrl").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        const idx = parseInt(btn.dataset.idx, 10);
        this.syncEditorBlockValues();
        if (action === "del") this.removeEditorBlock(idx);
        else if (action === "up") this.moveEditorBlock(idx, -1);
        else if (action === "down") this.moveEditorBlock(idx, 1);
      });
    });

    // Wire URL input -> preview image in block
    this.editorBlocksList.querySelectorAll(".editor-block-url-input").forEach(inp => {
      inp.addEventListener("input", () => {
        const preview = inp.closest(".editor-block-image-wrap")?.querySelector(".editor-block-img-preview");
        if (preview) {
          if (inp.value) {
            preview.src = inp.value;
            preview.classList.add("has-img");
          } else {
            preview.src = "";
            preview.classList.remove("has-img");
          }
        }
        this.syncEditorBlockValues();
        if (this.editorStatusLabel) this.editorStatusLabel.textContent = "Cambios sin guardar";
      });
    });

    // Live sync on textarea change
    this.editorBlocksList.querySelectorAll("textarea, input").forEach(el => {
      el.addEventListener("input", () => {
        if (this.editorStatusLabel) this.editorStatusLabel.textContent = "Cambios sin guardar";
      });
    });
  }

  updateEditorPreview() {
    if (!this.editorPreviewContent) return;
    this.syncEditorBlockValues();
    const title = (this.newsInputTitle && this.newsInputTitle.value) || "(Sin título)";
    const lead = (this.newsInputResumen && this.newsInputResumen.value) || "";
    const imgUrl = (this.newsInputImage && this.newsInputImage.value) || "";

    let html = `<h2>${title}</h2>`;
    if (lead) html += `<p class="preview-lead">${lead}</p>`;
    if (imgUrl) html += `<img src="${imgUrl}" alt="Portada">`;
    html += this._editorBlocks.map(b => {
      if (b.type === "text" && b.value) return `<p>${b.value.replace(/\n/g, '<br>')}</p>`;
      if (b.type === "image" && b.value) return `<img src="${b.value}" alt="${b.caption || ''}">` + (b.caption ? `<em style="font-size:0.75rem;color:var(--text-muted)">${b.caption}</em>` : "");
      if (b.type === "quote" && b.value) return `<blockquote>${b.value}</blockquote>`;
      return "";
    }).join("");

    this.editorPreviewContent.innerHTML = html;
  }

  closeNewsEditor() {
    if (this.modalAdminEditorNoticia) this.modalAdminEditorNoticia.classList.remove("active");
    this.editingNewsId = null;
  }

  async submitCreateNews(e) {
    e.preventDefault();
    if (!this.adminToken) return;

    // Sync block values before submit
    this.syncEditorBlockValues();

    const rubroOption = this.newsInputRubro.options[this.newsInputRubro.selectedIndex];
    const categoria = rubroOption.value;
    const categoriaSlug = rubroOption.dataset.slug || "noches-de-calle";
    const badge = this.newsInputBadge.value;
    const titulo = (this.newsInputTitle.value || "").trim();
    const resumen = (this.newsInputResumen.value || "").trim();
    const tagsRaw = (this.newsInputTags && this.newsInputTags.value || "").trim();
    const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
    const autor = (this.newsInputAutor && this.newsInputAutor.value || "Redacción Oficial").trim();
    const imagen = (this.newsInputImage && this.newsInputImage.value || "").trim();

    // Build bloques from editor state
    const bloques = this._editorBlocks.filter(b => b.value && b.value.trim());
    if (bloques.length === 0) {
      this.showToast("Agregá al menos un párrafo al cuerpo de la noticia.");
      this.switchEditorTab("contenido");
      return;
    }

    // Derive plain contenido and reading time from text blocks
    const textBlocks = bloques.filter(b => b.type === "text").map(b => b.value);
    const contenido = textBlocks.length > 0 ? textBlocks : [resumen];
    const wordCount = contenido.join(" ").split(/\s+/).length;
    const readMins = Math.max(1, Math.ceil(wordCount / 180));
    const tiempoLectura = `${readMins} min de lectura`;

    const isEdit = !!this.editingNewsId;
    const actionName = isEdit ? "editar_noticia" : "crear_noticia";

    if (this.btnSubmitCreateNews) {
      this.btnSubmitCreateNews.disabled = true;
      this.btnSubmitCreateNews.textContent = isEdit ? "Guardando..." : "Publicando...";
    }

    try {
      const payload = {
        titulo, categoria, categoriaSlug, badge, autor, tiempoLectura, tags, resumen, contenido, bloques, imagen
      };
      if (isEdit) payload.id = this.editingNewsId;

      const res = await fetch(`/api/admin?action=${actionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.closeNewsEditor();
        if (this.formAdminNoticia) this.formAdminNoticia.reset();
        this.updateNewsImagePreview("");
        this._editorBlocks = [];
        if (this.editorBlocksList) this.editorBlocksList.innerHTML = "";
        this.showToast(isEdit ? "✏️ ¡Noticia actualizada con éxito!" : "🎉 ¡Noticia publicada con éxito en el portal!");
        this.editingNewsId = null;
        await this.loadData();
        if (this.modalAdminPanel && this.modalAdminPanel.classList.contains("active")) {
          this.loadAdminNewsTable();
        }
      } else {
        this.showToast(data.message || "Error al procesar la noticia.");
      }
    } catch (err) {
      console.error("Error al procesar noticia:", err);
      this.showToast("Error de conexión con el servidor.");
    } finally {
      if (this.btnSubmitCreateNews) {
        this.btnSubmitCreateNews.disabled = false;
        this.btnSubmitCreateNews.innerHTML = isEdit
          ? '<span>Guardar Cambios</span> <span>💾</span>'
          : '<span>Publicar Noticia</span> <span>🚀</span>';
      }
    }
  }

  confirmDeleteThread(id, title = "") {
    if (!this.adminToken) {
      this.showToast("Debes iniciar sesión como administrador.");
      this.openAdminLogin();
      return;
    }

    if (this.modalAdminConfirm) {
      if (this.adminConfirmTitle) {
        this.adminConfirmTitle.textContent = "¿Eliminar Debate del Foro?";
      }
      if (this.adminConfirmMsg) {
        this.adminConfirmMsg.innerHTML = `¿Estás seguro de que deseas eliminar permanentemente el debate <strong>"${(title || id).replace(/</g, '&lt;')}"</strong> y todos sus comentarios? Esta acción no se puede deshacer.`;
      }
      this.modalAdminConfirm.classList.add("active");

      if (this.btnOkAdminConfirm) {
        this.btnOkAdminConfirm.onclick = async () => {
          this.closeAdminConfirm();
          await this.adminDeleteThread(id);
          if (this.modalThread && this.modalThread.classList.contains("active")) {
            this.modalThread.classList.remove("active");
          }
        };
      }
    } else {
      this.adminDeleteThread(id);
    }
  }

  confirmDeleteNews(id, title = "") {
    if (!this.adminToken) {
      this.showToast("Debes iniciar sesión como administrador.");
      this.openAdminLogin();
      return;
    }

    if (this.modalAdminConfirm) {
      if (this.adminConfirmTitle) {
        this.adminConfirmTitle.textContent = "¿Eliminar Noticia?";
      }
      if (this.adminConfirmMsg) {
        this.adminConfirmMsg.innerHTML = `¿Estás seguro de que deseas eliminar permanentemente la noticia <strong>"${(title || id).replace(/</g, '&lt;')}"</strong>? Esta acción no se puede deshacer.`;
      }
      this.modalAdminConfirm.classList.add("active");

      if (this.btnOkAdminConfirm) {
        this.btnOkAdminConfirm.onclick = async () => {
          this.closeAdminConfirm();
          await this.executeDeleteNews(id);
        };
      }
    } else {
      if (confirm(`¿Eliminar la noticia "${title || id}"? Esta acción borrará el artículo permanentemente.`)) {
        this.executeDeleteNews(id);
      }
    }
  }

  closeAdminConfirm() {
    if (this.modalAdminConfirm) {
      this.modalAdminConfirm.classList.remove("active");
    }
    if (this.btnOkAdminConfirm) {
      this.btnOkAdminConfirm.onclick = null;
    }
  }

  async executeDeleteNews(id) {
    if (!this.adminToken) return;

    try {
      const res = await fetch("/api/admin?action=borrar_noticia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast("🗑️ Noticia eliminada exitosamente.");

        // Eliminar inmediatamente del estado local en memoria
        if (this.data && Array.isArray(this.data.noticias)) {
          this.data.noticias = this.data.noticias.filter(n => String(n.id) !== String(id));
        }

        // Si el lector modal tenía esta noticia abierta, cerrarlo
        if (this.modalReader && this.modalReader.classList.contains("active")) {
          if (this.btnReaderAdminDel && this.btnReaderAdminDel.dataset.newsId === String(id)) {
            this.modalReader.classList.remove("active");
          }
        }

        this.renderNews();
        this.renderTrending();

        if (this.modalAdminPanel && this.modalAdminPanel.classList.contains("active")) {
          this.loadAdminNewsTable();
        }

        await this.loadData();
      } else {
        if (res.status === 401) {
          this.showToast("Tu sesión de administrador expiró. Volvé a ingresar.");
          this.adminLogout(false);
          this.openAdminLogin();
        } else {
          this.showToast(data.message || "Error al eliminar noticia.");
        }
      }
    } catch (err) {
      console.error("Error borrando noticia:", err);
      this.showToast("Error de conexión al eliminar.");
    }
  }

  openAdminPanel() {
    if (!this.adminToken) {
      this.openAdminLogin();
      return;
    }
    if (this.modalAdminPanel) {
      this.modalAdminPanel.classList.add("active");
      this.switchAdminTab("reports");
    }
  }

  closeAdminPanel() {
    if (this.modalAdminPanel) this.modalAdminPanel.classList.remove("active");
  }

  switchAdminTab(tabKey) {
    if (this.adminPanelTabs) {
      this.adminPanelTabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabKey));
    }
    if (this.adminTabReports)    this.adminTabReports.style.display    = tabKey === "reports" ? "block" : "none";
    if (this.adminTabNews)       this.adminTabNews.style.display       = tabKey === "news" ? "block" : "none";
    if (this.adminTabThreads)    this.adminTabThreads.style.display    = tabKey === "threads" ? "block" : "none";
    if (this.adminTabCronograma) this.adminTabCronograma.style.display = tabKey === "cronograma" ? "block" : "none";
    if (this.adminTabGuia)       this.adminTabGuia.style.display       = tabKey === "guia" ? "block" : "none";
    if (this.adminTabSite)       this.adminTabSite.style.display       = tabKey === "site" ? "block" : "none";
    if (this.adminTabPassword)   this.adminTabPassword.style.display   = tabKey === "password" ? "block" : "none";

    if (tabKey === "reports")    this.loadAdminReports();
    if (tabKey === "news")       this.loadAdminNewsTable();
    if (tabKey === "threads")    this.loadAdminThreadsTable();
    if (tabKey === "cronograma") this.loadAdminCronogramaEditor();
    if (tabKey === "guia")       this.loadAdminGuiaEditor();
    if (tabKey === "site")       this.loadAdminSiteSettings();
  }

  async checkAdminReportsBadge() {
    if (!this.adminToken) return;
    try {
      const res = await fetch("/api/admin?action=reportes", {
        headers: { "Authorization": `Bearer ${this.adminToken}` }
      });
      const data = await res.json();
      if (data.status === "ok") {
        const count = (data.hilosReportados?.length || 0) + (data.comentariosReportados?.length || 0);
        if (this.adminReportsBadge) {
          this.adminReportsBadge.textContent = `${count} reportes`;
          this.adminReportsBadge.style.display = count > 0 ? "inline-block" : "none";
        }
        if (this.tabReportsBadge) {
          this.tabReportsBadge.textContent = count;
          this.tabReportsBadge.style.display = count > 0 ? "inline-block" : "none";
        }
      }
    } catch (err) {
      console.warn("Error consultando badge de reportes:", err);
    }
  }

  async loadAdminReports() {
    if (!this.adminReportsContainer || !this.adminToken) return;
    this.adminReportsContainer.innerHTML = '<div class="admin-loading-state">Cargando denuncias de la comunidad...</div>';

    try {
      const res = await fetch("/api/admin?action=reportes", {
        headers: { "Authorization": `Bearer ${this.adminToken}` }
      });
      const data = await res.json();
      if (data.status !== "ok") throw new Error(data.message || "Error al consultar");

      const hilos = data.hilosReportados || [];
      const comentarios = data.comentariosReportados || [];
      const total = hilos.length + comentarios.length;

      if (this.adminReportsBadge) {
        this.adminReportsBadge.textContent = `${total} reportes`;
        this.adminReportsBadge.style.display = total > 0 ? "inline-block" : "none";
      }
      if (this.tabReportsBadge) {
        this.tabReportsBadge.textContent = total;
        this.tabReportsBadge.style.display = total > 0 ? "inline-block" : "none";
      }

      if (total === 0) {
        this.adminReportsContainer.innerHTML = `
          <div class="admin-empty-state">
            <span style="font-size:2.2rem; display:block; margin-bottom:0.5rem">✨</span>
            <h4 style="color:#fff; font-size:1.05rem; margin-bottom:0.3rem">¡Bandeja de Moderación Limpia!</h4>
            <p style="color:var(--text-mid); font-size:0.85rem">No hay publicaciones ni comentarios con denuncias pendientes.</p>
          </div>`;
        return;
      }

      let html = "";
      if (hilos.length > 0) {
        html += `<h4 class="admin-report-group-title">Debates Denunciados (${hilos.length})</h4>`;
        html += hilos.map(h => `
          <div class="admin-report-card" data-tipo="hilo" data-id="${h.id}">
            <div class="admin-report-card-header">
              <span class="admin-report-count">🚩 ${h.reportes} reporte${h.reportes === 1 ? "" : "s"}</span>
              <span class="admin-report-author">Publicado por <strong>${h.autor_nombre}</strong> (${h.colegio_id})</span>
              <span class="admin-report-date">${this.formatTimeAgo(h.creado_en)}</span>
            </div>
            <h5 class="admin-report-item-title">${h.titulo}</h5>
            <p class="admin-report-item-content">${h.contenido}</p>
            <div class="admin-report-actions">
              <button type="button" class="btn-admin-action-sm btn-report-dismiss" data-tipo="hilo" data-id="${h.id}">
                ✅ Descartar Reportes
              </button>
              <button type="button" class="btn-admin-action-sm btn-report-delete" data-tipo="hilo" data-id="${h.id}">
                🗑️ Eliminar Hilo Completo
              </button>
            </div>
          </div>
        `).join("");
      }

      if (comentarios.length > 0) {
        html += `<h4 class="admin-report-group-title" style="margin-top:1.5rem">Comentarios Denunciados (${comentarios.length})</h4>`;
        html += comentarios.map(c => `
          <div class="admin-report-card" data-tipo="comentario" data-id="${c.id}">
            <div class="admin-report-card-header">
              <span class="admin-report-count">🚩 ${c.reportes} reporte${c.reportes === 1 ? "" : "s"}</span>
              <span class="admin-report-author">Comentado por <strong>${c.autor_nombre}</strong> (${c.colegio_id})</span>
              <span class="admin-report-date">${this.formatTimeAgo(c.creado_en)}</span>
            </div>
            <p class="admin-report-item-content" style="font-size:0.95rem; color:#fff;">${c.contenido}</p>
            <div class="admin-report-actions">
              <button type="button" class="btn-admin-action-sm btn-report-dismiss" data-tipo="comentario" data-id="${c.id}">
                ✅ Descartar Reportes
              </button>
              <button type="button" class="btn-admin-action-sm btn-report-delete" data-tipo="comentario" data-id="${c.id}">
                🗑️ Eliminar Comentario
              </button>
            </div>
          </div>
        `).join("");
      }

      this.adminReportsContainer.innerHTML = html;

      // Eventos de botones de moderación
      this.adminReportsContainer.querySelectorAll(".btn-report-dismiss").forEach(b => {
        b.addEventListener("click", () => this.handleModerateReport("descartar", b.dataset.tipo, b.dataset.id));
      });
      this.adminReportsContainer.querySelectorAll(".btn-report-delete").forEach(b => {
        b.addEventListener("click", () => this.handleModerateReport("eliminar", b.dataset.tipo, b.dataset.id));
      });

    } catch (err) {
      console.error("Error cargando reportes:", err);
      this.adminReportsContainer.innerHTML = '<div class="admin-empty-state"><p>Error al cargar denuncias.</p></div>';
    }
  }

  async handleModerateReport(accion, tipo, id) {
    if (!this.adminToken) return;
    if (accion === "eliminar") {
      if (!confirm(`¿Estás seguro de eliminar este ${tipo === "hilo" ? "debate" : "comentario"}?`)) return;
    }

    try {
      const res = await fetch("/api/admin?action=moderar_reporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ accion, tipo, id })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast(accion === "descartar" ? "Reportes descartados." : "Contenido eliminado.");
        await this.loadAdminReports();
        this.loadThreads();
      } else {
        this.showToast(data.message || "Error al moderar.");
      }
    } catch (err) {
      console.error("Error moderando reporte:", err);
      this.showToast("Error de conexión.");
    }
  }

  async loadAdminNewsTable() {
    if (!this.adminNewsTableWrap || !this.adminToken) return;
    this.adminNewsTableWrap.innerHTML = '<div class="admin-loading-state">Cargando noticias...</div>';

    try {
      let newsList = [];
      if (this.data && Array.isArray(this.data.noticias)) {
        newsList = this.data.noticias;
      } else {
        const res = await fetch("/api/comunidad");
        const data = await res.json();
        newsList = data.noticias || [];
      }

      if (newsList.length === 0) {
        this.adminNewsTableWrap.innerHTML = '<div class="admin-empty-state"><p>No hay noticias publicadas.</p></div>';
        return;
      }

      this.adminNewsTableWrap.innerHTML = `
        <table class="admin-news-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Firma</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${newsList.map(n => `
              <tr>
                <td><strong>${n.titulo}</strong></td>
                <td><span class="admin-table-cat">${n.categoria}</span></td>
                <td style="color:var(--text-mid); font-size:0.8rem;">${n.fecha}</td>
                <td style="color:var(--text-mid); font-size:0.8rem;">${n.autor}</td>
                <td style="text-align:right;">
                  <div class="admin-actions-cell">
                    <button type="button" class="btn-admin-table-action btn-admin-edit-table" data-id="${n.id}">
                      ✏️ Editar
                    </button>
                    <button type="button" class="btn-admin-table-action danger btn-admin-del-table" data-id="${n.id}" data-title="${(n.titulo || '').replace(/"/g, '&quot;')}">
                      🗑️ Borrar
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      this.adminNewsTableWrap.querySelectorAll(".btn-admin-edit-table").forEach(btn => {
        btn.addEventListener("click", () => {
          this.closeAdminPanel();
          this.openEditNews(btn.dataset.id);
        });
      });

      this.adminNewsTableWrap.querySelectorAll(".btn-admin-del-table").forEach(btn => {
        btn.addEventListener("click", () => {
          this.confirmDeleteNews(btn.dataset.id, btn.dataset.title);
        });
      });

    } catch (err) {
      console.error("Error cargando tabla de noticias:", err);
      this.adminNewsTableWrap.innerHTML = '<div class="admin-empty-state"><p>Error al cargar tabla de noticias.</p></div>';
    }
  }

  // -------------------------------------------------------------
  // TAB: DEBATES DEL FORO
  // -------------------------------------------------------------
  async loadAdminThreadsTable() {
    if (!this.adminThreadsTableWrap || !this.adminToken) return;
    this.adminThreadsTableWrap.innerHTML = '<div class="admin-loading-state">Cargando debates del foro...</div>';

    try {
      const res = await fetch("/api/admin?action=hilos", {
        headers: { "Authorization": `Bearer ${this.adminToken}` }
      });
      const data = await res.json();
      if (data.status !== "ok") throw new Error(data.message || "Error al obtener hilos");

      this.adminAllThreads = data.hilos || [];
      this.renderAdminThreadsTableRows(this.adminAllThreads);
    } catch (err) {
      console.error("Error cargando debates en panel admin:", err);
      this.adminThreadsTableWrap.innerHTML = '<div class="admin-empty-state"><p>Error al cargar debates del foro.</p></div>';
    }
  }

  filterAdminThreadsTable(query) {
    if (!Array.isArray(this.adminAllThreads)) return;
    const q = (query || "").toLowerCase().trim();
    if (!q) {
      this.renderAdminThreadsTableRows(this.adminAllThreads);
      return;
    }
    const filtered = this.adminAllThreads.filter(h =>
      (h.titulo || "").toLowerCase().includes(q) ||
      (h.autor_nombre || "").toLowerCase().includes(q) ||
      (h.colegio_id || "").toLowerCase().includes(q) ||
      (h.canal_id || "").toLowerCase().includes(q)
    );
    this.renderAdminThreadsTableRows(filtered);
  }

  renderAdminThreadsTableRows(threads) {
    if (!this.adminThreadsTableWrap) return;

    if (!threads || threads.length === 0) {
      this.adminThreadsTableWrap.innerHTML = '<div class="admin-empty-state"><p>No se encontraron debates.</p></div>';
      return;
    }

    this.adminThreadsTableWrap.innerHTML = `
      <table class="admin-news-table">
        <thead>
          <tr>
            <th>Título del Debate</th>
            <th>Canal</th>
            <th>Autor / Colegio</th>
            <th style="text-align:center;">Respuestas</th>
            <th style="text-align:center;">Votos</th>
            <th style="text-align:right;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${threads.map(h => {
            const col = this.getColegio(h.colegio_id);
            return `
              <tr>
                <td>
                  <strong style="color:#fff;">${h.titulo}</strong>
                  ${h.fijado ? `<span class="thread-pinned-badge" style="margin-left:6px; font-size:0.65rem;">📌 FIJADO</span>` : ""}
                </td>
                <td><span class="admin-table-cat">${h.canal_id}</span></td>
                <td style="font-size:0.78rem;">
                  <span style="color:#fff;">${h.autor_nombre}</span>
                  <div style="color:var(--gold-bright); font-size:0.7rem;">${col.escudo || "🥁"} ${col.nombre}</div>
                </td>
                <td style="text-align:center; font-weight:700;">💬 ${h.count_comentarios ?? h.respuestas_count ?? 0}</td>
                <td style="text-align:center; font-weight:700; color:var(--gold-bright);">▲ ${h.votos || 0}</td>
                <td style="text-align:right;">
                  <div class="admin-actions-cell">
                    <button type="button" class="btn-admin-table-action btn-admin-table-pin" data-id="${h.id}" data-pinned="${h.fijado ? 1 : 0}">
                      ${h.fijado ? "📌 Desfijar" : "📌 Fijar"}
                    </button>
                    <button type="button" class="btn-admin-table-action danger btn-admin-table-del-thread" data-id="${h.id}" data-title="${(h.titulo || '').replace(/"/g, '&quot;')}">
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    this.adminThreadsTableWrap.querySelectorAll(".btn-admin-table-pin").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const currentPinned = parseInt(btn.dataset.pinned, 10) === 1;
        this.adminTogglePinThread(id, currentPinned ? 0 : 1);
        setTimeout(() => this.loadAdminThreadsTable(), 300);
      });
    });

    this.adminThreadsTableWrap.querySelectorAll(".btn-admin-table-del-thread").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const title = btn.dataset.title;
        this.confirmDeleteThread(id, title);
      });
    });
  }

  // -------------------------------------------------------------
  // TAB: CRONOGRAMA OFICIAL
  // -------------------------------------------------------------
  loadAdminCronogramaEditor() {
    if (!this.adminCronogramaListWrap) return;
    const cronograma = Array.isArray(this.data?.cronograma) && this.data.cronograma.length > 0
      ? this.data.cronograma
      : [
          { fase: "Pruebas Piloto", fecha: "Septiembre 2026", lugar: "Costanera de Posadas (4to Tramo)", horario: "14:00 a 23:00 hs", estado: "En desarrollo", icono: "⏱️" },
          { fase: "Noches de Calle (Desfile Oficial)", fecha: "Septiembre - Octubre 2026", lugar: "4 Tramos de la Costanera", horario: "18:00 a 04:30 hs", estado: "Próximamente", icono: "🥁" },
          { fase: "Show en el Anfiteatro", fecha: "Octubre 2026", lugar: "Anfiteatro Manuel Antonio Ramírez", horario: "17:00 a 05:00 hs", estado: "Cierre de Temporada", icono: "👑" }
        ];

    this.adminCronogramaListWrap.innerHTML = "";
    cronograma.forEach((item, idx) => {
      this.addCronogramaPhaseUI(item, idx);
    });
  }

  addCronogramaPhaseUI(item = {}, index = null) {
    if (!this.adminCronogramaListWrap) return;
    const card = document.createElement("div");
    card.className = "admin-editor-card-item cronograma-phase-card";

    const idx = index !== null ? index + 1 : this.adminCronogramaListWrap.children.length + 1;
    card.innerHTML = `
      <div class="admin-editor-item-header">
        <span class="admin-editor-item-title"><span>📅</span> Fase #${idx}</span>
        <button type="button" class="btn-admin-delete-item btn-del-phase" title="Eliminar fase">✕ Quitar</button>
      </div>
      <div class="form-row-2col">
        <div class="topic-form-group">
          <label class="topic-form-label">Nombre de la Fase</label>
          <input type="text" class="topic-form-input phase-input-fase" placeholder="Ej: Pruebas Piloto" value="${(item.fase || '').replace(/"/g, '&quot;')}" required>
        </div>
        <div class="topic-form-group">
          <label class="topic-form-label">Ícono / Emoji</label>
          <input type="text" class="topic-form-input phase-input-icono" placeholder="🥁" value="${(item.icono || '🥁').replace(/"/g, '&quot;')}">
        </div>
      </div>
      <div class="form-row-2col">
        <div class="topic-form-group">
          <label class="topic-form-label">Fecha / Mes</label>
          <input type="text" class="topic-form-input phase-input-fecha" placeholder="Ej: Septiembre 2026" value="${(item.fecha || '').replace(/"/g, '&quot;')}" required>
        </div>
        <div class="topic-form-group">
          <label class="topic-form-label">Horario</label>
          <input type="text" class="topic-form-input phase-input-horario" placeholder="Ej: 18:00 a 04:30 hs" value="${(item.horario || '').replace(/"/g, '&quot;')}">
        </div>
      </div>
      <div class="form-row-2col">
        <div class="topic-form-group">
          <label class="topic-form-label">Lugar / Ubicación</label>
          <input type="text" class="topic-form-input phase-input-lugar" placeholder="Ej: 4 Tramos de la Costanera" value="${(item.lugar || '').replace(/"/g, '&quot;')}">
        </div>
        <div class="topic-form-group">
          <label class="topic-form-label">Estado (Etiqueta)</label>
          <input type="text" class="topic-form-input phase-input-estado" placeholder="Ej: En desarrollo, Próximamente..." value="${(item.estado || '').replace(/"/g, '&quot;')}">
        </div>
      </div>
    `;

    card.querySelector(".btn-del-phase").addEventListener("click", () => {
      card.remove();
    });

    this.adminCronogramaListWrap.appendChild(card);
  }

  async saveAdminCronograma() {
    if (!this.adminToken) return;
    const cards = this.adminCronogramaListWrap.querySelectorAll(".cronograma-phase-card");
    const cronograma = [];

    cards.forEach(c => {
      const fase = c.querySelector(".phase-input-fase")?.value.trim() || "";
      const icono = c.querySelector(".phase-input-icono")?.value.trim() || "🥁";
      const fecha = c.querySelector(".phase-input-fecha")?.value.trim() || "";
      const horario = c.querySelector(".phase-input-horario")?.value.trim() || "";
      const lugar = c.querySelector(".phase-input-lugar")?.value.trim() || "";
      const estado = c.querySelector(".phase-input-estado")?.value.trim() || "";

      if (fase) {
        cronograma.push({ fase, icono, fecha, horario, lugar, estado });
      }
    });

    if (this.btnSaveAdminCronograma) {
      this.btnSaveAdminCronograma.disabled = true;
      this.btnSaveAdminCronograma.textContent = "Guardando cronograma...";
    }

    try {
      const res = await fetch("/api/admin?action=guardar_cronograma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ cronograma })
      });
      const data = await res.json();
      if (data.status === "ok") {
        if (!this.data) this.data = {};
        this.data.cronograma = cronograma;
        this.renderCronograma();
        this.showToast("📅 ¡Cronograma oficial guardado con éxito!");
      } else {
        this.showToast(data.message || "Error al guardar cronograma.");
      }
    } catch (err) {
      console.error("Error guardando cronograma:", err);
      this.showToast("Error de conexión al guardar cronograma.");
    } finally {
      if (this.btnSaveAdminCronograma) {
        this.btnSaveAdminCronograma.disabled = false;
        this.btnSaveAdminCronograma.innerHTML = '<span>💾 Guardar Cronograma Oficial</span>';
      }
    }
  }

  // -------------------------------------------------------------
  // TAB: GUÍAS & FAQ
  // -------------------------------------------------------------
  loadAdminGuiaEditor() {
    if (!this.adminGuiaListWrap) return;
    const faqs = (Array.isArray(this.data?.faq) && this.data.faq.length > 0)
      ? this.data.faq
      : ((Array.isArray(this.data?.guia) && this.data.guia.length > 0) ? this.data.guia : [
          { pregunta: "¿Qué es la Estudiantina de Posadas?", respuesta: "Es la mayor fiesta cultural y juvenil de la provincia de Misiones..." }
        ]);

    this.adminGuiaListWrap.innerHTML = "";
    faqs.forEach((item, idx) => {
      this.addGuiaFaqUI(item, idx);
    });
  }

  addGuiaFaqUI(item = {}, index = null) {
    if (!this.adminGuiaListWrap) return;
    const card = document.createElement("div");
    card.className = "admin-editor-card-item guia-faq-card";

    const idx = index !== null ? index + 1 : this.adminGuiaListWrap.children.length + 1;
    card.innerHTML = `
      <div class="admin-editor-item-header">
        <span class="admin-editor-item-title"><span>💡</span> Pregunta #${idx}</span>
        <button type="button" class="btn-admin-delete-item btn-del-faq" title="Eliminar pregunta">✕ Quitar</button>
      </div>
      <div class="topic-form-group">
        <label class="topic-form-label">Pregunta</label>
        <input type="text" class="topic-form-input faq-input-pregunta" placeholder="Ej: ¿Dónde estacionar?" value="${(item.pregunta || '').replace(/"/g, '&quot;')}" required>
      </div>
      <div class="topic-form-group">
        <label class="topic-form-label">Respuesta Explicativa</label>
        <textarea class="topic-form-textarea faq-input-respuesta" rows="3" placeholder="Escribí la respuesta detallada..." required>${item.respuesta || ''}</textarea>
      </div>
    `;

    card.querySelector(".btn-del-faq").addEventListener("click", () => {
      card.remove();
    });

    this.adminGuiaListWrap.appendChild(card);
  }

  async saveAdminGuia() {
    if (!this.adminToken) return;
    const cards = this.adminGuiaListWrap.querySelectorAll(".guia-faq-card");
    const faq = [];

    cards.forEach(c => {
      const pregunta = c.querySelector(".faq-input-pregunta")?.value.trim() || "";
      const respuesta = c.querySelector(".faq-input-respuesta")?.value.trim() || "";
      if (pregunta && respuesta) {
        faq.push({ pregunta, respuesta });
      }
    });

    if (this.btnSaveAdminGuia) {
      this.btnSaveAdminGuia.disabled = true;
      this.btnSaveAdminGuia.textContent = "Guardando guías...";
    }

    try {
      const res = await fetch("/api/admin?action=guardar_guia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ faq })
      });
      const data = await res.json();
      if (data.status === "ok") {
        if (!this.data) this.data = {};
        this.data.faq = faq;
        this.data.guia = faq;
        this.renderGuia();
        this.showToast("💡 ¡Guía & FAQ guardadas con éxito!");
      } else {
        this.showToast(data.message || "Error al guardar guías.");
      }
    } catch (err) {
      console.error("Error guardando guía:", err);
      this.showToast("Error de conexión al guardar guía.");
    } finally {
      if (this.btnSaveAdminGuia) {
        this.btnSaveAdminGuia.disabled = false;
        this.btnSaveAdminGuia.innerHTML = '<span>💾 Guardar Guías & FAQ</span>';
      }
    }
  }

  // -------------------------------------------------------------
  // TAB: AJUSTES DEL SITIO & MARQUESINA
  // -------------------------------------------------------------
  loadAdminSiteSettings() {
    if (!this.formAdminSiteSettings) return;
    const a = this.data?.ajustes || {};

    if (this.siteSettingTickerActive) {
      this.siteSettingTickerActive.checked = a.tickerActivo !== false;
    }

    if (this.siteSettingTickerLines) {
      if (Array.isArray(a.tickerLines) && a.tickerLines.length > 0) {
        this.siteSettingTickerLines.value = a.tickerLines.join("\n");
      } else {
        this.siteSettingTickerLines.value = [
          "🥁 Temporada 2026 en marcha — Pruebas Piloto iniciadas en la Costanera de Posadas",
          "💃 Cuerpos de Baile: Novedades coreográficas y nuevas temáticas para las Noches de Calle",
          "🎮 Simulador v2026 ya disponible — Modo Cuerpo de Baile con eventos exclusivos",
          "📅 Noches de Calle oficiales: Septiembre - Octubre 2026",
          "👑 Gran Cierre en el Anfiteatro Manuel Antonio Ramírez — Octubre 2026"
        ].join("\n");
      }
    }

    if (this.siteSettingTagline) {
      this.siteSettingTagline.value = a.tagline || "Portal de Comunidad & Noticias";
    }

    if (this.siteSettingInstagram) {
      this.siteSettingInstagram.value = a.instagram || "@estudiantina.online";
    }

    if (this.siteSettingEmail) {
      this.siteSettingEmail.value = a.email || "contacto@estudiantina.online";
    }
  }

  async submitSaveSiteSettings(e) {
    e.preventDefault();
    if (!this.adminToken) return;

    const tickerActivo = this.siteSettingTickerActive ? this.siteSettingTickerActive.checked : true;
    const tickerLines = this.siteSettingTickerLines
      ? this.siteSettingTickerLines.value.split("\n").map(l => l.trim()).filter(Boolean)
      : [];
    const tagline = this.siteSettingTagline ? this.siteSettingTagline.value.trim() : "";
    const instagram = this.siteSettingInstagram ? this.siteSettingInstagram.value.trim() : "";
    const email = this.siteSettingEmail ? this.siteSettingEmail.value.trim() : "";

    const ajustes = { tickerActivo, tickerLines, tagline, instagram, email };

    const btnSubmit = document.getElementById("btn-save-admin-settings");
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Guardando ajustes...";
    }

    try {
      const res = await fetch("/api/admin?action=guardar_ajustes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ ajustes })
      });
      const data = await res.json();
      if (data.status === "ok") {
        if (!this.data) this.data = {};
        this.data.ajustes = ajustes;
        this.applySiteSettings();
        this.showToast("⚙️ ¡Ajustes del portal actualizados con éxito!");
      } else {
        this.showToast(data.message || "Error al guardar ajustes.");
      }
    } catch (err) {
      console.error("Error guardando ajustes:", err);
      this.showToast("Error de conexión al guardar ajustes.");
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>💾 Guardar Ajustes del Sitio</span>';
      }
    }
  }

  async submitChangePassword(e) {
    e.preventDefault();
    if (!this.adminToken) return;

    const act = (this.pwdActual && this.pwdActual.value || "").trim();
    const nueva = (this.pwdNueva && this.pwdNueva.value || "").trim();
    const conf = (this.pwdConfirmar && this.pwdConfirmar.value || "").trim();

    if (!act || !nueva || !conf) return;
    if (nueva.length < 6) {
      this.showToast("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (nueva !== conf) {
      this.showToast("Las contraseñas no coinciden");
      return;
    }

    if (this.btnSubmitChangePwd) {
      this.btnSubmitChangePwd.disabled = true;
      this.btnSubmitChangePwd.textContent = "Guardando...";
    }

    try {
      const res = await fetch("/api/admin?action=cambiar_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ passwordActual: act, nuevaPassword: nueva })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast("🔐 Contraseña actualizada exitosamente.");
        if (this.formAdminChangePwd) this.formAdminChangePwd.reset();
      } else {
        this.showToast(data.message || "Error al cambiar contraseña.");
      }
    } catch (err) {
      console.error("Error cambiando password:", err);
      this.showToast("Error de conexión con el servidor.");
    } finally {
      if (this.btnSubmitChangePwd) {
        this.btnSubmitChangePwd.disabled = false;
        this.btnSubmitChangePwd.innerHTML = '<span>Actualizar Contraseña</span>';
      }
    }
  }

  async adminTogglePinThread(id, fijar) {
    if (!this.adminToken) return;
    try {
      const res = await fetch("/api/admin?action=fijar_hilo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ id, fijar: fijar ? 1 : 0 })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast(fijar ? "📌 Debate fijado al inicio" : "📌 Debate desfijado");
        this.loadThreads();
      } else {
        this.showToast(data.message || "Error al modificar fijado");
      }
    } catch (err) {
      console.error("Error fijando hilo:", err);
      this.showToast("Error de conexión");
    }
  }

  async adminDeleteThread(id) {
    if (!this.adminToken) return;
    try {
      const res = await fetch("/api/admin?action=borrar_hilo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast("🗑️ Debate eliminado con éxito.");
        this.loadThreads();
        this.checkAdminReportsBadge();
      } else {
        this.showToast(data.message || "Error al eliminar debate");
      }
    } catch (err) {
      console.error("Error eliminando hilo:", err);
      this.showToast("Error de conexión");
    }
  }

  async adminDeleteComment(id) {
    if (!this.adminToken) return;
    if (!confirm("¿Seguro que deseas eliminar este comentario?")) return;
    try {
      const res = await fetch("/api/admin?action=borrar_comentario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast("🗑️ Comentario eliminado.");
        if (this.activeThreadId) {
          this.openThread(this.activeThreadId);
        }
        this.loadThreads();
        this.checkAdminReportsBadge();
      } else {
        this.showToast(data.message || "Error al eliminar comentario");
      }
    } catch (err) {
      console.error("Error eliminando comentario:", err);
      this.showToast("Error de conexión");
    }
  }

  showToast(msg) {
    if (!this.toastNotification) return;
    this.toastNotification.textContent = msg;
    this.toastNotification.classList.add("active");
    setTimeout(() => this.toastNotification.classList.remove("active"), 2800);
  }

  getFallbackData() {
    return {
      noticias: [
        {
          id: "noticia-01",
          titulo: "Comenzaron las Pruebas Piloto en la Costanera",
          categoria: "Noches de Calle",
          categoriaSlug: "noches-de-calle",
          fecha: "07/09/2026",
          autor: "Redaccion",
          tiempoLectura: "3 min de lectura",
          badge: "ULTIMO MOMENTO",
          resumen: "Miles de estudiantes secundarios coparon la Costanera de Posadas en una jornada historica de ensayo general.",
          contenido: ["La Estudiantina vivio su primera jornada de ensayo oficial con maxima convocatoria."],
          tags: ["Costanera", "Posadas"]
        }
      ]
    };
  }
}

// Inicializar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  window.comunidadApp = new ComunidadApp();

  const btnBackToTop = document.getElementById("btn-footer-back-to-top");
  if (btnBackToTop) {
    btnBackToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
