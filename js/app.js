/**
 * Controlador Principal de la Aplicación (Fiel a Copero)
 * Simulador de Carrera - Estudiantina de Posadas (Modo Normal)
 *
 * Jerarquía tradicional de Posadas:
 * - GIGANTES: El Janssen y La Indu
 * - HISTÓRICOS: El Nacional y La Normal
 * - GRANDES: El Sanba, El Bachi, La Madre y La EPET 2
 * - COMPETITIVOS: El Roque, El Santa, Comercio 6, Comercio 18, Verbo, etc.
 * - BARRIALES Y EMERGENTES: BOPs, etc.
 */

import { COLEGIOS, getColegioById, getColegiosPorRubro } from "./colegios.js?v=20260904_8";
import { RUBROS, getRolById } from "./roles.js?v=20260904_8";
import { SimuladorCarrera } from "./simulador.js?v=20260904_8";
import { rankingManager } from "./ranking.js?v=20260904_8";
import { UsuarioService } from "./usuario.js";

export const PROPUESTAS_ESPECIALES_POOL = [
  "🔥 Proyecto de Élite: La comisión directiva y los caciques invirtieron fondos extraordinarios en formación juvenil y buscan un talento para liderar la renovación de la banda.",
  "🔥 Proyecto de Reconquista: Tras quedar a milésimas del podio el año pasado, el colegio renovó todos los instrumentos y preparó arreglos rítmicos de alta complejidad.",
  "🔥 Alianza de Galpón & Carroceros: Gran inyección de egresados para coordinar percusión y efectos de luces de última generación en el 4to tramo.",
  "🔥 Apuesta de Vanguardia Musical: Los directores incorporaron cortes de estilo internacional y prometen una pasada histórica que romperá todos los moldes.",
  "🔥 Proyecto Semillero de Oro: Convocatoria abierta para refundar la gloria de la escuela con disciplina rigurosa y protagonismo absoluto desde el primer año.",
  "🔥 Furia Estudiantil en Ascenso: Un movimiento comunitario masivo copó los ensayos y toda la hinchada empuja para dar el batacazo frente a los colosos."
];

class EstudiantinaApp {
  constructor() {
    this.simulador = new SimuladorCarrera();
    this.sonidoHabilitado = true;
    this.audioCtx = null;

    this.selectedColegioId = null;
    this.selectedRubroId = "banda";
    this.selectedRolId = "chancha";
    this.filtroJerarquia = "todos";
    this.colegiosDestacados = [];
    this.sancionPendienteDuracion = 1;
    this.sancionPendienteMotivo = "";

    this.sortearColegiosDestacados();
    this.initElements();
    this.initEvents();
    this.renderColegiosList();
    this.renderRolesList();
    this.initConfetti();
  }

  initElements() {
    this.screens = {
      intro: document.getElementById("screen-intro"),
      identity: document.getElementById("screen-identity"),
      career: document.getElementById("screen-career"),
      summary: document.getElementById("screen-summary"),
      rankings: document.getElementById("screen-rankings")
    };

    this.substeps = {
      colegio: document.getElementById("substep-colegio"),
      rubro: document.getElementById("substep-rubro"),
      personalizacion: document.getElementById("substep-personalizacion")
    };

    this.dots = [
      document.getElementById("step-dot-1"),
      document.getElementById("step-dot-2"),
      document.getElementById("step-dot-3")
    ];
    this.lines = [
      document.getElementById("step-line-1"),
      document.getElementById("step-line-2")
    ];

    this.btnGoIdentity = document.getElementById("btn-go-identity");
    this.btnToColegio = document.getElementById("btn-to-colegio");
    this.btnToPersonalizacion = document.getElementById("btn-to-personalizacion");
    this.btnStartSimulation = document.getElementById("btn-start-simulation");
    this.btnBackToIntro = document.getElementById("btn-back-to-intro");
    this.btnBackToRubro = document.getElementById("btn-back-to-rubro");
    this.btnBackToColegio = document.getElementById("btn-back-to-colegio");
    this.colegiosFilterBar = document.getElementById("colegios-filter-bar");
    this.colegioSubtitle = document.getElementById("colegio-subtitle");

    this.btnContinueAfterOutcome = document.getElementById("btn-continue-after-outcome");
    this.btnShowTransfersOrFinish = document.getElementById("btn-show-transfers-or-finish");
    this.btnStayCurrentSchool = document.getElementById("btn-stay-current-school");
    this.btnCopySummary = document.getElementById("btn-copy-summary");
    this.btnDownloadCard = document.getElementById("btn-download-card");
    this.btnShareCard = document.getElementById("btn-share-card") || document.getElementById("btn-download-card");
    this.modalShareCard = document.getElementById("modal-share-card");
    this.btnCloseShareModal = document.getElementById("btn-close-share-modal");
    this.shareCardPreviewImg = document.getElementById("share-card-preview-img");
    this.shareCardLoading = document.getElementById("share-card-loading");
    this.btnShareNative = document.getElementById("btn-share-native");
    this.btnShareDownload = document.getElementById("btn-share-download");
    this.btnShareCopy = document.getElementById("btn-share-copy");
    this.btnPlayAgain = document.getElementById("btn-play-again");
    this.btnRestartNav = document.getElementById("btn-restart-nav");
    this.btnSoundToggle = document.getElementById("btn-sound-toggle");
    this.soundIcon = document.getElementById("sound-icon");

    this.modalParade = document.getElementById("modal-parade");
    this.seasonLeaderboardList = document.getElementById("season-leaderboard-list");
    this.leaderboardSeasonTag = document.getElementById("leaderboard-season-tag");
    this.modalTransfers = document.getElementById("modal-transfers");

    this.transferStatusIcon = document.getElementById("transfer-status-icon");
    this.transferModalTitle = document.getElementById("transfer-modal-title");
    this.transferModalSubtitle = document.getElementById("transfer-modal-subtitle");
    this.expulsionAlertBox = document.getElementById("expulsion-alert-box");
    this.expulsionReasonText = document.getElementById("expulsion-reason-text");
    this.transferOffersContainer = document.getElementById("transfer-offers-container");
    this.stayOptionContainer = document.getElementById("stay-option-container");

    this.modalSuspensionApes = document.getElementById("modal-suspension");
    this.modalTerms = document.getElementById("modal-terms");
    this.btnToggleTermsDesplegable = document.getElementById("btn-toggle-terms-desplegable");
    this.termsDesplegablePanel = document.getElementById("terms-desplegable-panel");
    this.termsTriggerArrow = document.getElementById("terms-trigger-arrow");
    this.btnOpenTerms = document.getElementById("btn-open-terms");
    this.menuItemTerms = document.getElementById("menu-item-terms");
    this.btnCloseTerms = document.getElementById("btn-close-terms");
    this.btnAcceptTerms = document.getElementById("btn-accept-terms");
    this.suspensionModalTitle = document.getElementById("suspension-modal-title");
    this.suspensionModalSubtitle = document.getElementById("suspension-modal-subtitle");
    this.suspensionModalDesc = document.getElementById("suspension-modal-desc");
    this.suspensionModalDuracion = document.getElementById("suspension-modal-duracion");
    this.btnBancarSuspension = document.getElementById("btn-bancar-suspension");
    this.btnTraspasoSuspension = document.getElementById("btn-traspaso-suspension");

    this.inputSearchColegio = document.getElementById("input-search-colegio");
    this.colegiosContainer = document.getElementById("colegios-grid-container");
    this.rolesContainer = document.getElementById("roles-grid-container");
    this.inputPlayerName = document.getElementById("input-player-name");
    this.identitySummaryPreview = document.getElementById("identity-summary-preview");

    this.statusAvatar = document.getElementById("status-avatar");
    this.statusPlayerName = document.getElementById("status-player-name");
    this.statusDirectorBadge = document.getElementById("status-director-badge");
    this.statusColegioRol = document.getElementById("status-colegio-rol");
    this.statusYearNumber = document.getElementById("status-year-number");
    this.statusOverallOvr = document.getElementById("status-overall-ovr");

    this.statRitmoVal = document.getElementById("stat-ritmo-val");
    this.statRitmoBar = document.getElementById("stat-ritmo-bar");
    this.statHinchadaVal = document.getElementById("stat-hinchada-val");
    this.statHinchadaBar = document.getElementById("stat-hinchada-bar");
    this.statResistenciaVal = document.getElementById("stat-resistencia-val");
    this.statResistenciaBar = document.getElementById("stat-resistencia-bar");
    this.statOverallVal = document.getElementById("stat-overall-val");
    this.statOverallBar = document.getElementById("stat-overall-bar");

    // Sidebar duplicates
    this.sidebarRitmoVal = document.getElementById("sidebar-ritmo-val");
    this.sidebarHinchadaVal = document.getElementById("sidebar-hinchada-val");
    this.sidebarResistenciaVal = document.getElementById("sidebar-resistencia-val");
    this.sidebarOverallVal = document.getElementById("sidebar-overall-val");

    this.cardDecision = document.getElementById("card-decision");
    this.decisionCategory = document.getElementById("decision-category");
    this.decisionTitle = document.getElementById("decision-title");
    this.decisionNarrative = document.getElementById("decision-narrative");
    this.optionsContainer = document.getElementById("options-container");

    this.cardOutcomeFeedback = document.getElementById("card-outcome-feedback");
    this.outcomeIcon = document.getElementById("outcome-icon");
    this.outcomeTitle = document.getElementById("outcome-title");
    this.outcomeMessage = document.getElementById("outcome-message");
    this.outcomeDeltasContainer = document.getElementById("outcome-deltas-container");

    this.careerTableBody = document.getElementById("career-table-body");
    this.summaryTableBody = document.getElementById("summary-table-body");

    this.trophiesContainer = document.getElementById("trophies-list-container");
    this.schoolInfoCardSidebar = document.getElementById("school-info-card-sidebar");

    this.paradeTitle = document.getElementById("parade-title");
    this.paradeScorePalco1 = document.getElementById("parade-score-palco1");
    this.paradeScorePalco2 = document.getElementById("parade-score-palco2");
    this.paradeScoreAnfi = document.getElementById("parade-score-anfi");
    this.podiumTitle = document.getElementById("podium-title");
    this.podiumDesc = document.getElementById("podium-desc");

    this.graduateCard = document.getElementById("graduate-card");
    this.cardAvatarElement = document.getElementById("card-avatar-element");
    this.cardStudentName = document.getElementById("card-student-name");
    this.cardNicknameBadge = document.getElementById("card-nickname-badge");
    this.cardSchoolTitle = document.getElementById("card-school-title");
    this.cardRoleTitle = document.getElementById("card-role-title");
    this.cardOverallNumber = document.getElementById("card-overall-number");
    this.cardRitmoVal = document.getElementById("card-ritmo-val");
    this.cardHinchadaVal = document.getElementById("card-hinchada-val");
    this.cardResistenciaVal = document.getElementById("card-resistencia-val");
    this.cardTrophiesSummary = document.getElementById("card-trophies-summary");
    this.achievementsGridContainer = document.getElementById("achievements-grid-container");

    this.toastNotification = document.getElementById("toast-notification");
    this.toastMessage = document.getElementById("toast-message");

    // Elementos del Salón de la Fama y Rankings (Pestaña Completa)
    this.btnOpenRankings = document.getElementById("btn-open-rankings");
    this.btnIntroRankings = document.getElementById("btn-intro-rankings");
    this.btnSummaryRankings = document.getElementById("btn-summary-rankings");
    this.btnCloseRankings = document.getElementById("btn-close-rankings");
    this.btnBackFromRankings = document.getElementById("btn-back-from-rankings");
    this.modalRankings = document.getElementById("modal-rankings");

    this.tabBtnOvr = document.getElementById("tab-btn-ovr");
    this.tabBtnGanadores = document.getElementById("tab-btn-ganadores");
    this.tabBtnColegios = document.getElementById("tab-btn-colegios");

    this.rankingPanelOvr = document.getElementById("ranking-panel-ovr");
    this.rankingPanelGanadores = document.getElementById("ranking-panel-ganadores");
    this.rankingPanelColegios = document.getElementById("ranking-panel-colegios");

    this.rankingListOvr = document.getElementById("ranking-list-ovr");
    this.ganadoresPodiumContainer = document.getElementById("ganadores-podium-container");
    this.rankingGanadoresTbody = document.getElementById("ranking-ganadores-tbody");
    this.colegiosPodiumContainer = document.getElementById("colegios-podium-container");
    this.rankingColegiosTbody = document.getElementById("ranking-colegios-tbody");

    this.summaryRankingBanner = document.getElementById("summary-ranking-banner");
    this.rankingBannerTitle = document.getElementById("ranking-banner-title");
    this.rankingBannerDesc = document.getElementById("ranking-banner-desc");

    // Menú Desplegable / Drawer
    this.btnMenuToggle = document.getElementById("btn-menu-toggle");
    this.navDropdownMenu = document.getElementById("nav-dropdown-menu");
    this.dropdownBackdrop = document.getElementById("dropdown-backdrop");
    this.btnCloseDropdown = document.getElementById("btn-close-dropdown");
    this.menuItemRankings = document.getElementById("menu-item-rankings");
    this.menuItemSound = document.getElementById("menu-item-sound");
    this.menuSoundIcon = document.getElementById("menu-sound-icon");
    this.menuSoundTitle = document.getElementById("menu-sound-title");
    this.menuSoundStatus = document.getElementById("menu-sound-status");
    this.menuItemRestart = document.getElementById("menu-item-restart");
    this.menuItemInstagram = document.getElementById("menu-item-instagram");
    this.menuItemCreator = document.getElementById("menu-item-creator");

    // Patrocinadores Oficiales
    this.btnToggleSponsors = document.getElementById("btn-toggle-sponsors");
    this.sponsorsDropdownPanel = document.getElementById("sponsors-dropdown-panel");
    this.sponsorsDropdownArrow = document.getElementById("sponsors-dropdown-arrow");
    this.btnOpenSponsors = document.getElementById("btn-open-sponsors");
    this.modalSponsors = document.getElementById("modal-sponsors");
    this.btnCloseSponsors = document.getElementById("btn-close-sponsors");
  }

