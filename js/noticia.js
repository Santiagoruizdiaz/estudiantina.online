/**
 * JAVASCRIPT DE PÁGINA COMPLETA DE NOTICIA — ESTUDIANTINA ONLINE
 * Gestión del artículo individual, pestañas, galería, barra de lectura, lightbox y modo admin.
 */

class NoticiaPageApp {
  constructor() {
    this.articleId = this.extractArticleId();
    this.data = null;
    this.article = null;
    this.adminToken = localStorage.getItem("comunidad_admin_token") || null;

    this.cacheDom();
    this.initEvents();
    this.loadData();
  }

  extractArticleId() {
    const params = new URLSearchParams(window.location.search);
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
            window.location.href = `comunidad.html?editNews=${encodeURIComponent(this.article.id)}`;
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
      this.breadcrumbCat.href = `comunidad.html?cat=${encodeURIComponent(art.categoria || '')}`;
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
          `<a href="comunidad.html?search=${encodeURIComponent(t)}" class="noticia-tag-item">#${t}</a>`
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
        this.showToast("🗑️ Noticia eliminada exitosamente. Redirigiendo a Comunidad...");
        setTimeout(() => {
          window.location.href = "comunidad.html";
        }, 1500);
      } else {
        this.showToast(data.message || "Error al eliminar noticia");
      }
    } catch (err) {
      console.error("Error al borrar noticia:", err);
      this.showToast("Error de conexión con el servidor.");
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
          <a href="comunidad.html" class="btn-cta-foro">
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
