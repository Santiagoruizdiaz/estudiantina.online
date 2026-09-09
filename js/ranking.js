/**
 * Módulo de Salón de la Fama y Rankings Globales Oficiales - Estudiantina de Posadas
 * Gestiona la sincronización en línea con el servidor (api/ranking.php / api/ranking)
 * y persiste caché local para máxima resiliencia offline.
 */

import { COLEGIOS } from "./colegios.js?v=20260904_8";

const STORAGE_KEY_PLAYERS = "estudiantina_jugadores_ranking_v3";
const STORAGE_KEY_COLLEGES = "estudiantina_colegios_stats_v3";
const MAX_TOP_PLAYERS = 10;

class RankingManager {
  constructor() {
    this.memoryJugadores = [];
    this.memoryColegios = {};
    this.initStorage();
    // Carga inicial en segundo plano desde el backend global
    this.cargarRankingGlobal();
  }

  /**
   * Inicializa las entradas locales desde 0 y limpia versiones viejas
   */
  initStorage() {
    try {
      localStorage.removeItem("estudiantina_jugadores_ranking_v1");
      localStorage.removeItem("estudiantina_colegios_stats_v1");
      localStorage.removeItem("estudiantina_jugadores_ranking_v2");
      localStorage.removeItem("estudiantina_colegios_stats_v2");

      const rawPlayers = localStorage.getItem(STORAGE_KEY_PLAYERS);
      if (!rawPlayers) {
        this.savePlayers([]);
      } else {
        const parsed = JSON.parse(rawPlayers) || [];
        // Purgar cualquier rastro de la ESMU
        const cleaned = parsed.filter(p => p.colegioId !== "esmu" && !p.colegioNombre?.toLowerCase().includes("esmu"));
        this.memoryJugadores = cleaned;
        if (cleaned.length !== parsed.length) {
          this.savePlayers(cleaned);
        }
      }

      const rawColleges = localStorage.getItem(STORAGE_KEY_COLLEGES);
      if (!rawColleges) {
        this.saveColegiosStats({});
      } else {
        const parsedCol = JSON.parse(rawColleges) || {};
        if (parsedCol.esmu) {
          delete parsedCol.esmu;
          this.saveColegiosStats(parsedCol);
        }
        this.memoryColegios = parsedCol;
      }
    } catch (e) {
      this.memoryJugadores = [];
      this.memoryColegios = {};
    }
  }