  initEvents() {
    if (this.btnSoundToggle) {
      this.btnSoundToggle.addEventListener("click", () => {
        this.toggleSonido();
      });
    }

    
    const closeTerms = () => {
      if (this.modalTerms) {
        this.modalTerms.classList.remove("active");
        this.modalTerms.setAttribute("aria-hidden", "true");
      }
    };
    const openTerms = () => {
      this.cerrarDropdownMenu();
      if (this.modalTerms) {
        this.modalTerms.classList.add("active");
        this.modalTerms.setAttribute("aria-hidden", "false");
      }
    };

    const toggleDesplegable = () => {
      if (!this.termsDesplegablePanel) return;
      const isHidden = this.termsDesplegablePanel.style.display === "none";
      if (isHidden) {
        this.termsDesplegablePanel.style.display = "block";
        this.btnToggleTermsDesplegable?.setAttribute("aria-expanded", "true");
        this.btnToggleTermsDesplegable?.classList.add("expanded");
        if (this.termsTriggerArrow) this.termsTriggerArrow.textContent = "▴ Contraer";
        // Smooth scroll if needed
        setTimeout(() => {
          this.termsDesplegablePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } else {
        this.termsDesplegablePanel.style.display = "none";
        this.btnToggleTermsDesplegable?.setAttribute("aria-expanded", "false");
        this.btnToggleTermsDesplegable?.classList.remove("expanded");
        if (this.termsTriggerArrow) this.termsTriggerArrow.textContent = "▾ Desplegar";
      }
    };

    if (this.btnToggleTermsDesplegable) {
      this.btnToggleTermsDesplegable.addEventListener("click", toggleDesplegable);
    }
    if (this.btnOpenTerms) this.btnOpenTerms.addEventListener("click", openTerms);
    if (this.menuItemTerms) this.menuItemTerms.addEventListener("click", () => {
      this.cerrarDropdownMenu();
      openTerms();
    });
    if (this.btnCloseTerms) this.btnCloseTerms.addEventListener("click", closeTerms);
    if (this.btnAcceptTerms) this.btnAcceptTerms.addEventListener("click", closeTerms);
    if (this.modalTerms) {
      this.modalTerms.addEventListener("click", (e) => {
        if (e.target === this.modalTerms) closeTerms();
      });
    }

    this.btnGoIdentity.addEventListener("click", () => {
      this.playBeepSound(520);
      this.sortearColegiosDestacados();
      this.selectedRubroId = this.selectedRubroId || "banda";
      document.querySelectorAll(".rubro-tab").forEach(t => {
        t.classList.toggle("active", t.dataset.rubro === this.selectedRubroId);
      });
      this.renderRolesList();
      this.setIdentitySubstep(1);
      this.showScreen("identity");
    });

    if (this.btnBackToIntro) {
      this.btnBackToIntro.addEventListener("click", () => {
        this.showScreen("intro");
      });
    }

    if (this.btnToColegio) {
      this.btnToColegio.addEventListener("click", () => {
        this.playBeepSound(600);
        this.filtroJerarquia = "todos";
        this.renderFilterPills();
        this.renderColegiosList(this.inputSearchColegio ? this.inputSearchColegio.value : "");
        this.setIdentitySubstep(2);
      });
    }

    if (this.btnBackToRubro) {
      this.btnBackToRubro.addEventListener("click", () => {
        this.setIdentitySubstep(1);
      });
    }

    if (this.btnToPersonalizacion) {
      this.btnToPersonalizacion.addEventListener("click", () => {
        this.playBeepSound(680);
        this.renderIdentityPreview();
        this.setIdentitySubstep(3);
      });
    }

    if (this.btnBackToColegio) {
      this.btnBackToColegio.addEventListener("click", () => {
        this.setIdentitySubstep(2);
      });
    }

    if (this.btnStartSimulation) {
      this.btnStartSimulation.addEventListener("click", () => {
        this.iniciarSimulacion();
      });
    }

    if (this.inputSearchColegio) {
      this.inputSearchColegio.addEventListener("input", (e) => {
        this.renderColegiosList(e.target.value);
      });
    }

    document.querySelectorAll(".rubro-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".rubro-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.selectedRubroId = tab.dataset.rubro;
        this.renderRolesList();
      });
    });

    this.btnContinueAfterOutcome.addEventListener("click", () => {
      if (this.ultimoOutcome?.decisionLog?.abrirTraspasoEmergencia) {
        this.ultimoOutcome = null;
        this.cardOutcomeFeedback.classList.remove("active");
        this.simulador.registrarAnioSuspendido();
        this.actualizarDashboard();
        this.abrirModalMercadoYPases(true);
        return;
      }
      if (this.ultimoOutcome?.decisionLog?.esSuspensionAPES) {
        const log = this.ultimoOutcome.decisionLog;
        this.ultimoOutcome = null;
        this.cardOutcomeFeedback.classList.remove("active");
        this.mostrarModalSuspensionAPES(log);
        return;
      }
      this.mostrarSiguienteEvento();
    });

    if (this.btnBancarSuspension) {
      this.btnBancarSuspension.addEventListener("click", () => {
        this.modalSuspensionApes?.classList.remove("active");
        const carreraTerminada = this.simulador.cumplirSuspension(this.sancionPendienteDuracion || 1, this.sancionPendienteMotivo);
        this.actualizarDashboard();
        if (carreraTerminada) {
          this.mostrarPantallaResumen();
        } else {
          this.showToast(`🏛️ ¡Cumplieron la sanción a puertas cerradas! ${this.simulador.colegioActual.apodo} regresa a la Costanera.`);
          this.simulador.iniciarAnio(this.simulador.anioActual);
          this.actualizarDashboard();
          this.mostrarSiguienteEvento();
        }
      });
    }

    if (this.btnTraspasoSuspension) {
      this.btnTraspasoSuspension.addEventListener("click", () => {
        this.modalSuspensionApes?.classList.remove("active");
        this.simulador.registrarAnioSuspendido(this.sancionPendienteMotivo);
        this.actualizarDashboard();
        this.abrirModalMercadoYPases(true);
      });
    }

    this.btnShowTransfersOrFinish.addEventListener("click", () => {
      this.modalParade.classList.remove("active");
      const esUltimoAnio = this.simulador.anioActual >= this.simulador.maxAnios;
      if (esUltimoAnio) {
        this.simulador.concluirCarrera();
        this.mostrarPantallaResumen();
      } else {
        this.abrirModalMercadoYPases();
      }
    });

    this.btnStayCurrentSchool.addEventListener("click", () => {
      this.simulador.renovarEnColegioActual();
      this.modalTransfers.classList.remove("active");
      this.showToast(`¡Renovaste tu lealtad con ${this.simulador.colegioActual.apodo}! (+4 Hinchada)`);
      this.avanzarAlSiguienteAnio();
    });

    if (this.btnCopySummary) {
      this.btnCopySummary.addEventListener("click", () => {
        this.copiarResumenAlPortapapeles();
      });
    }

    if (this.btnShareCard) {
      this.btnShareCard.addEventListener("click", () => {
        this.abrirModalCompartirFicha();
      });
    } else if (this.btnDownloadCard) {
      this.btnDownloadCard.addEventListener("click", () => {
        this.abrirModalCompartirFicha();
      });
    }

    if (this.btnCloseShareModal) {
      this.btnCloseShareModal.addEventListener("click", () => {
        this.cerrarModalCompartirFicha();
      });
    }

    if (this.modalShareCard) {
      this.modalShareCard.addEventListener("click", (e) => {
        if (e.target === this.modalShareCard) {
          this.cerrarModalCompartirFicha();
        }
      });
    }

    if (this.btnShareNative) {
      this.btnShareNative.addEventListener("click", () => {
        this.compartirFichaRedes();
      });
    }

    if (this.btnShareDownload) {
      this.btnShareDownload.addEventListener("click", () => {
        this.descargarFichaDesdePreview();
      });
    }

    if (this.btnShareCopy) {
      this.btnShareCopy.addEventListener("click", () => {
        this.copiarResumenAlPortapapeles();
      });
    }

    this.btnPlayAgain.addEventListener("click", () => {
      this.sortearColegiosDestacados();
      this.renderColegiosList();
      this.showScreen("intro");
    });

    if (this.btnRestartNav) {
      this.btnRestartNav.addEventListener("click", () => {
        if (confirm("¿Deseas reiniciar la carrera actual y volver al inicio?")) {
          this.sortearColegiosDestacados();
          this.renderColegiosList();
          this.showScreen("intro");
        }
      });
    }

    // Eventos del Menú Desplegable / Drawer
    if (this.btnMenuToggle) {
      this.btnMenuToggle.addEventListener("click", () => this.toggleDropdownMenu());
    }
    if (this.btnCloseDropdown) {
      this.btnCloseDropdown.addEventListener("click", () => this.cerrarDropdownMenu());
    }
    if (this.dropdownBackdrop) {
      this.dropdownBackdrop.addEventListener("click", () => this.cerrarDropdownMenu());
    }
    if (this.menuItemRankings) {
      this.menuItemRankings.addEventListener("click", () => {
        this.cerrarDropdownMenu();
        this.abrirModalRankings();
      });
    }
    if (this.menuItemSound) {
      this.menuItemSound.addEventListener("click", () => {
        this.toggleSonido();
      });
    }
    if (this.menuItemInstagram) {
      this.menuItemInstagram.addEventListener("click", () => {
        this.cerrarDropdownMenu();
      });
    }
    if (this.menuItemCreator) {
      this.menuItemCreator.addEventListener("click", () => {
        this.cerrarDropdownMenu();
      });
    }
    if (this.menuItemRestart) {
      this.menuItemRestart.addEventListener("click", () => {
        this.cerrarDropdownMenu();
        if (confirm("¿Deseas reiniciar la carrera actual y volver al inicio?")) {
          this.sortearColegiosDestacados();
          this.renderColegiosList();
          this.showScreen("intro");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.cerrarDropdownMenu();
      }
    });

    // Eventos de apertura / cierre del Salón de la Fama y Rankings
    if (this.btnOpenRankings) {
      this.btnOpenRankings.addEventListener("click", () => {
        this.abrirModalRankings();
      });
    }

    if (this.btnIntroRankings) {
      this.btnIntroRankings.addEventListener("click", () => {
        this.abrirModalRankings();
      });
    }

    if (this.btnSummaryRankings) {
      this.btnSummaryRankings.addEventListener("click", () => {
        this.abrirModalRankings();
      });
    }

    if (this.btnBackFromRankings) {
      this.btnBackFromRankings.addEventListener("click", () => {
        this.playBeepSound(400);
        this.showScreen(this.previousScreen || "intro");
      });
    }

    if (this.btnCloseRankings) {
      this.btnCloseRankings.addEventListener("click", () => {
        this.cerrarModalRankings();
      });
    }

    if (this.modalRankings) {
      this.modalRankings.addEventListener("click", (e) => {
        if (e.target === this.modalRankings) {
          this.cerrarModalRankings();
        }
      });
    }

    // Listeners de Patrocinadores Oficiales
    if (this.btnToggleSponsors) {
      this.btnToggleSponsors.addEventListener("click", () => {
        this.toggleDesplegablePatrocinadores();
      });
    }

    if (this.btnOpenSponsors) {
      this.btnOpenSponsors.addEventListener("click", () => {
        this.abrirModalSponsors();
      });
    }

    if (this.btnCloseSponsors) {
      this.btnCloseSponsors.addEventListener("click", () => {
        this.cerrarModalSponsors();
      });
    }

    if (this.modalSponsors) {
      this.modalSponsors.addEventListener("click", (e) => {
        if (e.target === this.modalSponsors) {
          this.cerrarModalSponsors();
        }
      });
    }

    // Tabs del Salón de la Fama
    if (this.tabBtnOvr) {
      this.tabBtnOvr.addEventListener("click", () => {
        this.cambiarPestanaRanking("ovr");
        this.playBeepSound(500);
      });
    }
    if (this.tabBtnGanadores) {
      this.tabBtnGanadores.addEventListener("click", () => {
        this.cambiarPestanaRanking("ganadores");
        this.playBeepSound(540);
      });
    }
    if (this.tabBtnColegios) {
      this.tabBtnColegios.addEventListener("click", () => {
        this.cambiarPestanaRanking("colegios");
        this.playBeepSound(580);
      });
    }
  }

  toggleSonido() {
    this.sonidoHabilitado = !this.sonidoHabilitado;
    if (this.soundIcon) this.soundIcon.textContent = this.sonidoHabilitado ? "🔊" : "🔇";
    if (this.menuSoundIcon) this.menuSoundIcon.textContent = this.sonidoHabilitado ? "🔊" : "🔇";
    if (this.menuSoundStatus) this.menuSoundStatus.textContent = this.sonidoHabilitado ? "Activado" : "Silenciado";
    if (this.btnSoundToggle) this.btnSoundToggle.classList.toggle("sound-muted", !this.sonidoHabilitado);
    this.showToast(this.sonidoHabilitado ? "Sonido activado" : "Sonido silenciado");
  }

