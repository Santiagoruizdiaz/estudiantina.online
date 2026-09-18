/**
 * FORO DE DEBATE ESTUDIANTIL - APLICACIÓN DEDICADA FULL-PAGE
 * estudiantina.online - Módulo ES nativo
 */

import { COLEGIOS } from "./colegios.js";
import { UsuarioService } from "./usuario.js";

function decodeEntities(str) {
  if (!str) return "";
  const entityMap = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#039;": "'",
    "&#x27;": "'",
    "&#39;": "'"
  };
  return String(str).replace(/&(?:amp|lt|gt|quot|#039|#x27|#39);/g, (match) => entityMap[match] || match);
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

function getSvg(name, extraClass = "") {
  const cls = extraClass ? `svg-icon ${extraClass}` : "svg-icon";
  const svgs = {
    sun: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    search: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    message: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    messageCircle: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
    share: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    repeat: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    flag: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
    pin: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>`,
    trash: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    shield: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    ban: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
    trophy: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    eye: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
    chevronUp: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
    chevronDown: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    minusCircle: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    plusCircle: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    bolt: `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    layers: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    music: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    award: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    externalLink: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    coffee: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    newspaper: `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>`
  };
  return svgs[name] || "";
}

function getSchoolDot(col) {
  if (!col) return "";
  const color = col.color || "#2563eb";
  return `<span class="school-dot" style="background-color:${color};" title="${escapeHtml(col.nombre || "")}"></span>`;
}

function getChannelIconSvg(canalId) {
  if (canalId === "banda") return getSvg("music", "svg-icon-xs");
  if (canalId === "baile") return getSvg("award", "svg-icon-xs");
  if (canalId === "hinchadas") return getSvg("messageCircle", "svg-icon-xs");
  if (canalId === "simulador") return getSvg("bolt", "svg-icon-xs");
  if (canalId === "noticias") return getSvg("newspaper", "svg-icon-xs");
  if (canalId === "offtopic") return getSvg("coffee", "svg-icon-xs");
  if (canalId === "todos") return getSvg("layers", "svg-icon-xs");
  return getSvg("message", "svg-icon-xs");
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

    // Usuario y sesión compartida con el portal vía UsuarioService
    this.currentUser = UsuarioService.getUser();
    this.userVotes = new Set(JSON.parse(localStorage.getItem("comunidad_voted_threads") || "[]"));
    UsuarioService.onChange(user => {
      this.currentUser = user;
      this.updateUserBar();
    });

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

    // Reddit Layout & Filtros
    this.activeSchoolFilter = "todos";
    this.countdownInterval = null;
    this.redditCreateBox = document.getElementById("reddit-create-box");
    this.redditCreateAvatar = document.getElementById("reddit-create-avatar");
    this.redditCreateInputBtn = document.getElementById("reddit-create-input-btn");
    this.sidebarChannelsList = document.getElementById("sidebar-channels-list");
    this.sidebarSchoolsList = document.getElementById("sidebar-schools-list");
    this.sidebarSchoolSearch = document.getElementById("sidebar-school-search");
    this.btnClearSchoolFilter = document.getElementById("btn-clear-school-filter");
    this.activeFeed = "home";
    this.forumFeedFilterBar = document.getElementById("forum-feed-filter-bar");
    this.forumFeedSchoolChip = document.getElementById("forum-feed-school-chip");
    this.forumFeedChannelChip = document.getElementById("forum-feed-channel-chip");
    this.btnFeedClearAll = document.getElementById("btn-feed-clear-all");
    this.tabSortComments = document.getElementById("tab-sort-comments");
    this.activeSchoolFilterPill = document.getElementById("forum-active-school-filter-pill");

    // Widgets Right Sidebar
    this.widgetStatColegios = document.getElementById("widget-stat-colegios");
    this.widgetStatUsuarios = document.getElementById("widget-stat-usuarios");
    this.widgetStatDebates = document.getElementById("widget-stat-debates");
    this.countdownDays = document.getElementById("countdown-days");
    this.countdownHours = document.getElementById("countdown-hours");
    this.countdownMins = document.getElementById("countdown-mins");
    this.countdownSecs = document.getElementById("countdown-secs");
    this.sidebarTopColegios = document.getElementById("sidebar-top-colegios");

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

    // Pestaña Completa de Hilo (Reddit / Twitter Full Page View)
    this.forumFeedView = document.getElementById("forum-feed-view");
    this.forumThreadView = document.getElementById("forum-thread-view");
    this.btnBackToFeed = document.getElementById("btn-back-to-feed");
    this.threadPageChannel = document.getElementById("thread-page-channel");
    this.threadPageDate = document.getElementById("thread-page-date");
    this.threadPageNavChannel = document.getElementById("thread-page-nav-channel");
    this.threadPageNavDate = document.getElementById("thread-page-nav-date");
    this.threadPageFlair = document.getElementById("thread-page-flair");
    this.btnShareThreadPage = document.getElementById("btn-share-thread-page");
    this.btnShareThreadPill = document.getElementById("btn-share-thread-pill");
    // Modal Compartir Debate
    this.modalShareThread = document.getElementById("modal-share-thread");
    this.btnCloseShareModal = document.getElementById("btn-close-share-modal");
    this.shareModalThreadTitle = document.getElementById("share-modal-thread-title");
    this.shareLinkWhatsapp = document.getElementById("share-link-whatsapp");
    this.shareLinkX = document.getElementById("share-link-x");
    this.shareLinkTelegram = document.getElementById("share-link-telegram");
    this.shareLinkNative = document.getElementById("share-link-native");
    this.shareInputUrl = document.getElementById("share-input-url");
    this.btnShareCopyAction = document.getElementById("btn-share-copy-action");
    this.btnShareCopyText = document.getElementById("btn-share-copy-text");
    this.currentShareData = null;

    // Menú Desplegable Flotante de Opciones (Tres Puntitos)
    this.forumMoreDropdown = document.getElementById("forum-more-dropdown");
    this.dropdownActionReport = document.getElementById("dropdown-action-report");
    this.dropdownActionShare = document.getElementById("dropdown-action-share");
    this.activeDropdownContext = null;

    // Modal Reportar Usuario / Publicación
    this.modalReportUser = document.getElementById("modal-report-user");
    this.btnCloseReportModal = document.getElementById("btn-close-report-modal");
    this.btnCancelReport = document.getElementById("btn-cancel-report");
    this.formReportContent = document.getElementById("form-report-content");
    this.reportTargetType = document.getElementById("report-target-type");
    this.reportTargetId = document.getElementById("report-target-id");
    this.reportAuthorId = document.getElementById("report-author-id");
    this.reportPreviewAuthor = document.getElementById("report-preview-author");
    this.reportPreviewSnippet = document.getElementById("report-preview-snippet");
    this.reportDetailsText = document.getElementById("report-details-text");

    this.btnReportThreadPage = document.getElementById("btn-report-thread-page");
    this.btnThreadMoreOptions = document.getElementById("btn-thread-more-options");
    this.threadPageAvatar = document.getElementById("thread-page-avatar");
    this.threadPageSchool = document.getElementById("thread-page-school");
    this.threadPageAuthorName = document.getElementById("thread-page-author-name");
    this.threadPageAuthorHandle = document.getElementById("thread-page-author-handle");
    this.threadPageAuthorRole = document.getElementById("thread-page-author-role");
    this.threadPageTitle = document.getElementById("thread-page-title");
    this.threadPageContent = document.getElementById("thread-page-content");
    this.btnVoteThreadPage = document.getElementById("btn-vote-thread-page");
    this.threadPageVotes = document.getElementById("thread-page-votes");
    this.threadPageRepliesCount = document.getElementById("thread-page-replies-count");
    this.replyPageUserAvatar = document.getElementById("reply-page-user-avatar");
    this.replyPageUserLabel = document.getElementById("reply-page-user-label");
    this.replyPageSchoolHint = document.getElementById("reply-page-school-hint");

    // Barra de entrada y compositor desplegable estilo Reddit
    this.redditJoinWrap = document.getElementById("reddit-join-wrap");
    this.redditJoinTrigger = document.getElementById("reddit-join-trigger");
    this.formReplyPage = document.getElementById("form-reply-page");
    this.replyPageContent = document.getElementById("reply-page-content");
    this.btnCancelReplyPage = document.getElementById("btn-cancel-reply-page");
    this.btnSubmitReplyPage = document.getElementById("btn-submit-reply-page");

    // Controles de Orden y Búsqueda de Comentarios estilo Reddit
    this.btnToggleSortDropdown = document.getElementById("btn-toggle-sort-dropdown");
    this.redditSortMenu = document.getElementById("reddit-sort-menu");
    this.currentSortLabel = document.getElementById("current-sort-label");
    this.commentsSearchInput = document.getElementById("comments-search-input");
    this.commentsSearchQuery = "";
    this.threadCommentsStreamCount = document.getElementById("thread-comments-stream-count");
    this.btnSortCommentsTop = document.getElementById("btn-sort-comments-top");
    this.btnSortCommentsRecent = document.getElementById("btn-sort-comments-recent");
    this.threadCommentsStream = document.getElementById("thread-comments-stream");
    this.commentsSortMode = "top";
    this.currentComments = [];
    this.currentThread = null;
    this.feedScrollPosition = 0;

    // Compatibilidad con selectores heredados
    this.threadModalTitle = document.getElementById("thread-page-title") || document.getElementById("thread-modal-title");
    this.threadModalChannel = document.getElementById("thread-page-channel") || document.getElementById("thread-modal-channel");
    this.threadModalDate = document.getElementById("thread-page-date") || document.getElementById("thread-modal-date");
    this.threadOpAvatar = document.getElementById("thread-page-avatar") || document.getElementById("thread-op-avatar");
    this.threadOpName = document.getElementById("thread-page-author-name") || document.getElementById("thread-op-name");
    this.threadOpHandle = document.getElementById("thread-page-author-handle") || document.getElementById("thread-op-handle");
    this.threadOpSchool = document.getElementById("thread-page-school") || document.getElementById("thread-op-school");
    this.threadOpContent = document.getElementById("thread-page-content") || document.getElementById("thread-op-content");
    this.threadModalVotes = document.getElementById("thread-page-votes") || document.getElementById("thread-modal-votes");
    this.threadModalRepliesCount = document.getElementById("thread-page-replies-count") || document.getElementById("thread-modal-replies-count");
    this.btnVoteThread = document.getElementById("btn-vote-thread-page") || document.getElementById("btn-vote-thread");
    this.btnShareThreadModal = document.getElementById("btn-share-thread-page") || document.getElementById("btn-share-thread-modal");
    this.btnReportThread = document.getElementById("btn-report-thread-page") || document.getElementById("btn-report-thread");
    this.threadRepliesList = document.getElementById("thread-comments-stream") || document.getElementById("thread-replies-list");
    this.formReply = document.getElementById("form-reply-page") || document.getElementById("form-reply");
    this.replyInputContent = document.getElementById("reply-page-content") || document.getElementById("reply-input-content");
    this.replyUserAvatar = document.getElementById("reply-page-user-avatar") || document.getElementById("reply-user-avatar");
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
    this.profileStatKarmaThreads = document.getElementById("profile-stat-karma-threads");
    this.profileStatKarmaReplies = document.getElementById("profile-stat-karma-replies");
    this.profileStatThreads = document.getElementById("profile-stat-threads");
    this.profileStatReplies = document.getElementById("profile-stat-replies");
    this.profileCakedayText = document.getElementById("profile-cakeday-text");
    this.profileBadgesList = document.getElementById("profile-badges-list");

    // Pestañas del perfil unificado estilo Reddit
    this.tabBtnProfileView = document.getElementById("tab-btn-profile-view");
    this.tabBtnProfileEdit = document.getElementById("tab-btn-profile-edit");
    this.tabBtnProfileThreads = document.getElementById("tab-btn-profile-threads");
    this.tabBtnProfileReplies = document.getElementById("tab-btn-profile-replies");
    this.tabBtnProfileBadges = document.getElementById("tab-btn-profile-badges");
    this.tabLabelProfileView = document.getElementById("tab-label-profile-view");

    this.profileTabView = document.getElementById("profile-tab-view");
    this.profileTabEdit = document.getElementById("profile-tab-edit");
    this.profileTabThreads = document.getElementById("profile-tab-threads");
    this.profileTabReplies = document.getElementById("profile-tab-replies");
    this.profileTabBadges = document.getElementById("profile-tab-badges");

    this.profileOverviewList = document.getElementById("profile-overview-list");
    this.profileThreadsList = document.getElementById("profile-threads-list");
    this.profileRepliesList = document.getElementById("profile-replies-list");
    this.profileCountTabThreads = document.getElementById("profile-count-tab-threads");
    this.profileCountTabReplies = document.getElementById("profile-count-tab-replies");
    this.profileCountTabBadges = document.getElementById("profile-count-tab-badges");

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
      this.themeIcon.innerHTML = getSvg('sun', 'svg-icon-sm');
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
      this.themeIcon.innerHTML = getSvg('moon', 'svg-icon-sm');
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
      this.activeFeed = null;
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

    // Soporte para filtro de colegio en URL (?colegio=ID)
    const colegioParam = params.get("colegio");
    if (colegioParam) {
      this.activeSchoolFilter = colegioParam;
      this.activeFeed = null;
    }

    this.bindEvents();

    // Cargar Colegios en Sidebar y Cuenta Regresiva 2026
    this.populateSidebarSchools();
    this.startCountdown2026();

    // Sincronizar estado visual de navegación
    this.syncNavigationUI();

    // Cargar Canales y Debates Iniciales
    this.loadChannels();
    this.loadThreads(false);

    // Deep link a hilo específico (soporta ?hilo= y ?id= desde noticias)
    const hiloParam = params.get("hilo") || params.get("id");
    if (hiloParam) {
      this.openThread(hiloParam, false);
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
        this.showToast(`Modo Administrador activado (${this.adminUser})`);
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
    if (!id) return { id: "", nombre: "Colegio de Posadas", escudo: "", color: "#0284c7" };
    const found = COLEGIOS.find(c => c.id === id);
    if (!found) return { id, nombre: id, escudo: "", color: "#0284c7" };
    const primary = (found.colores && found.colores.primary) || "#0284c7";
    return {
      ...found,
      color: primary
    };
  }

  applySchoolTheme(colegioId, targetEl = document.documentElement) {
    if (!colegioId) {
      const defaultGrad = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
      const schoolProps = [
        "--school-primary", "--school-secondary", "--school-accent", "--school-glow",
        "--school-collar", "--school-text-contrast", "--school-surface", "--school-border",
        "--school-gradient", "--school-gradient-subtle", "--foro-accent"
      ];
      schoolProps.forEach(p => {
        if (targetEl) targetEl.style.removeProperty(p);
        if (document.documentElement) document.documentElement.style.removeProperty(p);
        if (document.body) document.body.style.removeProperty(p);
      });
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute("content", "#090a0f");
      const heroStrip = document.getElementById("about-card-hero-strip");
      if (heroStrip) heroStrip.style.setProperty("background", defaultGrad, "important");
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
    const surface = isLight ? this.hexToRgba(primary, 0.10) : (colors.surface || this.hexToRgba(primary, 0.12));
    const border = isLight ? this.hexToRgba(primary, 0.28) : (colors.border || this.hexToRgba(primary, 0.35));
    const gradient = colors.gradient || `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
    const gradientSubtle = `linear-gradient(180deg, ${surface} 0%, transparent 100%)`;

    const allProps = {
      "--school-primary": primary,
      "--school-secondary": secondary,
      "--school-accent": accent,
      "--school-glow": glow,
      "--school-collar": collar,
      "--school-text-contrast": textContrast,
      "--school-surface": surface,
      "--school-border": border,
      "--school-gradient": gradient,
      "--school-gradient-subtle": gradientSubtle,
      "--foro-accent": primary
    };

    Object.entries(allProps).forEach(([k, v]) => {
      if (document.documentElement) document.documentElement.style.setProperty(k, v);
      if (document.body) document.body.style.setProperty(k, v);
      if (targetEl && targetEl !== document.documentElement && targetEl !== document.body) {
        targetEl.style.setProperty(k, v);
      }
    });

    const heroStrip = document.getElementById("about-card-hero-strip");
    if (heroStrip) {
      heroStrip.style.setProperty("background", gradient, "important");
    }

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", primary);
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
      `<option value="${c.id}">${c.nombre}</option>`
    ).join("");

    if (this.topicSchool) this.topicSchool.innerHTML = options;
    if (this.authSelectSchool) this.authSelectSchool.innerHTML = options;
    if (this.onboardingSchool) this.onboardingSchool.innerHTML = options;
    if (this.editProfileSchool) this.editProfileSchool.innerHTML = options;
  }

  populateSidebarSchools() {
    const uEl = this.widgetStatUsuarios || document.getElementById("widget-stat-usuarios");
    if (uEl && (uEl.textContent === "--" || !uEl.textContent.trim())) {
      uEl.textContent = "186";
    }
    const cEl = this.widgetStatColegios || document.getElementById("widget-stat-colegios");
    if (cEl) {
      cEl.textContent = String((COLEGIOS && COLEGIOS.length) || 33);
    }

    if (!this.sidebarSchoolsList) return;
    const counts = this.schoolCounts || {};
    const html = (COLEGIOS || []).map(c => {
      const primary = (c.colores && c.colores.primary) || "#38bdf8";
      const isAct = this.activeSchoolFilter === c.id;
      const count = counts[c.id] || 0;
      return `
        <button type="button" class="sidebar-school-chip ${isAct ? "active" : ""}" data-school-id="${c.id}">
          <span class="school-chip-dot" style="background:${primary};"></span>
          <span class="school-name">${escapeHtml(c.nombre)}</span>
          ${count > 0 ? `<span class="left-nav-count">${count}</span>` : ""}
        </button>
      `;
    }).join("");
    this.sidebarSchoolsList.innerHTML = html;

    this.sidebarSchoolsList.querySelectorAll(".sidebar-school-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.schoolId;
        if (this.activeSchoolFilter === id) {
          this.setSchoolFilter("todos");
        } else {
          this.setSchoolFilter(id);
        }
      });
    });
  }

  setSchoolFilter(schoolId, shouldReload = true) {
    this.activeSchoolFilter = schoolId || "todos";
    if (this.activeSchoolFilter !== "todos") {
      this.activeFeed = null;
      // Aplicar dinámicamente los colores del colegio seleccionado al tema global
      this.applySchoolTheme(this.activeSchoolFilter);
    } else {
      // Restaurar el tema del usuario logueado o default
      const userCol = (this.currentUser && this.currentUser.colegioId) ? this.currentUser.colegioId : null;
      this.applySchoolTheme(userCol);
    }

    // Actualizar URL sin recargar
    const url = new URL(window.location);
    if (this.activeSchoolFilter !== "todos") {
      url.searchParams.set("colegio", this.activeSchoolFilter);
    } else {
      url.searchParams.delete("colegio");
    }
    window.history.replaceState({}, "", url);

    this.syncNavigationUI();

    if (shouldReload) {
      this.page = 0;
      this.loadThreads(false);
    }
  }

  syncNavigationUI() {
    // 1. Feeds Principales
    const navFeedHome = document.getElementById("nav-feed-home");
    const navFeedPopular = document.getElementById("nav-feed-popular");
    const navFeedComentados = document.getElementById("nav-feed-comentados");

    const isHomeActive = this.activeFeed === "home" && this.activeCanal === "todos" && this.activeSchoolFilter === "todos";
    const isPopularActive = this.activeFeed === "popular";
    const isComentadosActive = this.activeFeed === "comentados";

    if (navFeedHome) navFeedHome.classList.toggle("active", isHomeActive);
    if (navFeedPopular) navFeedPopular.classList.toggle("active", isPopularActive);
    if (navFeedComentados) navFeedComentados.classList.toggle("active", isComentadosActive);

    // 2. Canales Temáticos en Sidebar y Grid
    if (this.sidebarChannelsList) {
      this.sidebarChannelsList.querySelectorAll(".left-nav-item").forEach(b => {
        const canalId = b.dataset.canal;
        b.classList.toggle("active", canalId === this.activeCanal);
      });
    }
    if (this.channelsGrid) {
      this.channelsGrid.querySelectorAll(".channel-chip").forEach(b => {
        b.classList.toggle("active", b.dataset.canal === this.activeCanal);
      });
    }

    // 3. Colegios en Sidebar
    if (this.sidebarSchoolsList) {
      this.sidebarSchoolsList.querySelectorAll(".sidebar-school-chip").forEach(b => {
        b.classList.toggle("active", b.dataset.schoolId === this.activeSchoolFilter);
      });
    }
    if (this.btnClearSchoolFilter) {
      this.btnClearSchoolFilter.style.display = (this.activeSchoolFilter && this.activeSchoolFilter !== "todos") ? "inline-block" : "none";
    }

    // 4. Barra dinámica de filtros en el Feed
    const hasSchoolFilter = this.activeSchoolFilter && this.activeSchoolFilter !== "todos";
    const hasChannelFilter = this.activeCanal && this.activeCanal !== "todos";

    if (this.forumFeedFilterBar) {
      this.forumFeedFilterBar.style.display = (hasSchoolFilter || hasChannelFilter) ? "flex" : "none";
    }

    if (this.forumFeedSchoolChip) {
      if (hasSchoolFilter) {
        const col = this.getColegio(this.activeSchoolFilter);
        this.forumFeedSchoolChip.style.display = "inline-flex";
        this.forumFeedSchoolChip.innerHTML = `${getSchoolDot(col)} <span>${escapeHtml(col.nombre)}</span> <span class="chip-dismiss">✕</span>`;
      } else {
        this.forumFeedSchoolChip.style.display = "none";
      }
    }

    if (this.forumFeedChannelChip) {
      if (hasChannelFilter) {
        const canalName = this.getChannelName(this.activeCanal);
        this.forumFeedChannelChip.style.display = "inline-flex";
        this.forumFeedChannelChip.innerHTML = `<span>c/${escapeHtml(canalName)}</span> <span class="chip-dismiss">✕</span>`;
      } else {
        this.forumFeedChannelChip.style.display = "none";
      }
    }

    // Compatibilidad con activeSchoolFilterPill legacy
    if (this.activeSchoolFilterPill) {
      if (hasSchoolFilter) {
        const col = this.getColegio(this.activeSchoolFilter);
        this.activeSchoolFilterPill.style.display = "inline-flex";
        this.activeSchoolFilterPill.innerHTML = `<span>${getSchoolDot(col)} ${escapeHtml(col.nombre)}</span> <span style="margin-left:4px;opacity:0.7;">✕</span>`;
      } else {
        this.activeSchoolFilterPill.style.display = "none";
      }
    }

    // Sincronizar tabs de ordenación legacy si existen
    const tabSortTop = document.getElementById("tab-sort-top");
    const tabSortRecent = document.getElementById("tab-sort-recent");
    const tabSortComments = document.getElementById("tab-sort-comments");
    if (tabSortTop) tabSortTop.classList.toggle("active", this.activeSort === "top");
    if (tabSortRecent) tabSortRecent.classList.toggle("active", this.activeSort === "recientes");
    if (tabSortComments) tabSortComments.classList.toggle("active", this.activeSort === "comentados");
  }

  startCountdown2026() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    // 1ª Noche de Calle oficial Estudiantina 2026: Viernes 18 de Septiembre de 2026, 20:00 hs (Posadas / UTC-3)
    const targetDate = new Date("2026-09-18T20:00:00-03:00").getTime();

    const updateClock = () => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) {
        if (this.countdownDays) this.countdownDays.textContent = "0";
        if (this.countdownHours) this.countdownHours.textContent = "0";
        if (this.countdownMins) this.countdownMins.textContent = "0";
        if (this.countdownSecs) this.countdownSecs.textContent = "0";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (this.countdownDays) this.countdownDays.textContent = String(days);
      if (this.countdownHours) this.countdownHours.textContent = String(hours).padStart(2, "0");
      if (this.countdownMins) this.countdownMins.textContent = String(mins).padStart(2, "0");
      if (this.countdownSecs) this.countdownSecs.textContent = String(secs).padStart(2, "0");
    };

    updateClock();
    this.countdownInterval = setInterval(updateClock, 1000);
  }

  updateTopColegiosWidget(threads) {
    if (!this.sidebarTopColegios || !Array.isArray(threads)) return;
    const schoolCounts = {};
    threads.forEach(t => {
      if (t.colegio_id) {
        const weight = 1 + (parseInt(t.respuestas_count || 0, 10) || 0) + (parseInt(t.votos || 0, 10) || 0);
        schoolCounts[t.colegio_id] = (schoolCounts[t.colegio_id] || 0) + weight;
      }
    });

    const sortedIds = Object.keys(schoolCounts).sort((a, b) => schoolCounts[b] - schoolCounts[a]);
    const fallbackIds = ["janssen", "santa_maria", "industrial", "nacional", "comercio6", "san_basilio"];
    fallbackIds.forEach(id => {
      if (!sortedIds.includes(id)) sortedIds.push(id);
    });

    const top5 = sortedIds.slice(0, 5);
    const html = top5.map((id, idx) => {
      const col = this.getColegio(id);
      const count = schoolCounts[id] || (12 - idx * 2);
      const isAct = this.activeSchoolFilter === id;
      return `
        <div class="top-colegio-item ${isAct ? "active" : ""}" data-school-id="${id}" title="Filtrar debates de ${escapeHtml(col.nombre)}">
          <span class="top-colegio-rank">${idx + 1}</span>
          <span class="top-colegio-badge">${getSchoolDot(col)}</span>
          <span class="top-colegio-name">${escapeHtml(col.nombre)}</span>
          <span class="top-colegio-count">${count} pts</span>
        </div>
      `;
    }).join("");

    this.sidebarTopColegios.innerHTML = html;
    this.sidebarTopColegios.querySelectorAll(".top-colegio-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = item.dataset.schoolId;
        this.setSchoolFilter(id);
      });
    });
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
        this.showToast(`Bienvenido a la comunidad, @${json.usuario.username}!`);
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
    UsuarioService.setUser(user);
    if (user.colegioId) {
      this.applySchoolTheme(user.colegioId);
    }
    this.updateUserBar();

    if (this.modalGoogleAuth) this.modalGoogleAuth.classList.remove("active");

    const col = this.getColegio(user.colegioId);
    const handleText = user.username ? ` (@${user.username})` : "";
    this.showToast(`Conectado como ${user.nombre}${handleText}`);

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

    if (this.redditCreateAvatar) {
      this.redditCreateAvatar.src = isLogged ? (this.currentUser.avatarUrl || "assets/avatar-default.webp") : "assets/avatar-default.webp";
    }

    if (isLogged) {
      if (this.userAvatarImg) this.userAvatarImg.src = this.currentUser.avatarUrl;
      if (this.userProfileName) this.userProfileName.textContent = this.currentUser.nombre;

      const col = this.getColegio(this.currentUser.colegioId);
      if (this.userSchoolBadge) {
        this.userSchoolBadge.innerHTML = `${getSchoolDot(col)} <span class="user-school-name" style="color:${col.color};font-weight:700;">${escapeHtml(col.nombre)}</span>`;
      }
      if (this.topicSchool) this.topicSchool.value = this.currentUser.colegioId;
      if (this.replyUserAvatar) this.replyUserAvatar.src = this.currentUser.avatarUrl;
      if (this.replySchoolHint) {
        this.replySchoolHint.textContent = `Comentando como hincha de ${col.nombre}`;
      }
    } else {
      if (this.replySchoolHint) {
        this.replySchoolHint.textContent = "Comentando como hincha anónimo";
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
        UsuarioService.clearUser();
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

    // Iniciar debate (botón de hero, FAB y Reddit quick create post card)
    const handleOpenCreateModal = (schoolId = null) => {
      if (!this.currentUser) {
        if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
        this.showToast("Por favor identificate para iniciar un debate");
        return;
      }
      if (schoolId && this.topicSchool) {
        this.topicSchool.value = schoolId;
      }
      if (this.topicCanal && this.activeCanal && this.activeCanal !== "todos") {
        this.topicCanal.value = this.activeCanal;
      }
      if (this.modalTopic) this.modalTopic.classList.add("active");
    };

    if (this.btnProposeTopic) {
      this.btnProposeTopic.addEventListener("click", () => handleOpenCreateModal());
    }
    const btnFab = document.getElementById("btn-fab-topic");
    if (btnFab) {
      btnFab.addEventListener("click", () => handleOpenCreateModal());
    }
    if (this.redditCreateInputBtn) {
      this.redditCreateInputBtn.addEventListener("click", () => handleOpenCreateModal());
    }
    if (this.btnCloseTopic) {
      this.btnCloseTopic.addEventListener("click", () => {
        this.modalTopic.classList.remove("active");
      });
    }
    if (this.formTopic) {
      this.formTopic.addEventListener("submit", (e) => this.handleCreateTopic(e));
    }

    // Pestaña Completa de Hilo (Reddit & Twitter Full Page View)
    if (this.btnBackToFeed) {
      this.btnBackToFeed.addEventListener("click", () => this.showFeedView());
    }
    if (this.btnShareThreadPage) {
      this.btnShareThreadPage.addEventListener("click", () => this.shareCurrentThread());
    }
    if (this.btnShareThreadPill) {
      this.btnShareThreadPill.addEventListener("click", () => this.shareCurrentThread());
    }
    if (this.btnReportThreadPage) {
      this.btnReportThreadPage.addEventListener("click", () => {
        if (this.activeThreadId) this.reportContent("hilo", this.activeThreadId);
      });
    }
    if (this.btnVoteThreadPage) {
      this.btnVoteThreadPage.addEventListener("click", () => {
        if (this.activeThreadId) this.toggleVote(this.activeThreadId);
      });
    }
    if (this.btnThreadMoreOptions) {
      this.btnThreadMoreOptions.addEventListener("click", (e) => {
        e.stopPropagation();
        const thread = this.currentThread;
        this.openMoreDropdown(this.btnThreadMoreOptions, {
          tipo: "hilo",
          id: this.activeThreadId || (thread && thread.id),
          autorGoogleId: thread ? thread.autor_google_id : "",
          autorNombre: thread ? (thread.autor_nombre || thread.autor_handle) : "",
          preview: thread ? (thread.titulo || thread.contenido) : "",
          threadId: this.activeThreadId || (thread && thread.id)
        });
      });
    }

    // Menú Desplegable Flotante de Opciones (Tres Puntitos)
    if (this.dropdownActionReport) {
      this.dropdownActionReport.addEventListener("click", (e) => {
        e.stopPropagation();
        const ctx = this.activeDropdownContext;
        this.closeMoreDropdown();
        this.openReportModal(ctx);
      });
    }
    if (this.dropdownActionShare) {
      this.dropdownActionShare.addEventListener("click", (e) => {
        e.stopPropagation();
        const ctx = this.activeDropdownContext;
        this.closeMoreDropdown();
        if (ctx && (ctx.threadId || ctx.id)) {
          this.shareThread(ctx.threadId || ctx.id, ctx.preview);
        } else {
          this.shareCurrentThread();
        }
      });
    }

    // Modal Reportar Usuario
    if (this.btnCloseReportModal) {
      this.btnCloseReportModal.addEventListener("click", () => this.closeReportModal());
    }
    if (this.btnCancelReport) {
      this.btnCancelReport.addEventListener("click", () => this.closeReportModal());
    }
    if (this.modalReportUser) {
      this.modalReportUser.addEventListener("click", (e) => {
        if (e.target === this.modalReportUser) {
          this.closeReportModal();
        }
      });
    }
    if (this.formReportContent) {
      this.formReportContent.addEventListener("submit", (e) => this.handleReportSubmit(e));
    }

    // Cerrar menú flotante al hacer click afuera o scroll
    document.addEventListener("click", (e) => {
      if (this.forumMoreDropdown && this.forumMoreDropdown.style.display !== "none") {
        if (!e.target.closest("#forum-more-dropdown") && !e.target.closest(".reddit-more-dots-btn") && !e.target.closest("#btn-thread-more-options") && !e.target.closest(".btn-comment-report")) {
          this.closeMoreDropdown();
        }
      }
    });
    window.addEventListener("scroll", () => {
      if (this.forumMoreDropdown && this.forumMoreDropdown.style.display !== "none") {
        this.closeMoreDropdown();
      }
    }, { passive: true });

    // Modal Compartir Debate
    if (this.btnCloseShareModal) {
      this.btnCloseShareModal.addEventListener("click", () => this.closeShareModal());
    }
    if (this.modalShareThread) {
      this.modalShareThread.addEventListener("click", (e) => {
        if (e.target === this.modalShareThread) {
          this.closeShareModal();
        }
      });
    }
    if (this.btnShareCopyAction) {
      this.btnShareCopyAction.addEventListener("click", async () => {
        const url = this.shareInputUrl ? this.shareInputUrl.value : "";
        if (!url) return;
        const ok = await this.copyToClipboard(url);
        if (ok) {
          if (this.btnShareCopyText) this.btnShareCopyText.textContent = "¡Copiado! ✓";
          this.btnShareCopyAction.classList.add("copied");
          this.showToast("🔗 Enlace copiado al portapapeles");
          setTimeout(() => {
            if (this.btnShareCopyText) this.btnShareCopyText.textContent = "Copiar";
            if (this.btnShareCopyAction) this.btnShareCopyAction.classList.remove("copied");
          }, 2500);
        }
      });
    }
    if (this.shareLinkNative) {
      this.shareLinkNative.addEventListener("click", async (e) => {
        e.preventDefault();
        if (this.currentShareData && navigator.share) {
          try {
            await navigator.share({
              title: `${this.currentShareData.title} | Estudiantina.online`,
              text: this.currentShareData.text,
              url: this.currentShareData.url
            });
            this.closeShareModal();
          } catch (err) {
            // Cancelación intencional del usuario (AbortError)
          }
        }
      });
    }

    // Barra de entrada "Join the conversation" estilo Reddit
    if (this.redditJoinTrigger) {
      this.redditJoinTrigger.addEventListener("click", () => {
        if (!this.currentUser) {
          if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
          this.showToast("Iniciá sesión para comentar en el debate");
          return;
        }
        this.redditJoinTrigger.style.display = "none";
        if (this.formReplyPage) {
          this.formReplyPage.style.display = "block";
          if (this.replyPageContent) this.replyPageContent.focus();
        }
      });
    }
    if (this.btnCancelReplyPage) {
      this.btnCancelReplyPage.addEventListener("click", () => {
        if (this.formReplyPage) this.formReplyPage.style.display = "none";
        if (this.redditJoinTrigger) this.redditJoinTrigger.style.display = "flex";
        if (this.replyPageContent) this.replyPageContent.value = "";
      });
    }

    // Controles de Orden y Búsqueda de Comentarios estilo Reddit
    if (this.btnToggleSortDropdown) {
      this.btnToggleSortDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.redditSortMenu) {
          const isHidden = this.redditSortMenu.style.display === "none";
          this.redditSortMenu.style.display = isHidden ? "block" : "none";
        }
      });
    }
    document.querySelectorAll(".reddit-sort-option").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const sort = btn.dataset.sort || "top";
        this.setCommentsSort(sort);
        if (this.currentSortLabel) {
          this.currentSortLabel.textContent = (sort === "top" ? "Best" : "New");
        }
        document.querySelectorAll(".reddit-sort-option").forEach(o => o.classList.toggle("active", o.dataset.sort === sort));
        if (this.redditSortMenu) this.redditSortMenu.style.display = "none";
      });
    });
    window.addEventListener("click", (e) => {
      if (this.redditSortMenu && this.redditSortMenu.style.display !== "none" && !e.target.closest(".reddit-sort-dropdown-wrap")) {
        this.redditSortMenu.style.display = "none";
      }
    });

    if (this.commentsSearchInput) {
      let commentSearchTimer = null;
      this.commentsSearchInput.addEventListener("input", () => {
        clearTimeout(commentSearchTimer);
        commentSearchTimer = setTimeout(() => {
          this.commentsSearchQuery = (this.commentsSearchInput.value || "").trim().toLowerCase();
          this.renderCommentsStream();
        }, 150);
      });
    }

    if (this.btnSortCommentsTop) {
      this.btnSortCommentsTop.addEventListener("click", () => this.setCommentsSort("top"));
    }
    if (this.btnSortCommentsRecent) {
      this.btnSortCommentsRecent.addEventListener("click", () => this.setCommentsSort("recientes"));
    }
    if (this.formReplyPage) {
      this.formReplyPage.addEventListener("submit", (e) => this.handlePageSubmitReply(e));
    }
    if (this.replyPageContent) {
      this.replyPageContent.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
          e.preventDefault();
          this.handlePageSubmitReply(e);
        }
      });
    }

    // Barra de formato rápido para el compositor de la pestaña
    const formatButtons = document.querySelectorAll("#form-reply-page .btn-reply-format");
    formatButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const fmt = btn.dataset.format;
        this.applyFormatToTextarea(this.replyPageContent, fmt);
      });
    });

    // Manejo de navegación atrás/adelante del navegador (popstate)
    window.addEventListener("popstate", () => {
      const params = new URLSearchParams(window.location.search);
      const hiloId = params.get("hilo") || params.get("id");
      if (hiloId) {
        this.openThread(hiloId, false);
      } else {
        this.showFeedView(false);
      }
    });

    // Atajo Escape: volver al feed si está en la pestaña completa y ningún modal está abierto
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMoreDropdown();
        if (this.modalReportUser && this.modalReportUser.classList.contains("active")) {
          this.closeReportModal();
          return;
        }
        const anyModalOpen = document.querySelector(".topic-modal-overlay.active, .auth-modal-overlay.active, .admin-modal-overlay.active, .profile-modal-overlay.active, .share-modal-overlay.active, .report-modal-overlay.active");
        if (this.modalShareThread && this.modalShareThread.classList.contains("active")) {
          this.closeShareModal();
          return;
        }
        if (!anyModalOpen && this.forumThreadView && this.forumThreadView.style.display !== "none") {
          this.showFeedView();
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

    // Control de Barra Lateral / Canales estilo Reddit (PC Toggle & Mobile Drawer)
    const btnToggleNav = document.getElementById("btn-toggle-left-nav");
    const leftSidebar = document.getElementById("foro-left-sidebar");
    const drawerBackdrop = document.getElementById("sidebar-drawer-backdrop");

    // Restaurar preferencia de sidebar colapsado en PC
    if (window.innerWidth > 1024 && localStorage.getItem("foro_sidebar_collapsed") === "1") {
      document.body.classList.add("sidebar-collapsed");
      if (btnToggleNav) btnToggleNav.setAttribute("title", "Mostrar canales y filtros");
    }

    const toggleDrawerMobile = (forceState) => {
      if (!leftSidebar) return;
      const willOpen = forceState !== undefined ? forceState : !leftSidebar.classList.contains("open");
      leftSidebar.classList.toggle("open", willOpen);
      if (drawerBackdrop) drawerBackdrop.classList.toggle("active", willOpen);
      document.body.classList.toggle("drawer-open", willOpen);
    };

    const toggleSidebarDesktop = () => {
      const isNowCollapsed = document.body.classList.toggle("sidebar-collapsed");
      try {
        localStorage.setItem("foro_sidebar_collapsed", isNowCollapsed ? "1" : "0");
      } catch (e) {}
      if (btnToggleNav) {
        btnToggleNav.setAttribute("title", isNowCollapsed ? "Mostrar canales y filtros" : "Ocultar canales y filtros");
      }
    };

    if (btnToggleNav) {
      btnToggleNav.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.innerWidth > 1024) {
          toggleSidebarDesktop();
        } else {
          toggleDrawerMobile();
        }
      });
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener("click", () => toggleDrawerMobile(false));
    }

    if (leftSidebar) {
      leftSidebar.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024 && (e.target.closest(".left-nav-item") || e.target.closest(".sidebar-school-chip") || e.target.closest(".sidebar-channel-item"))) {
          toggleDrawerMobile(false);
        }
      });
    }

    // Búsqueda con debounce (soportando input desktop y mobile)
    let searchTimer = null;
    const searchInputs = [
      this.searchInput,
      this.searchMobileInput || document.getElementById("forum-search-input-mobile")
    ].filter(Boolean);

    const clearBtns = [
      this.searchClearBtn,
      this.searchMobileClearBtn || document.getElementById("btn-forum-search-clear-mobile")
    ].filter(Boolean);

    const updateClearBtns = (val) => {
      clearBtns.forEach(btn => {
        btn.style.display = val ? "inline-flex" : "none";
      });
    };

    searchInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        const val = e.target.value.trim();
        // Sincronizar el otro input si existe
        searchInputs.forEach(other => {
          if (other !== input) other.value = e.target.value;
        });
        updateClearBtns(val);
        searchTimer = setTimeout(() => {
          this.searchQuery = val;
          this.page = 0;
          this.loadThreads(false);
        }, 320);
      });
    });

    clearBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        searchInputs.forEach(input => input.value = "");
        updateClearBtns("");
        this.searchQuery = "";
        this.page = 0;
        this.loadThreads(false);
      });
    });

    // Ordenamiento (Más Votados / Recientes / Más Comentados)
    const tabSortTop = document.getElementById("tab-sort-top");
    const tabSortRecent = document.getElementById("tab-sort-recent");
    const tabSortComments = document.getElementById("tab-sort-comments");

    const updateSortTabs = (sort) => {
      this.activeSort = sort;
      if (sort === "top") this.activeFeed = "popular";
      else if (sort === "comentados") this.activeFeed = "comentados";
      else if (sort === "recientes") this.activeFeed = "home";
      this.syncNavigationUI();
      this.page = 0;
      this.loadThreads(false);
    };

    if (tabSortTop) tabSortTop.addEventListener("click", () => updateSortTabs("top"));
    if (tabSortRecent) tabSortRecent.addEventListener("click", () => updateSortTabs("recientes"));
    if (tabSortComments) tabSortComments.addEventListener("click", () => updateSortTabs("comentados"));

    // Feeds del Sidebar Izquierdo
    const navFeedHome = document.getElementById("nav-feed-home");
    if (navFeedHome) {
      navFeedHome.addEventListener("click", () => {
        this.activeFeed = "home";
        this.activeCanal = "todos";
        this.activeSort = "recientes";
        this.setSchoolFilter("todos", false);
        const url = new URL(window.location);
        url.searchParams.delete("canal");
        url.searchParams.delete("colegio");
        window.history.replaceState({}, "", url);
        this.syncNavigationUI();
        this.page = 0;
        this.loadThreads(false);
      });
    }
    const navFeedPopular = document.getElementById("nav-feed-popular");
    if (navFeedPopular) {
      navFeedPopular.addEventListener("click", () => {
        this.activeFeed = "popular";
        this.activeSort = "top";
        this.syncNavigationUI();
        this.page = 0;
        this.loadThreads(false);
      });
    }
    const navFeedComentados = document.getElementById("nav-feed-comentados");
    if (navFeedComentados) {
      navFeedComentados.addEventListener("click", () => {
        this.activeFeed = "comentados";
        this.activeSort = "comentados";
        this.syncNavigationUI();
        this.page = 0;
        this.loadThreads(false);
      });
    }

    // Botones de filtro del feed bar
    if (this.forumFeedSchoolChip) {
      this.forumFeedSchoolChip.addEventListener("click", () => {
        this.setSchoolFilter("todos");
      });
    }
    if (this.forumFeedChannelChip) {
      this.forumFeedChannelChip.addEventListener("click", () => {
        this.activeCanal = "todos";
        if (!this.activeSchoolFilter || this.activeSchoolFilter === "todos") {
          this.activeFeed = "home";
        }
        const url = new URL(window.location);
        url.searchParams.delete("canal");
        window.history.replaceState({}, "", url);
        this.syncNavigationUI();
        this.page = 0;
        this.loadThreads(false);
      });
    }
    if (this.btnFeedClearAll) {
      this.btnFeedClearAll.addEventListener("click", () => {
        this.activeFeed = "home";
        this.activeCanal = "todos";
        this.activeSort = "recientes";
        this.setSchoolFilter("todos", false);
        const url = new URL(window.location);
        url.searchParams.delete("canal");
        url.searchParams.delete("colegio");
        window.history.replaceState({}, "", url);
        this.syncNavigationUI();
        this.page = 0;
        this.loadThreads(false);
      });
    }

    // Filtro interactivo de Colegios en Sidebar Izquierdo
    if (this.sidebarSchoolSearch && this.sidebarSchoolsList) {
      this.sidebarSchoolSearch.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.sidebarSchoolsList.querySelectorAll(".sidebar-school-chip").forEach(chip => {
          const name = chip.textContent.toLowerCase();
          chip.style.display = name.includes(query) ? "flex" : "none";
        });
      });
    }

    if (this.btnClearSchoolFilter) {
      this.btnClearSchoolFilter.addEventListener("click", () => {
        this.setSchoolFilter("todos");
      });
    }

    if (this.activeSchoolFilterPill) {
      this.activeSchoolFilterPill.addEventListener("click", () => {
        this.setSchoolFilter("todos");
      });
    }

    // Barra de formato de comentarios estilo Reddit
    document.querySelectorAll(".btn-reply-format").forEach(btn => {
      btn.addEventListener("click", () => {
        if (!this.replyInputContent) return;
        const fmt = btn.dataset.format;
        const textarea = this.replyInputContent;
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const text = textarea.value;
        const sel = text.substring(start, end);

        let insert = "";
        if (fmt === "bold") insert = `**${sel || "texto en negrita"}**`;
        else if (fmt === "italic") insert = `*${sel || "texto en cursiva"}*`;
        else if (fmt === "quote") insert = `\n> ${sel || "cita"}\n`;
        else if (fmt === "redoble") {
          const col = (this.currentUser && this.getColegio(this.currentUser.colegioId)) || { nombre: "MI COLEGIO" };
          insert = `¡¡VAMOS ${col.nombre.toUpperCase()}!!\n`;
        }

        textarea.value = text.substring(0, start) + insert + text.substring(end);
        textarea.focus();
        textarea.setSelectionRange(start + insert.length, start + insert.length);
      });
    });

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
        toggleBtn.innerHTML = isPwd ? getSvg("eyeOff", "svg-icon-xs") : getSvg("eye", "svg-icon-xs");
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
    if (this.tabBtnProfileBadges) {
      this.tabBtnProfileBadges.addEventListener("click", () => this.switchProfileTab("badges"));
    }

    if (this.btnOpenEditProfile) {
      this.btnOpenEditProfile.addEventListener("click", () => this.switchProfileTab("edit"));
    }
    if (this.btnCancelEditProfile) {
      this.btnCancelEditProfile.addEventListener("click", () => this.switchProfileTab("view"));
    }

    if (this.btnProfileShare) {
      this.btnProfileShare.addEventListener("click", async () => {
        const userId = this.btnProfileShare.dataset.userId;
        if (!userId) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}?usuario=${encodeURIComponent(userId)}`;
        const ok = await this.copyToClipboard(shareUrl);
        if (ok) {
          this.showToast("Enlace al perfil copiado al portapapeles");
        } else {
          this.showToast(shareUrl);
        }
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
      this.channelsList = canales;
      if (this.statChannelsCount) this.statChannelsCount.textContent = canales.length;
      const uCount = json.totalUsuarios ?? json.total_usuarios;
      if (uCount !== undefined) {
        const uEl = this.widgetStatUsuarios || document.getElementById("widget-stat-usuarios");
        if (uEl) uEl.textContent = String(uCount);
      }
      const cEl = this.widgetStatColegios || document.getElementById("widget-stat-colegios");
      if (cEl) {
        cEl.textContent = String((COLEGIOS && COLEGIOS.length) || 33);
      }

      let totalHilos = canales.reduce((acc, c) => acc + (parseInt(c.hilos_count, 10) || 0), 0);

      // 1. Barra horizontal scrollable para mobile / tablet
      const html = [
        `<button type="button" class="channel-chip ${this.activeCanal === "todos" ? "active" : ""}" data-canal="todos">
          <span>${getChannelIconSvg("todos")} Todos los Canales</span>
          <span class="channel-count">${totalHilos}</span>
        </button>`
      ];

      canales.forEach(c => {
        const isAct = this.activeCanal === c.id;
        html.push(
          `<button type="button" class="channel-chip ${isAct ? "active" : ""}" data-canal="${escapeHtml(c.id)}">
            <span>${getChannelIconSvg(c.id)} ${escapeHtml(c.titulo)}</span>
            <span class="channel-count">${c.hilos_count || 0}</span>
          </button>`
        );
      });

      if (this.channelsGrid) {
        this.channelsGrid.innerHTML = html.join("");
        this.channelsGrid.querySelectorAll(".channel-chip").forEach(btn => {
          btn.addEventListener("click", () => {
            this.activeCanal = btn.dataset.canal;
            if (this.activeCanal === "todos") {
              if (!this.activeSchoolFilter || this.activeSchoolFilter === "todos") {
                this.activeFeed = "home";
              }
            } else {
              this.activeFeed = null;
            }
            const url = new URL(window.location);
            if (this.activeCanal !== "todos") {
              url.searchParams.set("canal", this.activeCanal);
            } else {
              url.searchParams.delete("canal");
            }
            window.history.replaceState({}, "", url);
            this.syncNavigationUI();
            this.page = 0;
            this.loadThreads(false);
          });
        });
      }

      // 2. Lista de Canales en Sidebar Izquierdo
      if (this.sidebarChannelsList) {
        const sidebarHtml = [
          `<button type="button" class="left-nav-item ${this.activeCanal === "todos" ? "active" : ""}" data-canal="todos">
            <span class="nav-icon">${getChannelIconSvg("todos")}</span>
            <span class="nav-label">Todos los Canales</span>
            <span class="left-nav-count">${totalHilos}</span>
          </button>`
        ];

        canales.forEach(c => {
          const isAct = this.activeCanal === c.id;
          sidebarHtml.push(
            `<button type="button" class="left-nav-item ${isAct ? "active" : ""}" data-canal="${escapeHtml(c.id)}">
              <span class="nav-icon">${getChannelIconSvg(c.id)}</span>
              <span class="nav-label">${escapeHtml(c.titulo)}</span>
              <span class="left-nav-count">${c.hilos_count || 0}</span>
            </button>`
          );
        });

        this.sidebarChannelsList.innerHTML = sidebarHtml.join("");
        this.sidebarChannelsList.querySelectorAll(".left-nav-item").forEach(btn => {
          btn.addEventListener("click", () => {
            this.activeCanal = btn.dataset.canal;
            if (this.activeCanal === "todos") {
              if (!this.activeSchoolFilter || this.activeSchoolFilter === "todos") {
                this.activeFeed = "home";
              }
            } else {
              this.activeFeed = null;
            }
            const url = new URL(window.location);
            if (this.activeCanal !== "todos") {
              url.searchParams.set("canal", this.activeCanal);
            } else {
              url.searchParams.delete("canal");
            }
            window.history.replaceState({}, "", url);
            this.syncNavigationUI();
            this.page = 0;
            this.loadThreads(false);
          });
        });
      }

      // 3. Sincronizar opciones del modal de creación de debate
      if (this.topicCanal && Array.isArray(canales) && canales.length > 0) {
        const currentVal = this.topicCanal.value;
        const opts = canales.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.titulo)}</option>`);
        this.topicCanal.innerHTML = opts.join("");
        if (currentVal && canales.some(c => c.id === currentVal)) {
          this.topicCanal.value = currentVal;
        } else if (this.activeCanal && this.activeCanal !== "todos" && canales.some(c => c.id === this.activeCanal)) {
          this.topicCanal.value = this.activeCanal;
        }
      }
    } catch (e) {
      console.warn("Error al cargar canales del foro:", e);
    }
  }

  getChannelName(canalId) {
    if (!canalId || canalId === "todos") return "general";
    if (this.channelsList && Array.isArray(this.channelsList)) {
      const found = this.channelsList.find(c => c.id === canalId);
      if (found) return found.titulo || found.id;
    }
    return canalId;
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
      const colegioParam = this.activeSchoolFilter !== "todos" ? `&colegio=${encodeURIComponent(this.activeSchoolFilter)}` : "";
      const url = `/api/foro?action=hilos&canal=${encodeURIComponent(this.activeCanal)}&sort=${this.activeSort}&q=${q}&limit=${this.pageSize}&offset=${offset}${googleIdParam}${colegioParam}`;

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
        let label = this.activeCanal === "todos" ? "Todos los debates" : `Canal: ${this.activeCanal}`;
        if (this.activeSchoolFilter !== "todos") {
          const col = this.getColegio(this.activeSchoolFilter);
          label += ` • ${col.nombre}`;
        }
        this.activeChannelPill.textContent = label;
      }

      if (!append) {
        const total = (json.total_count !== undefined && json.total_count !== null) ? json.total_count : threads.length;
        if (this.threadsCountBadge) {
          this.threadsCountBadge.textContent = `${total} debates`;
        }
        if (this.statThreadsCount) {
          this.statThreadsCount.textContent = total;
        }
        if (this.widgetStatDebates) {
          this.widgetStatDebates.textContent = String(total);
        }
        const uCount = json.totalUsuarios ?? json.total_usuarios;
        if (uCount !== undefined) {
          const uEl = this.widgetStatUsuarios || document.getElementById("widget-stat-usuarios");
          if (uEl) uEl.textContent = String(uCount);
        }

        if (threads.length === 0) {
          const hasSchoolFilter = this.activeSchoolFilter && this.activeSchoolFilter !== "todos";
          const hasChannelFilter = this.activeCanal && this.activeCanal !== "todos";
          let helpAction = "";
          if (hasSchoolFilter && hasChannelFilter) {
            helpAction = `<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
              <button type="button" class="btn-feed-clear-all" id="btn-empty-clear-canal" style="background:var(--foro-pill-bg);padding:6px 12px;border-radius:var(--r-pill);">Ver debates de este colegio en todos los canales</button>
              <button type="button" class="btn-feed-clear-all" id="btn-empty-clear-school" style="background:var(--foro-pill-bg);padding:6px 12px;border-radius:var(--r-pill);">Quitar filtro de colegio</button>
            </div>`;
          } else if (hasSchoolFilter) {
            helpAction = `<div style="margin-top:12px;"><button type="button" class="btn-feed-clear-all" id="btn-empty-clear-school" style="background:var(--foro-pill-bg);padding:6px 12px;border-radius:var(--r-pill);">Quitar filtro de colegio</button></div>`;
          }

          this.threadsContainer.innerHTML = `
            <div class="empty-state">
              <span class="empty-state-icon">${getSvg("message", "svg-icon-lg")}</span>
              <h3>No se encontraron debates</h3>
              <p>Sé el primero en iniciar un debate sobre este tema o probá con otra búsqueda o colegio.</p>
              ${helpAction}
            </div>`;

          if (document.getElementById("btn-empty-clear-canal")) {
            document.getElementById("btn-empty-clear-canal").addEventListener("click", () => {
              this.activeCanal = "todos";
              this.syncNavigationUI();
              this.page = 0;
              this.loadThreads(false);
            });
          }
          if (document.getElementById("btn-empty-clear-school")) {
            document.getElementById("btn-empty-clear-school").addEventListener("click", () => {
              this.setSchoolFilter("todos");
            });
          }
          this.updateTopColegiosWidget([]);
          return;
        }
        this.threadsContainer.innerHTML = "";
      }

      this.updateTopColegiosWidget(threads);
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
      const isVoted = (t.user_voted === 1) || this.userVotes.has(`hilo_${t.id}`);
      const isPinned = t.fijado === 1 || t.fijado === true;
      const dateText = timeAgo(t.creado_en);
      const votosCount = (t.votos !== undefined && t.votos !== null) ? t.votos : 0;
      const respuestasCount = t.respuestas_count ?? t.comentarios_count ?? 0;

      const card = document.createElement("article");
      card.className = `thread-card reddit-feed-card ${isPinned ? "is-pinned" : ""}`;
      card.dataset.id = t.id;

      card.innerHTML = `
        <div class="reddit-post-gutter" style="display:none;" data-thread-id="${t.id}">
          <button type="button" class="btn-gutter-vote vote-up" data-thread-id="${t.id}" aria-label="Upvote">${getSvg("chevronUp", "svg-icon-xs")}</button>
          <span class="gutter-vote-count">${votosCount}</span>
          <button type="button" class="btn-gutter-vote vote-down" data-thread-id="${t.id}" aria-label="Downvote">${getSvg("chevronDown", "svg-icon-xs")}</button>
        </div>
        <div class="reddit-post-main">
          <!-- 1. Cabecera Comunitaria Reddit (canal • autor • tiempo •••) -->
          <div class="thread-card-header">
            <div class="thread-community-meta" data-author-id="${escapeHtml(t.autor_google_id)}" title="Ver perfil de ${escapeHtml(t.autor_nombre || "Hincha")}">
              <span class="reddit-post-community-badge">
                ${getSchoolDot(col)}
                <span class="community-name">c/${escapeHtml(t.canal_titulo || t.canal_id || "general")}</span>
              </span>
              <span class="meta-dot">•</span>
              <span class="thread-card-author-name">u/${escapeHtml(t.autor_username || (t.autor_nombre ? t.autor_nombre.toLowerCase().replace(/\s+/g,"_") : "hincha"))}</span>
              <span class="meta-dot">•</span>
              <span class="thread-time">${dateText}</span>
              ${isPinned ? `<span class="pinned-badge">${getSvg("pin", "svg-icon-xs")} Fijado</span>` : ""}
            </div>
            <div class="thread-header-actions">
              ${this.adminToken ? `
                <div class="thread-admin-bar">
                  <button type="button" class="btn-mod-action btn-mod-pin ${isPinned ? "pinned-active" : ""}" data-thread-id="${t.id}" data-is-pinned="${isPinned ? "1" : "0"}" title="${isPinned ? "Desfijar" : "Fijar"}">
                    ${getSvg("pin", "svg-icon-xs")}
                  </button>
                  <button type="button" class="btn-mod-action btn-mod-del" data-thread-id="${t.id}" data-thread-title="${escapeHtml(t.titulo)}" title="Eliminar">
                    ${getSvg("trash", "svg-icon-xs")}
                  </button>
                  <button type="button" class="btn-mod-action btn-mod-sanction" data-author-id="${escapeHtml(t.autor_google_id)}" data-author-name="${escapeHtml(t.autor_nombre)}" data-author-avatar="${escapeHtml(t.autor_avatar || "")}" data-author-school="${escapeHtml(t.colegio_id || "janssen")}" title="Sancionar">
                    ${getSvg("ban", "svg-icon-xs")}
                  </button>
                </div>
              ` : `
                <button type="button" class="btn-report-thread-sm reddit-more-dots-btn" title="Opciones / Reportar" data-thread-id="${t.id}">
                  •••
                </button>
              `}
            </div>
          </div>

          <!-- 2. Título de Alta Jerarquía -->
          <h3 class="thread-title">${escapeHtml(t.titulo)}</h3>

          <!-- 3. Flairs de Colegio / Categoría -->
          <div class="thread-flairs-row">
            <span class="thread-school-badge">${getSchoolDot(col)} <span class="school-badge-name" style="color:${col.color};font-weight:700;">${escapeHtml(col.nombre)}</span></span>
          </div>

          <!-- 4. Resumen / Cuerpo del debate -->
          <p class="thread-excerpt">${escapeHtml(t.contenido)}</p>

          <!-- 5. Barra de Acciones Píldora Estilo Reddit -->
          <div class="thread-card-footer reddit-action-bar">
            <div class="reddit-vote-capsule ${isVoted ? "voted" : ""}" data-thread-id="${t.id}">
              <button type="button" class="btn-vote-arrow btn-vote-up" data-thread-id="${t.id}" aria-label="Upvote">
                ${getSvg("chevronUp", "svg-icon-xs")}
              </button>
              <span class="vote-count">${votosCount}</span>
              <button type="button" class="btn-vote-arrow btn-vote-down" data-thread-id="${t.id}" aria-label="Downvote">
                ${getSvg("chevronDown", "svg-icon-xs")}
              </button>
            </div>

            <button type="button" class="reddit-action-pill btn-open-replies" data-thread-id="${t.id}">
              <span class="pill-icon">${getSvg("message", "svg-icon-xs")}</span>
              <span>${respuestasCount}</span>
            </button>

            <button type="button" class="reddit-action-pill btn-share-thread-card" data-thread-id="${t.id}" data-thread-title="${escapeHtml(t.titulo)}" title="Compartir enlace">
              <span class="pill-icon">${getSvg("share", "svg-icon-xs")}</span>
              <span>Share</span>
            </button>
          </div>
        </div>
      `;


      // Eventos de la tarjeta
      card.addEventListener("click", (e) => {
        const authorEl = e.target.closest(".thread-community-meta");
        if (authorEl && authorEl.dataset.authorId) {
          e.stopPropagation();
          this.openUserProfile(authorEl.dataset.authorId);
          return;
        }
        if (e.target.closest(".reddit-post-gutter") || e.target.closest(".reddit-vote-capsule") || e.target.closest(".btn-share-thread-card") || e.target.closest(".thread-admin-bar") || e.target.closest(".btn-report-thread-sm")) {
          return;
        }
        this.openThread(t.id);
      });

      const postGutter = card.querySelector(".reddit-post-gutter");
      if (postGutter) {
        postGutter.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleVote(t.id, false, null, postGutter);
        });
      }

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
          this.openMoreDropdown(repBtn, {
            tipo: "hilo",
            id: t.id,
            autorGoogleId: t.autor_google_id,
            autorNombre: t.autor_nombre || t.autor_handle,
            preview: t.titulo || t.contenido,
            threadId: t.id
          });
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

  showFeedView(updateUrl = true) {
    document.body.classList.remove("thread-view-active");
    if (this.forumThreadView) this.forumThreadView.style.display = "none";
    if (this.forumFeedView) this.forumFeedView.style.display = "flex";
    document.title = "Foro de Debate Estudiantil | estudiantina.online";
    if (updateUrl) {
      const url = new URL(window.location);
      url.searchParams.delete("hilo");
      url.searchParams.delete("id");
      window.history.pushState({ view: "feed" }, "", url.toString());
    }
    if (this.feedScrollPosition) {
      window.scrollTo({ top: this.feedScrollPosition, behavior: "smooth" });
    }
    this.activeThreadId = null;
    this.currentThread = null;
    this.currentComments = [];
  }

  closeThreadModal() {
    this.showFeedView(true);
  }

  async copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("navigator.clipboard.writeText falló, usando fallback:", err);
      }
    }
    // Fallback con textarea temporal compatible con HTTP y contextos no seguros
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      console.error("Fallback execCommand falló:", err);
      return false;
    }
  }

  getThreadShareUrl(threadId) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("hilo", threadId);
    return url.toString();
  }

  openShareModal(id, title, url, text) {
    if (!this.modalShareThread) return;
    this.currentShareData = { id, title, url, text };

    if (this.shareModalThreadTitle) {
      this.shareModalThreadTitle.textContent = title;
    }
    if (this.shareInputUrl) {
      this.shareInputUrl.value = url;
    }
    if (this.btnShareCopyText) {
      this.btnShareCopyText.textContent = "Copiar";
    }
    if (this.btnShareCopyAction) {
      this.btnShareCopyAction.classList.remove("copied");
    }

    const shareMsg = `${text} ${url}`;
    if (this.shareLinkWhatsapp) {
      this.shareLinkWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
    }
    if (this.shareLinkX) {
      this.shareLinkX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    }
    if (this.shareLinkTelegram) {
      this.shareLinkTelegram.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    }

    // Mostrar botón de compartir nativo si el navegador lo soporta
    if (this.shareLinkNative) {
      this.shareLinkNative.style.display = navigator.share ? "flex" : "none";
    }

    this.modalShareThread.classList.add("active");
  }

  closeShareModal() {
    if (this.modalShareThread) {
      this.modalShareThread.classList.remove("active");
    }
    this.currentShareData = null;
  }

  shareCurrentThread() {
    const id = this.activeThreadId || (this.currentThread && this.currentThread.id);
    if (!id) {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get("hilo") || params.get("id");
      if (urlId) {
        this.shareThread(urlId);
      }
      return;
    }
    const rawTitle = (this.currentThread && this.currentThread.titulo) || (this.threadPageTitle && this.threadPageTitle.textContent) || "Debate";
    this.shareThread(id, rawTitle);
  }

  openMoreDropdown(triggerEl, context) {
    if (!this.forumMoreDropdown || !triggerEl) return;
    this.activeDropdownContext = context || {};

    const rect = triggerEl.getBoundingClientRect();
    const dropdownWidth = 190;
    const dropdownHeight = 90;

    // Colocación horizontal inteligente dentro del viewport
    let left = rect.right - dropdownWidth;
    if (left < 10) left = 10;
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }

    // Colocación vertical inteligente (abajo por defecto, arriba si no hay espacio)
    let top = rect.bottom + 6;
    if (top + dropdownHeight > window.innerHeight - 10) {
      top = rect.top - dropdownHeight - 6;
    }
    if (top < 10) top = 10;

    this.forumMoreDropdown.style.top = `${top}px`;
    this.forumMoreDropdown.style.left = `${left}px`;
    this.forumMoreDropdown.style.display = "flex";
  }

  closeMoreDropdown() {
    if (this.forumMoreDropdown) {
      this.forumMoreDropdown.style.display = "none";
    }
    this.activeDropdownContext = null;
  }

  openReportModal(context) {
    if (!this.modalReportUser) return;
    const ctx = context || this.activeDropdownContext || {};

    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      this.showToast("Debés identificarte para reportar publicaciones.");
      return;
    }

    if (this.reportTargetType) this.reportTargetType.value = ctx.tipo || "hilo";
    if (this.reportTargetId) this.reportTargetId.value = ctx.id || "";
    if (this.reportAuthorId) this.reportAuthorId.value = ctx.autorGoogleId || "";

    if (this.reportPreviewAuthor) {
      const authorText = ctx.autorNombre ? `u/${escapeHtml(ctx.autorNombre)}` : "Usuario de la comunidad";
      this.reportPreviewAuthor.textContent = authorText;
    }
    if (this.reportPreviewSnippet) {
      const snip = (ctx.preview || "").trim();
      this.reportPreviewSnippet.textContent = snip ? (snip.length > 120 ? snip.slice(0, 120) + "..." : snip) : "(Sin vista previa de texto)";
    }
    if (this.reportDetailsText) {
      this.reportDetailsText.value = "";
    }

    // Restablecer motivo predeterminado
    const firstRadio = document.querySelector('input[name="report-reason"][value="Agresiones o faltas de respeto"]');
    if (firstRadio) firstRadio.checked = true;

    this.modalReportUser.classList.add("active");
  }

  closeReportModal() {
    if (this.modalReportUser) {
      this.modalReportUser.classList.remove("active");
    }
  }

  async handleReportSubmit(e) {
    if (e) e.preventDefault();
    if (!this.currentUser) {
      this.closeReportModal();
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      this.showToast("Debés identificarte para reportar.");
      return;
    }

    const tipo = this.reportTargetType ? this.reportTargetType.value : "hilo";
    const itemId = parseInt(this.reportTargetId ? this.reportTargetId.value : "0", 10);
    const authorGoogleId = this.reportAuthorId ? this.reportAuthorId.value : "";

    if (!itemId) {
      this.showToast("Error: elemento no especificado para reportar");
      return;
    }

    // Evitar auto-reporte
    if (authorGoogleId && this.currentUser.googleId && authorGoogleId === this.currentUser.googleId) {
      this.showToast("No podés reportar tu propia publicación");
      this.closeReportModal();
      return;
    }

    const selectedRadio = document.querySelector('input[name="report-reason"]:checked');
    const motivoBase = selectedRadio ? selectedRadio.value : "Agresiones o faltas de respeto";
    const extraDetails = this.reportDetailsText ? this.reportDetailsText.value.trim() : "";
    const motivoCompleto = extraDetails ? `${motivoBase}: ${extraDetails}` : motivoBase;

    try {
      const res = await fetch("/api/foro?action=reportar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          itemId,
          id: itemId,
          googleId: this.currentUser.googleId,
          motivo: motivoCompleto
        })
      });
      const json = await res.json();
      this.closeReportModal();
      if (json.status === "ok") {
        this.showToast(json.message || "✓ Reporte enviado para revisión del equipo moderador.");
      } else {
        this.showToast(json.message || "No se pudo registrar el reporte");
      }
    } catch (err) {
      this.closeReportModal();
      this.showToast("Error de conexión al enviar reporte");
    }
  }

  applyFormatToTextarea(textarea, format) {
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const val = textarea.value || "";
    const selected = val.substring(start, end);
    let replacement = "";

    switch (format) {
      case "bold":
        replacement = selected ? `**${selected}**` : `**texto en negrita**`;
        break;
      case "italic":
        replacement = selected ? `*${selected}*` : `*texto en cursiva*`;
        break;
      case "quote":
        replacement = selected ? `\n> ${selected}\n` : `\n> cita del debate\n`;
        break;
      case "redoble":
        const col = this.currentUser ? this.getColegio(this.currentUser.colegioId) : null;
        const colName = col ? col.nombre : "la tribuna";
        replacement = ` ¡Alienta ${colName}! `;
        break;
      default:
        return;
    }

    textarea.value = val.substring(0, start) + replacement + val.substring(end);
    textarea.focus();
    const newCursor = start + replacement.length;
    textarea.setSelectionRange(newCursor, newCursor);
  }

  async openThread(id, updateUrl = true) {
    if (!id) return;
    document.body.classList.add("thread-view-active");
    if (!this.activeThreadId) {
      this.feedScrollPosition = window.scrollY || 0;
    }
    this.activeThreadId = id;

    // Cambiar a la vista de pestaña completa
    if (this.forumFeedView) this.forumFeedView.style.display = "none";
    if (this.forumThreadView) {
      this.forumThreadView.style.display = "flex";
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Actualizar URL limpia
    if (updateUrl) {
      const url = new URL(window.location);
      url.searchParams.set("hilo", id);
      window.history.pushState({ view: "thread", hiloId: id }, "", url.toString());
    }

    // Estado de carga inicial
    if (this.threadPageContent) {
      this.threadPageContent.innerHTML = `<div class="loading-spinner"></div> Cargando debate...`;
    }
    if (this.threadCommentsStream) {
      this.threadCommentsStream.innerHTML = `<div class="loading-spinner"></div> Cargando comentarios...`;
    }

    try {
      const googleIdParam = this.currentUser ? `&googleId=${encodeURIComponent(this.currentUser.googleId)}` : "";
      const res = await fetch(`/api/foro?action=hilo&id=${encodeURIComponent(id)}${googleIdParam}`);
      const json = await res.json();

      const h = json.hilo || (json.data && json.data.hilo);
      if (json.status !== "ok" || !h) {
        this.showToast("El debate solicitado no existe o fue eliminado");
        this.showFeedView(true);
        return;
      }
      this.currentThread = h;
      const col = this.getColegio(h.colegio_id);

      // Título de pestaña del navegador y título del post
      document.title = `${decodeEntities(h.titulo)} | Foro Estudiantina`;
      if (this.threadPageNavChannel) this.threadPageNavChannel.textContent = h.canal_titulo || h.canal_id;
      if (this.threadPageNavDate) this.threadPageNavDate.textContent = timeAgo(h.creado_en);
      if (this.threadPageTitle) this.threadPageTitle.textContent = decodeEntities(h.titulo);
      if (this.threadPageChannel) {
        const canalId = h.canal_id || "general";
        this.threadPageChannel.textContent = `c/${canalId}`;
        this.threadPageChannel.style.cursor = "pointer";
        this.threadPageChannel.title = `Ver debates en c/${canalId}`;
        this.threadPageChannel.onclick = (e) => {
          e.stopPropagation();
          this.activeCanal = canalId;
          this.activeFeed = null;
          const url = new URL(window.location);
          url.searchParams.set("canal", canalId);
          url.searchParams.delete("hilo");
          url.searchParams.delete("id");
          window.history.pushState({ view: "feed", canal: canalId }, "", url.toString());
          this.syncNavigationUI();
          this.showFeedView(false);
          this.page = 0;
          this.loadThreads(false);
        };
      }
      if (this.threadPageDate) this.threadPageDate.textContent = timeAgo(h.creado_en);

      // Metadatos de autor del debate estilo Reddit
      const rawUser = h.autor_username || (h.autor_nombre ? h.autor_nombre.toLowerCase().replace(/\s+/g, '_') : "hincha");
      const displayAuthor = `u/${rawUser}`;
      if (this.threadPageAvatar) {
        this.threadPageAvatar.src = h.autor_avatar || "assets/avatar-default.webp";
        this.threadPageAvatar.dataset.authorId = h.autor_google_id;
        this.threadPageAvatar.title = `Ver perfil de ${displayAuthor}`;
        this.threadPageAvatar.onclick = () => {
          if (this.threadPageAvatar.dataset.authorId) {
            this.openUserProfile(this.threadPageAvatar.dataset.authorId);
          }
        };
      }
      if (this.threadPageAuthorName) {
        this.threadPageAuthorName.textContent = displayAuthor;
        this.threadPageAuthorName.dataset.authorId = h.autor_google_id;
        this.threadPageAuthorName.title = `Ver perfil de ${displayAuthor}`;
        this.threadPageAuthorName.onclick = () => {
          if (this.threadPageAuthorName.dataset.authorId) {
            this.openUserProfile(this.threadPageAuthorName.dataset.authorId);
          }
        };
      }
      if (this.threadPageAuthorHandle) {
        this.threadPageAuthorHandle.textContent = "";
        this.threadPageAuthorHandle.style.display = "none";
      }
      if (this.threadPageFlair) {
        this.threadPageFlair.textContent = h.canal_titulo || h.canal_id || "Banda de Música";
      }
      if (this.threadPageSchool) {
        this.threadPageSchool.innerHTML = `${getSchoolDot(col)} ${escapeHtml(col.nombre)}`;
      }

      // Contenido enriquecido con citas y formato
      if (this.threadPageContent) {
        this.threadPageContent.innerHTML = this.formatRichText(h.contenido);
      }

      // Votos y estadísticas
      if (this.threadPageVotes) {
        this.threadPageVotes.textContent = (h.votos !== undefined && h.votos !== null) ? h.votos : 0;
      }
      const isVoted = (h.user_voted === 1) || this.userVotes.has(`hilo_${h.id}`);
      if (this.btnVoteThreadPage) {
        this.btnVoteThreadPage.classList.toggle("voted", isVoted);
      }

      // Resetear barra de entrada "Join the conversation" y compositor
      if (this.redditJoinTrigger) this.redditJoinTrigger.style.display = "flex";
      if (this.formReplyPage) this.formReplyPage.style.display = "none";
      if (this.replyPageContent) this.replyPageContent.value = "";
      if (this.commentsSearchInput) this.commentsSearchInput.value = "";
      this.commentsSearchQuery = "";

      // Actualizar compositor del usuario actual
      this.updateComposerUserIdentity();

      // Guardar y renderizar comentarios
      this.currentComments = json.comentarios || (json.data && json.data.comentarios) || [];
      if (this.threadPageRepliesCount) {
        this.threadPageRepliesCount.textContent = this.currentComments.length;
      }
      if (this.threadCommentsStreamCount) {
        this.threadCommentsStreamCount.textContent = this.currentComments.length;
      }

      this.renderCommentsStream();
    } catch (err) {
      console.error("Error al abrir debate en pestaña:", err);
      this.showToast("Error de conexión al cargar el debate");
    }
  }

  updateComposerUserIdentity() {
    if (this.replyPageUserAvatar) {
      this.replyPageUserAvatar.src = (this.currentUser && this.currentUser.avatarUrl) ? this.currentUser.avatarUrl : "assets/avatar-default.webp";
    }
    if (this.replyPageUserLabel) {
      this.replyPageUserLabel.textContent = this.currentUser ? `Comentando como ${this.currentUser.nombre}` : "Comentar en este debate";
    }
    if (this.replyPageSchoolHint) {
      if (this.currentUser) {
        const col = this.getColegio(this.currentUser.colegioId);
        this.replyPageSchoolHint.innerHTML = `${getSchoolDot(col)} Hincha de ${escapeHtml(col.nombre)}`;
      } else {
        this.replyPageSchoolHint.textContent = "Ingresá con Google para participar";
      }
    }
  }

  setCommentsSort(mode) {
    this.commentsSortMode = mode;
    if (this.btnSortCommentsTop) this.btnSortCommentsTop.classList.toggle("active", mode === "top");
    if (this.btnSortCommentsRecent) this.btnSortCommentsRecent.classList.toggle("active", mode === "recientes");
    this.renderCommentsStream();
  }

  formatRichText(text) {
    if (!text) return "";
    let safe = escapeHtml(text);
    // Citas en bloque: líneas que empiezan con &gt;
    const lines = safe.split("\n");
    const processed = [];
    let inQuote = false;
    let quoteLines = [];

    for (const line of lines) {
      if (line.startsWith("&gt; ") || line.startsWith("&gt;")) {
        inQuote = true;
        quoteLines.push(line.replace(/^&gt;\s?/, ""));
      } else {
        if (inQuote) {
          processed.push(`<blockquote>${quoteLines.join("<br>")}</blockquote>`);
          inQuote = false;
          quoteLines = [];
        }
        processed.push(line);
      }
    }
    if (inQuote) {
      processed.push(`<blockquote>${quoteLines.join("<br>")}</blockquote>`);
    }

    safe = processed.join("<br>");

    // Negrita **texto**
    safe = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Cursiva *texto*
    safe = safe.replace(/\*([^\*]+?)\*/g, "<em>$1</em>");
    // Párrafos
    return `<p>${safe}</p>`;
  }

  renderCommentNode(r, depth = 0) {
    const col = this.getColegio(r.colegio_id);
    const isVoted = (r.user_voted === 1) || this.userVotes.has(`comentario_${r.id}`);
    const dateText = timeAgo(r.creado_en);
    const rVotos = (r.votos !== undefined && r.votos !== null) ? r.votos : 0;
    const isOp = (this.currentThread && r.autor_google_id === this.currentThread.autor_google_id);
    // Use username if available, else fallback to nombre
    const authorDisplay = r.autor_username
      ? `u/${r.autor_username}`
      : `u/${(r.autor_nombre || "hincha").toLowerCase().replace(/\s+/g, "_")}`;
    // Role flair from the user data (rol_estudiantil field)
    const rolFlair = r.rol_estudiantil || r.autor_rol || "";

    const repliesHtml = (r.replies && r.replies.length > 0)
      ? `<div class="reddit-comment-replies">
          ${r.replies.map(reply => this.renderCommentNode(reply, depth + 1)).join("")}
        </div>`
      : "";

    return `
      <div class="reddit-comment-block ${depth > 0 ? "reddit-comment-reply-block" : ""}" data-comment-id="${r.id}" data-depth="${depth}">
        <!-- Cabecera del comentario con avatar y autor -->
        <div class="reddit-comment-header">
          <img class="reddit-comment-avatar" src="${escapeHtml(r.autor_avatar || "assets/avatar-default.webp")}" alt="Avatar" data-author-id="${escapeHtml(r.autor_google_id)}" loading="lazy" onerror="this.src='assets/avatar-default.webp'" />
          <div class="reddit-comment-author-info">
            <span class="reddit-comment-author" data-author-id="${escapeHtml(r.autor_google_id)}">${escapeHtml(authorDisplay)}</span>
            ${isOp ? `<span class="reddit-op-badge" title="Autor original">OP</span>` : ""}
            ${rolFlair ? `<span class="reddit-author-role-flair">${escapeHtml(rolFlair)}</span>` : ""}
            <span class="reddit-meta-dot">•</span>
            <span class="reddit-comment-time">${dateText}</span>
            <span class="reddit-comment-school-chip">${getSchoolDot(col)} <span style="color:${col.color};font-weight:700;">${escapeHtml(col.nombre)}</span></span>
          </div>
        </div>

        <!-- Cuerpo y Guía Vertical Continua (Reddit Thread Line) -->
        <div class="reddit-comment-body-wrapper">
          <div class="reddit-thread-line-container" data-comment-id="${r.id}" title="Colapsar hilo">
            <div class="reddit-thread-line"></div>
          </div>
          <div class="reddit-comment-main-col">
            <div class="reddit-comment-text">
              ${this.formatRichText(r.contenido)}
            </div>

            <!-- Barra de acciones Reddit debajo del comentario -->
            <div class="reddit-comment-actions">
              <button type="button" class="reddit-comment-collapse-btn" data-comment-id="${r.id}" title="Colapsar hilo">
                <span class="collapse-icon">${getSvg("minusCircle", "svg-icon-xs")}</span>
              </button>
              <div class="reddit-comment-vote-group">
                <button type="button" class="reddit-comment-vote-arrow ${isVoted ? "voted" : ""}" data-comment-id="${r.id}" aria-label="Votar arriba">
                  ${getSvg("chevronUp", "svg-icon-xs")}
                </button>
                <span class="reddit-comment-vote-count">${rVotos > 0 ? rVotos : "Vote"}</span>
                <button type="button" class="reddit-comment-vote-arrow down" data-comment-id="${r.id}" aria-label="Votar abajo">
                  ${getSvg("chevronDown", "svg-icon-xs")}
                </button>
              </div>
              <button type="button" class="reddit-comment-action-btn btn-comment-reply" data-comment-id="${r.id}" data-author-name="${escapeHtml(authorDisplay)}">
                <span class="action-icon">${getSvg("message", "svg-icon-xs")}</span>
                <span>Reply</span>
              </button>
              <button type="button" class="reddit-comment-action-btn btn-comment-report" data-comment-id="${r.id}" data-author-id="${escapeHtml(r.autor_google_id || "")}" data-author-name="${escapeHtml(authorDisplay)}" data-snippet="${escapeHtml((r.contenido || "").slice(0, 120))}" title="Opciones / Reportar">
                <span class="action-icon">•••</span>
              </button>
              ${this.adminToken ? `
                <button type="button" class="reddit-comment-action-btn btn-reply-mod-del" data-comment-id="${r.id}" title="Eliminar respuesta">${getSvg("trash", "svg-icon-xs")}</button>
                <button type="button" class="reddit-comment-action-btn btn-reply-mod-sanction" data-author-id="${escapeHtml(r.autor_google_id)}" data-author-name="${escapeHtml(r.autor_nombre)}" data-author-avatar="${escapeHtml(r.autor_avatar || "")}" data-author-school="${escapeHtml(r.colegio_id || "janssen")}" title="Sancionar usuario">${getSvg("ban", "svg-icon-xs")}</button>
              ` : ""}
            </div>

            <!-- Mini-Compositor Inline desplegable -->
            <div class="reddit-inline-reply-box" id="inline-reply-box-${r.id}" style="display:none;">
              <textarea class="reddit-inline-textarea" placeholder="What are your thoughts?"></textarea>
              <div class="reddit-inline-actions">
                <button type="button" class="reddit-btn-cancel btn-inline-cancel" data-comment-id="${r.id}">Cancel</button>
                <button type="button" class="reddit-btn-comment btn-inline-submit" data-comment-id="${r.id}">Comment</button>
              </div>
            </div>

            <!-- Respuestas anidadas debajo del comentario -->
            ${repliesHtml}
          </div>
        </div>
      </div>
    `;
  }

  renderCommentsStream() {
    if (!this.threadCommentsStream) return;

    if (!this.currentComments || this.currentComments.length === 0) {
      this.threadCommentsStream.innerHTML = `
        <div class="empty-state-stream">
          <span class="empty-icon">${getSvg("message", "svg-icon-lg")}</span>
          <p>Aún no hay respuestas en este debate. Sé el primero en unirte a la conversación.</p>
        </div>`;
      return;
    }

    // Filtrar por buscador en vivo si hay término de búsqueda
    let commentsToRender = this.currentComments;
    if (this.commentsSearchQuery) {
      commentsToRender = commentsToRender.filter(c => {
        const text = (c.contenido || "").toLowerCase();
        const author = (c.autor_nombre || "").toLowerCase() + (c.autor_username || "").toLowerCase();
        return text.includes(this.commentsSearchQuery) || author.includes(this.commentsSearchQuery);
      });
    }

    if (commentsToRender.length === 0) {
      this.threadCommentsStream.innerHTML = `
        <div class="empty-state-stream">
          <span class="empty-icon">${getSvg("search", "svg-icon-lg")}</span>
          <p>No se encontraron comentarios que coincidan con "<strong>${escapeHtml(this.commentsSearchQuery)}</strong>"</p>
        </div>`;
      return;
    }

    // 1. Indexar todos los comentarios por id para estructuración en árbol
    const commentMap = new Map();
    commentsToRender.forEach(c => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    // 2. Construir jerarquía respetando parent_id y fallback contextual (@Autor)
    const roots = [];
    commentsToRender.forEach(c => {
      const node = commentMap.get(c.id);
      let parentNode = null;
      if (node.parent_id && commentMap.has(node.parent_id)) {
        parentNode = commentMap.get(node.parent_id);
      } else if (!node.parent_id && node.contenido && node.contenido.trim().startsWith("@")) {
        // Fallback: Detectar respuesta a comentario previo mediante mención @nombre
        const match = node.contenido.trim().match(/^@([a-zA-Z0-9_\u00C0-\u00FF\s]+?)(?:\s|$)/);
        if (match) {
          const targetName = match[1].trim().toLowerCase();
          for (const other of commentsToRender) {
            if (other.id !== node.id && other.id < node.id) {
              const aName = (other.autor_username || other.autor_nombre || "").toLowerCase();
              if (aName === targetName || aName.includes(targetName) || targetName.includes(aName)) {
                parentNode = commentMap.get(other.id);
                break;
              }
            }
          }
        }
      }

      if (parentNode && parentNode.id !== node.id) {
        parentNode.replies.push(node);
      } else {
        roots.push(node);
      }
    });

    // 3. Ordenar debates principales según el modo seleccionado
    roots.sort((a, b) => {
      if (this.commentsSortMode === "top") {
        const diff = (b.votos || 0) - (a.votos || 0);
        if (diff !== 0) return diff;
        return new Date(a.creado_en) - new Date(b.creado_en);
      } else {
        return new Date(b.creado_en) - new Date(a.creado_en);
      }
    });

    // 4. Ordenar respuestas anidadas de forma cronológica (creado_en ASC) para lectura fluida
    const sortReplies = (node) => {
      node.replies.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
      node.replies.forEach(sortReplies);
    };
    roots.forEach(sortReplies);

    const html = roots.map(rootNode => this.renderCommentNode(rootNode, 0)).join("");
    this.threadCommentsStream.innerHTML = html;

    // Listeners de perfiles
    this.threadCommentsStream.querySelectorAll(".reddit-comment-avatar, .reddit-comment-author").forEach(el => {
      el.addEventListener("click", () => {
        if (el.dataset.authorId) {
          this.openUserProfile(el.dataset.authorId);
        }
      });
    });

    // Listeners de colapso de hilo (botón ⊖ y línea vertical guía)
    const toggleCollapse = (commentId) => {
      const block = this.threadCommentsStream.querySelector(`.reddit-comment-block[data-comment-id="${commentId}"]`);
      if (block) {
        const isCollapsed = block.classList.toggle("is-collapsed");
        const icon = block.querySelector(".collapse-icon");
        if (icon) {
          icon.innerHTML = isCollapsed ? getSvg("plusCircle", "svg-icon-xs") : getSvg("minusCircle", "svg-icon-xs");
        }
      }
    };

    this.threadCommentsStream.querySelectorAll(".reddit-comment-collapse-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cid = btn.dataset.commentId;
        toggleCollapse(cid);
      });
    });

    this.threadCommentsStream.querySelectorAll(".reddit-thread-line-container").forEach(line => {
      line.addEventListener("click", (e) => {
        e.stopPropagation();
        const cid = line.dataset.commentId;
        toggleCollapse(cid);
      });
    });

    // Listeners de votos en respuestas
    this.threadCommentsStream.querySelectorAll(".reddit-comment-vote-arrow").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const commentId = btn.dataset.commentId;
        this.toggleVote(this.activeThreadId, true, commentId, btn);
      });
    });

    // Listeners de opciones / reporte en comentarios (•••)
    this.threadCommentsStream.querySelectorAll(".btn-comment-report").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const commentId = btn.dataset.commentId;
        const authorId = btn.dataset.authorId || "";
        const authorName = btn.dataset.authorName || "";
        const snippet = btn.dataset.snippet || "";
        this.openMoreDropdown(btn, {
          tipo: "comentario",
          id: commentId,
          autorGoogleId: authorId,
          autorNombre: authorName,
          preview: snippet,
          threadId: this.activeThreadId
        });
      });
    });

    // Listeners de respuestas inline (abrir y enviar)
    this.threadCommentsStream.querySelectorAll(".btn-comment-reply").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this.currentUser) {
          if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
          this.showToast("Iniciá sesión para responder");
          return;
        }
        const commentId = btn.dataset.commentId;
        const authorTag = btn.dataset.authorName;
        const inlineBox = document.getElementById(`inline-reply-box-${commentId}`);
        if (inlineBox) {
          const isHidden = inlineBox.style.display === "none";
          inlineBox.style.display = isHidden ? "flex" : "none";
          if (isHidden) {
            const ta = inlineBox.querySelector(".reddit-inline-textarea");
            if (ta) {
              ta.value = `@${authorTag} `;
              ta.focus();
            }
          }
        }
      });
    });

    this.threadCommentsStream.querySelectorAll(".btn-inline-cancel").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const commentId = btn.dataset.commentId;
        const inlineBox = document.getElementById(`inline-reply-box-${commentId}`);
        if (inlineBox) inlineBox.style.display = "none";
      });
    });

    this.threadCommentsStream.querySelectorAll(".btn-inline-submit").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const commentId = btn.dataset.commentId;
        const inlineBox = document.getElementById(`inline-reply-box-${commentId}`);
        if (inlineBox) {
          const ta = inlineBox.querySelector(".reddit-inline-textarea");
          const text = ta ? ta.value.trim() : "";
          if (text.length >= 2) {
            this.handlePageSubmitReply(null, text, commentId);
          } else {
            this.showToast("La respuesta es demasiado corta");
          }
        }
      });
    });

    // Listeners de moderación
    if (this.adminToken) {
      this.threadCommentsStream.querySelectorAll(".btn-reply-mod-del").forEach(btn => {
        btn.addEventListener("click", () => {
          const commentId = btn.dataset.commentId;
          this.adminDeleteComment(commentId, this.activeThreadId);
        });
      });

      this.threadCommentsStream.querySelectorAll(".btn-reply-mod-sanction").forEach(btn => {
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

  // Compatibilidad con código existente
  renderReplies(replies) {
    this.currentComments = replies || [];
    this.renderCommentsStream();
  }

  async handlePageSubmitReply(e, customContent = null, parentId = null) {
    if (e && e.preventDefault) e.preventDefault();
    if (!this.currentUser) {
      if (this.modalGoogleAuth) this.modalGoogleAuth.classList.add("active");
      this.showToast("Iniciá sesión para responder al debate");
      return;
    }

    const content = customContent !== null ? customContent.trim() : (this.replyPageContent ? this.replyPageContent.value.trim() : "");
    if (content.length < 2) {
      this.showToast("El comentario es demasiado corto");
      return;
    }

    if (this.btnSubmitReplyPage && customContent === null) {
      this.btnSubmitReplyPage.disabled = true;
      this.btnSubmitReplyPage.innerHTML = `<span>Enviando...</span>`;
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
          contenido: content,
          parentId: parentId ? parseInt(parentId, 10) : null
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        if (this.replyPageContent && customContent === null) {
          this.replyPageContent.value = "";
        }
        this.showToast("Comentario publicado");
        await this.openThread(this.activeThreadId, false); // Refrescar comentarios en pestaña
        this.loadThreads(false); // Refrescar contador en feed
      } else {
        this.showToast(json.message || "No se pudo publicar el comentario");
      }
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      this.showToast("Error de conexión al comentar");
    } finally {
      if (this.btnSubmitReplyPage) {
        this.btnSubmitReplyPage.disabled = false;
        this.btnSubmitReplyPage.innerHTML = `<span>Comentar</span>`;
      }
    }
  }

  // Compatibilidad
  async handleSubmitReply(e) {
    return this.handlePageSubmitReply(e);
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
        this.showToast("Debate creado con éxito");
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
    const targetBtn = btnEl || (!isComment ? (this.btnVoteThreadPage || this.btnVoteThread) : null);
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
        } else {
          this.userVotes.delete(key);
        }
        localStorage.setItem("comunidad_voted_threads", JSON.stringify(Array.from(this.userVotes)));

        if (isComment) {
          // Comentario: sincronizar todos los botones de este comentario en el árbol
          const commentBtns = document.querySelectorAll(`.comment-vote-btn[data-comment-id="${targetId}"], .reply-vote-btn[data-comment-id="${targetId}"]`);
          commentBtns.forEach(b => {
            b.classList.toggle("voted", voted);
            const countSpan = b.querySelector(".vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          });
        } else {
          // Hilo: sincronizar pestaña completa si está abierta
          if (this.btnVoteThreadPage && (this.activeThreadId == targetId)) {
            this.btnVoteThreadPage.classList.toggle("voted", voted);
          }
          if (this.threadPageVotes && (this.activeThreadId == targetId) && total !== undefined) {
            this.threadPageVotes.textContent = total;
          }
          if (this.btnVoteThread && (this.activeThreadId == targetId)) {
            this.btnVoteThread.classList.toggle("voted", voted);
          }
          if (this.threadModalVotes && (this.activeThreadId == targetId) && total !== undefined) {
            this.threadModalVotes.textContent = total;
          }
          // Y sincronizar tarjetas en el feed (cápsula y gutter lateral)
          const feedCapsules = document.querySelectorAll(`.reddit-vote-capsule[data-thread-id="${targetId}"]`);
          feedCapsules.forEach(cap => {
            cap.classList.toggle("voted", voted);
            const countSpan = cap.querySelector(".vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          });
          const feedGutters = document.querySelectorAll(`.reddit-post-gutter[data-thread-id="${targetId}"]`);
          feedGutters.forEach(gut => {
            gut.classList.toggle("voted", voted);
            const countSpan = gut.querySelector(".gutter-vote-count");
            if (countSpan && total !== undefined) countSpan.textContent = total;
          });
        }

        this.showToast(voted ? "Voto registrado" : "Voto retirado");
      } else {
        this.showToast(json.message || "No se pudo registrar el voto");
      }
    } catch (err) {
      console.error("Error al votar:", err);
      this.showToast("Error de conexión al votar");
    }
  }

  async shareThread(id, title) {
    const targetId = id || this.activeThreadId;
    if (!targetId) return;

    const rawTitle = title || (this.currentThread && this.currentThread.titulo) || (this.threadPageTitle && this.threadPageTitle.textContent) || "Debate de la Estudiantina";
    const cleanTitle = decodeEntities(rawTitle);
    const shareUrl = this.getThreadShareUrl(targetId);
    const shareText = `"${cleanTitle}" — Sumate al debate en el Foro de la Estudiantina de Posadas:`;

    // 1. En dispositivos móviles con Web Share API, abrir diálogo nativo del sistema
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `${cleanTitle} | Estudiantina.online`,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }

    // 2. Copiar enlace automáticamente al portapapeles
    const copied = await this.copyToClipboard(shareUrl);
    if (copied) {
      this.showToast("🔗 Enlace copiado al portapapeles");
    }

    // 3. Abrir modal enriquecido con opciones para WhatsApp, X, Telegram y copiado
    this.openShareModal(targetId, cleanTitle, shareUrl, shareText);
  }

  async reportContent(tipo, id) {
    this.openReportModal({
      tipo: tipo || "hilo",
      id: id,
      autorGoogleId: "",
      autorNombre: "",
      preview: "",
      threadId: this.activeThreadId || id
    });
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
        this.showToast(`Sesión de moderador iniciada (${this.adminUser})`);
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
        this.showToast(json.fijado === 1 ? "Hilo fijado en la cima" : "Hilo desfijado");
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
            this.showToast("Debate eliminado con éxito");
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
            this.showToast("Comentario eliminado");
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
    if (this.sanctionUserSchool) this.sanctionUserSchool.innerHTML = `${getSchoolDot(col)} ${escapeHtml(col.nombre)}`;
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
        this.showToast(json.message || "Sanción aplicada con éxito");
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
      { name: "replies", btn: this.tabBtnProfileReplies, panel: this.profileTabReplies },
      { name: "badges", btn: this.tabBtnProfileBadges, panel: this.profileTabBadges }
    ];

    tabs.forEach(t => {
      const isActive = t.name === tabName;
      if (t.btn) {
        t.btn.classList.toggle("active", isActive);
        t.btn.setAttribute("aria-selected", isActive ? "true" : "false");
      }
      if (t.panel) {
        t.panel.style.display = isActive ? (t.name === "edit" ? "block" : "flex") : "none";
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
      const m = json.metricas || { totalHilos: 0, totalComentarios: 0, karmaTotal: 0, karmaHilos: 0, karmaComentarios: 0 };
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

      // Nombre y Handle Estilo Reddit (u/usuario)
      if (this.profileUserName) {
        this.profileUserName.textContent = u.nombre || "Hincha";
      }
      if (this.profileUserHandle) {
        const handle = u.username ? `u/${u.username}` : (u.googleId ? `u/hincha_${u.googleId.slice(-4)}` : "u/hincha");
        this.profileUserHandle.textContent = handle;
        this.profileUserHandle.style.display = "inline-block";
      }

      // Badge de Moderador o Estado
      if (this.profileUserBadge) {
        if (u.rol === "admin" || u.rol === "superadmin") {
          this.profileUserBadge.innerHTML = `${getSvg("shield", "svg-icon-xs")} Moderador Oficial`;
          this.profileUserBadge.className = "reddit-flair-badge badge-mod";
          this.profileUserBadge.style.display = "inline-flex";
        } else if (u.estado === "suspendido") {
          this.profileUserBadge.textContent = "Suspendido";
          this.profileUserBadge.className = "reddit-flair-badge";
          this.profileUserBadge.style.background = "#d97706";
          this.profileUserBadge.style.display = "inline-flex";
        } else if (u.estado === "baneado") {
          this.profileUserBadge.textContent = "Baneado";
          this.profileUserBadge.className = "reddit-flair-badge";
          this.profileUserBadge.style.background = "#dc2626";
          this.profileUserBadge.style.display = "inline-flex";
        } else {
          this.profileUserBadge.style.display = "none";
        }
      }

      // Tags de Colegio, Rol Estudiantil y Año (Flairs)
      if (this.profileSchoolPill) {
        this.profileSchoolPill.innerHTML = `${getSchoolDot(col)} ${escapeHtml(col.nombre)}`;
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
            : "Este hincha aún no ha escrito una biografía en su perfil.";
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
        this.tabLabelProfileView.textContent = "Resumen";
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

      // Métricas de Karma Estilo Reddit
      if (this.profileStatKarma) this.profileStatKarma.textContent = m.karmaTotal || 0;
      if (this.profileStatKarmaThreads) this.profileStatKarmaThreads.textContent = m.karmaHilos ?? 0;
      if (this.profileStatKarmaReplies) this.profileStatKarmaReplies.textContent = m.karmaComentarios ?? 0;
      if (this.profileStatThreads) this.profileStatThreads.textContent = m.totalHilos || 0;
      if (this.profileStatReplies) this.profileStatReplies.textContent = m.totalComentarios || 0;

      // Cake Day Estudiantil ("En la tribuna desde...")
      if (this.profileCakedayText) {
        let cakeText = "En la tribuna desde la Estudiantina 2026";
        if (u.creadoEn) {
          try {
            const d = new Date(u.creadoEn);
            if (!isNaN(d.getTime())) {
              const meses = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
              ];
              cakeText = `En la tribuna desde el ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
            }
          } catch (e) {}
        }
        this.profileCakedayText.textContent = cakeText;
      }

      // Contadores en Pestañas
      if (this.profileCountTabThreads) this.profileCountTabThreads.textContent = m.totalHilos || 0;
      if (this.profileCountTabReplies) this.profileCountTabReplies.textContent = m.totalComentarios || 0;
      if (this.profileCountTabBadges) this.profileCountTabBadges.textContent = insignias.length;

      // Pestaña 1: Feed Unificado "Resumen" (Overview) Estilo Reddit
      if (this.profileOverviewList) {
        const feedItems = [
          ...hilos.map(h => ({ ...h, _tipo: "hilo", _fecha: new Date(h.creado_en).getTime() || 0 })),
          ...comentarios.map(c => ({ ...c, _tipo: "comentario", _fecha: new Date(c.creado_en).getTime() || 0 }))
        ].sort((a, b) => b._fecha - a._fecha);

        if (feedItems.length === 0) {
          this.profileOverviewList.innerHTML = `
            <div class="reddit-empty-feed">
              <span class="reddit-empty-icon">${getSvg("message", "svg-icon-lg")}</span>
              <span>Este hincha todavía no tiene actividad registrada en el foro.</span>
            </div>`;
        } else {
          this.profileOverviewList.innerHTML = feedItems.map(item => {
            if (item._tipo === "hilo") {
              return `
                <div class="reddit-post-card" data-thread-id="${item.id}">
                  <div class="reddit-post-vote-box">
                    <span class="reddit-vote-arrow">${getSvg("chevronUp", "svg-icon-xs")}</span>
                    <span>${item.votos || 0}</span>
                  </div>
                  <div class="reddit-post-main">
                    <div class="reddit-post-header">
                      <span class="reddit-channel-badge">c/${escapeHtml(this.getChannelName(item.canal_id))}</span>
                      <span>•</span>
                      <span>Publicó un debate</span>
                      <span>•</span>
                      <span>${timeAgo(item.creado_en)}</span>
                    </div>
                    <h4 class="reddit-post-title">${escapeHtml(item.titulo)}</h4>
                    <div class="reddit-post-footer">
                      <span class="reddit-footer-btn">${getSvg("message", "svg-icon-xs")} ${item.respuestas_count || 0} respuestas</span>
                      <span class="reddit-footer-btn">${getSvg("externalLink", "svg-icon-xs")} Ver debate</span>
                    </div>
                  </div>
                </div>`;
            } else {
              return `
                <div class="reddit-comment-card" data-thread-id="${item.hilo_id}">
                  <div class="reddit-comment-meta">
                    <span>${getSvg("message", "svg-icon-xs")} Comentó en</span>
                    <span class="reddit-comment-thread-ref">${escapeHtml(item.hilo_titulo || "Debate #" + item.hilo_id)}</span>
                    <span>•</span>
                    <span>${timeAgo(item.creado_en)}</span>
                  </div>
                  <p class="reddit-comment-body">${escapeHtml(item.contenido)}</p>
                  <div class="reddit-comment-footer">
                    <span>${getSvg("chevronUp", "svg-icon-xs")} ${item.votos || 0} votos</span>
                    <span>•</span>
                    <span style="color:var(--accent-primary);">Ver en el debate</span>
                  </div>
                </div>`;
            }
          }).join("");

          this.profileOverviewList.querySelectorAll("[data-thread-id]").forEach(card => {
            card.addEventListener("click", () => {
              const threadId = card.dataset.threadId;
              this.closeUserProfileModal();
              this.openThread(threadId);
            });
          });
        }
      }

      // Pestaña 2: Debates Creados Estilo Reddit
      if (this.profileThreadsList) {
        if (hilos.length === 0) {
          this.profileThreadsList.innerHTML = `
            <div class="reddit-empty-feed">
              <span class="reddit-empty-icon">${getSvg("message", "svg-icon-lg")}</span>
              <span>No ha publicado debates todavía.</span>
            </div>`;
        } else {
          this.profileThreadsList.innerHTML = hilos.map(h => `
            <div class="reddit-post-card" data-thread-id="${h.id}">
              <div class="reddit-post-vote-box">
                <span class="reddit-vote-arrow">${getSvg("chevronUp", "svg-icon-xs")}</span>
                <span>${h.votos || 0}</span>
              </div>
              <div class="reddit-post-main">
                <div class="reddit-post-header">
                  <span class="reddit-channel-badge">c/${escapeHtml(this.getChannelName(h.canal_id))}</span>
                  <span>•</span>
                  <span>${timeAgo(h.creado_en)}</span>
                </div>
                <h4 class="reddit-post-title">${escapeHtml(h.titulo)}</h4>
                <div class="reddit-post-footer">
                  <span class="reddit-footer-btn">${getSvg("message", "svg-icon-xs")} ${h.respuestas_count || 0} respuestas</span>
                  <span class="reddit-footer-btn">${getSvg("externalLink", "svg-icon-xs")} Ver debate</span>
                </div>
              </div>
            </div>
          `).join("");

          this.profileThreadsList.querySelectorAll(".reddit-post-card").forEach(item => {
            item.addEventListener("click", () => {
              const threadId = item.dataset.threadId;
              this.closeUserProfileModal();
              this.openThread(threadId);
            });
          });
        }
      }

      // Pestaña 3: Comentarios / Respuestas Estilo Reddit
      if (this.profileRepliesList) {
        if (comentarios.length === 0) {
          this.profileRepliesList.innerHTML = `
            <div class="reddit-empty-feed">
              <span class="reddit-empty-icon">${getSvg("message", "svg-icon-lg")}</span>
              <span>No ha participado en comentarios todavía.</span>
            </div>`;
        } else {
          this.profileRepliesList.innerHTML = comentarios.map(c => `
            <div class="reddit-comment-card" data-thread-id="${c.hilo_id}">
              <div class="reddit-comment-meta">
                <span>${getSvg("message", "svg-icon-xs")} Comentó en</span>
                <span class="reddit-comment-thread-ref">${escapeHtml(c.hilo_titulo || "Debate #" + c.hilo_id)}</span>
                <span>•</span>
                <span>${timeAgo(c.creado_en)}</span>
              </div>
              <p class="reddit-comment-body">${escapeHtml(c.contenido)}</p>
              <div class="reddit-comment-footer">
                <span>${getSvg("chevronUp", "svg-icon-xs")} ${c.votos || 0} votos</span>
                <span>•</span>
                <span style="color:var(--accent-primary);">Ver en el debate</span>
              </div>
            </div>
          `).join("");

          this.profileRepliesList.querySelectorAll(".reddit-comment-card").forEach(item => {
            item.addEventListener("click", () => {
              const threadId = item.dataset.threadId;
              this.closeUserProfileModal();
              this.openThread(threadId);
            });
          });
        }
      }

      // Pestaña 4: Vitrina de Trofeos Estilo Reddit (Trophy Case)
      if (this.profileBadgesList) {
        if (insignias.length === 0) {
          this.profileBadgesList.innerHTML = `
            <div class="reddit-empty-feed" style="grid-column: 1 / -1;">
              <span class="reddit-empty-icon">${getSvg("award", "svg-icon-lg")}</span>
              <span>Aún no ha obtenido trofeos culturales de la Estudiantina. ¡Participá en los debates y sumá votos para desbloquearlos!</span>
            </div>`;
        } else {
          this.profileBadgesList.innerHTML = insignias.map(b => `
            <div class="reddit-trophy-card" title="${escapeHtml(b.desc)}" style="border-color: ${b.color || "var(--border-subtle)"};">
              <div class="reddit-trophy-icon" style="background: ${b.color ? b.color + '18' : 'var(--bg-elevated)'};">${getSvg("award", "svg-icon-md")}</div>
              <div class="reddit-trophy-info">
                <span class="reddit-trophy-title">${escapeHtml(b.titulo)}</span>
                <span class="reddit-trophy-desc">${escapeHtml(b.desc)}</span>
              </div>
            </div>
          `).join("");
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
        this.currentUser = { ...this.currentUser, ...json.usuario };
        UsuarioService.setUser(this.currentUser);

        this._pendingEditPhoto = null;
        this._restoreGoogleAvatar = false;

        if (this.currentUser.colegioId) {
          this.applySchoolTheme(this.currentUser.colegioId);
        }

        this.updateUserBar();
        this.showToast("Perfil actualizado con éxito");

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