  /**
   * Sincroniza el ranking global con el servidor (estudiantina.online / local)
   */
  async cargarRankingGlobal() {
    // Intentar primero con la ruta limpia /api/ranking, fallback a api/ranking.php y /data/ranking.json
    const endpoints = ["/api/ranking", "api/ranking.php", "data/ranking.json"];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const top = Array.isArray(data.top10) ? data.top10 : Array.isArray(data) ? data : null;
            if (top) {
              this.savePlayers(top);
            }
            if (data.colegios && typeof data.colegios === "object") {
              this.saveColegiosStats(data.colegios);
            }
            return {
              top10: this.getTop10Players(),
              colegios: this.getColegiosStats()
            };
          }
        }
      } catch (err) {
        // Continuar al fallback
      }
    }

    return {
      top10: this.getTop10Players(),
      colegios: this.getColegiosStats()
    };
  }

  /**
   * Obtiene la lista actual de jugadores del Top 10
   */
  getTop10Players() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLAYERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(p => p.colegioId !== "esmu" && !p.colegioNombre?.toLowerCase().includes("esmu"))
            .slice(0, MAX_TOP_PLAYERS);
        }
      }
    } catch (e) {
      if (this.memoryJugadores) {
        return this.memoryJugadores
          .filter(p => p.colegioId !== "esmu" && !p.colegioNombre?.toLowerCase().includes("esmu"))
          .slice(0, MAX_TOP_PLAYERS);
      }
    }
    return [];
  }

  /**
   * Guarda de forma segura la lista de jugadores (máximo 10)
   */
  savePlayers(playersList) {
    const cleaned = (playersList || []).filter(p => p.colegioId !== "esmu" && !p.colegioNombre?.toLowerCase().includes("esmu"));
    const trimmed = cleaned.slice(0, MAX_TOP_PLAYERS);
    this.memoryJugadores = trimmed;
    try {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(trimmed));
    } catch (e) {
      // Ignorar fallback
    }
  }

  /**
   * Obtiene el diccionario de estadísticas de colegios
   */
  getColegiosStats() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COLLEGES);
      if (raw) {
        return JSON.parse(raw) || {};
      }
    } catch (e) {
      if (this.memoryColegios) return this.memoryColegios;
    }
    return this.memoryColegios || {};
  }

  /**
   * Guarda el diccionario de estadísticas de colegios
   */
  saveColegiosStats(stats) {
    this.memoryColegios = stats || {};
    try {
      localStorage.setItem(STORAGE_KEY_COLLEGES, JSON.stringify(this.memoryColegios));
    } catch (e) {
      // Ignorar fallback
    }
  }

  /**
   * Registra el inicio de una carrera escolar globalmente
   */
  registrarInicioCarrera(colegioId) {
    if (!colegioId) return;

    // Actualizar caché local
    const stats = this.getColegiosStats();
    if (!stats[colegioId]) {
      stats[colegioId] = {
        partidasIniciadas: 0,
        temporadasJugadas: 0,
        titulosOro: 0,
        podiosTotales: 0
      };
    }
    stats[colegioId].partidasIniciadas = (stats[colegioId].partidasIniciadas || 0) + 1;
    this.saveColegiosStats(stats);

    // Enviar al servidor en segundo plano
    this.enviarAlServidor({
      action: "registrarInicio",
      colegioId
    });
  }

  /**
   * Registra una temporada disputada por un colegio globalmente
   */
  registrarTemporadaColegio(colegioId, puesto) {
    if (!colegioId) return;

    // Actualizar local
    const stats = this.getColegiosStats();
    if (!stats[colegioId]) {
      stats[colegioId] = {
        partidasIniciadas: 0,
        temporadasJugadas: 0,
        titulosOro: 0,
        podiosTotales: 0
      };
    }
    stats[colegioId].temporadasJugadas = (stats[colegioId].temporadasJugadas || 0) + 1;
    if (puesto === 1) {
      stats[colegioId].titulosOro = (stats[colegioId].titulosOro || 0) + 1;
    }
    if (puesto >= 1 && puesto <= 3) {
      stats[colegioId].podiosTotales = (stats[colegioId].podiosTotales || 0) + 1;
    }
    this.saveColegiosStats(stats);

    // Enviar al servidor en segundo plano
    this.enviarAlServidor({
      action: "registrarTemporada",
      colegioId,
      puesto
    });
  }

  /**
   * Envía datos en segundo plano a la API del servidor
   */
  async enviarAlServidor(body) {
    const endpoints = ["/api/ranking", "api/ranking.php"];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        if (res.ok) return true;
      } catch (e) {
        // Reintentar con siguiente endpoint
      }
    }
    return false;
  }

  /**
   * Criterio de ordenamiento principal por Overall (OVR)
   */
  compararPorOVR(a, b) {
    if (b.ovr !== a.ovr) return b.ovr - a.ovr;
    if (b.titulosOro !== a.titulosOro) return b.titulosOro - a.titulosOro;
    if (b.podiosTotales !== a.podiosTotales) return b.podiosTotales - a.podiosTotales;
    if (b.ritmo !== a.ritmo) return (b.ritmo || 0) - (a.ritmo || 0);
    return (b.hinchada || 0) - (a.hinchada || 0);
  }

  /**
   * Registra un egresado al completar su carrera escolar en el servidor global.
   * Si califica en el Top 10 histórico, se almacena en data/ranking.json en el servidor.
   * @param {Object} egresado 
   * @returns {Promise<Object>} { entroTop10: boolean, posicionOVR: number, registro: Object }
   */
  async registrarEgresado(egresado) {
    if (!egresado) return { entroTop10: false };

    const payload = {
      action: "registrarEgresado",
      egresado
    };

    const endpoints = ["/api/ranking", "api/ranking.php"];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === "ok") {
            if (Array.isArray(data.top10)) {
              this.savePlayers(data.top10);
            }
            return {
              entroTop10: Boolean(data.entroTop10),
              posicionOVR: Number(data.posicionOVR) || 0,
              registro: data.registro || egresado
            };
          }
        }
      } catch (e) {
        // Fallback al siguiente endpoint
      }
    }

    // Fallback local seguro si no hay conexión al servidor
    return this.registrarEgresadoLocal(egresado);
  }

  /**
   * Fallback local offline si el servidor no responde
   */
  registrarEgresadoLocal(egresado) {
    const topList = this.getTop10Players();
    const nuevoRegistro = {
      id: "player_" + Date.now(),
      nombre: egresado.nombre || "Estudiante Egresado",
      apodoJugador: egresado.apodoJugador || "",
      colegioId: egresado.colegioId || "janssen",
      colegioNombre: egresado.colegioNombre || "Colegio de Posadas",
      colegioApodo: egresado.colegioApodo || "Colegio",
      escudo: egresado.escudo || "🥁",
      rubroNombre: egresado.rubroNombre || "Banda de Música",
      rolNombre: egresado.rolNombre || "Integrante",
      ovr: Number(egresado.ovr) || 50,
      titulosOro: Number(egresado.titulosOro) || 0,
      titulosChallenger: Number(egresado.titulosChallenger) || 0,
      podiosTotales: Number(egresado.podiosTotales) || 0,
      ritmo: Number(egresado.ritmo) || 50,
      hinchada: Number(egresado.hinchada) || 50,
      resistencia: Number(egresado.resistencia) || 50,
      anios: Number(egresado.anios) || 5,
      fecha: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
    };

    const candidatos = [...topList, nuevoRegistro].sort((a, b) => this.compararPorOVR(a, b));
    const indexOVR = candidatos.findIndex(p => p.id === nuevoRegistro.id);
    const entroTop10 = indexOVR >= 0 && indexOVR < MAX_TOP_PLAYERS;

    if (entroTop10) {
      const nuevaLista = candidatos.slice(0, MAX_TOP_PLAYERS);
      this.savePlayers(nuevaLista);
    }

    return {
      entroTop10,
      posicionOVR: indexOVR + 1,
      registro: nuevoRegistro
    };
  }

  /**
   * Obtiene la lista del Top 10 ordenada por OVR
   */
  getRankingPorOVR() {
    const list = this.getTop10Players();
    return list.sort((a, b) => this.compararPorOVR(a, b));
  }

  /**
   * Obtiene el listado de colegios ordenados por popularidad y desempeño
   */
  getRankingColegios() {
    const stats = this.getColegiosStats();
    
    const colegiosList = COLEGIOS
      .filter(col => col.id !== "esmu" && !col.nombre.toLowerCase().includes("esmu"))
      .map(col => {
        const colStat = stats[col.id] || {
          partidasIniciadas: 0,
          temporadasJugadas: 0,
          titulosOro: 0,
          podiosTotales: 0
        };

      const efectividadOro = colStat.temporadasJugadas > 0
        ? Math.round((colStat.titulosOro / colStat.temporadasJugadas) * 100)
        : 0;

      return {
        ...col,
        partidasIniciadas: colStat.partidasIniciadas || 0,
        temporadasJugadas: colStat.temporadasJugadas || 0,
        titulosOro: colStat.titulosOro || 0,
        podiosTotales: colStat.podiosTotales || 0,
        efectividadOro
      };
    });

    colegiosList.sort((a, b) => {
      if (b.partidasIniciadas !== a.partidasIniciadas) return b.partidasIniciadas - a.partidasIniciadas;
      if (b.temporadasJugadas !== a.temporadasJugadas) return b.temporadasJugadas - a.temporadasJugadas;
      if (b.titulosOro !== a.titulosOro) return b.titulosOro - a.titulosOro;
      return a.tier - b.tier;
    });

    return colegiosList;
  }

  /**
   * Obtiene el listado de colegios ordenados estrictamente por palmarés de títulos (Colegios Más Ganadores)
   * Criterio: Copas de Oro > Podios Totales > % Efectividad de Campeonatos > Temporadas Jugadas
   */
  getRankingColegiosMasGanadores() {
    const stats = this.getColegiosStats();
    
    const colegiosList = COLEGIOS
      .filter(col => col.id !== "esmu" && !col.nombre.toLowerCase().includes("esmu"))
      .map(col => {
        const colStat = stats[col.id] || {
          partidasIniciadas: 0,
          temporadasJugadas: 0,
          titulosOro: 0,
          podiosTotales: 0
        };

        const efectividadOro = colStat.temporadasJugadas > 0
          ? Math.round((colStat.titulosOro / colStat.temporadasJugadas) * 100)
          : 0;

        return {
          ...col,
          partidasIniciadas: colStat.partidasIniciadas || 0,
          temporadasJugadas: colStat.temporadasJugadas || 0,
          titulosOro: colStat.titulosOro || 0,
          podiosTotales: colStat.podiosTotales || 0,
          efectividadOro
        };
      });

    colegiosList.sort((a, b) => {
      if (b.titulosOro !== a.titulosOro) return b.titulosOro - a.titulosOro;
      if (b.podiosTotales !== a.podiosTotales) return b.podiosTotales - a.podiosTotales;
      if (b.efectividadOro !== a.efectividadOro) return b.efectividadOro - a.efectividadOro;
      if (b.temporadasJugadas !== a.temporadasJugadas) return b.temporadasJugadas - a.temporadasJugadas;
      return a.tier - b.tier;
    });

    return colegiosList;
  }
}

export const rankingManager = new RankingManager();