  toggleDropdownMenu() {
    if (this.navDropdownMenu?.classList.contains("active")) {
      this.cerrarDropdownMenu();
    } else {
      this.abrirDropdownMenu();
    }
  }

  abrirDropdownMenu() {
    this.navDropdownMenu?.classList.add("active");
    this.dropdownBackdrop?.classList.add("active");
    this.btnMenuToggle?.classList.add("active");
    if (this.menuSoundIcon) this.menuSoundIcon.textContent = this.sonidoHabilitado ? "🔊" : "🔇";
    if (this.menuSoundStatus) this.menuSoundStatus.textContent = this.sonidoHabilitado ? "Activado" : "Silenciado";
  }

  cerrarDropdownMenu() {
    this.navDropdownMenu?.classList.remove("active");
    this.dropdownBackdrop?.classList.remove("active");
    this.btnMenuToggle?.classList.remove("active");
  }

  sortearColegiosDestacados() {
    const indices = [];
    while (indices.length < 2 && indices.length < COLEGIOS.length) {
      const idx = Math.floor(Math.random() * COLEGIOS.length);
      if (!indices.includes(idx)) indices.push(idx);
    }
    const pool = [...PROPUESTAS_ESPECIALES_POOL].sort(() => Math.random() - 0.5);
    this.colegiosDestacados = indices.map((idx, i) => ({
      id: COLEGIOS[idx].id,
      propuesta: pool[i % pool.length]
    }));
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playDrumSound() {
    if (!this.sonidoHabilitado) return;
    try {
      this.ensureAudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) { }
  }

  playWhistleSound() {
    if (!this.sonidoHabilitado) return;
    try {
      this.ensureAudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(2400, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(2800, this.audioCtx.currentTime + 0.08);
      osc.frequency.setValueAtTime(2400, this.audioCtx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) { }
  }

  playFanfareSound() {
    if (!this.sonidoHabilitado) return;
    try {
      this.ensureAudioContext();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = this.audioCtx.currentTime + (idx * 0.12);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) { }
  }

  playBeepSound(freq = 440) {
    if (!this.sonidoHabilitado) return;
    try {
      this.ensureAudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch (e) { }
  }

  triggerHaptic(pattern = 12) {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) { }
    }
  }

  showScreen(screenId) {
    if (screenId !== "rankings" && this.currentScreenId) {
      this.previousScreen = this.currentScreenId;
    }
    this.currentScreenId = screenId;

    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove("active");
    });
    if (this.screens[screenId]) {
      this.screens[screenId].classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  setIdentitySubstep(stepNumber) {
    this.substeps.rubro.style.display = stepNumber === 1 ? "block" : "none";
    this.substeps.colegio.style.display = stepNumber === 2 ? "block" : "none";
    this.substeps.personalizacion.style.display = stepNumber === 3 ? "block" : "none";

    this.dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx + 1 <= stepNumber);
    });
    this.lines.forEach((line, idx) => {
      line.classList.toggle("active", idx + 1 < stepNumber);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderFilterPills() {
    if (!this.colegiosFilterBar) return;
    this.colegiosFilterBar.innerHTML = "";

    let pills = [];
    if (this.selectedRubroId === "baile") {
      pills = [
        { filter: "todos", label: "Todos (33)" },
        { filter: "grande", label: "👑 Grandes • Cat. A (5)" },
        { filter: "competitivo", label: "🏆 Competitivos • Cat. B (4)" },
        { filter: "emergente", label: "★ Emergentes • Cat. C y resto (24)" }
      ];
      if (this.colegioSubtitle) {
        this.colegioSubtitle.textContent = "Seleccioná entre las 33 instituciones oficiales de Posadas según la jerarquía oficial de Cuerpo de Baile (Cat. A, B y C).";
      }
    } else {
      pills = [
        { filter: "todos", label: "Todos (33)" },
        { filter: "gigante", label: "Gigantes" },
        { filter: "historico", label: "Históricos" },
        { filter: "grande", label: "Grandes" },
        { filter: "competitivo", label: "Competitivos" },
        { filter: "emergente", label: "Emergentes" }
      ];
      if (this.colegioSubtitle) {
        this.colegioSubtitle.textContent = "Seleccioná entre las 33 instituciones oficiales de Posadas según la jerarquía tradicional de Banda de Música.";
      }
    }

    pills.forEach(p => {
      const btn = document.createElement("button");
      btn.className = `colegio-filter-pill ${p.filter === (this.filtroJerarquia || "todos") ? "active" : ""}`;
      btn.dataset.filter = p.filter;
      btn.textContent = p.label;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".colegio-filter-pill").forEach(pill => pill.classList.remove("active"));
        btn.classList.add("active");
        this.filtroJerarquia = p.filter;
        this.triggerHaptic(8);
        this.renderColegiosList(this.inputSearchColegio ? this.inputSearchColegio.value : "");
      });
      this.colegiosFilterBar.appendChild(btn);
    });
  }

  renderColegiosList(filterQuery = "") {
    const q = filterQuery.toLowerCase().trim();
    const filtro = (this.filtroJerarquia || "todos").toLowerCase();
    const colegios = getColegiosPorRubro(this.selectedRubroId || "banda");

    const filtered = colegios.filter(col => {
      // 1. Filtrado por jerarquía
      if (filtro !== "todos") {
        const tierNormalizado = col.tierNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (!tierNormalizado.includes(filtro)) {
          return false;
        }
      }

      // 2. Filtrado por búsqueda de texto
      if (!q) return true;
      return col.nombre.toLowerCase().includes(q) ||
        col.apodo.toLowerCase().includes(q) ||
        col.especialidad.toLowerCase().includes(q) ||
        col.tierNombre.toLowerCase().includes(q) ||
        (col.categoria && col.categoria.toLowerCase().includes(q)) ||
        (col.descripcion && col.descripcion.toLowerCase().includes(q)) ||
        (col.lema && col.lema.toLowerCase().includes(q));
    });

    this.colegiosContainer.innerHTML = "";
    if (filtered.length === 0) {
      this.colegiosContainer.innerHTML = `<p class="empty-state-text" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No se encontraron colegios con "${filterQuery}".</p>`;
      return;
    }

    filtered.forEach(col => {
      const isSelected = col.id === this.selectedColegioId;
      const destacadoInfo = (this.colegiosDestacados || []).find(d => d.id === col.id);
      const isDestacado = !!destacadoInfo;

      const card = document.createElement("div");
      card.className = `colegio-card ${isSelected ? "selected" : ""} ${isDestacado ? "destacado" : ""}`;
      card.style.setProperty("--selected-glow-rgb", this.hexToRgb(col.colores.primary));

      const tierClass = col.tierNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rivalColegio = col.rivalHistorico ? getColegioById(col.rivalHistorico, this.selectedRubroId) : null;
      const rivalNombre = rivalColegio ? rivalColegio.apodo : "";

      const descripcionAMostrar = isDestacado ? destacadoInfo.propuesta : col.descripcion;

      let tierBadgeHtml = '';
      if (this.selectedRubroId === "baile") {
        if (col.categoria === "A") {
          tierBadgeHtml = '<span class="badge-tag grande cat-a">👑 CAT. A • GRANDE</span>';
        } else if (col.categoria === "B") {
          tierBadgeHtml = '<span class="badge-tag competitivo cat-b">🏆 CAT. B • COMPETITIVO</span>';
        } else {
          tierBadgeHtml = '<span class="badge-tag emergente cat-c">★ CAT. C • EMERGENTE</span>';
        }
      } else {
        tierBadgeHtml = `<span class="badge-tag ${tierClass}">★ ${col.tierNombre.toUpperCase()}</span>`;
      }

      card.innerHTML = `
        <div class="colegio-card-header">
          <span class="colegio-escudo">${col.escudo}</span>
          <div style="flex: 1; min-width: 0;">
            <div class="colegio-apodo-row">
              <span class="colegio-apodo">${col.apodo}</span>
              <div style="display: flex; gap: 0.25rem; flex-wrap: wrap; align-items: center;">
                ${isDestacado ? '<span class="badge-tag destacado">🔥 PROYECTO DESTACADO</span>' : ''}
                ${tierBadgeHtml}
              </div>
            </div>
          </div>
          ${isSelected ? '<span class="colegio-selected-badge">✓ Elegido</span>' : ''}
        </div>

        <div class="colegio-badges">
          <span class="badge-tag">${col.especialidad}</span>
          ${col.tecnico ? '<span class="badge-tag tecnico">Técnico (6 Años)</span>' : ''}
          ${col.lema ? `<span class="badge-tag lema-tag">"${col.lema}"</span>` : ''}
        </div>

        <!-- Propuesta de Proyecto Institucional (fiel a Copero) -->
        <div class="colegio-proyecto-box">
          <div class="proyecto-header">
            <span class="proyecto-icon">${isDestacado ? '🔥' : '📋'}</span>
            <span class="proyecto-label" style="${isDestacado ? 'color: #fb923c;' : ''}">${isDestacado ? 'Proyecto Especial de Temporada:' : 'Propuesta de Proyecto:'}</span>
          </div>
          <p class="proyecto-desc ${isDestacado ? 'destacado-desc' : ''}">${descripcionAMostrar}</p>
          ${isSelected && col.tentacionTexto ? `
            <div class="proyecto-propuesta-personal">
              <span class="propuesta-personal-badge">🎯 Propuesta para vos:</span>
              <span class="propuesta-personal-text">"${col.tentacionTexto}"</span>
            </div>
          ` : ''}
          <div class="proyecto-meta">
            <span class="proyecto-chip">⚡ Exigencia: <strong>${col.id === 'industrial' && this.selectedRubroId === 'banda' ? '76% (desde 3º año)' : `${col.exigencia}%`}</strong></span>
            <span class="proyecto-chip">💰 Presupuesto: <strong>${col.presupuesto}</strong></span>
            ${rivalNombre ? `<span class="proyecto-chip">⚔️ Rival: <strong>${rivalNombre}</strong></span>` : ''}
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        this.selectedColegioId = col.id;
        this.updateSchoolTheme(col.id);
        if (this.btnToPersonalizacion) this.btnToPersonalizacion.disabled = false;
        this.triggerHaptic(14);
        this.playBeepSound(480);
        this.renderColegiosList(filterQuery);
      });

      this.colegiosContainer.appendChild(card);
    });

    if (this.btnToPersonalizacion) this.btnToPersonalizacion.disabled = !this.selectedColegioId;
  }

  renderRolesList() {
    const rubro = RUBROS.find(r => r.id === this.selectedRubroId) || RUBROS[0];
    this.rolesContainer.innerHTML = "";

    const rolesDisponibles = rubro.rolesIniciales || [];
    if (!rolesDisponibles.some(r => r.id === this.selectedRolId)) {
      this.selectedRolId = rolesDisponibles[0]?.id || (this.selectedRubroId === "baile" ? "pasista_escuadra" : "cajita");
    }

    rolesDisponibles.forEach(rol => {
      const isSelected = rol.id === this.selectedRolId;
      const card = document.createElement("div");
      card.className = `rol-card ${isSelected ? "selected" : ""}`;

      card.innerHTML = `
        <div class="rol-name">${rol.nombre}</div>
        <div class="rol-rango">${rol.rango}</div>
        <p class="rol-desc">${rol.descripcion}</p>
      `;

      card.addEventListener("click", () => {
        this.selectedRolId = rol.id;
        if (this.btnToColegio) this.btnToColegio.disabled = false;
        this.playBeepSound(540);
        this.renderRolesList();
      });

      this.rolesContainer.appendChild(card);
    });

    if (this.btnToColegio) this.btnToColegio.disabled = !this.selectedRolId;
  }

  renderIdentityPreview() {
    const col = getColegioById(this.selectedColegioId, this.selectedRubroId);
    const { rubro, rol } = getRolById(this.selectedRubroId, this.selectedRolId);

    const jerarquiaTexto = this.selectedRubroId === "baile"
      ? (col.categoria ? `Cat. ${col.categoria} (${col.tierNombre})` : col.tierNombre)
      : col.tierNombre.toUpperCase();

    this.identitySummaryPreview.innerHTML = `
      <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 1.25rem; display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 2.5rem;">${col.escudo}</span>
        <div>
          <h4 style="font-size: 1.2rem; color: #ffffff;">${col.apodo} • <span style="font-size: 0.85rem; color: var(--gold-primary); font-weight: 800;">${jerarquiaTexto}</span></h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${rubro.nombre} • ${rol.nombre}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Exigencia escolar: ${col.id === 'industrial' && this.selectedRubroId === 'banda' ? '76/100 (a partir de 3º año)' : `${col.exigencia}/100`} • Presupuesto: ${col.presupuesto}</p>
        </div>
      </div>
    `;
  }

  updateSchoolTheme(colegioId) {
    const col = getColegioById(colegioId);
    if (!col || !col.colores) return;
    const root = document.documentElement;
    const colors = col.colores;
    root.style.setProperty("--school-primary", colors.primary);
    root.style.setProperty("--school-secondary", colors.secondary);
    root.style.setProperty("--school-accent", colors.accent || colors.primary);
    root.style.setProperty("--school-glow", colors.glow || "rgba(29, 78, 216, 0.4)");
    root.style.setProperty("--school-collar", colors.collar || colors.secondary);
    root.style.setProperty("--school-text-contrast", colors.textContrast || "#ffffff");
    root.style.setProperty("--school-surface", colors.surface || "rgba(29, 78, 216, 0.08)");
    root.style.setProperty("--school-border", colors.border || "rgba(29, 78, 216, 0.35)");
    root.style.setProperty("--school-gradient", colors.gradient || `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent || colors.primary} 100%)`);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", colors.primary);
    }
  }

  hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  iniciarSimulacion() {
    const nombre = this.inputPlayerName.value.trim() || "Estudiante";
    const esDestacado = (this.colegiosDestacados || []).some(d => d.id === this.selectedColegioId);
    this.simulador.iniciarCarrera(
      nombre,
      this.selectedColegioId,
      this.selectedRubroId,
      this.selectedRolId,
      esDestacado
    );

    // Registrar elección de colegio para estadísticas
    rankingManager.registrarInicioCarrera(this.selectedColegioId);

    this.updateSchoolTheme(this.simulador.colegioActual.id);
    this.playWhistleSound();
    this.actualizarDashboard();
    this.showScreen("career");
    this.mostrarSiguienteEvento();
  }

  actualizarDashboard() {
    const col = this.simulador.colegioActual;
    const nombreRol = this.simulador.getNombreRolActual();

    this.statusAvatar.textContent = this.simulador.rubro.icono;
    this.statusPlayerName.textContent = this.simulador.nombre;
    this.statusDirectorBadge.style.display = this.simulador.esDirector ? "inline-block" : "none";
    this.statusColegioRol.textContent = `${col.apodo} (${col.tierNombre}) • ${nombreRol}`;
    this.statusYearNumber.textContent = `${this.simulador.anioActual}º Año`;

    // Si hubo ascenso (ej. a Pilar o a Director)
    if (this.simulador.mensajeAscenso) {
      this.showToast(this.simulador.mensajeAscenso);
      this.playFanfareSound();
      this.triggerConfetti();
      this.simulador.mensajeAscenso = null;
    }

    this.statRitmoVal.textContent = this.simulador.stats.ritmo;
    this.statRitmoBar.style.width = `${this.simulador.stats.ritmo}%`;

    this.statHinchadaVal.textContent = this.simulador.stats.hinchada;
    this.statHinchadaBar.style.width = `${this.simulador.stats.hinchada}%`;

    this.statResistenciaVal.textContent = this.simulador.stats.resistencia;
    this.statResistenciaBar.style.width = `${this.simulador.stats.resistencia}%`;

    this.statOverallVal.textContent = this.simulador.stats.overall;
    this.statOverallBar.style.width = `${this.simulador.stats.overall}%`;

    // Sistema cromático dinámico de OVR
    const ovrData = this.getOvrTierData(this.simulador.stats.overall);
    const root = document.documentElement;
    root.style.setProperty("--ovr-current", ovrData.color);
    root.style.setProperty("--ovr-current-glow", ovrData.glow);

    // OVR badge grande en el player card
    if (this.statusOverallOvr) {
      this.statusOverallOvr.textContent = this.simulador.stats.overall;
      const badgeParent = this.statusOverallOvr.closest(".player-ovr-badge");
      if (badgeParent) {
        badgeParent.className = `player-ovr-badge ${ovrData.tierClass}`;
        const labelEl = badgeParent.querySelector(".player-ovr-label");
        if (labelEl) labelEl.textContent = ovrData.badgeText;
      }
    }

    // Sidebar stat vals
    if (this.sidebarRitmoVal) this.sidebarRitmoVal.textContent = this.simulador.stats.ritmo;
    if (this.sidebarHinchadaVal) this.sidebarHinchadaVal.textContent = this.simulador.stats.hinchada;
    if (this.sidebarResistenciaVal) this.sidebarResistenciaVal.textContent = this.simulador.stats.resistencia;
    if (this.sidebarOverallVal) this.sidebarOverallVal.textContent = this.simulador.stats.overall;

    this.renderTablaHistorica();
    this.renderVitrinaCopas();
    this.renderSchoolInfoSidebar();
  }

  mostrarSiguienteEvento() {
    this.cardDecision.style.display = "block";
    this.cardOutcomeFeedback.classList.remove("active");

    const paso = this.simulador.siguienteDecision();

    if (paso.tipo === "evento") {
      const ev = paso.evento;
      const faseStr = ev.faseNombre ? ev.faseNombre.toUpperCase() : (paso.esSorpresa ? "⚠️ GIRO DEL DESTINO / URGENCIA" : ev.categoria.toUpperCase());
      this.decisionCategory.textContent = `⚡ ${faseStr} • ${this.simulador.anioActual}º AÑO (${paso.eventoNumero}/${paso.totalEventos})`;
      this.decisionTitle.textContent = ev.titulo;
      this.decisionNarrative.textContent = ev.descripcion;

      if (paso.esSorpresa) {
        this.playBeepSound(320);
      }

      this.optionsContainer.innerHTML = "";
      ev.opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        const isAlto = String(op.riesgo || "").trim().toLowerCase() === "alto";
        const riskClass = op.riesgo === "Bajo" ? "risk-bajo" : op.riesgo === "Medio" ? "risk-medio" : "risk-alto";
        const riskLabel = isAlto ? `Riesgo Alto • +25% Pts 🔥` : `Riesgo ${op.riesgo}`;

        btn.innerHTML = `
          <div class="option-header">
            <span class="option-text">${op.texto}</span>
            <span class="risk-tag ${riskClass}">${riskLabel}</span>
          </div>
          <p class="option-desc">${op.descripcion}</p>
        `;

        btn.addEventListener("click", () => {
          this.triggerHaptic(10);
          this.playDrumSound();
          this.ejecutarDecision(op.id);
        });

        this.optionsContainer.appendChild(btn);
      });
    } else {
      this.simularNochesDeCalle();
    }
  }

  ejecutarDecision(opcionId) {
    const outcome = this.simulador.tomarDecision(opcionId);
    if (!outcome) return;

    this.ultimoOutcome = outcome;

    if (outcome.colegioNuevo) {
      this.updateSchoolTheme(outcome.colegioNuevo.id);
      this.showToast(`¡Bomba! Te transferiste a ${outcome.colegioNuevo.apodo}`);
    }

    this.cardDecision.style.display = "none";
    this.cardOutcomeFeedback.classList.add("active");

    if (outcome.decisionLog.bonoAltoRiesgo) {
      this.outcomeIcon.textContent = "🔥";
      this.outcomeTitle.textContent = "¡Alto Riesgo Conquistado! (+25% Puntos)";
      this.outcomeTitle.style.color = "#f59e0b";
    } else {
      this.outcomeIcon.textContent = outcome.esExito ? "🎉" : "⚠️";
      this.outcomeTitle.textContent = outcome.esExito ? "¡Decisión Acertada!" : "Momento de Dificultad";
      this.outcomeTitle.style.color = outcome.esExito ? "#34d399" : "#f87171";
    }
    this.outcomeMessage.textContent = outcome.decisionLog.mensaje;

    const deltas = outcome.decisionLog.statsDelta;
    this.outcomeDeltasContainer.innerHTML = "";

    const statMap = [
      { key: "ritmo", label: "Ritmo" },
      { key: "hinchada", label: "Hinchada" },
      { key: "resistencia", label: "Aguante" },
      { key: "overall", label: "Rating General" }
    ];

    statMap.forEach(s => {
      const val = deltas[s.key];
      if (val !== 0) {
        const chip = document.createElement("div");
        chip.className = `stat-delta-chip ${val > 0 ? "positive" : "negative"}`;
        chip.textContent = `${val > 0 ? "+" : ""}${val} ${s.label}`;
        this.outcomeDeltasContainer.appendChild(chip);
      }
    });

    this.actualizarDashboard();
  }

  simularNochesDeCalle() {
    const res = this.simulador.simularNochesYPalcos();

    this.paradeTitle.textContent = `¡Fin de la Estudiantina - ${res.anio}º Año!`;
    this.paradeScorePalco1.textContent = res.palco1Score;
    this.paradeScorePalco2.textContent = res.palco2Score;
    this.paradeScoreAnfi.textContent = res.anfiScore;

    if (res.podio === 1) {
      this.podiumTitle.textContent = "🥇 ¡CAMPEONES DE ORO!";
      this.podiumTitle.style.color = "#f59e0b";
      this.podiumDesc.textContent = `El jurado dictaminó el 1º Puesto para ${res.colegioApodo} (${res.tierNombre}). ¡Toda la Costanera festeja!`;
      this.triggerConfetti();
      this.playFanfareSound();
    } else if (res.podio === 2) {
      this.podiumTitle.textContent = "🥈 ¡SUBCAMPEONES DE LA ESTUDIANTINA!";
      this.podiumTitle.style.color = "#cbd5e1";
      this.podiumDesc.textContent = `Gran 2º puesto peleado hasta la última planilla frente al Anfiteatro.`;
      this.playFanfareSound();
    } else if (res.podio === 3) {
      this.podiumTitle.textContent = "🥉 ¡3º Puesto en el Podio!";
      this.podiumTitle.style.color = "#d97706";
      this.podiumDesc.textContent = `Copa de Bronce obtenida con orgullo y mucha garra.`;
      this.playBeepSound(650);
    } else {
      this.podiumTitle.textContent = "🎖️ Mención de Honor";
      this.podiumTitle.style.color = "#94a3b8";
      this.podiumDesc.textContent = `Gran pasada por el 4to tramo con aplausos de la multitud en las vallas.`;
      this.playBeepSound(520);
    }

    this.actualizarDashboard();
    this.renderTablaPosicionesTemporada(res.tablaPosiciones, res.anio);

    // Registrar temporada disputada por el colegio actual y su puesto
    rankingManager.registrarTemporadaColegio(this.simulador.colegioActual.id, res.podio);

    const esUltimoAnio = this.simulador.anioActual >= this.simulador.maxAnios;
    this.btnShowTransfersOrFinish.textContent = esUltimoAnio
      ? "Ver Ficha de Egresado y Resumen Final 🎓"
      : `Continuar al Mercado de Pases (${this.simulador.anioActual + 1}º Año) ➔`;

    this.modalParade.classList.add("active");
  }

  renderTablaPosicionesTemporada(tablaPos, anio) {
    if (!this.seasonLeaderboardList) {
      this.seasonLeaderboardList = document.getElementById("season-leaderboard-list");
    }
    if (!this.seasonLeaderboardList) return;

    if (this.leaderboardSeasonTag) {
      this.leaderboardSeasonTag.textContent = `${anio || this.simulador?.anioActual || 1}º Año`;
    }

    // Si por caché o desincronización de versiones tablaPos viniera undefined, la generamos
    if (!tablaPos && this.simulador) {
      if (typeof this.simulador.generarTablaPosicionesTemporada === "function") {
        const u = this.simulador.ultimoResultadoDesfile;
        tablaPos = this.simulador.generarTablaPosicionesTemporada(
          u?.palco1Score || 8.5,
          u?.palco2Score || 8.5,
          u?.anfiScore || 8.5,
          u?.podio || 4
        );
      } else {
        tablaPos = this.generarTablaPosicionesFallback();
      }
    }

    if (!tablaPos || !tablaPos.top5) return;

    this.seasonLeaderboardList.innerHTML = "";

    const medallas = { 1: "🥇", 2: "🥈", 3: "🥉" };

    // Filtro estricto de unicidad para evitar cualquier duplicado en Top 5
    const seenIds = new Set();
    const cleanTop5 = [];
    tablaPos.top5.forEach(entry => {
      const key = entry.id || entry.apodo;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        cleanTop5.push(entry);
      }
    });
    tablaPos.top5 = cleanTop5;

    // 1. Render Top 5
    tablaPos.top5.forEach(entry => {
      const row = document.createElement("div");
      row.className = `leaderboard-row ${entry.esTuColegio ? "user-school-row" : ""}`;

      const posDisplay = medallas[entry.posicion]
        ? `<span class="row-medal">${medallas[entry.posicion]}</span> <span class="row-pos-num">${entry.posicion}º</span>`
        : `<span class="row-pos-num normal-pos">${entry.posicion}º</span>`;

      const tuColegioTag = entry.esTuColegio
        ? `<span class="user-school-badge">⭐ Tu Colegio</span>`
        : "";

      row.innerHTML = `
        <div class="leaderboard-row-left">
          <div class="row-pos-box">${posDisplay}</div>
          <span class="row-escudo">${entry.escudo}</span>
          <div class="row-info">
            <span class="row-school-name" title="${entry.nombre}">${entry.apodo}</span>
            ${tuColegioTag}
          </div>
        </div>
        <div class="leaderboard-row-right">
          <span class="row-pts">${entry.puntosTexto}</span>
        </div>
      `;
      this.seasonLeaderboardList.appendChild(row);
    });

    // 2. Si tu colegio NO quedó en el Top 5 (y no está ya presente en el top 5)
    const yaEstaEnTop5 = tablaPos.top5.some(e => e.esTuColegio || (tablaPos.tuColegio && (e.id === tablaPos.tuColegio.id || e.apodo === tablaPos.tuColegio.apodo)));

    if (!yaEstaEnTop5 && !tablaPos.estaEnTop5 && tablaPos.tuColegio) {
      const divider = document.createElement("div");
      divider.className = "leaderboard-divider-row";
      divider.innerHTML = `<span>• • •</span>`;
      this.seasonLeaderboardList.appendChild(divider);

      const userRow = document.createElement("div");
      userRow.className = "leaderboard-row user-school-row outside-top5";
      userRow.innerHTML = `
        <div class="leaderboard-row-left">
          <div class="row-pos-box">
            <span class="row-pos-num outside-num">#${tablaPos.tuColegio.posicion}</span>
          </div>
          <span class="row-escudo">${tablaPos.tuColegio.escudo}</span>
          <div class="row-info">
            <span class="row-school-name" title="${tablaPos.tuColegio.nombre}">${tablaPos.tuColegio.apodo}</span>
            <span class="user-school-badge">⭐ Tu Colegio</span>
          </div>
        </div>
        <div class="leaderboard-row-right">
          <span class="row-pts user-pts">${tablaPos.tuColegio.puntosTexto}</span>
        </div>
      `;
      this.seasonLeaderboardList.appendChild(userRow);
    }
  }

  generarTablaPosicionesFallback() {
    const colActual = this.simulador?.colegioActual || { id: "janssen", apodo: "El Janssen", escudo: "⚙️", tier: 1 };
    const u = this.simulador?.ultimoResultadoDesfile;
    const playerPts = parseFloat((parseFloat(u?.palco1Score || 7.11) + parseFloat(u?.palco2Score || 7.19) + parseFloat(u?.anfiScore || 7.21)).toFixed(2));
    const podio = u?.podio || 1;

    // Lista de rivales excluyendo SIEMPRE al colegio del usuario
    const rivales = [
      { id: "industrial", apodo: "La Indu", escudo: "🔧", nombre: "La Indu" },
      { id: "janssen", apodo: "El Janssen", escudo: "⚙️", nombre: "El Janssen" },
      { id: "nacional", apodo: "El Nacional", escudo: "🏛️", nombre: "El Nacional" },
      { id: "normal_mixta", apodo: "La Normal", escudo: "📖", nombre: "La Normal" },
      { id: "san_basilio", apodo: "El Sanba", escudo: "🛡️", nombre: "El Sanba" },
      { id: "humanista", apodo: "El Bachi", escudo: "🎭", nombre: "El Bachi" },
      { id: "epet_2", apodo: "La EPET 2", escudo: "⚙️", nombre: "La EPET 2" }
    ].filter(r => r.id !== colActual.id);

    const playerEntry = {
      posicion: podio <= 3 ? podio : 14,
      apodo: colActual.apodo,
      escudo: colActual.escudo,
      nombre: colActual.nombre || colActual.apodo,
      puntosTexto: playerPts.toFixed(2) + " pts",
      esTuColegio: true
    };

    let top5 = [];
    let estaEnTop5 = podio <= 5;

    if (podio === 1) {
      playerEntry.posicion = 1;
      top5 = [
        playerEntry,
        { posicion: 2, ...rivales[0], puntosTexto: (playerPts - 0.25).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 3, ...rivales[1], puntosTexto: (playerPts - 0.50).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 4, ...rivales[2], puntosTexto: (playerPts - 0.80).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 5, ...rivales[3], puntosTexto: (playerPts - 1.10).toFixed(2) + " pts", esTuColegio: false }
      ];
    } else if (podio === 2) {
      playerEntry.posicion = 2;
      top5 = [
        { posicion: 1, ...rivales[0], puntosTexto: (playerPts + 0.25).toFixed(2) + " pts", esTuColegio: false },
        playerEntry,
        { posicion: 3, ...rivales[1], puntosTexto: (playerPts - 0.25).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 4, ...rivales[2], puntosTexto: (playerPts - 0.55).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 5, ...rivales[3], puntosTexto: (playerPts - 0.85).toFixed(2) + " pts", esTuColegio: false }
      ];
    } else if (podio === 3) {
      playerEntry.posicion = 3;
      top5 = [
        { posicion: 1, ...rivales[0], puntosTexto: (playerPts + 0.50).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 2, ...rivales[1], puntosTexto: (playerPts + 0.25).toFixed(2) + " pts", esTuColegio: false },
        playerEntry,
        { posicion: 4, ...rivales[2], puntosTexto: (playerPts - 0.30).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 5, ...rivales[3], puntosTexto: (playerPts - 0.60).toFixed(2) + " pts", esTuColegio: false }
      ];
    } else {
      top5 = [
        { posicion: 1, ...rivales[0], puntosTexto: (playerPts + 1.20).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 2, ...rivales[1], puntosTexto: (playerPts + 0.95).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 3, ...rivales[2], puntosTexto: (playerPts + 0.70).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 4, ...rivales[3], puntosTexto: (playerPts + 0.45).toFixed(2) + " pts", esTuColegio: false },
        { posicion: 5, ...rivales[4], puntosTexto: (playerPts + 0.20).toFixed(2) + " pts", esTuColegio: false }
      ];
      playerEntry.posicion = 14;
      estaEnTop5 = false;
    }

    return { top5, tuColegio: playerEntry, estaEnTop5 };
  }

  mostrarModalSuspensionAPES(log) {
    const col = this.simulador.colegioActual;
    const duracion = log.duracionSancion || 1;
    const motivo = log.motivoSuspension || "";

    this.sancionPendienteDuracion = duracion;
    this.sancionPendienteMotivo = motivo;

    if (this.suspensionModalTitle) {
      this.suspensionModalTitle.textContent = `🚨 ¡${col.apodo.toUpperCase()} SUSPENDIDO!`;
    }
    if (this.suspensionModalDuracion) {
      this.suspensionModalDuracion.textContent = `${duracion} Temporada${duracion > 1 ? "s" : ""}`;
    }

    let textoDesc = `Por resolución de la Comisión Organizadora y el Tribunal de Disciplina, ${col.apodo} queda formalmente DESCALIFICADO y SUSPENDIDO durante esta temporada. Se cancelan todas las pasadas en la Costanera y el Anfiteatro.`;
    if (motivo === "robo_chanchas") {
      textoDesc = `🚨 FALLO DISCIPLINARIO OFICIAL:\n\nTras el allanamiento donde se recuperaron los instrumentos sustraídos, el Tribunal de Disciplina y las autoridades competentes dictaminaron la CLAUSURA Y SUSPENSIÓN TOTAL de ${col.apodo} por ${duracion} temporada(s). Se suspenden de inmediato las Noches de Calle y la participación en el Anfiteatro.`;
    } else if (motivo === "bombas_molotov") {
      textoDesc = `🚨 FALLO DISCIPLINARIO OFICIAL:\n\nDebido al gravísimo altercado frente a La Normal en represalia por el conflicto de instrumentos, las autoridades y el Tribunal de Disciplina clausuraron la participación de ${col.apodo} por ${duracion} temporada(s). Se suspenden de inmediato las Noches de Calle y el Anfiteatro.`;
    }

    if (this.suspensionModalDesc) {
      this.suspensionModalDesc.textContent = textoDesc;
    }

    const btnBancarTitle = document.getElementById("btn-bancar-title");
    if (btnBancarTitle) {
      btnBancarTitle.textContent = `Bancar la Sanción en ${col.apodo}`;
    }

    this.playBeepSound(260);
    this.modalSuspensionApes?.classList.add("active");
  }

  abrirModalMercadoYPases(esPorSancionAPES = false) {
    const mercado = this.simulador.evaluarMercadoYOfertas();
    if (mercado.esUltimoAnio) {
      this.mostrarPantallaResumen();
      return;
    }

    this.transferOffersContainer.innerHTML = "";

    if (esPorSancionAPES) {
      this.transferStatusIcon.textContent = "🚨";
      this.transferModalTitle.textContent = "¡Pase de Emergencia por Suspensión Oficial!";
      this.transferModalSubtitle.textContent = `${this.simulador.colegioActual.apodo} fue suspendido por el Tribunal de Disciplina. Podés fichar por otro colegio para seguir desfilando en la Costanera.`;
      this.expulsionAlertBox.style.display = "block";
      this.expulsionReasonText.textContent = "Sanción Disciplinaria Oficial: El colegio no puede participar en la Estudiantina.";
      this.stayOptionContainer.style.display = "none";

      const ofertas = (mercado.ofertasRescate && mercado.ofertasRescate.length > 0) ? mercado.ofertasRescate : mercado.ofertas;
      ofertas.forEach(rescate => {
        const card = document.createElement("div");
        card.className = "offer-card";
        card.innerHTML = `
          <div class="offer-card-left">
            <span class="offer-escudo">${rescate.colegio.escudo}</span>
            <div class="offer-info">
              <span class="offer-action-tag">Pase de Emergencia</span>
              <span class="offer-colegio-name">${rescate.colegio.apodo}</span>
              <div class="offer-meta">
                <span class="offer-meta-chip">${rescate.colegio.tierNombre}</span>
                <span class="offer-meta-chip">+${rescate.bonoResistencia || 2} Aguante</span>
              </div>
            </div>
          </div>
          <button class="offer-action-btn btn-accept-offer">Fichar ➜</button>
        `;

        card.querySelector(".btn-accept-offer").addEventListener("click", () => {
          this.simulador.aceptarOfertaColegio(rescate.colegio.id, rescate.rolOfrecido, true);
          this.updateSchoolTheme(rescate.colegio.id);
          this.modalTransfers.classList.remove("active");
          this.showToast(`¡Pase de emergencia a ${rescate.colegio.apodo}! Seguís en carrera.`);
          this.avanzarAlSiguienteAnio();
        });

        this.transferOffersContainer.appendChild(card);
      });

      this.modalTransfers.classList.add("active");
      return;
    }

    if (mercado.fueExpulsado) {
      this.transferStatusIcon.textContent = "🚪";
      this.transferModalTitle.textContent = "¡Expulsado de la Banda!";
      this.transferModalSubtitle.textContent = `La comisión directiva de ${this.simulador.colegioActual.apodo} te dio de baja. Debés elegir un nuevo colegio obligado.`;
      this.expulsionAlertBox.style.display = "block";
      this.expulsionReasonText.textContent = mercado.motivo;
      this.stayOptionContainer.style.display = "none";

      mercado.ofertasRescate.forEach(rescate => {
        const card = document.createElement("div");
        card.className = "offer-card";
        card.innerHTML = `
          <div class="offer-card-left">
            <span class="offer-escudo">${rescate.colegio.escudo}</span>
            <div class="offer-info">
              <span class="offer-action-tag">Fichaje de Rescate</span>
              <span class="offer-colegio-name">${rescate.colegio.apodo}</span>
              <div class="offer-meta">
                <span class="offer-meta-chip">${rescate.colegio.tierNombre}</span>
                <span class="offer-meta-chip">+${rescate.bonoResistencia} Aguante</span>
              </div>
            </div>
          </div>
          <button class="offer-action-btn btn-accept-offer">Aceptar ➜</button>
        `;

        card.querySelector(".btn-accept-offer").addEventListener("click", () => {
          this.simulador.aceptarOfertaColegio(rescate.colegio.id, rescate.rolOfrecido, true);
          this.updateSchoolTheme(rescate.colegio.id);
          this.modalTransfers.classList.remove("active");
          this.showToast(`Te incorporaste a ${rescate.colegio.apodo}`);
          this.avanzarAlSiguienteAnio();
        });

        this.transferOffersContainer.appendChild(card);
      });
    } else {
      this.transferStatusIcon.textContent = "✨";
      this.transferModalTitle.textContent = "Mercado de Pases Estudiantil";
      this.transferModalSubtitle.textContent = "Tu rendimiento llamó la atención en la Costanera. Podés cambiarte o quedarte a pelear por tu escuela.";
      this.expulsionAlertBox.style.display = "none";
      this.stayOptionContainer.style.display = "block";
      this.btnStayCurrentSchool.textContent = `🛡️ Renovar Lealtad y Quedarme en ${this.simulador.colegioActual.apodo} (+4 Hinchada)`;

      mercado.ofertas.forEach(oferta => {
        const card = document.createElement("div");
        card.className = "offer-card";
        card.innerHTML = `
          <div class="offer-card-left">
            <span class="offer-escudo">${oferta.colegio.escudo}</span>
            <div class="offer-info">
              <span class="offer-action-tag">${oferta.tipo}</span>
              <span class="offer-colegio-name">${oferta.colegio.apodo}</span>
              <div class="offer-meta">
                <span class="offer-meta-chip">${oferta.colegio.tierNombre}</span>
                <span class="offer-meta-chip">${oferta.rolOfrecido}</span>
                <span class="offer-meta-chip">${oferta.modificador}</span>
              </div>
            </div>
          </div>
          <button class="offer-action-btn btn-accept-offer">Aceptar ➜</button>
        `;

        card.querySelector(".btn-accept-offer").addEventListener("click", () => {
          this.simulador.aceptarOfertaColegio(oferta.colegio.id, oferta.rolOfrecido, false);
          this.updateSchoolTheme(oferta.colegio.id);
          this.modalTransfers.classList.remove("active");
          this.showToast(`¡Pase confirmado! Ahora sos ${oferta.rolOfrecido} en ${oferta.colegio.apodo}`);
          this.avanzarAlSiguienteAnio();
        });

        this.transferOffersContainer.appendChild(card);
      });
    }

    this.modalTransfers.classList.add("active");
  }

  avanzarAlSiguienteAnio() {
    const finalizada = this.simulador.avanzarAlSiguienteAnio();
    if (finalizada) {
      this.mostrarPantallaResumen();
    } else {
      this.actualizarDashboard();
      this.mostrarSiguienteEvento();
    }
  }

  renderTablaHistorica() {
    this.careerTableBody.innerHTML = "";

    if (this.simulador.tablaHistorica.length === 0) {
      this.careerTableBody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Completá las noches de calle de 1º año para ver tu primera temporada aquí.</td></tr>`;
      return;
    }

    this.simulador.tablaHistorica.forEach(fila => {
      const tr = document.createElement("tr");
      const podioChip = fila.podio === 1
        ? '<span class="podio-chip oro">🥇 1º Puesto</span>'
        : fila.podio === 2
          ? '<span class="podio-chip plata">🥈 2º Puesto</span>'
          : fila.podio === 3
            ? '<span class="podio-chip bronce">🥉 3º Puesto</span>'
            : '<span style="color: var(--text-muted);">Mención</span>';

      tr.innerHTML = `
        <td style="font-weight: 700; color: #ffffff;">${fila.anioTexto}</td>
        <td class="td-school"><span>${fila.escudo}</span> <span>${fila.colegioApodo}</span> <span style="font-size:0.65rem; color:var(--gold-primary);">(${fila.tierNombre})</span></td>
        <td>${fila.rolTexto}</td>
        <td>${fila.palco1Score}</td>
        <td>${fila.palco2Score}</td>
        <td>${fila.anfiScore}</td>
        <td style="font-weight: 800; color: #ffffff;">${fila.totalScore}</td>
        <td>${fila.ritmo}</td>
        <td>${fila.hinchada}</td>
        <td>${fila.resistencia}</td>
        <td class="td-overall">${fila.overall}</td>
        <td>${podioChip}</td>
      `;

      this.careerTableBody.appendChild(tr);
    });
  }

  renderSchoolInfoSidebar() {
    const col = this.simulador.colegioActual;
    const rival = getColegioById(col.rivalHistorico || "industrial");
    this.schoolInfoCardSidebar.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Jerarquía:</span>
          <span style="font-weight: 800; color: var(--gold-primary);">${col.tierNombre.toUpperCase()}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Exigencia mínima:</span>
          <span style="font-weight: 700; color: #ffffff;">${col.id === 'industrial' ? (this.simulador.anioActual < 3 ? 'Sin exigencia (hasta 3° año)' : '76 / 100') : `${col.exigencia} / 100`}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Presupuesto:</span>
          <span style="font-weight: 700; color: #34d399;">${col.presupuesto}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Rival Histórico:</span>
          <span style="font-weight: 700; color: #f87171;">${rival.apodo}</span>
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.4rem; border-top: 1px solid var(--border-glass); padding-top: 0.5rem;">
          "${col.descripcion}"
        </p>
      </div>
    `;
  }

  renderVitrinaCopas() {
    this.trophiesContainer.innerHTML = "";
    if (this.simulador.copasGanadas.length === 0) {
      this.trophiesContainer.innerHTML = `<p class="empty-state-text">Aún no hay copas en la vitrina. ¡A darlo todo en la Costanera!</p>`;
      return;
    }

    this.simulador.copasGanadas.forEach(copa => {
      const item = document.createElement("div");
      item.className = "trophy-item";
      const icon = copa.esChallenger ? "🌟" : copa.puesto === 1 ? "🏆" : copa.puesto === 2 ? "🥈" : copa.puesto === 3 ? "🥉" : "📣";
      item.innerHTML = `
        <span class="trophy-icon">${icon}</span>
        <div class="trophy-details">
          <span class="trophy-name">${copa.nombre}</span>
          <span class="trophy-year">${copa.anio}º Año • ${copa.colegio}</span>
        </div>
      `;
      this.trophiesContainer.appendChild(item);
    });
  }

  async mostrarPantallaResumen() {
    const col = this.simulador.colegioActual;
    const rol = this.simulador.rol;

    this.cardAvatarElement.textContent = this.simulador.rubro.icono;
    this.cardStudentName.textContent = this.simulador.nombre;
    const apodo = this.simulador.generarApodoPersonalizado();
    if (this.cardNicknameBadge) {
      this.cardNicknameBadge.textContent = `"${apodo}"`;
    }

    // Colegio y Rol de Egreso Oficial
    if (this.cardSchoolTitle) {
      this.cardSchoolTitle.textContent = col.apodo;
    }
    if (this.cardRoleTitle) {
      this.cardRoleTitle.textContent = `${this.simulador.esDirector ? "Director/a • " : ""}${rol.nombre} • Egresado/a`;
    }

    this.cardOverallNumber.textContent = this.simulador.stats.overall;
    const ovrData = this.getOvrTierData(this.simulador.stats.overall);
    const root = document.documentElement;
    root.style.setProperty("--ovr-current", ovrData.color);
    root.style.setProperty("--ovr-current-glow", ovrData.glow);
    const cardBadge = this.cardOverallNumber.closest(".card-overall-badge");
    if (cardBadge) {
      cardBadge.className = `card-overall-badge ${ovrData.tierClass}`;
      const labelEl = cardBadge.querySelector(".overall-label");
      if (labelEl) labelEl.textContent = `Nivel: ${ovrData.label}`;
    }

    this.cardRitmoVal.textContent = this.simulador.stats.ritmo;
    this.cardHinchadaVal.textContent = this.simulador.stats.hinchada;
    this.cardResistenciaVal.textContent = this.simulador.stats.resistencia;

    // Actualizar elementos premium de la Ficha Coleccionable
    const cardSchoolBadgeIcon = document.getElementById("card-school-badge-icon");
    if (cardSchoolBadgeIcon) cardSchoolBadgeIcon.textContent = col.escudo || "🏫";

    const cardOverallTierText = document.getElementById("card-overall-tier-text");
    if (cardOverallTierText) cardOverallTierText.textContent = ovrData.label.toUpperCase();

    const cardPromocionText = document.getElementById("card-promocion-text");
    if (cardPromocionText) cardPromocionText.textContent = `${this.simulador.maxAnios}º AÑO EGRESO`;

    const cardRitmoBar = document.getElementById("card-ritmo-bar");
    if (cardRitmoBar) cardRitmoBar.style.width = `${Math.min(100, Math.max(15, this.simulador.stats.ritmo))}%`;

    const cardHinchadaBar = document.getElementById("card-hinchada-bar");
    if (cardHinchadaBar) cardHinchadaBar.style.width = `${Math.min(100, Math.max(15, this.simulador.stats.hinchada))}%`;

    const cardResistenciaBar = document.getElementById("card-resistencia-bar");
    if (cardResistenciaBar) cardResistenciaBar.style.width = `${Math.min(100, Math.max(15, this.simulador.stats.resistencia))}%`;

    const copasOro = this.simulador.getTitulosOro();
    const totalPodios = this.simulador.getPodiosTotales();
    const subcampeonatos = this.simulador.tablaHistorica.filter(t => t.podio === 2).length;
    const tercerosPuestos = this.simulador.tablaHistorica.filter(t => t.podio === 3).length;
    const copasChallenger = this.simulador.titulosChallenger || 0;
    
    if (copasOro > 0) {
      this.cardTrophiesSummary.textContent = copasChallenger > 0
        ? `🏆 ${copasOro} Título(s) de Oro (🌟 ${copasChallenger} Copa Challenger) • ${totalPodios} Podio(s) Totales`
        : `🏆 ${copasOro} Título(s) de Oro • ${totalPodios} Podio(s) Totales`;
    } else if (totalPodios > 0) {
      const detalle = [];
      if (subcampeonatos > 0) detalle.push(`🥈 ${subcampeonatos} Subcampeonato(s)`);
      if (tercerosPuestos > 0) detalle.push(`🥉 ${tercerosPuestos} Tercer(os) Puesto(s)`);
      this.cardTrophiesSummary.textContent = `${detalle.join(" • ")} (0 Títulos de Oro) • ${totalPodios} Podio(s) Totales`;
    } else {
      this.cardTrophiesSummary.textContent = `🎖️ Mención de Honor Oficial • Sin podios alcanzados`;
    }

    this.summaryTableBody.innerHTML = "";
    this.simulador.tablaHistorica.forEach(fila => {
      const tr = document.createElement("tr");
      const podioChip = fila.podio === 1
        ? '<span class="podio-chip oro">🥇 Oro</span>'
        : fila.podio === 2
          ? '<span class="podio-chip plata">🥈 Plata</span>'
          : fila.podio === 3
            ? '<span class="podio-chip bronce">🥉 Bronce</span>'
            : '<span style="color: var(--text-muted);">-</span>';

      tr.innerHTML = `
        <td style="font-weight: 700; color: #ffffff;">${fila.anioTexto}</td>
        <td class="td-school">${fila.escudo} ${fila.colegioApodo}</td>
        <td>${fila.rolTexto}</td>
        <td style="font-weight: 800;">${fila.totalScore}</td>
        <td>${fila.ritmo}</td>
        <td>${fila.hinchada}</td>
        <td>${fila.resistencia}</td>
        <td class="td-overall">${fila.overall}</td>
        <td>${podioChip}</td>
      `;
      this.summaryTableBody.appendChild(tr);
    });

    this.renderLogros();

    // Guardar en el Salón de la Fama Global si califica en el Top 10
    const resRanking = await rankingManager.registrarEgresado({
      nombre: this.simulador.nombre,
      apodoJugador: apodo,
      colegioId: col.id,
      colegioNombre: col.nombre,
      colegioApodo: col.apodo,
      escudo: col.escudo,
      rubroNombre: this.simulador.rubro.nombre,
      rolNombre: `${this.simulador.esDirector ? "Director/a • " : ""}${rol.nombre}`,
      ovr: this.simulador.stats.overall,
      titulosOro: copasOro,
      titulosChallenger: this.simulador.titulosChallenger || 0,
      podiosTotales: totalPodios,
      ritmo: this.simulador.stats.ritmo,
      hinchada: this.simulador.stats.hinchada,
      resistencia: this.simulador.stats.resistencia,
      anios: this.simulador.maxAnios
    });

    if (this.summaryRankingBanner) {
      if (resRanking && resRanking.entroTop10) {
        this.summaryRankingBanner.style.display = "flex";
        if (this.rankingBannerTitle) {
          this.rankingBannerTitle.textContent = `🌟 ¡HISTÓRICO! Ingresaste al Salón de la Fama Global (Puesto #${resRanking.posicionOVR})`;
        }
        if (this.rankingBannerDesc) {
          this.rankingBannerDesc.textContent = `Tu marca de ${this.simulador.stats.overall} OVR y ${copasOro} Copa(s) de Oro te inmortaliza en el Top 10 histórico de la Estudiantina.`;
        }
      } else {
        this.summaryRankingBanner.style.display = "none";
      }
    }

    this.showScreen("summary");
    this.triggerConfetti();
    this.playFanfareSound();
  }

  async abrirModalRankings(tabInicial = "ganadores") {
    if (this.navDropdownMenu) {
      this.navDropdownMenu.classList.remove("active");
    }
    if (this.dropdownBackdrop) {
      this.dropdownBackdrop.classList.remove("active");
    }
    this.cambiarPestanaRanking(tabInicial);
    this.showScreen("rankings");
    if (this.modalRankings) {
      this.modalRankings.classList.add("active");
    }
    // Sincronizar con el servidor global para ver nuevos egresados y copas en tiempo real
    await rankingManager.cargarRankingGlobal();
    this.cambiarPestanaRanking(tabInicial);
  }

  cerrarModalRankings() {
    if (this.modalRankings) {
      this.modalRankings.classList.remove("active");
    }
    this.showScreen(this.previousScreen || "intro");
  }

  toggleDesplegablePatrocinadores() {
    this.playBeepSound(460);
    const isOpen = this.sponsorsDropdownPanel?.classList.contains("active");
    if (isOpen) {
      this.sponsorsDropdownPanel?.classList.remove("active");
      this.sponsorsDropdownPanel?.setAttribute("aria-hidden", "true");
      this.btnToggleSponsors?.classList.remove("active");
      this.btnToggleSponsors?.setAttribute("aria-expanded", "false");
    } else {
      this.sponsorsDropdownPanel?.classList.add("active");
      this.sponsorsDropdownPanel?.setAttribute("aria-hidden", "false");
      this.btnToggleSponsors?.classList.add("active");
      this.btnToggleSponsors?.setAttribute("aria-expanded", "true");
    }
  }

  abrirModalSponsors() {
    this.playBeepSound(480);
    if (this.modalSponsors) {
      this.modalSponsors.classList.add("active");
      this.modalSponsors.setAttribute("aria-hidden", "false");
    }
  }

  cerrarModalSponsors() {
    this.playBeepSound(320);
    if (this.modalSponsors) {
      this.modalSponsors.classList.remove("active");
      this.modalSponsors.setAttribute("aria-hidden", "true");
    }
  }

  cambiarPestanaRanking(tab) {
    this.currentRankingTab = tab;
    const tabs = [
      { id: "ovr", btn: this.tabBtnOvr, panel: this.rankingPanelOvr, render: () => this.renderRankingOVR() },
      { id: "ganadores", btn: this.tabBtnGanadores, panel: this.rankingPanelGanadores, render: () => this.renderRankingColegiosMasGanadores() },
      { id: "colegios", btn: this.tabBtnColegios, panel: this.rankingPanelColegios, render: () => this.renderRankingColegios() }
    ];

    tabs.forEach(t => {
      if (t.id === tab) {
        t.btn?.classList.add("active");
        t.panel?.classList.add("active");
        t.render();
      } else {
        t.btn?.classList.remove("active");
        t.panel?.classList.remove("active");
      }
    });
  }

  renderRankingColegiosMasGanadores() {
    if (!this.rankingGanadoresTbody) return;
    const colegios = rankingManager.getRankingColegiosMasGanadores();

    // 1. Render Top 3 Podium de Ganadores (Disposición Olímpica)
    if (this.ganadoresPodiumContainer) {
      this.ganadoresPodiumContainer.innerHTML = "";
      const top3 = colegios.slice(0, 3);
      const totalCopas = colegios.reduce((acc, c) => acc + c.titulosOro, 0);

      if (totalCopas === 0) {
        this.ganadoresPodiumContainer.innerHTML = `
          <div class="empty-podium-box">
            <span class="empty-podium-symbol">⚑</span>
            <p><strong>Sin registros de campeonatos aún.</strong> Disputá una temporada completa para consagrar a tu colegio en el historial de la Estudiantina.</p>
          </div>
        `;
      } else {
        top3.forEach((col, idx) => {
          const podiumCard = document.createElement("div");
          podiumCard.className = `colegio-podium-card podium-ganador-card podium-pos-${idx + 1}`;
          podiumCard.style.setProperty("--school-border-color", col.colores?.primary || "rgba(255,255,255,0.15)");

          const posSymbol = idx === 0 ? "1º" : idx === 1 ? "2º" : "3º";
          const posTitle = idx === 0 ? "CAMPEÓN HISTÓRICO" : idx === 1 ? "SUBCAMPEÓN HISTÓRICO" : "3º PUESTO HISTÓRICO";

          podiumCard.innerHTML = `
            <div class="podium-rank-tag rank-${idx + 1}">${idx === 0 ? '👑 ' : ''}${posSymbol}</div>
            <span class="podium-school-escudo">${col.escudo}</span>
            <h4 class="podium-school-name">${col.apodo}</h4>
            <span class="podium-pos-title">${posTitle}</span>
            <div class="podium-trophy-display">
              <span class="trophy-val">${col.titulosOro}</span>
              <span class="trophy-unit">${col.titulosOro === 1 ? 'COPA DE ORO' : 'COPAS DE ORO'}</span>
            </div>
            <div class="podium-micro-stats">
              <span>${col.podiosTotales} podios</span>
              <span class="micro-sep">•</span>
              <span>${col.temporadasJugadas} temporadas</span>
              <span class="micro-sep">•</span>
              <span>${col.efectividadOro}% efectividad</span>
            </div>
          `;
          this.ganadoresPodiumContainer.appendChild(podiumCard);
        });
      }
    }

    // 2. Render Tabla de Ganadores
    this.rankingGanadoresTbody.innerHTML = "";
    colegios.forEach((col, idx) => {
      const tr = document.createElement("tr");
      if (idx < 3) {
        tr.className = `row-podium-top row-top-${idx + 1}`;
      }
      
      const posNum = String(idx + 1).padStart(2, "0");
      const isTop3 = idx < 3;
      const primaryColor = col.colores?.primary || "#f59e0b";
      const secondaryColor = col.colores?.secondary || "#ffffff";

      tr.style.setProperty("--col-primary", primaryColor);
      tr.style.setProperty("--col-secondary", secondaryColor);

      tr.innerHTML = `
        <td class="td-pos ${isTop3 ? `rank-top-${idx + 1}` : ''}">
          <span class="pos-num-text">${posNum}</span>
        </td>
        <td class="td-school">
          <span class="td-school-escudo">${col.escudo}</span>
          <div class="td-school-info">
            <strong class="td-school-apodo">${col.apodo}</strong>
            <span class="td-school-nombre">${col.nombre}</span>
          </div>
        </td>
        <td class="td-trophies text-center">
          ${col.titulosOro > 0 
            ? `<span class="gold-trophy-chip" style="background: ${primaryColor}20; border-color: ${primaryColor}77; color: ${primaryColor};"><span class="chip-trophy-icon">🏆</span> ${col.titulosOro}</span>` 
            : `<span class="zero-dash">-</span>`}
        </td>
        <td class="text-center font-tabular">
          ${col.podiosTotales > 0 ? `<span class="podium-count-badge">${col.podiosTotales}</span>` : '<span class="zero-dash">-</span>'}
        </td>
        <td class="text-center font-tabular text-muted">${col.temporadasJugadas}</td>
        <td class="text-center">
          <span class="efectividad-chip ${col.efectividadOro >= 50 ? 'alta' : col.efectividadOro >= 20 ? 'media' : ''}">
            ${col.temporadasJugadas > 0 ? `${col.efectividadOro}%` : '-'}
          </span>
        </td>
      `;
      this.rankingGanadoresTbody.appendChild(tr);
    });
  }

  renderRankingOVR() {
    if (!this.rankingListOvr) return;
    const top10 = rankingManager.getRankingPorOVR();
    this.rankingListOvr.innerHTML = "";

    if (!top10 || top10.length === 0) {
      this.rankingListOvr.innerHTML = `
        <div class="ranking-empty-state">
          <div class="empty-state-icon-glow">⚑</div>
          <h4 class="empty-state-headline">Sin egresados en el Salón de la Fama</h4>
          <p class="empty-state-subtext">Completá una carrera en la Costanera para consagrar tu nombre y tu OVR en el podio histórico.</p>
        </div>
      `;
      return;
    }

    top10.forEach((player, idx) => {
      const card = document.createElement("div");
      card.className = "ranking-player-card card-player-user";
      
      const col = getColegioById(player.colegioId);
      const primaryColor = col?.colores?.primary || "#f59e0b";

      const rankBadge = String(idx + 1).padStart(2, "0");
      const rankClass = idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : "rank-other";
      const nicknameHtml = player.apodoJugador ? ` <span class="ranking-nickname">"${player.apodoJugador}"</span>` : "";

      card.innerHTML = `
        <div class="ranking-player-left">
          <span class="ranking-rank-num ${rankClass}">${rankBadge}</span>
          <span class="ranking-player-escudo">${player.escudo || "🥁"}</span>
          <div class="ranking-player-info">
            <div class="ranking-player-header-row">
              <span class="ranking-player-name">${player.nombre}${nicknameHtml}</span>
              ${player.titulosOro > 0 ? `<span class="ranking-gold-tag">🏆 ${player.titulosOro} Oro</span>` : ''}
              ${player.titulosChallenger > 0 ? `<span class="ranking-gold-tag ranking-challenger-tag" style="background: rgba(234, 179, 8, 0.25); border-color: #facc15; color: #fef08a;">🌟 Challenger</span>` : ''}
            </div>
            <div class="ranking-player-school-role">
              <span class="ranking-school-name">${player.colegioApodo || player.colegioNombre}</span>
              <span class="ranking-role-dot">•</span>
              <span class="ranking-role-name">${player.rolNombre}</span>
              ${player.fecha ? `<span class="ranking-date-tag">(${player.fecha})</span>` : ""}
            </div>
            <div class="ranking-player-specs">
              <span>RIT <strong>${player.ritmo}</strong></span>
              <span class="spec-sep">•</span>
              <span>HIN <strong>${player.hinchada}</strong></span>
              <span class="spec-sep">•</span>
              <span>AGU <strong>${player.resistencia}</strong></span>
            </div>
          </div>
        </div>
        <div class="ranking-player-right">
          <div class="ranking-ovr-box" style="border-color: ${primaryColor}; box-shadow: 0 4px 14px ${primaryColor}33;">
            <span class="ranking-ovr-num" style="color: ${primaryColor};">${player.ovr}</span>
            <span class="ranking-ovr-label" style="color: ${primaryColor};">OVR</span>
          </div>
        </div>
      `;
      this.rankingListOvr.appendChild(card);
    });
  }

  renderRankingColegios() {
    if (!this.rankingColegiosTbody) return;
    const colegios = rankingManager.getRankingColegios();
    
    // Render Top 3 Podium
    if (this.colegiosPodiumContainer) {
      this.colegiosPodiumContainer.innerHTML = "";
      const top3 = colegios.slice(0, 3);
      const totalPartidas = colegios.reduce((acc, c) => acc + c.partidasIniciadas, 0);

      if (totalPartidas === 0) {
        this.colegiosPodiumContainer.innerHTML = `
          <div class="empty-podium-box">
            <span class="empty-podium-symbol">⚑</span>
            <p><strong>Aún no hay carreras registradas.</strong> Elegí tu colegio y desfilá en la Costanera para liderar las estadísticas.</p>
          </div>
        `;
      } else {
        top3.forEach((col, idx) => {
          const podiumCard = document.createElement("div");
          podiumCard.className = `colegio-podium-card podium-ganador-card podium-pos-${idx + 1}`;
          const primaryColor = col.colores?.primary || "rgba(255,255,255,0.15)";
          podiumCard.style.setProperty("--school-border-color", primaryColor);
          podiumCard.style.setProperty("--col-primary", primaryColor);

          const posSymbol = idx === 0 ? "1º" : idx === 1 ? "2º" : "3º";

          podiumCard.innerHTML = `
            <div class="podium-rank-tag rank-${idx + 1}">${posSymbol}</div>
            <span class="podium-school-escudo">${col.escudo}</span>
            <h4 class="podium-school-name">${col.apodo}</h4>
            <div class="podium-trophy-display">
              <span class="trophy-val" style="color: ${primaryColor};">${col.partidasIniciadas}</span>
              <span class="trophy-unit">${col.partidasIniciadas === 1 ? 'PARTIDA' : 'PARTIDAS'}</span>
            </div>
            <div class="podium-micro-stats">
              <span>${col.temporadasJugadas} temporadas</span>
              <span class="micro-sep">•</span>
              <span style="color: ${primaryColor};">🏆 ${col.titulosOro} copas</span>
            </div>
          `;
          this.colegiosPodiumContainer.appendChild(podiumCard);
        });
      }
    }

    // Render Table
    this.rankingColegiosTbody.innerHTML = "";
    colegios.forEach((col, idx) => {
      const tr = document.createElement("tr");
      if (idx < 3) {
        tr.className = `row-podium-top row-top-${idx + 1}`;
      }
      const posNum = String(idx + 1).padStart(2, "0");
      const isTop3 = idx < 3;
      const primaryColor = col.colores?.primary || "#38bdf8";
      const secondaryColor = col.colores?.secondary || "#ffffff";

      tr.style.setProperty("--col-primary", primaryColor);
      tr.style.setProperty("--col-secondary", secondaryColor);

      tr.innerHTML = `
        <td class="td-pos ${isTop3 ? `rank-top-${idx + 1}` : ''}">
          <span class="pos-num-text">${posNum}</span>
        </td>
        <td class="td-school">
          <span class="td-school-escudo">${col.escudo}</span>
          <div class="td-school-info">
            <strong class="td-school-apodo">${col.apodo}</strong>
            <span class="td-school-nombre">${col.nombre}</span>
          </div>
        </td>
        <td class="text-center font-tabular font-bold">${col.partidasIniciadas}</td>
        <td class="text-center font-tabular text-muted">${col.temporadasJugadas}</td>
        <td class="text-center font-tabular" style="color: ${col.titulosOro > 0 ? primaryColor : 'var(--text-muted)'}; font-weight: 800;">
          ${col.titulosOro > 0 ? `🏆 ${col.titulosOro}` : '-'}
        </td>
        <td class="text-center">
          <span class="efectividad-chip ${col.efectividadOro >= 50 ? 'alta' : ''}">
            ${col.temporadasJugadas > 0 ? `${col.efectividadOro}%` : '-'}
          </span>
        </td>
      `;
      this.rankingColegiosTbody.appendChild(tr);
    });
  }

  renderLogros() {
    const logros = this.simulador.getLogrosDetallados();
    const logrosObtenidos = logros.filter(l => l.desbloqueado);
    const logrosBloqueados = logros.filter(l => !l.desbloqueado);

    // Actualizar el badge del contador
    const counterBadge = document.getElementById("achievements-counter-badge");
    if (counterBadge) {
      counterBadge.textContent = `${logrosObtenidos.length} / ${logros.length} Desbloqueados`;
    }

    this.achievementsGridContainer.innerHTML = "";

    // 1. Renderizar primero los logros conseguidos con su medalla dorada
    logrosObtenidos.forEach(logro => {
      const box = document.createElement("div");
      box.className = "achievement-box unlocked";

      box.innerHTML = `
        <div class="achievement-icon-wrapper">
          <span class="achievement-icon">${logro.icono}</span>
          <span class="achievement-check-badge">✓</span>
        </div>
        <div class="achievement-content">
          <div class="achievement-header-row">
            <span class="achievement-status-tag">★ LOGRO CONSEGUIDO</span>
          </div>
          <h4 class="achievement-title">${logro.titulo}</h4>
          <p class="achievement-desc">${logro.descripcion}</p>
        </div>
      `;

      this.achievementsGridContainer.appendChild(box);
    });

    // 2. Renderizar los logros pendientes (bloqueados) para completar la colección
    logrosBloqueados.forEach(logro => {
      const box = document.createElement("div");
      box.className = "achievement-box locked";

      box.innerHTML = `
        <div class="achievement-icon-wrapper">
          <span class="achievement-icon" style="filter: grayscale(1); opacity: 0.6;">🔒</span>
        </div>
        <div class="achievement-content">
          <div class="achievement-header-row">
            <span class="achievement-status-tag locked-tag">POR DESBLOQUEAR</span>
          </div>
          <h4 class="achievement-title" style="opacity: 0.85;">${logro.titulo}</h4>
          <p class="achievement-desc">${logro.descripcion}</p>
        </div>
      `;

      this.achievementsGridContainer.appendChild(box);
    });
  }

  copiarResumenAlPortapapeles() {
    const texto = this.simulador.generarTextoResumen();
    navigator.clipboard.writeText(texto).then(() => {
      this.showToast("¡Ficha de egresado copiada para compartir!");
    }).catch(() => {
      this.showToast("Copia manual lista en consola");
      console.log(texto);
    });
  }

  showToast(mensaje) {
    this.toastMessage.textContent = mensaje;
    this.toastNotification.classList.add("active");
    setTimeout(() => {
      this.toastNotification.classList.remove("active");
    }, 2800);
  }

  initConfetti() {
    this.confettiCanvas = document.getElementById("confetti-canvas");
    this.confettiCtx = this.confettiCanvas.getContext("2d");
    this.confettiParticles = [];
    this.isConfettiRunning = false;

    window.addEventListener("resize", () => {
      this.resizeConfetti();
    });
    this.resizeConfetti();
  }

  resizeConfetti() {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  triggerConfetti() {
    this.resizeConfetti();
    this.confettiParticles = [];
    const colors = ["#f59e0b", "#fbbf24", "#3b82f6", "#ef4444", "#10b981", "#ec4899", "#ffffff"];

    for (let i = 0; i < 120; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * -this.confettiCanvas.height,
        w: Math.random() * 9 + 5,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    if (!this.isConfettiRunning) {
      this.isConfettiRunning = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.isConfettiRunning) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    let activeCount = 0;
    this.confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;

      if (p.y < this.confettiCanvas.height + 20) {
        activeCount++;
        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate((p.rot * Math.PI) / 180);
        this.confettiCtx.fillStyle = p.color;
        this.confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        this.confettiCtx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.isConfettiRunning = false;
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }

  getOvrTierData(ovr) {
    const val = Math.round(Number(ovr) || 50);
    if (val >= 90) {
      return {
        tierClass: "ovr-tier-elite",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.45)",
        label: "Leyenda Histórica",
        badgeText: "ÉLITE"
      };
    } else if (val >= 80) {
      return {
        tierClass: "ovr-tier-high",
        color: "#22c55e",
        glow: "rgba(34, 197, 94, 0.4)",
        label: "Destacado",
        badgeText: "FIGURA"
      };
    } else if (val >= 70) {
      return {
        tierClass: "ovr-tier-mid",
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.4)",
        label: "Competitivo",
        badgeText: "TITULAR"
      };
    } else if (val >= 60) {
      return {
        tierClass: "ovr-tier-dev",
        color: "#f97316",
        glow: "rgba(249, 115, 22, 0.4)",
        label: "En Ascenso",
        badgeText: "PROMESA"
      };
    } else {
      return {
        tierClass: "ovr-tier-low",
        color: "#ef4444",
        glow: "rgba(239, 68, 68, 0.4)",
        label: "En Formación",
        badgeText: "DESAFÍO"
      };
    }
  }

  async abrirModalCompartirFicha() {
    if (!this.modalShareCard) return;

    this.playBeepSound(650);
    this.modalShareCard.classList.add("active");
    this.modalShareCard.setAttribute("aria-hidden", "false");

    if (this.shareCardLoading) this.shareCardLoading.style.display = "flex";
    if (this.shareCardPreviewImg) this.shareCardPreviewImg.style.display = "none";

    await this.generarFichaImage();
  }

  cerrarModalCompartirFicha() {
    if (!this.modalShareCard) return;
    this.modalShareCard.classList.remove("active");
    this.modalShareCard.setAttribute("aria-hidden", "true");
  }

  async generarFichaImage() {
    const card = document.getElementById("graduate-card");
    const sanitizedName = (this.simulador?.nombre || "Estudiante").replace(/[^a-zA-Z0-9_-]/g, "_");
    const ovr = this.simulador?.stats?.overall || 80;
    const fileName = `Ficha_Estudiantina_${sanitizedName}_${ovr}OVR.png`;

    this.currentCardFileName = fileName;
    this.currentCardTitle = `Ficha Oficial de Egresado - ${this.simulador?.nombre || 'Estudiante'} (${ovr} OVR)`;
    this.currentCardText = `🎓 ¡Mi trayectoria en la Estudiantina de Posadas con ${this.simulador?.colegioActual?.apodo || 'mi colegio'}! Calificación Oficial: ⭐ ${ovr} OVR. ¡Simulá tu carrera en estudiantina.online!`;

    try {
      if (typeof html2canvas !== "undefined" && card) {
        const canvas = await html2canvas(card, {
          backgroundColor: "#07080a",
          scale: 2, // 2x para nitidez HD en historias de Instagram y estados
          useCORS: true,
          logging: false,
          allowTaint: true
        });

        const dataUrl = canvas.toDataURL("image/png");
        this.currentCardDataUrl = dataUrl;

        canvas.toBlob(blob => {
          this.currentCardBlob = blob;
        }, "image/png");

        if (this.shareCardPreviewImg) {
          this.shareCardPreviewImg.src = dataUrl;
          this.shareCardPreviewImg.style.display = "block";
        }
        if (this.shareCardLoading) {
          this.shareCardLoading.style.display = "none";
        }
      } else {
        this.generarFichaCanvasNativoPreview(fileName);
      }
    } catch (err) {
      console.error("Error generando ficha con html2canvas:", err);
      this.generarFichaCanvasNativoPreview(fileName);
    }
  }

  generarFichaCanvasNativoPreview(fileName) {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = 800;
      const h = 1000;
      canvas.width = w;
      canvas.height = h;

      const col = this.simulador?.colegioActual || { apodo: "Colegio", colores: { primary: "#1d4ed8", secondary: "#facc15" } };
      const ovr = this.simulador?.stats?.overall || 80;
      const nombre = this.simulador?.nombre || "Estudiante";

      // Fondo degradado cósmico/obsidiana de lujo
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#161928");
      bgGrad.addColorStop(0.5, "#0d0f19");
      bgGrad.addColorStop(1, "#07080f");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Marca de agua de fondo
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-15 * Math.PI / 180);
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.font = "900 140px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ESTUDIANTINA", 0, 0);
      ctx.restore();

      // Marco dorado exterior de colección
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, w - 48, h - 48);

      ctx.strokeStyle = "rgba(254, 240, 138, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(32, 32, w - 64, h - 64);

      // Cabecera Oficial
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🏅 ESTUDIANTINA DE POSADAS • FICHA OFICIAL 🏅", w / 2, 70);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText("CREDENCIAL OFICIAL DE EGRESADO • EDICIÓN HISTÓRICA", w / 2, 92);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 108);
      ctx.lineTo(w - 60, 108);
      ctx.stroke();

      // Medallón de Avatar Circular con Anillo Dorado
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2 - 130, 195, 55, 0, Math.PI * 2);
      ctx.fillStyle = "#1e2438";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = "52px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.simulador?.rubro?.icono || "🥁", w / 2 - 130, 195);

      // Escudo del colegio en mini pin
      ctx.beginPath();
      ctx.arc(w / 2 - 95, 230, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#0f111c";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = "18px sans-serif";
      ctx.fillText(col.escudo || "⚙️", w / 2 - 95, 230);
      ctx.restore();

      // Escudo OVR Hero
      const ovrTier = this.getOvrTierData(ovr);
      ctx.save();
      ctx.fillStyle = "rgba(20, 24, 38, 0.95)";
      ctx.strokeStyle = ovrTier.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(w / 2 + 30, 138, 170, 115, [18]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = ovrTier.color;
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OVR GENERAL", w / 2 + 115, 162);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 52px Outfit, sans-serif";
      ctx.fillText(`${ovr}`, w / 2 + 115, 215);

      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillText(ovrTier.label.toUpperCase(), w / 2 + 115, 238);
      ctx.restore();

      // Nombre del Estudiante
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 38px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(nombre, w / 2, 310);

      // Apodo en Cinta Dorada
      ctx.fillStyle = "#fef08a";
      ctx.font = "italic 800 24px Inter, sans-serif";
      ctx.fillText(`"${this.simulador?.generarApodoPersonalizado?.() || 'El Pulso de Oro'}"`, w / 2, 348);

      // Colegio y Rol
      ctx.fillStyle = "#93c5fd";
      ctx.font = "bold 18px Inter, sans-serif";
      ctx.fillText(`${col.apodo} • Egresado/a`, w / 2, 382);

      // 3 Pilares de Estadísticas
      const stats = this.simulador?.stats || { ritmo: 85, hinchada: 85, resistencia: 85 };
      const statBoxes = [
        { label: "RITMO", icon: "🥁", val: stats.ritmo, x: 80 },
        { label: "HINCHADA", icon: "📣", val: stats.hinchada, x: 290 },
        { label: "AGUANTE", icon: "⚡", val: stats.resistencia, x: 500 }
      ];

      statBoxes.forEach(s => {
        ctx.fillStyle = "rgba(14, 18, 28, 0.9)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(s.x, 430, 210, 85, [14]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${s.icon} ${s.label}`, s.x + 105, 456);

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 28px Outfit, sans-serif";
        ctx.fillText(`${s.val}`, s.x + 105, 490);

        // Barra de progreso
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.roundRect(s.x + 20, 500, 170, 5, [3]);
        ctx.fill();

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.roundRect(s.x + 20, 500, (s.val / 100) * 170, 5, [3]);
        ctx.fill();
      });

      // Panel de Palmarés y Copas de Lujo
      ctx.fillStyle = "rgba(20, 17, 12, 0.95)";
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(80, 560, w - 160, 100, [16]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🏆 PALMARÉS DE LA COSTANERA", w / 2, 595);

      const copas = this.simulador?.getTitulosOro?.() ?? 0;
      const copasChallenger = this.simulador?.titulosChallenger || 0;
      const totalPodios = this.simulador?.getPodiosTotales?.() ?? 0;
      const subs = this.simulador?.tablaHistorica?.filter(t => t.podio === 2).length || 0;
      const ter = this.simulador?.tablaHistorica?.filter(t => t.podio === 3).length || 0;

      let textoCopas = "";
      if (copas > 0) {
        textoCopas = copasChallenger > 0
          ? `🏆 ${copas} Copa(s) de Oro (🌟 ${copasChallenger} Challenger) • ${totalPodios} Podios Totales`
          : `🏆 ${copas} Copa(s) de Oro • ${totalPodios} Podio(s) Totales`;
      } else if (totalPodios > 0) {
        textoCopas = `🥈 ${subs} Subcampeonato(s) • 🥉 ${ter} 3º Puesto(s) • ${totalPodios} Podios (0 Oros)`;
      } else {
        textoCopas = `🎖️ Mención de Honor Oficial • Sin podios alcanzados`;
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Inter, sans-serif";
      ctx.fillText(textoCopas, w / 2, 632);

      // Pie y Certificación
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(60, h - 90);
      ctx.lineTo(w - 60, h - 90);
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("FICHA OFICIAL #EST-2026", 60, h - 60);

      ctx.fillStyle = "#64748b";
      ctx.textAlign = "right";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.fillText("estudiantina.online • Simulador de Carrera", w - 60, h - 60);

      const dataUrl = canvas.toDataURL("image/png");
      this.currentCardDataUrl = dataUrl;

      canvas.toBlob(blob => {
        this.currentCardBlob = blob;
      }, "image/png");

      if (this.shareCardPreviewImg) {
        this.shareCardPreviewImg.src = dataUrl;
        this.shareCardPreviewImg.style.display = "block";
      }
      if (this.shareCardLoading) {
        this.shareCardLoading.style.display = "none";
      }
    } catch (e) {
      console.error(e);
      if (this.shareCardLoading) {
        this.shareCardLoading.innerHTML = "<p style='color: #f87171;'>No se pudo generar la vista previa.</p>";
      }
    }
  }

  async compartirFichaRedes() {
    this.playBeepSound(700);

    // 1. Intentar Web Share API con archivo si el navegador lo soporta (móviles Android/iOS)
    if (this.currentCardBlob && navigator.canShare) {
      const file = new File([this.currentCardBlob], this.currentCardFileName || "Ficha_APES.png", { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: this.currentCardTitle,
            text: this.currentCardText,
            url: "https://estudiantina.online"
          });
          this.showToast("¡Ficha compartida exitosamente! 📲✨");
          return;
        } catch (shareErr) {
          if (shareErr.name === "AbortError") return; // Usuario canceló el modal nativo
          console.warn("Error en share con archivo, probando alternativa:", shareErr);
        }
      }
    }

    // 2. Si navigator.share soporta texto y URL
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.currentCardTitle,
          text: this.currentCardText,
          url: "https://estudiantina.online"
        });
        // Además descargamos la imagen para que el usuario la tenga
        if (this.currentCardDataUrl) {
          this.forzarDescargaDataUrl(this.currentCardDataUrl, this.currentCardFileName || "Ficha_APES.png");
        }
        this.showToast("¡Compartido! Además descargamos tu imagen HD 📸");
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    // 3. Fallback de escritorio: Descargar la imagen y copiar el resumen al portapapeles
    if (this.currentCardDataUrl) {
      this.forzarDescargaDataUrl(this.currentCardDataUrl, this.currentCardFileName || "Ficha_APES.png");
    }
    this.copiarResumenAlPortapapeles();
    this.showToast("📸 ¡Imagen descargada y texto copiado para pegar en tus redes!");
  }

  descargarFichaDesdePreview() {
    if (!this.currentCardDataUrl) {
      this.showToast("Generando imagen para descargar...");
      this.generarFichaImage().then(() => {
        if (this.currentCardDataUrl) {
          this.forzarDescargaDataUrl(this.currentCardDataUrl, this.currentCardFileName || "Ficha_APES.png");
        }
      });
      return;
    }
    this.forzarDescargaDataUrl(this.currentCardDataUrl, this.currentCardFileName || "Ficha_APES.png");
  }

  forzarDescargaDataUrl(dataUrl, fileName) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("¡Ficha descargada! Lista para subir a tus redes 📲");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.estudiantinaApp = new EstudiantinaApp();
  UsuarioService.initGlobalNavUser({ container: "global-nav-user", sourcePage: "home" });
});
