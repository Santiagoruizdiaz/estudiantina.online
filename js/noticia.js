/**
 * JAVASCRIPT DE PÁGINA COMPLETA DE NOTICIA — ESTUDIANTINA ONLINE
 * Gestión del artículo individual, pestañas, galería, barra de lectura, lightbox y modo admin.
 */

import { COLEGIOS } from "./colegios.js";
import { UsuarioService } from "./usuario.js";

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
    if (diffMs < 0) return "Ahora";
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

class NoticiaPageApp {
  constructor() {
    this.articleId = this.extractArticleId();
    this.data = null;
    this.article = null;
    this.adminToken = localStorage.getItem("comunidad_admin_token") || null;

    // Sesión única centralizada y datos del debate
    this.currentUser = UsuarioService.getUser();
    UsuarioService.onChange(user => {
      this.currentUser = user;
      if (this.hiloData) {
        this.renderCommentsSection();
      }
    });
    this.hiloData = null;
    this.comentarios = [];
    this.isSubmittingComment = false;

    this.cacheDom();
    this.initEvents();
    this.loadData();
  }

  extractArticleId() {
    const params = new URLSearchParams(window.location.search);
    const urlToken = (params.get("token") || params.get("admin_token") || params.get("admin") || "").trim();
    if (urlToken) {
      this.adminToken = urlToken;
      localStorage.setItem("comunidad_admin_token", urlToken);
      params.delete("token");
      params.delete("admin_token");
      params.delete("admin");
      const newSearch = params.toString() ? `?${params.toString()}` : "";
      window.history.replaceState({}, document.title, window.location.pathname + newSearch + window.location.hash);
    }
    let id = params.get("id");
    if (!id && window.location.hash) {
      id = window.location.hash.replace(/^#/, "");
    }
    return id;
  }

  cacheDom() {
    // Layout & Progress
    this.progressBar        = document.getElementById("noticia-progress-bar");
    this.loadingState       = document.getElementById("noticia-loading-state");
    this.articleContent     = document.getElementById("noticia-article-content");

    // Breadcrumbs
    this.breadcrumbCat      = document.getElementById("noticia-breadcrumb-cat");
    this.breadcrumbTitle    = document.getElementById("noticia-breadcrumb-title");

    // Header & Meta
    this.subnavCat          = document.getElementById("noticia-subnav-cat");
    this.headerDate         = document.getElementById("header-date");
    this.btnFooterBackToTop = document.getElementById("btn-footer-back-to-top");
    this.catPill            = document.getElementById("noticia-cat-pill");
    this.breakingPill       = document.getElementById("noticia-breaking-pill");
    this.headline           = document.getElementById("noticia-headline");
    this.leadParagraph      = document.getElementById("noticia-lead");
    this.authorAvatar       = document.getElementById("noticia-author-avatar");
    this.authorName         = document.getElementById("noticia-author-name");
    this.authorMeta         = document.getElementById("noticia-author-meta");

    // Cover
    this.coverFigure        = document.getElementById("noticia-cover-figure");
    this.coverImg           = document.getElementById("noticia-cover-img");
    this.coverCaption       = document.getElementById("noticia-cover-caption");

    // Tabs
    this.tabButtons         = document.querySelectorAll(".noticia-tab-btn");
    this.tabPanels          = document.querySelectorAll(".noticia-tab-panel");
    this.tabGalleryCount    = document.getElementById("noticia-tab-gallery-count");

    // Content Body & Tags
    this.bodyEditorial      = document.getElementById("noticia-body-editorial");
    this.tagsList           = document.getElementById("noticia-tags-list");
    this.galleryGrid        = document.getElementById("noticia-gallery-grid");
    this.tabRelatedGrid     = document.getElementById("noticia-tab-related-grid");
    this.bottomRelatedGrid  = document.getElementById("noticia-bottom-related-grid");

    // Share buttons
    this.btnNavShare        = document.getElementById("btn-noticia-nav-share");
    this.btnShareWhatsapp   = document.getElementById("btn-share-whatsapp");
    this.btnShareX          = document.getElementById("btn-share-x");
    this.btnShareCopy       = document.getElementById("btn-share-copy");
    this.btnMobileWhatsapp  = document.getElementById("btn-mobile-whatsapp");
    this.btnMobileShare     = document.getElementById("btn-mobile-share");
    this.btnMobileTop       = document.getElementById("btn-mobile-top");

    // Admin buttons
    this.btnAdminEdit       = document.getElementById("btn-noticia-admin-edit");
    this.btnAdminDel        = document.getElementById("btn-noticia-admin-del");

    // Lightbox
    this.lightbox           = document.getElementById("noticia-lightbox");
    this.lightboxImg        = document.getElementById("noticia-lightbox-img");
    this.lightboxCaption    = document.getElementById("noticia-lightbox-caption");
    this.btnCloseLightbox   = document.getElementById("btn-close-lightbox");

    // Toast
    this.toastNotification  = document.getElementById("toast-notification");

    // Foro y Comentarios Integrados
    this.tabCommentsCount       = document.getElementById("noticia-tab-comments-count");
    this.inlineCommentsSection  = document.getElementById("noticia-inline-comments-section");
    this.tabCommentsSection     = document.getElementById("noticia-tab-comments-section");
  }

  initEvents() {
    // Barra de lectura (scroll progress)
    window.addEventListener("scroll", () => this.updateReadingProgress(), { passive: true });

    // Fecha en vivo
    if (this.headerDate) {
      try {
        const now = new Date();
        const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const raw = now.toLocaleDateString('es-AR', opts);
        this.headerDate.textContent = raw.charAt(0).toUpperCase() + raw.slice(1);
      } catch(e) {}
    }

    // Volver arriba en footer
    if (this.btnFooterBackToTop) {
      this.btnFooterBackToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Pestañas
    this.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabKey = btn.dataset.tab;
        this.switchTab(tabKey);
      });
    });

    // Compartir nativo
    const triggerNativeShare = () => {
      const title = this.article ? this.article.titulo : document.title;
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title, text: `${title} — Leé la nota completa en estudiantina.online`, url }).catch(() => {});
      } else {
        this.copyUrlToClipboard();
      }
    };

    if (this.btnNavShare)    this.btnNavShare.addEventListener("click", triggerNativeShare);
    if (this.btnMobileShare) this.btnMobileShare.addEventListener("click", triggerNativeShare);

    // Copiar enlace
    if (this.btnShareCopy) {
      this.btnShareCopy.addEventListener("click", () => this.copyUrlToClipboard());
    }

    // Scroll al inicio (mobile)
    if (this.btnMobileTop) {
      this.btnMobileTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Lightbox cerrar
    if (this.btnCloseLightbox) {
      this.btnCloseLightbox.addEventListener("click", () => this.closeLightbox());
    }
    if (this.lightbox) {
      this.lightbox.addEventListener("click", (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.lightbox && this.lightbox.classList.contains("active")) {
        this.closeLightbox();
      }
    });

    // Delegación de clics en fotos del cuerpo para abrir en Lightbox
    if (this.bodyEditorial) {
      this.bodyEditorial.addEventListener("click", (e) => {
        const img = e.target.closest(".noticia-inline-image-block img");
        if (img) {
          const caption = img.parentElement.querySelector(".noticia-inline-caption")?.textContent || "";
          this.openLightbox(img.src, caption);
        }
      });
    }

    // Portada click -> Lightbox
    if (this.coverImg) {
      this.coverImg.style.cursor = "zoom-in";
      this.coverImg.addEventListener("click", () => {
        if (this.coverImg.src) {
          const cap = this.coverCaption ? this.coverCaption.textContent : "";
          this.openLightbox(this.coverImg.src, cap);
        }
      });
    }

    // Botones Admin
    if (this.adminToken) {
      if (this.btnAdminEdit) {
        this.btnAdminEdit.style.display = "inline-flex";
        this.btnAdminEdit.addEventListener("click", () => {
          if (this.article) {
            window.location.href = `index.html?editNews=${encodeURIComponent(this.article.id)}`;
          }
        });
      }
      if (this.btnAdminDel) {
        this.btnAdminDel.style.display = "inline-flex";
        this.btnAdminDel.addEventListener("click", () => this.confirmDeleteArticle());
      }
    }
  }

  async loadData() {
    const endpoints = ["/api/comunidad", "api/comunidad.php", "data/comunidad.json"];
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { cache: "no-store" });
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json") || ep.endsWith(".json")) {
            const parsed = await res.json();
            if (parsed && Array.isArray(parsed.noticias)) {
              this.data = parsed;
              break;
            }
          }
        }
      } catch (err) {
        // Continuar al siguiente fallback
      }
    }
    if (!this.data) {
      console.error("Error definitivo cargando datos de noticias.");
    }

    this.renderArticle();
  }

  renderArticle() {
    const noticias = this.data?.noticias || [];
    if (noticias.length === 0) {
      this.renderNotFound("No hay noticias disponibles en este momento.");
      return;
    }

    // Buscar artículo por ID o usar el primero
    let art = null;
    if (this.articleId) {
      art = noticias.find(n => String(n.id) === String(this.articleId));
    }
    if (!art) {
      art = noticias[0]; // Noticia más reciente
      if (art) this.articleId = art.id;
    }

    if (!art) {
      this.renderNotFound("El artículo solicitado no existe o fue retirado.");
      return;
    }

    this.article = art;

    // Actualizar Título y Metadatos de la Pestaña del Navegador
    document.title = `${art.titulo} | Estudiantina de Posadas`;
    const ogTitle = document.getElementById("og-title");
    const ogDesc  = document.getElementById("og-desc");
    const ogImage = document.getElementById("og-image");
    if (ogTitle) ogTitle.content = `${art.titulo} | Estudiantina Online`;
    if (ogDesc)  ogDesc.content  = art.resumen || "";
    if (ogImage && (art.imagen || art.imagenUrl)) ogImage.content = art.imagen || art.imagenUrl;

    // Breadcrumbs
    if (this.breadcrumbCat) {
      this.breadcrumbCat.textContent = art.categoria || "Noticias";
      this.breadcrumbCat.href = `index.html?cat=${encodeURIComponent(art.categoria || '')}`;
    }
    if (this.breadcrumbTitle) {
      this.breadcrumbTitle.textContent = art.titulo;
    }

    // Header
    if (this.subnavCat) {
      this.subnavCat.textContent = art.categoria || "Noticia";
    }
    if (this.catPill) {
      this.catPill.textContent = art.categoria || "Noticias";
    }
    if (this.breakingPill) {
      if (art.badge) {
        this.breakingPill.textContent = art.badge;
        this.breakingPill.style.display = "inline-block";
      } else {
        this.breakingPill.style.display = "none";
      }
    }

    if (this.headline) this.headline.textContent = art.titulo;
    if (this.leadParagraph) this.leadParagraph.textContent = art.resumen || "";

    // Byline
    if (this.authorName) this.authorName.textContent = art.autor || "Redacción Oficial";
    if (this.authorMeta) {
      const lectura = art.tiempoLectura || "3 min de lectura";
      this.authorMeta.textContent = `Publicado el ${art.fecha} · ⏱️ ${lectura} · Posadas, Misiones`;
    }

    // Portada
    const coverUrl = art.imagen || art.imagenUrl;
    if (coverUrl && this.coverFigure && this.coverImg) {
      this.coverImg.src = coverUrl;
      this.coverImg.alt = art.titulo;
      this.coverFigure.style.display = "block";
    } else if (this.coverFigure) {
      this.coverFigure.style.display = "none";
    }

    // Enlaces de compartir directo
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(`${art.titulo} — Leé la nota completa: `);
    if (this.btnShareWhatsapp) {
      this.btnShareWhatsapp.href = `https://api.whatsapp.com/send?text=${shareTitle}${shareUrl}`;
    }
    if (this.btnMobileWhatsapp) {
      this.btnMobileWhatsapp.href = `https://api.whatsapp.com/send?text=${shareTitle}${shareUrl}`;
    }
    if (this.btnShareX) {
      this.btnShareX.href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;
    }

    // Renderizar Bloques Editoriales
    this.renderBlocks(art);

    // Tags
    if (this.tagsList) {
      const tags = Array.isArray(art.tags) ? art.tags : [];
      if (tags.length > 0) {
        this.tagsList.innerHTML = tags.map(t =>
          `<a href="index.html?search=${encodeURIComponent(t)}" class="noticia-tag-item">#${t}</a>`
        ).join("");
      } else {
        const box = document.getElementById("noticia-tags-box");
        if (box) box.style.display = "none";
      }
    }

    // Pestaña Galería de Fotos
    this.renderGallery(art);

    // Noticias Relacionadas (en pestaña y al pie)
    this.renderRelatedNews(art, noticias);

    // Mostrar contenido y ocultar spinner
    if (this.loadingState)   this.loadingState.style.display = "none";
    if (this.articleContent) this.articleContent.style.display = "block";

    // Cargar debate e integración del foro para la noticia
    this.loadForumThread();
  }

  renderBlocks(art) {
    if (!this.bodyEditorial) return;

    let bloques = art.bloques;
    if (!bloques || !Array.isArray(bloques) || bloques.length === 0) {
      const contenido = Array.isArray(art.contenido) ? art.contenido : [art.resumen || ""];
      bloques = contenido.map(p => ({ type: "text", value: p }));
    }

    const html = bloques.map(block => {
      if (block.type === "image" && block.value) {
        const captionHtml = block.caption
          ? `<figcaption class="noticia-inline-caption">📷 ${block.caption}</figcaption>`
          : "";
        return `
          <figure class="noticia-inline-image-block">
            <img src="${block.value}" alt="${block.caption || 'Fotografía de la nota'}" loading="lazy">
            ${captionHtml}
          </figure>`;
      }
      if (block.type === "quote" && block.value) {
        return `<blockquote class="noticia-pullquote-block">${block.value}</blockquote>`;
      }
      if (block.type === "text" && block.value) {
        const cleanText = block.value.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
        return `<p>${cleanText}</p>`;
      }
      return "";
    }).join("");

    this.bodyEditorial.innerHTML = html;
  }

  renderGallery(art) {
    if (!this.galleryGrid) return;

    const images = [];
    const coverUrl = art.imagen || art.imagenUrl;
    if (coverUrl) {
      images.push({ src: coverUrl, caption: "Fotografía de Portada" });
    }

    const bloques = Array.isArray(art.bloques) ? art.bloques : [];
    bloques.forEach((b, i) => {
      if (b.type === "image" && b.value) {
        images.push({ src: b.value, caption: b.caption || `Fotografía del evento #${i + 1}` });
      }
    });

    if (this.tabGalleryCount) {
      this.tabGalleryCount.textContent = images.length;
      this.tabGalleryCount.style.display = images.length > 0 ? "inline-block" : "none";
    }

    if (images.length === 0) {
      this.galleryGrid.innerHTML = `
        <div class="noticia-gallery-empty" style="grid-column: 1 / -1;">
          <p>Esta noticia no posee imágenes adicionales en la galería.</p>
        </div>`;
      return;
    }

    this.galleryGrid.innerHTML = images.map(img => `
      <div class="noticia-gallery-item" data-src="${img.src}" data-caption="${(img.caption || '').replace(/"/g, '&quot;')}">
        <img src="${img.src}" alt="${img.caption}" loading="lazy">
        ${img.caption ? `<div class="noticia-gallery-item-caption">${img.caption}</div>` : ""}
      </div>
    `).join("");

    // Clic en foto de la galería -> abrir Lightbox
    this.galleryGrid.querySelectorAll(".noticia-gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        this.openLightbox(item.dataset.src, item.dataset.caption);
      });
    });
  }

  renderRelatedNews(currentArt, allNews) {
    const related = allNews
      .filter(n => n.id !== currentArt.id)
      .slice(0, 3);

    const makeCardHtml = (n) => {
      const img = n.imagen || n.imagenUrl || "assets/noticias/noticia-01.webp";
      return `
        <a href="noticia.html?id=${n.id}" class="noticia-related-card">
          <div class="noticia-related-thumb-wrap">
            <img src="${img}" alt="${(n.titulo || '').replace(/"/g, '&quot;')}" loading="lazy">
          </div>
          <div class="noticia-related-content">
            <span class="noticia-related-cat">${n.categoria}</span>
            <h4 class="noticia-related-heading">${n.titulo}</h4>
            <span class="noticia-related-footer">📅 ${n.fecha} · ⏱️ ${n.tiempoLectura || '3 min'}</span>
          </div>
        </a>
      `;
    };

    if (this.tabRelatedGrid) {
      this.tabRelatedGrid.innerHTML = related.length > 0
        ? related.map(makeCardHtml).join("")
        : `<p style="color:var(--text-muted); grid-column:1/-1;">No hay más noticias disponibles en esta sección.</p>`;
    }

    if (this.bottomRelatedGrid) {
      this.bottomRelatedGrid.innerHTML = related.length > 0
        ? related.map(makeCardHtml).join("")
        : `<p style="color:var(--text-muted); grid-column:1/-1;">Próximamente más coberturas.</p>`;
    }
  }

  switchTab(tabKey) {
    this.tabButtons.forEach(btn => {
      const isActive = btn.dataset.tab === tabKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const targetPanel = document.getElementById(`noticia-tab-${tabKey}`);
    this.tabPanels.forEach(p => p.classList.remove("active"));
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  }

  updateReadingProgress() {
    if (!this.progressBar) return;
    const { scrollY, innerHeight } = window;
    const fullHeight = document.documentElement.scrollHeight - innerHeight;
    if (fullHeight <= 0) return;
    const progress = (scrollY / fullHeight) * 100;
    this.progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  }

  openLightbox(src, caption = "") {
    if (!this.lightbox || !this.lightboxImg) return;
    this.lightboxImg.src = src;
    if (this.lightboxCaption) this.lightboxCaption.textContent = caption;
    this.lightbox.classList.add("active");
    this.lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove("active");
    this.lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (this.lightboxImg) this.lightboxImg.src = "";
  }

  copyUrlToClipboard() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast("🔗 Enlace de la noticia copiado al portapapeles");
      }).catch(() => {
        this.showToast("Copiá este enlace: " + url);
      });
    } else {
      this.showToast("Copiá este enlace: " + url);
    }
  }

  showToast(msg) {
    if (!this.toastNotification) return;
    this.toastNotification.textContent = msg;
    this.toastNotification.classList.add("active");
    setTimeout(() => this.toastNotification.classList.remove("active"), 3200);
  }

  async confirmDeleteArticle() {
    if (!this.article) return;
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente la noticia "${this.article.titulo}"?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin?action=borrar_noticia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.adminToken}`
        },
        body: JSON.stringify({ id: this.article.id })
      });
      const data = await res.json();
      if (data.status === "ok") {
        this.showToast("Noticia eliminada exitosamente. Redirigiendo a Portal...");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        this.showToast(data.message || "Error al eliminar noticia");
      }
    } catch (err) {
      console.error("Error al borrar noticia:", err);
      this.showToast("Error de conexión con el servidor.");
    }
  }

  // =========================================================================
  // INTEGRACIÓN DEL FORO Y GESTIÓN DE COMENTARIOS
  // =========================================================================

  getColegio(id) {
    const defaultColegio = {
      id: "janssen",
      nombre: "El Janssen",
      escudo: "⚙️",
      colores: { primary: "#1d4ed8" }
    };
    if (!id) return defaultColegio;
    return COLEGIOS.find(c => c.id === id) || defaultColegio;
  }

  async loadForumThread() {
    if (!this.articleId) return;
    const googleId = this.currentUser?.googleId || "";
    try {
      const res = await fetch(`/api/foro?action=noticia_hilo&noticiaId=${encodeURIComponent(this.articleId)}&googleId=${encodeURIComponent(googleId)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === "ok") {
          this.hiloData = json.hilo;
          this.comentarios = json.comentarios || [];
          this.updateCommentsBadge();
          this.renderCommentsWidget();
        }
      }
    } catch (err) {
      console.warn("No se pudo cargar el debate del foro para la noticia:", err);
    }
  }

  updateCommentsBadge() {
    if (!this.tabCommentsCount) return;
    const count = this.comentarios.length;
    this.tabCommentsCount.textContent = count;
    this.tabCommentsCount.style.display = count > 0 ? "inline-block" : "none";
  }

  renderCommentsWidget() {
    const buildHtml = (sectionKey) => {
      const hiloUrl = this.hiloData ? `foro.html?id=${this.hiloData.id}` : `foro.html`;
      const isLogged = !!this.currentUser;
      const userCol = isLogged ? this.getColegio(this.currentUser.colegioId) : null;

      // Opciones de colegios para el selector
      const colegiosOptions = COLEGIOS.map(c => `<option value="${c.id}" ${isLogged && this.currentUser.colegioId === c.id ? "selected" : ""}>${c.escudo || "🥁"} ${c.nombre}</option>`).join("");

      // Header del bloque
      const headerHtml = `
        <div class="noticia-comments-header">
          <div class="noticia-comments-header-left">
            <span class="noticia-comments-icon">💬</span>
            <div>
              <h3 class="noticia-comments-title">Debate en la Comunidad</h3>
              <p class="noticia-comments-subtitle">Comentarios oficiales sincronizados en tiempo real con el Foro</p>
            </div>
          </div>
          <a href="${hiloUrl}" class="noticia-comments-forum-link" target="_blank" rel="noopener noreferrer">
            <span>Abrir en el Foro</span>
            <span>↗</span>
          </a>
        </div>
      `;

      // Bloque de formulario / login
      let formHtml = "";
      if (isLogged) {
        formHtml = `
          <div class="noticia-comment-form-wrap">
            <div class="noticia-comment-user-header">
              <div class="noticia-comment-user-info">
                <img src="${this.currentUser.avatarUrl}" alt="Avatar" class="noticia-comment-user-avatar">
                <span class="noticia-comment-user-name">${escapeHtml(this.currentUser.nombre)}</span>
                <span class="noticia-comment-school-badge">${userCol.escudo || "🥁"} ${userCol.nombre}</span>
              </div>
              <div class="noticia-school-selector-wrap">
                <select class="noticia-select-school" aria-label="Cambiar colegio">
                  ${colegiosOptions}
                </select>
              </div>
            </div>
            <textarea class="noticia-comment-textarea" placeholder="Escribí tu comentario sobre esta cobertura (respetando la fraternidad estudiantil)..." maxlength="1500"></textarea>
            <div class="noticia-comment-form-actions">
              <span class="noticia-comment-hint">💡 Tu comentario será visible aquí y en el Foro</span>
              <button type="button" class="btn-noticia-submit-comment">
                <span>Publicar Comentario 🚀</span>
              </button>
            </div>
          </div>
        `;
      } else {
        formHtml = `
          <div class="noticia-comment-login-card">
            <div class="noticia-login-info">
              <span class="noticia-login-icon">🥁</span>
              <div class="noticia-login-text">
                <h4>Sumate al debate de esta noticia</h4>
                <p>Iniciá sesión con tu cuenta de Google para opinar y representar a tu colegio en los comentarios.</p>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button type="button" class="btn-noticia-google-login">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Ingresar con Google</span>
              </button>
              <button type="button" class="btn-noticia-quick-login" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 14px; border-radius:var(--r-pill); font-size:0.82rem; font-weight:700; cursor:pointer;">
                <span>Acceso Rápido Colegial ⚡</span>
              </button>
            </div>
          </div>
        `;
      }

      // Lista de comentarios
      let listHtml = "";
      if (this.comentarios.length === 0) {
        listHtml = `
          <div class="noticia-comments-empty">
            <span class="noticia-comments-empty-icon">💬</span>
            <p style="font-weight:700; color:#fff; margin-bottom:0.25rem;">Aún no hay comentarios en esta noticia</p>
            <p style="font-size:0.82rem;">¡Sé el primero en compartir tu opinión como hincha de tu colegio!</p>
          </div>
        `;
      } else {
        const cardsHtml = this.comentarios.map(c => {
          const col = this.getColegio(c.colegio_id);
          const hasVoted = Number(c.user_voted) === 1;
          const votosCount = Number(c.votos || 0);
          const rawUser = c.autor_username || (c.autor_nombre ? c.autor_nombre.toLowerCase().replace(/\s+/g, "_") : "hincha");
          const displayHandle = `u/${rawUser}`;
          return `
            <article class="noticia-comment-card" data-comment-id="${c.id}">
              <div class="noticia-comment-card-header">
                <div class="noticia-comment-author-box">
                  <a href="foro.html?user=${encodeURIComponent(c.autor_google_id)}" title="Ver perfil de ${displayHandle}">
                    <img src="${c.autor_avatar || 'assets/avatar-default.webp'}" alt="${escapeHtml(c.autor_nombre || 'Hincha')}" class="noticia-comment-author-avatar" onerror="this.src='assets/avatar-default.webp'">
                  </a>
                  <div>
                    <a href="foro.html?user=${encodeURIComponent(c.autor_google_id)}" class="noticia-comment-author-name" style="color:inherit; text-decoration:none; font-weight:700;">${displayHandle}</a>
                    <span class="noticia-comment-school-badge" style="margin-left:5px;">${col.escudo || "🥁"} ${col.nombre}</span>
                  </div>
                </div>
                <span class="noticia-comment-date">${timeAgo(c.creado_en)}</span>
              </div>
              <div class="noticia-comment-body">
                ${escapeHtml(c.contenido).replace(/\n/g, '<br>')}
              </div>
              <div class="noticia-comment-footer">
                <button type="button" class="noticia-vote-pill ${hasVoted ? 'has-voted' : ''}" data-comment-id="${c.id}">
                  <span>▲</span>
                  <span class="vote-count">${votosCount}</span>
                </button>
                <button type="button" class="noticia-report-btn" data-comment-id="${c.id}">
                  <span>🚩 Reportar</span>
                </button>
              </div>
            </article>
          `;
        }).join("");

        listHtml = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span style="font-weight:800; font-size:0.92rem; color:#fff;">Comentarios (${this.comentarios.length})</span>
          </div>
          <div class="noticia-comments-list">
            ${cardsHtml}
          </div>
        `;
      }

      return `${headerHtml}${formHtml}${listHtml}`;
    };

    // Inyectar en ambos contenedores
    const targets = [this.inlineCommentsSection, this.tabCommentsSection].filter(Boolean);
    targets.forEach(container => {
      container.innerHTML = buildHtml(container.id);
      this.attachCommentsEvents(container);
    });
  }

  attachCommentsEvents(container) {
    if (!container) return;

    // Botón de Google Login
    const btnGoogle = container.querySelector(".btn-noticia-google-login");
    if (btnGoogle) {
      btnGoogle.addEventListener("click", () => this.handleGoogleLogin());
    }

    // Botón de Acceso Rápido
    const btnQuick = container.querySelector(".btn-noticia-quick-login");
    if (btnQuick) {
      btnQuick.addEventListener("click", () => this.quickLogin());
    }

    // Selector de colegio
    const selectSchool = container.querySelector(".noticia-select-school");
    if (selectSchool && this.currentUser) {
      selectSchool.addEventListener("change", (e) => {
        this.currentUser.colegioId = e.target.value;
        this.saveUser(this.currentUser);
      });
    }

    // Envío de comentario
    const btnSubmit = container.querySelector(".btn-noticia-submit-comment");
    const textarea = container.querySelector(".noticia-comment-textarea");
    if (btnSubmit && textarea) {
      btnSubmit.addEventListener("click", () => {
        const text = textarea.value.trim();
        const school = selectSchool ? selectSchool.value : (this.currentUser?.colegioId || "janssen");
        this.submitComment(text, school, btnSubmit, textarea);
      });
    }

    // Votos en comentarios
    container.querySelectorAll(".noticia-vote-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const commentId = parseInt(pill.dataset.commentId, 10);
        this.toggleVote(commentId, pill);
      });
    });

    // Reportes
    container.querySelectorAll(".noticia-report-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const commentId = parseInt(btn.dataset.commentId, 10);
        this.reportComment(commentId, btn);
      });
    });
  }

  async handleGoogleLogin() {
    // Si ya está logueado en otra pestaña/página, sincronizar
    const current = UsuarioService.getUser();
    if (current) {
      this.currentUser = current;
      this.loadForumThread();
      return;
    }
    // Redirigir al portal del foro para login seguro oficial
    window.location.href = `foro.html?login=1&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
  }

  quickLogin() {
    this.handleGoogleLogin();
  }

  async saveUser(user) {
    this.currentUser = user;
    UsuarioService.setUser(user);
    const col = this.getColegio(user.colegioId);
    this.showToast(`¡Conectado como ${user.nombre} (${col.nombre})!`);

    try {
      await fetch("/api/foro?action=auth_google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
    } catch (e) {}

    this.loadForumThread();
  }

  async submitComment(text, schoolId, submitBtn, textareaEl) {
    if (!this.currentUser) {
      this.showToast("Iniciá sesión con Google para comentar");
      return;
    }
    if (!text || text.length < 3) {
      this.showToast("El comentario debe tener al menos 3 caracteres");
      return;
    }
    if (!this.hiloData) {
      this.showToast("Cargando el hilo del debate, aguardá un instante...");
      return;
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Publicando...";
      }

      const res = await fetch("/api/foro?action=comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiloId: this.hiloData.id,
          contenido: text,
          googleId: this.currentUser.googleId,
          autorNombre: this.currentUser.nombre,
          autorAvatar: this.currentUser.avatarUrl,
          colegioId: schoolId || this.currentUser.colegioId || "janssen"
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        this.showToast("💬 ¡Comentario publicado con éxito!");
        if (textareaEl) textareaEl.value = "";
        await this.loadForumThread();
      } else {
        this.showToast(json.message || "Error al publicar comentario");
      }
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      this.showToast("Error de conexión al publicar comentario");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Publicar Comentario 🚀";
      }
    }
  }

  async toggleVote(commentId, buttonEl) {
    if (!this.currentUser) {
      this.showToast("Iniciá sesión para votar comentarios");
      return;
    }
    if (!commentId) return;

    try {
      const res = await fetch("/api/foro?action=votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "comentario",
          itemId: commentId,
          googleId: this.currentUser.googleId
        })
      });

      const json = await res.json();
      if (json.status === "ok") {
        const hasVoted = !!json.voted;
        const newVotes = json.votos;

        // Actualizar en el estado en memoria
        const c = this.comentarios.find(item => item.id === commentId);
        if (c) {
          c.user_voted = hasVoted ? 1 : 0;
          c.votos = newVotes;
        }

        // Actualizar en los botones de ambos contenedores
        document.querySelectorAll(`.noticia-vote-pill[data-comment-id="${commentId}"]`).forEach(el => {
          el.classList.toggle("has-voted", hasVoted);
          const countEl = el.querySelector(".vote-count");
          if (countEl) countEl.textContent = newVotes;
        });

        this.showToast(hasVoted ? "▲ ¡Voto registrado!" : "Voto retirado");
      }
    } catch (err) {
      console.error("Error al votar:", err);
      this.showToast("Error al registrar voto");
    }
  }

  async reportComment(commentId, buttonEl) {
    if (!commentId) return;
    if (!confirm("¿Deseas reportar este comentario por contenido inapropiado?")) return;

    try {
      const res = await fetch("/api/foro?action=reportar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "comentario",
          itemId: commentId
        })
      });
      const json = await res.json();
      if (json.status === "ok") {
        this.showToast("🚩 Comentario reportado. Nuestro equipo lo moderará.");
        if (buttonEl) {
          buttonEl.disabled = true;
          buttonEl.textContent = "Reportado";
        }
      }
    } catch (err) {
      this.showToast("Error al enviar reporte");
    }
  }

  renderNotFound(msg) {
    if (this.loadingState) this.loadingState.style.display = "none";
    if (this.articleContent) this.articleContent.style.display = "none";
    const main = document.querySelector(".noticia-article-container");
    if (main) {
      main.innerHTML = `
        <div style="text-align:center; padding:5rem 1rem;">
          <span style="font-size:3.5rem; display:block; margin-bottom:1rem;">🗞️</span>
          <h2 style="font-family:var(--font-display); font-size:2rem; color:var(--text-white); margin-bottom:0.75rem;">Noticia no encontrada</h2>
          <p style="color:var(--text-muted); margin-bottom:2rem; max-width:480px; margin-inline:auto;">${msg}</p>
          <a href="index.html" class="btn-cta-foro">
            <span>← Volver al Portal de Noticias</span>
          </a>
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.noticiaApp = new NoticiaPageApp();
});
