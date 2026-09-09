/**
 * Motor de Simulación de Carrera - Modo Normal (Fiel a Copero)
 * Estudiantina de Posadas:
 * - Temporadas largas y detalladas: Ensayos, Pruebas Piloto, Noches de Calle, Anfiteatro + Evento Sorpresa (Mala Suerte / Giro de Destino).
 * - Mercado de pases realista y coherente con la jerarquía escolar.
 */
import { COLEGIOS, getColegioById, getColegiosPorRubro } from "./colegios.js?v=20260904_8";
import { getRolById } from "./roles.js?v=20260904_8";
import { getEventosPorAnioYFases, getRandomEventoSorpresa, getEventosPorTemporada, generarEventoSuspensionAPES } from "./eventos.js?v=20260904_8";

export const LOGROS_DEFINICIONES = [
  {
    id: "lealtad_en_la_proscripcion",
    titulo: "Aguante en la Sanción",
    descripcion: "Mantenerte leal a tu colegio cuando el tribunal suspendió a tu escuela de la Estudiantina.",
    icono: "🏛️"
  },
  {
    id: "dueno_costanera",
    titulo: "Dueño de la Costanera",
    descripcion: "Ganar el 1º puesto de tu rubro en tu último año escolar.",
    icono: "👑"
  },
  {
    id: "bicampeon",
    titulo: "Bicampeón de Oro",
    descripcion: "Ganar 2 o más títulos de 1º puesto a lo largo de tu secundaria.",
    icono: "🏆"
  },
  {
    id: "copa_challenger",
    titulo: "Copa Challenger",
    descripcion: "Ganar la Estudiantina 3 años consecutivos con tu colegio y consagrar el título de Challenger histórico.",
    icono: "🌟"
  },
  {
    id: "ascenso_pilar",
    titulo: "Pilar de Fila",
    descripcion: "Ganarte los galones de Pilar de Instrumento por tu rendimiento en los ensayos.",
    icono: "🛡️"
  },
  {
    id: "director_leyenda",
    titulo: "Director/a Histórico",
    descripcion: "Llegar a la dirección general de Banda o Cuerpo de Baile con el silbato de oro.",
    icono: "⭐"
  },
  {
    id: "superviviente_infortunio",
    titulo: "A Prueba de Balas",
    descripcion: "Superar con éxito un evento crítico de mala suerte (tendinitis, parche roto, veedor).",
    icono: "🩹"
  },
  {
    id: "traicion_historica",
    titulo: "Pase Bomba",
    descripcion: "Aceptar la oferta de cambio y defender los colores de otro colegio.",
    icono: "🔄"
  },
  {
    id: "expulsado_resiliente",
    titulo: "Resucitado de las Cenizas",
    descripcion: "Ser echado de tu colegio y salir campeón con otra escuela.",
    icono: "🔥"
  },
  {
    id: "gloria_gigante",
    titulo: "Coloso del Río",
    descripcion: "Salir campeón de la Estudiantina con un GIGANTE (Janssen o La Indu).",
    icono: "⚡"
  },
  {
    id: "lealtad_eterna",
    titulo: "Camiseta Puesta",
    descripcion: "Desfilar todos los años de tu secundaria para el mismo colegio.",
    icono: "⚜️"
  },
  {
    id: "show_anfi_epico",
    titulo: "Mística en el Anfi",
    descripcion: "Obtener un puntaje superior a 9.6 en el Anfiteatro Manuel Antonio Ramírez.",
    icono: "🎭"
  },
  {
    id: "maestro_ritmo",
    titulo: "Metrónomo Humano",
    descripcion: "Alcanzar 80 o más de Ritmo & Técnica — pocos llegan a ese nivel de precisión en el 4to tramo.",
    icono: "🥁"
  },
  {
    id: "idolo_popular",
    titulo: "Ídolo de la Valla",
    descripcion: "Alcanzar 80 o más de Hinchada & Popularidad — la tribuna corea tu nombre antes de que salgas a desfilar.",
    icono: "📣"
  },
  {
    id: "egresado_oro",
    titulo: "Leyenda Estudiantil",
    descripcion: "Retirarte de la secundaria con un Overall superior a 78 — un logro que sólo consiguen los que jamás le esquivaron al esfuerzo.",
    icono: "🎓"
  }
];

export class SimuladorCarrera {
  constructor() {
    this.reset();
  }

  reset() {
    this.nombre = "";
    this.colegioActual = null;
    this.colegioOrigen = null;
    this.colegiosHistorial = [];
    this.rubro = null;
    this.rol = null;
    this.instrumentoBase = "";
    this.esPilar = false;
    this.esDirector = false;

    this.anioActual = 1;
    this.maxAnios = 5;
    this.decisionIndexInYear = 0;
    this.eventosDelAnio = [];
    this.eventoActual = null;

    this.stats = {
      ritmo: 50,
      hinchada: 50,
      resistencia: 55,
      overall: 52
    };

    this.tablaHistorica = [];
    this.copasGanadas = [];
    this.logrosDesbloqueados = [];
    this.fase = "identity";
    this.ultimoResultadoDesfile = null;
    this.fueExpulsadoAlgunaVez = false;
    this.fueSuspendidoPorApes = false;
    this.mensajeAscenso = null;
    this.bonusColegioDestacado = false;
    this.apodoPersonalizado = "";
  }

  iniciarCarrera(nombre, colegioId, rubroId, rolId, esDestacado = false) {
    this.reset();
    this.bonusColegioDestacado = !!esDestacado;
    this.nombre = nombre.trim() || "Estudiante";
    this.colegioActual = getColegioById(colegioId, rubroId);
    this.colegioOrigen = this.colegioActual;
    this.colegiosHistorial = [this.colegioActual.id];
    
    const { rubro, rol } = getRolById(rubroId, rolId);
    this.rubro = rubro;
    this.rol = rol;
    this.instrumentoBase = rol.nombre;

    this.maxAnios = this.colegioActual.tecnico ? 6 : 5;

    const baseRnd = Math.floor(Math.random() * 5); // Variación inicial natural (0 a 4)
    this.stats = {
      ritmo: 45 + baseRnd + (rol.bonus.ritmo || 0),
      hinchada: 44 + baseRnd + (rol.bonus.hinchada || 0),
      resistencia: 47 + baseRnd + (rol.bonus.resistencia || 0),
      overall: 45 + baseRnd + (rol.bonus.overall || 0)
    };

    if (this.colegioActual.especialidad.toLowerCase().includes(this.rubro.id)) {
      this.stats.overall += 2;
      this.stats.ritmo += 1;
    }

    this.fase = "career";
    this.iniciarAnio(1);
  }

  /**
   * Configura la temporada con 5 eventos:
   * 1. Ensayos
   * 2. Prueba Piloto
   * 3. Evento Sorpresa (Mala suerte o giro del destino)
   * 4. Noches de Calle
   * 5. Show en el Anfiteatro
   */
  iniciarAnio(anio) {
    this.anioActual = anio;
    this.decisionIndexInYear = 0;
    this.mensajeAscenso = null;
    
    this.evaluarAscensosInternos(anio);

    // 5 eventos con progresión realista en la temporada, adaptados al rol y colegio
    this.eventosDelAnio = getEventosPorTemporada({
      anio,
      rolId: this.rol?.id,
      rubroId: this.rubro?.id,
      esPilar: this.esPilar,
      esDirector: this.esDirector,
      colegio: this.colegioActual
    });

    // Evento ultra-raro: Suspensión Extraordinaria (1 a 3 años) con antecedentes históricos
    const suspension = this.evaluarSuspensionAPES();
    if (suspension) {
      this.eventosDelAnio[2] = suspension; // Se inserta en la ranura de evento sorpresa/giro
    }
    
    this.siguienteDecision();
  }

  evaluarSuspensionAPES() {
    if (this.fueSuspendidoPorApes) return null;

    // Probabilidades:
    // Base: 0.5% (0.005)
    // La Normal Mixta: 100% más -> 1.0% (0.01)
    // El Nacional: 50% más -> 0.75% (0.0075)
    // Colegios Técnicos: 50% menos -> 0.25% (0.0025)
    let prob = 0.005;
    if (this.colegioActual?.id === "normal_mixta") {
      prob = 0.01;
    } else if (this.colegioActual?.id === "nacional") {
      prob = 0.0075;
    } else if (this.colegioActual?.tecnico) {
      prob = 0.0025;
    }

    if (Math.random() < prob) {
      this.fueSuspendidoPorApes = true;
      const duracion = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3 años
      return generarEventoSuspensionAPES(this.colegioActual, duracion, this.anioActual, this.maxAnios);
    }
    return null;
  }

  cumplirSuspension(duracion = 1, motivo = "") {
    this.desbloquearLogro("lealtad_en_la_proscripcion");
    this.fueSuspendidoPorApes = true;

    // Bonus de lealtad por resistir junto al colegio
    this.stats.hinchada = Math.min(99, this.stats.hinchada + 8);
    this.stats.resistencia = Math.min(99, this.stats.resistencia + 4);

    const detalleRol = motivo === "robo_chanchas"
      ? "Sanción Disciplinaria (Robo de Chanchas - Suspendido)"
      : motivo === "bombas_molotov"
      ? "Sanción Disciplinaria (Bombas Molotov - Suspendido)"
      : "Sanción Disciplinaria (Descalificado - Entrenamiento a puertas cerradas)";

    // 1. Registrar el año actual como suspendido sin desfile ni puntos
    this.tablaHistorica.push({
      anioTexto: `${this.anioActual}º Año`,
      escudo: this.colegioActual.escudo,
      colegioApodo: this.colegioActual.apodo,
      tierNombre: this.colegioActual.tierNombre,
      rolTexto: detalleRol,
      palco1Score: "SUSP",
      palco2Score: "SUSP",
      anfiScore: "SUSP",
      totalScore: "0.00 (Sanción Disciplinaria)",
      ritmo: this.stats.ritmo,
      hinchada: this.stats.hinchada,
      resistencia: this.stats.resistencia,
      overall: this.stats.overall,
      podio: 0
    });

    // 2. Si la sanción abarca más de 1 año (ej. 2 o 3 años), registrar los subsiguientes
    for (let i = 1; i < duracion; i++) {
      const anioExtra = this.anioActual + i;
      if (anioExtra <= this.maxAnios) {
        this.tablaHistorica.push({
          anioTexto: `${anioExtra}º Año`,
          escudo: this.colegioActual.escudo,
          colegioApodo: this.colegioActual.apodo,
          tierNombre: this.colegioActual.tierNombre,
          rolTexto: "Sanción Disciplinaria (Proscripción continua)",
          palco1Score: "—",
          palco2Score: "—",
          anfiScore: "—",
          totalScore: "—",
          ritmo: this.stats.ritmo,
          hinchada: this.stats.hinchada,
          resistencia: this.stats.resistencia,
          overall: this.stats.overall,
          podio: 0
        });
      }
    }

    // 3. Avanzar los años de sanción cumplidos
    this.anioActual += duracion;
    if (this.anioActual > this.maxAnios) {
      this.concluirCarrera();
      return true; // Finalizó secundaria durante la sanción
    }
    return false; // Continúa secundaria tras cumplir la sanción
  }

  registrarAnioSuspendido(motivo = "") {
    this.fueSuspendidoPorApes = true;
    const detalleRol = motivo === "robo_chanchas"
      ? "Sanción Disciplinaria (Robo de Chanchas - Traspaso Exprés)"
      : motivo === "bombas_molotov"
      ? "Sanción Disciplinaria (Bombas Molotov - Traspaso Exprés)"
      : "Sanción Disciplinaria (Traspaso de Emergencia)";

    this.tablaHistorica.push({
      anioTexto: `${this.anioActual}º Año`,
      escudo: this.colegioActual.escudo,
      colegioApodo: this.colegioActual.apodo,
      tierNombre: this.colegioActual.tierNombre,
      rolTexto: detalleRol,
      palco1Score: "SUSP",
      palco2Score: "SUSP",
      anfiScore: "SUSP",
      totalScore: "0.00 (Sanción Disciplinaria)",
      ritmo: this.stats.ritmo,
      hinchada: this.stats.hinchada,
      resistencia: this.stats.resistencia,
      overall: this.stats.overall,
      podio: 0
    });
  }

  evaluarAscensosInternos(anio) {
    // Ascenso a Pilar / Bastonera en tu propio colegio (a partir de 3º año, más exigente)
    if (anio >= 3 && !this.esPilar && !this.esDirector && (this.stats.ritmo >= 70 || this.stats.overall >= 70)) {
      this.esPilar = true;
      this.desbloquearLogro("ascenso_pilar");
      this.stats.overall = this._aplicarDelta(this.stats.overall, 1, true);
      this.stats.hinchada = Math.min(99, this.stats.hinchada + 2);
      if (this.rubro?.id === "baile") {
        this.rol = { id: "bastonera_banda", nombre: "Bastonera / Destaque", rango: "Figura Estelar" };
        this.mensajeAscenso = `⭐ ¡ASCENSO! Por tu técnica, carisma y gracia en la pista, te nombraron BASTONERA DE BANDA / PASISTA DESTAQUE.`;
      } else {
        this.mensajeAscenso = `⭐ ¡ASCENSO! Por tu nivel en los ensayos, la comisión te nombró PILAR de ${this.instrumentoBase}.`;
      }
    }

    // Ascenso a Director/a (a partir de 4º/5º año, muy exigente)
    if (anio >= 5 && !this.esDirector && (this.stats.overall >= 80 || this.stats.ritmo >= 82)) {
      this.esDirector = true;
      this.esPilar = true;
      this.desbloquearLogro("director_leyenda");
      // Si el estudiante tiene mucho nivel y suerte, consagra su liderazgo con +1 OVR
      if (this.stats.overall >= 84 && Math.random() < 0.35) {
        this.stats.overall = Math.min(99, this.stats.overall + 1);
      }
      this.stats.hinchada = Math.min(99, this.stats.hinchada + 3);
      if (this.rubro?.id === "baile") {
        this.rol = { id: "directora_baile", nombre: "Directora de Cuerpo de Baile", rango: "Jefatura Suprema" };
        this.mensajeAscenso = `👑 ¡CONSAGRACIÓN! Tus compañeras y la comisión te eligieron DIRECTORA GENERAL DE CUERPO DE BAILE.`;
      } else {
        this.mensajeAscenso = `👑 ¡CONSAGRACIÓN! Tus compañeros te eligieron DIRECTOR/A GENERAL de ${this.rubro.nombre}.`;
      }
    }
  }

  getNombreRolActual() {
    if (this.esDirector) {
      return this.rubro?.id === "baile" ? "Directora de Cuerpo de Baile" : `Director/a de ${this.rubro.nombre}`;
    }
    if (this.esPilar) {
      if (this.rubro?.id === "baile") return "Bastonera / Destaque";
      if (this.rol?.id === "ton") return "Pilar de Tones";
      if (this.rol?.id === "chancha") return "Pilar de Chanchas";
      if (this.rol?.id === "redoblante") return "Pilar de Redoblantes";
      if (this.rol?.id === "cajita") return "Pilar de Cajitas";
      return `Pilar de ${this.instrumentoBase}`;
    }
    return this.rol.nombre;
  }

  siguienteDecision() {
    if (this.decisionIndexInYear < this.eventosDelAnio.length) {
      this.eventoActual = this.eventosDelAnio[this.decisionIndexInYear];
      return { 
        tipo: "evento", 
        evento: this.eventoActual,
        eventoNumero: this.decisionIndexInYear + 1,
        totalEventos: this.eventosDelAnio.length,
        esSorpresa: !!this.eventoActual.tipo
      };
    } else {
      this.eventoActual = null;
      return { tipo: "desfile" };
    }
  }

  /**
   * Comprime un delta de stat usando rendimientos decrecientes (como Copero).
   * A mayor stat actual, más difícil es crecer.
   *   - Stat < 60:  delta * 1.0   (crecimiento normal)
   *   - Stat 60-70: delta * 0.65  (resistencia media)
   *   - Stat 70-78: delta * 0.40  (resistencia alta)
   *   - Stat 78-84: delta * 0.20  (crecimiento muy lento)
   *   - Stat 84-90: delta * 0.08  (crecimiento exótico)
   *   - Stat > 90:  delta * 0.02  (casi congelado)
   * Además, hay una probabilidad de que el crecimiento sea 0 incluso con éxito,
   * aumentando con el nivel actual.
   */
  /**
   * Comprime un delta de stat con rendimientos decrecientes y desaceleración por veteranía.
   * Regla de juego:
   * - Años 1 a 3: Curva formativa natural.
   * - A partir de 4º año: Crecimiento MÍNIMO (factor de desaceleración).
   * - Superar los 90 OVR: Reservado exclusivamente para partidas con mucha suerte.
   */
  _aplicarDelta(valorActual, delta, isOverall = false) {
    if (delta === 0) return valorActual;

    if (delta < 0) {
      // Las penalizaciones o fallas se aplican con impacto real
      return Math.max(20, valorActual + delta);
    }

    // Curva de progresión por nivel actual del atributo
    let factor;
    if (valorActual < 58)      factor = 0.54;
    else if (valorActual < 68) factor = 0.42;
    else if (valorActual < 76) factor = 0.30;
    else if (valorActual < 82) factor = 0.22;
    else if (valorActual < 86) factor = 0.16;
    else if (valorActual < 90) factor = 0.12;
    else                       factor = 0.05;

    // Regla crucial: A partir de 4º año el crecimiento es mínimo
    const anio = this.anioActual || 1;
    if (anio === 4) {
      factor *= 0.35; // Desaceleración marcada en 4to
    } else if (anio >= 5) {
      factor *= 0.20; // Crecimiento mínimo en 5to y 6to año
    }

    if (this.bonusColegioDestacado) {
      factor *= 1.05;
    }

    // Acumulación probabilística del residuo
    const floatGain = delta * factor;
    const baseInt = Math.floor(floatGain);
    const remainder = floatGain - baseInt;
    let ganancia = baseInt + (Math.random() < remainder ? 1 : 0);

    // En partidas con mucha suerte en el tramo final, tirada especial para consagrarse en 90+
    if (ganancia === 0 && valorActual >= 88 && delta >= 2 && Math.random() < 0.12) {
      ganancia = 1;
    }

    return Math.min(99, valorActual + ganancia);
  }

  tomarDecision(opcionId) {
    if (!this.eventoActual) return null;

    const opcion = this.eventoActual.opciones.find(o => o.id === opcionId);
    if (!opcion) return null;

    const roll = Math.random();
    // 10% más de probabilidad de éxito implícito si el colegio es destacado (excepto en eventos 50/50 puros)
    let probExito = opcion.probabilidad;
    if (this.bonusColegioDestacado && opcion.probabilidad !== 0.5) {
      probExito = Math.min(0.97, probExito * 1.10);
    }
    const esExito = roll <= probExito;
    const resultadoBase = esExito ? opcion.exito : (opcion.fracaso || opcion.exito);

    // Si la opción es de Alto Riesgo y salió bien, bonificar con 25% más de puntos
    const esAltoRiesgo = String(opcion.riesgo || "").trim().toLowerCase() === "alto";
    const resultado = { ...resultadoBase };
    let bonoAltoRiesgo = false;

    if (esAltoRiesgo && esExito) {
      bonoAltoRiesgo = true;
      if (resultado.ritmo && resultado.ritmo > 0) {
        resultado.ritmo = Math.max(1, Math.round(resultado.ritmo * 1.25));
      }
      if (resultado.hinchada && resultado.hinchada > 0) {
        resultado.hinchada = Math.max(1, Math.round(resultado.hinchada * 1.25));
      }
      if (resultado.resistencia && resultado.resistencia > 0) {
        resultado.resistencia = Math.max(1, Math.round(resultado.resistencia * 1.25));
      }
      if (resultado.overall && resultado.overall > 0) {
        resultado.overall = Math.max(1, Math.round(resultado.overall * 1.25));
      }
    }

    // Guardar stats ANTES para calcular los deltas reales mostrados
    const statsPrev = { ...this.stats };

    // Aplicar cada sub-stat con compresión
    this.stats.ritmo       = this._aplicarDelta(this.stats.ritmo,       resultado.ritmo       || 0);
    this.stats.hinchada    = this._aplicarDelta(this.stats.hinchada,    resultado.hinchada    || 0);
    this.stats.resistencia = this._aplicarDelta(this.stats.resistencia, resultado.resistencia || 0);

    // Overall crece de forma controlada
    const deltaOverallRaw = resultado.overall || 0;
    this.stats.overall = this._aplicarDelta(this.stats.overall, deltaOverallRaw, true);

    // Si fue Alto Riesgo con Éxito y por compresión el delta de overall quedó en 0 habiendo delta > 0,
    // asegurar al menos +1 punto de recompensa
    if (bonoAltoRiesgo && deltaOverallRaw > 0 && this.stats.overall === statsPrev.overall && this.stats.overall < 99) {
      this.stats.overall = Math.min(99, this.stats.overall + 1);
    }

    if (this.eventoActual.tipo === "mala_suerte" && esExito) {
      this.desbloquearLogro("superviviente_infortunio");
    }

    if (resultado.esDirector) {
      this.esDirector = true;
      this.esPilar = true;
      this.desbloquearLogro("director_leyenda");
    }

    let colegioNuevo = null;
    if (resultado.cambioColegio) {
      const rivalId = this.colegioActual.rivalHistorico || "industrial";
      colegioNuevo = getColegioById(rivalId);
      this.colegioActual = colegioNuevo;
      this.maxAnios = this.colegioActual.tecnico ? 6 : 5;
      if (!this.colegiosHistorial.includes(colegioNuevo.id)) {
        this.colegiosHistorial.push(colegioNuevo.id);
      }
      this.desbloquearLogro("traicion_historica");
    }

    // Deltas reales (lo que realmente cambió, puede ser 0 si no hubo crecimiento)
    const decisionLog = {
      eventoTitulo: this.eventoActual.titulo,
      faseNombre: this.eventoActual.faseNombre || "Giro del Destino",
      opcionTexto: opcion.texto,
      esExito,
      esAltoRiesgo,
      bonoAltoRiesgo,
      esMalaSuerte: this.eventoActual.tipo === "mala_suerte",
      mensaje: resultado.mensaje,
      statsDelta: {
        ritmo:       this.stats.ritmo       - statsPrev.ritmo,
        hinchada:    this.stats.hinchada    - statsPrev.hinchada,
        resistencia: this.stats.resistencia - statsPrev.resistencia,
        overall:     this.stats.overall     - statsPrev.overall
      }
    };

    if (resultado.abrirTraspasoEmergencia) {
      decisionLog.abrirTraspasoEmergencia = true;
    }

    if (resultado.esSuspensionAPES || resultado.bancarSuspension) {
      decisionLog.esSuspensionAPES = true;
      decisionLog.bancarSuspension = true;
      decisionLog.duracionSancion = resultado.duracionSancion || 1;
      decisionLog.motivoSuspension = resultado.motivoSuspension || "incidentes_apes";
    }

    this.decisionIndexInYear++;

    return {
      esExito,
      decisionLog,
      statsActuales: { ...this.stats },
      colegioNuevo
    };
  }

  simularNochesYPalcos() {
    const baseOverall = this.stats.overall;
    const overallFactor = this.stats.overall / 100;
    const factorRitmo = this.stats.ritmo / 100;
    const factorHinchada = this.stats.hinchada / 100;
    const factorResistencia = this.stats.resistencia / 100;

    // Calibración de dificultad por jerarquía de colegios:
    // En los siguientes OVR umbrales, la probabilidad de victoria está calibrada a ~60% (con podio asegurado ~99%):
    // - GIGANTES (Tier 1): A partir de 80 OVR (~60% victorias)
    // - HISTÓRICOS (Tier 2): A partir de 82 OVR (~60% victorias)
    // - GRANDES (Tier 3): A partir de 83 OVR (~60% victorias)
    // - COMPETITIVOS (Tier 4): A partir de 85 OVR (~60% victorias)
    // - EMERGENTES (Tier 5): A partir de 86 OVR (~60% victorias)
    const UMBRALES_FACIL = { 1: 80, 2: 82, 3: 83, 4: 85, 5: 86 };
    const TARGET_BASE = { 1: 9.480, 2: 9.507, 3: 9.514, 4: 9.508, 5: 9.512 };

    const tier = this.colegioActual.tier || 5;
    const umbral = UMBRALES_FACIL[tier] || 86;
    const diffUmbral = baseOverall - umbral;

    // En el umbral el rendimiento base se sitúa en ~9.48 - 9.51 por noche (~60% victorias),
    // escalando proporcionalmente con el OVR
    const basePuntaje = (TARGET_BASE[tier] || 9.512) + (diffUmbral * 0.045);

    // Ajustes por desempeño en atributos clave de cada noche:
    // Palco 1: Ritmo y sincronización musical
    // Palco 2: Aliento, despliegue y fervor de Hinchada
    // Anfiteatro: Resistencia física en el show final
    const statDelta1 = (factorRitmo - overallFactor) * 0.5;
    const statDelta2 = (factorHinchada - overallFactor) * 0.5;
    const statDeltaAnfi = (factorResistencia - overallFactor) * 0.5;

    // Variabilidad natural de las noches de desfile
    const ruido1 = (Math.random() * 2 - 1) * 0.10;
    const ruido2 = (Math.random() * 2 - 1) * 0.10;
    const ruidoAnfi = (Math.random() * 2 - 1) * 0.10;

    const palco1 = parseFloat(Math.min(10.0, Math.max(6.0, basePuntaje + statDelta1 + ruido1)).toFixed(2));
    const palco2 = parseFloat(Math.min(10.0, Math.max(6.0, basePuntaje + statDelta2 + ruido2)).toFixed(2));
    const anfi   = parseFloat(Math.min(10.0, Math.max(6.0, basePuntaje + statDeltaAnfi + ruidoAnfi)).toFixed(2));
    const totalScore = parseFloat(((palco1 + palco2 + anfi) / 3).toFixed(2));

    if (anfi >= 9.6) {
      this.desbloquearLogro("show_anfi_epico");
    }

    // 3. GENERAR TABLA DE POSICIONES Y DETERMINAR PODIO REAL (60% vos / 40% colegio)
    const tablaPosiciones = this.generarTablaPosicionesTemporada(palco1, palco2, anfi);
    const podio = tablaPosiciones.tuColegio.posicion;

    let copasDelAnio = [];
    if (podio === 1) {
      const nombreCopa = this.getCopaNombre(1);
      copasDelAnio.push(nombreCopa);
      this.copasGanadas.push({
        anio: this.anioActual,
        puesto: 1,
        esCampeonato: true,
        nombre: nombreCopa,
        colegio: this.colegioActual.nombre,
        colegioId: this.colegioActual.id
      });

      if (this.colegioActual.tier === 1) {
        this.desbloquearLogro("gloria_gigante");
      }
      if (this.fueExpulsadoAlgunaVez) {
        this.desbloquearLogro("expulsado_resiliente");
      }

      // Verificación de Copa Challenger: 3 campeonatos consecutivos con el mismo colegio
      // Se evalúan los últimos 2 años más el año actual (3 consecutivos)
      const anioAct = this.anioActual;
      const tieneAnioPrevio = this.copasGanadas.some(c => c.puesto === 1 && c.esCampeonato && c.anio === anioAct - 1 && c.colegioId === this.colegioActual.id);
      const tieneAnioAnteprevio = this.copasGanadas.some(c => c.puesto === 1 && c.esCampeonato && c.anio === anioAct - 2 && c.colegioId === this.colegioActual.id);

      if (tieneAnioPrevio && tieneAnioAnteprevio) {
        const cantChallengerPrevias = this.titulosChallenger || 0;
        this.titulosChallenger = cantChallengerPrevias + 1;
        const ordinalChallenger = this.titulosChallenger === 1 ? "1ª" : "2ª";
        const nombreChallenger = `🌟 Copa Challenger Estudiantil (${ordinalChallenger} Copa Challenger)`;
        
        copasDelAnio.push(nombreChallenger);
        this.copasGanadas.push({
          anio: this.anioActual,
          puesto: 1,
          esChallenger: true,
          esCampeonato: false,
          nombre: nombreChallenger,
          colegio: this.colegioActual.nombre,
          colegioId: this.colegioActual.id
        });

        this.desbloquearLogro("copa_challenger");
      }
    } else if (podio === 2) {
      const nombreCopa = this.getCopaNombre(2);
      copasDelAnio.push(nombreCopa);
      this.copasGanadas.push({
        anio: this.anioActual,
        puesto: 2,
        esCampeonato: false,
        nombre: nombreCopa,
        colegio: this.colegioActual.nombre,
        colegioId: this.colegioActual.id
      });
    } else if (podio === 3) {
      const nombreCopa = this.getCopaNombre(3);
      copasDelAnio.push(nombreCopa);
      this.copasGanadas.push({
        anio: this.anioActual,
        puesto: 3,
        esCampeonato: false,
        nombre: nombreCopa,
        colegio: this.colegioActual.nombre,
        colegioId: this.colegioActual.id
      });
    }

    // Copa Espíritu Estudiantil es un reconocimiento especial de la hinchada, NO un 1º puesto de rubro
    if (this.stats.hinchada >= 82 && Math.random() < 0.25) {
      const copaHinchada = "Copa Espíritu Estudiantil (Mejor Hinchada)";
      if (!copasDelAnio.includes(copaHinchada)) {
        copasDelAnio.push(copaHinchada);
        this.copasGanadas.push({
          anio: this.anioActual,
          puesto: 0,
          esEspecial: true,
          esCampeonato: false,
          nombre: copaHinchada,
          colegio: this.colegioActual.nombre,
          colegioId: this.colegioActual.id
        });
      }
    }

    // Bicampeón requiere ganar al menos 2 campeonatos reales de 1º puesto
    const primerosPuestos = this.copasGanadas.filter(c => c.puesto === 1 && c.esCampeonato);
    if (primerosPuestos.length >= 2) this.desbloquearLogro("bicampeon");
    // Dueño de la Costanera requiere ganar el 1º puesto en el último año
    if (this.anioActual === this.maxAnios && podio === 1) this.desbloquearLogro("dueno_costanera");

    // --- Crecimiento de fin de año: PROBABILISTA y MÍNIMO A PARTIR DE 4TO ---
    const esAnioAvanzado = this.anioActual >= 4;
    const bonoPodio = podio === 1 ? 0.15 : podio === 2 ? 0.08 : 0;
    const factorAnioFin = esAnioAvanzado ? 0.40 : 1.0;

    if (Math.random() < (0.40 + bonoPodio) * factorAnioFin) {
      this.stats.ritmo = this._aplicarDelta(this.stats.ritmo, 1);
    }
    if (Math.random() < (0.35 + bonoPodio) * factorAnioFin) {
      this.stats.hinchada = this._aplicarDelta(this.stats.hinchada, 1);
    }
    if (Math.random() < (0.30 + bonoPodio) * factorAnioFin) {
      this.stats.resistencia = this._aplicarDelta(this.stats.resistencia, 1);
    }

    // Overall de fin de año (muy controlado a partir de 4to año)
    const probOverall = esAnioAvanzado
      ? (podio === 1 ? 0.15 : 0.05)
      : (podio === 1 ? 0.35 : podio === 2 ? 0.20 : 0.08);

    if (Math.random() < probOverall) {
      this.stats.overall = this._aplicarDelta(this.stats.overall, 1, true);
    }

    if (this.stats.ritmo >= 80)    this.desbloquearLogro("maestro_ritmo");
    if (this.stats.hinchada >= 80) this.desbloquearLogro("idolo_popular");
    if (this.anioActual === this.maxAnios && this.stats.overall >= 78) this.desbloquearLogro("egresado_oro");

    const filaTabla = {
      anio: this.anioActual,
      anioTexto: `${this.anioActual}º Año`,
      colegioId: this.colegioActual.id,
      colegioNombre: this.colegioActual.nombre,
      colegioApodo: this.colegioActual.apodo,
      escudo: this.colegioActual.escudo,
      tier: this.colegioActual.tier,
      tierNombre: this.colegioActual.tierNombre,
      rolTexto: this.getNombreRolActual(),
      desfiles: "4 Noches + Anfi",
      palco1Score: palco1.toFixed(2),
      palco2Score: palco2.toFixed(2),
      anfiScore: anfi.toFixed(2),
      totalScore: totalScore.toFixed(2),
      ritmo: this.stats.ritmo,
      hinchada: this.stats.hinchada,
      resistencia: this.stats.resistencia,
      overall: this.stats.overall,
      podio,
      copas: copasDelAnio,
      tablaPosiciones
    };

    this.tablaHistorica.push(filaTabla);
    this.ultimoResultadoDesfile = filaTabla;

    return filaTabla;
  }

  generarTablaPosicionesTemporada(palco1, palco2, anfi) {
    const playerPts = parseFloat((parseFloat(palco1) + parseFloat(palco2) + parseFloat(anfi)).toFixed(2));
    const colegioActualId = this.colegioActual.id;
    const rubroId = this.rubro?.id || "banda";

    // Toda la Estudiantina oficial de Posadas compite por la copa según el rubro
    const colegiosDelRubro = getColegiosPorRubro(rubroId);
    const rivals = colegiosDelRubro.filter(c => c.id !== colegioActualId && c.id !== "esmu");

    const competitors = rivals.map(c => {
      let b = 8.50;
      let consistencia = 0.24;

      if (rubroId === "baile") {
        if (c.categoria === "A") {
          // GRANDES CAT. A: Roque, Sanba, Bachi, Santa María, Madre (máxima probabilidad)
          b = 9.30;
          consistencia = 0.19;
        } else if (c.categoria === "B") {
          // COMPETITIVOS CAT. B: Comercio 6, Naza, Inmaculada, Jesús Niño
          b = 9.06;
          consistencia = 0.23;
        } else {
          // EMERGENTES CAT. C y resto: Indu, Janssen, Goyena, Carmen, etc.
          b = 8.52;
          consistencia = 0.27;
        }
      } else {
        if (c.tier === 1) {
          // GIGANTES: El Janssen y La Indu (máxima probabilidad)
          b = 9.30;
          consistencia = 0.20;
        } else if (c.tier === 2) {
          // HISTÓRICOS: El Nacional y La Normal (pelean podio y pueden campeonar)
          b = 9.22;
          consistencia = 0.22;
        } else if (c.tier === 3) {
          // GRANDES: San Basilio, Bachi, Madre, EPET 2
          b = 9.12;
          consistencia = 0.24;
        } else if (c.tier === 4) {
          // COMPETITIVOS: Roque, Santa María, Comercio 6, Comercio 18, Verbo, etc.
          b = 8.92;
          consistencia = 0.25;
        } else {
          // EMERGENTES: BOPs, etc.
          b = 8.50;
          consistencia = 0.28;
        }
      }

      // Bonus por potencial de copa definido en el colegio
      const potFactor = (c.potencialCopa || 1.10) - 1.10;
      b += potFactor * 0.12;

      // Inspiración anual de temporada del conjunto rival
      const rachaTemporada = (Math.random() * 2 - 1) * 0.25;

      // Variación controlada de cada noche
      const noise1 = (Math.random() * 2 - 1) * consistencia;
      const noise2 = (Math.random() * 2 - 1) * consistencia;
      const noise3 = (Math.random() * 2 - 1) * consistencia;

      const s1 = Math.min(10.0, Math.max(6.0, b + rachaTemporada + noise1));
      const s2 = Math.min(10.0, Math.max(6.0, b + rachaTemporada + noise2));
      const s3 = Math.min(10.0, Math.max(6.0, b + rachaTemporada + noise3));
      const pts = parseFloat((s1 + s2 + s3).toFixed(2));

      const tierNombreMostrado = (rubroId === "baile" && c.categoria)
        ? `${c.tierNombre} • Cat. ${c.categoria}`
        : c.tierNombre;

      return {
        id: c.id,
        nombre: c.nombre,
        apodo: c.apodo,
        escudo: c.escudo,
        tier: c.tier,
        categoria: c.categoria,
        tierNombre: tierNombreMostrado,
        puntos: pts,
        esTuColegio: false
      };
    });

    const playerTierMostrado = (rubroId === "baile" && this.colegioActual.categoria)
      ? `${this.colegioActual.tierNombre} • Cat. ${this.colegioActual.categoria}`
      : this.colegioActual.tierNombre;

    const playerEntry = {
      id: this.colegioActual.id,
      nombre: this.colegioActual.nombre,
      apodo: this.colegioActual.apodo,
      escudo: this.colegioActual.escudo,
      tier: this.colegioActual.tier,
      categoria: this.colegioActual.categoria,
      tierNombre: playerTierMostrado,
      puntos: playerPts,
      esTuColegio: true
    };

    const all = [playerEntry, ...competitors];
    all.sort((a, b) => b.puntos - a.puntos);

    all.forEach((item, index) => {
      item.posicion = index + 1;
      item.puntosTexto = item.puntos.toFixed(2) + " pts";
    });

    const top5 = all.slice(0, 5);
    const tuColegio = all.find(c => c.esTuColegio);
    const estaEnTop5 = tuColegio.posicion <= 5;

    return {
      top5,
      tuColegio,
      estaEnTop5,
      totalColegios: all.length,
      tablaCompleta: all
    };
  }

  getCopaNombre(puesto) {
    const sufijoPuesto = puesto === 1 ? "1º Puesto (Copa de Oro)" : puesto === 2 ? "2º Puesto (Copa de Plata)" : "3º Puesto (Copa de Bronce)";
    const rubroNombre = this.rubro.id === "baile" ? "Cuerpo de Baile" : "Banda de Música";
    return `${sufijoPuesto} en ${rubroNombre}`;
  }

  /**
   * MERCADO DE PASES REALISTA Y CONDICIONADO POR JERARQUÍA ESCOLAR:
   * - Si estás en un Emergente (Tier 5):
   *    - En 1º o 2º año, un GIGANTE (Janssen o Indu) NUNCA te ofrece ser Pilar.
   *      Solo te ofrecen prueba en fila de choque si sos de élite absoluta (Overall >= 75).
   *    - Quienes te ofrecen ser Pilar en 2º año son otros colegios Emergentes o Barriales.
   *    - A partir de 3º/4º año, si demostraste ser crack, recién un Grande o Gigante te busca como Pilar.
   */
  _pickRandomColegio(pool, excludeIds = new Set()) {
    const candidates = pool.filter(c => !excludeIds.has(c.id));
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  _shuffleColegios(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  evaluarMercadoYOfertas() {
    const rubroId = this.rubro?.id || "banda";
    const poolColegios = getColegiosPorRubro(rubroId);
    let exigenciaMinima = this.colegioActual.exigencia || 55;
    const esUltimoAnio = this.anioActual >= this.maxAnios;

    if (esUltimoAnio) {
      return { esUltimoAnio: true };
    }

    // Condición de expulsión obligada
    let rendimientoInsuficiente = false;
    let malaConducta = Math.random() < 0.12 && this.colegioActual.tier <= 2;

    if (this.colegioActual.id === "industrial" && rubroId === "banda") {
      if (this.anioActual < 3) {
        // En La Indu no se exige nada hasta el 3er año
        exigenciaMinima = 0;
        rendimientoInsuficiente = false;
        malaConducta = false;
      } else {
        exigenciaMinima = 76;
        rendimientoInsuficiente = this.stats.overall < (exigenciaMinima - 8) || this.stats.resistencia < (exigenciaMinima - 10);
      }
    } else {
      rendimientoInsuficiente = this.stats.overall < (exigenciaMinima - 8) || this.stats.resistencia < (exigenciaMinima - 10);
    }

    if (rendimientoInsuficiente || malaConducta) {
      this.fueExpulsadoAlgunaVez = true;
      let motivo = `La comisión directiva de ${this.colegioActual.apodo} exigía ${exigenciaMinima} pts de rendimiento. Tus bajas notas y faltas al playón te costaron el puesto.`;
      if (malaConducta) {
        motivo = `Un cruce verbal con los directores de ${this.colegioActual.apodo} derivó en sanción disciplinaria y te dieron de baja.`;
      } else if (this.stats.resistencia < 50) {
        motivo = `Tu físico colapsó en la 3ra noche de calle. En un colegio de máxima exigencia como ${this.colegioActual.apodo} no perdonan la falta de aguante.`;
      }

      let candidatosRescate = poolColegios.filter(c => c.id !== this.colegioActual.id && c.tier >= this.colegioActual.tier);
      if (candidatosRescate.length < 3) {
        const otros = poolColegios.filter(c => c.id !== this.colegioActual.id && !candidatosRescate.some(cand => cand.id === c.id));
        candidatosRescate = candidatosRescate.concat(otros);
      }
      const rescates = this._shuffleColegios(candidatosRescate).slice(0, 3);

      return {
        esUltimoAnio: false,
        fueExpulsado: true,
        motivo,
        ofertasRescate: rescates.map(col => ({
          colegio: col,
          promesa: `Te dan cobijo inmediato: "${col.tentacionTexto}"`,
          bonoRitmo: +2,
          bonoResistencia: +4,
          rolOfrecido: this.instrumentoBase
        }))
      };
    }

    // MERCADO DE OFERTAS ALEATORIAS Y COHERENTES SEGÚN NIVEL Y TIER
    const otrosColegios = poolColegios.filter(c => c.id !== this.colegioActual.id);
    const colegiosElegidos = new Set([this.colegioActual.id]);
    const ofertas = [];

    const esEmergente = this.colegioActual.tier === 5;
    const esCompetitivo = this.colegioActual.tier === 4;
    const esGrandeOHistorico = this.colegioActual.tier === 2 || this.colegioActual.tier === 3;
    const esGigante = this.colegioActual.tier === 1;

    // --- OFERTA 1: Clásico Histórico o Rival Directo de Categoría (40% Clásico, 60% Competidor Directo Rotativo) ---
    let col1 = null;
    let esRivalOficial = false;
    if (Math.random() < 0.40 && this.colegioActual.rivalHistorico) {
      const rival = getColegioById(this.colegioActual.rivalHistorico, rubroId);
      if (rival && !colegiosElegidos.has(rival.id)) {
        col1 = rival;
        esRivalOficial = true;
      }
    }
    if (!col1) {
      // Competidor directo del mismo tier o adyacente (¡rotación plena entre todos los colegios!)
      const peerPool = poolColegios.filter(c => Math.abs(c.tier - this.colegioActual.tier) <= 1);
      col1 = this._pickRandomColegio(peerPool, colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
    }

    if (col1) {
      colegiosElegidos.add(col1.id);
      let rolRival = this.instrumentoBase;
      if (this.anioActual >= 4 && this.stats.overall >= 80 && (esEmergente || esCompetitivo)) {
        rolRival = this.rubro.id === "baile" ? "Directora de Cuerpo de Baile" : `Director/a de ${this.rubro.nombre}`;
      } else if (this.anioActual >= 3 && this.stats.overall >= 70) {
        rolRival = this.rubro.id === "baile" ? "Bastonera / Destaque" : `Pilar de ${this.instrumentoBase}`;
      }

      if (esRivalOficial) {
        ofertas.push({
          colegio: col1,
          tipo: `Rival Directo (${col1.tierNombre})`,
          rolOfrecido: rolRival,
          promesa: `Pase a tu clásico rival: "${col1.tentacionTexto}"`,
          modificador: "🔥 +5 Ritmo, pero -4 Hinchada inicial por el revuelo"
        });
      } else {
        ofertas.push({
          colegio: col1,
          tipo: `Duelo de Categoría (${col1.tierNombre})`,
          rolOfrecido: rolRival,
          promesa: `${col1.apodo} compite palmo a palmo en la Costanera y te busca como refuerzo estelar.`,
          modificador: "⚔️ +4 Ritmo y competencia de rubro al rojo vivo"
        });
      }
    }

    // --- OFERTA 2: Salto hacia arriba / Proyecto de Élite (Completamente Aleatorio entre instituciones elegibles) ---
    let col2 = null;
    let rol2 = this.instrumentoBase;
    let tipo2 = "";
    let promesa2 = "";
    let modif2 = "";

    const formatPilar = this.rubro.id === "baile" ? "Bastonera / Destaque" : `Pilar de ${this.instrumentoBase}`;
    const formatDir = this.rubro.id === "baile" ? "Directora de Cuerpo de Baile" : `Director/a de ${this.rubro.nombre}`;

    if (esEmergente) {
      if (this.anioActual <= 2) {
        // Rotar entre los 15 colegios Competitivos (Tier 4)
        col2 = this._pickRandomColegio(poolColegios.filter(c => c.tier === 4), colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
        rol2 = this.instrumentoBase;
        tipo2 = `Paso a Competitivo (${col2 ? col2.tierNombre : "Tradicional"})`;
        promesa2 = `${col2 ? col2.apodo : "El colegio"} te vio gran potencial en los palcos y te ofrece integrarte a su fila titular.`;
        modif2 = "⭐ +3 Nivel General y mejor vestuario";
      } else {
        // En 3º año en adelante: si sos crack (>= 75 OVR), un Grande o Histórico (Tier 2-3) te busca
        const pool2 = (this.stats.overall >= 75) ? poolColegios.filter(c => c.tier <= 3) : poolColegios.filter(c => c.tier === 4);
        col2 = this._pickRandomColegio(pool2, colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
        rol2 = (this.stats.overall >= 78) ? formatPilar : this.instrumentoBase;
        tipo2 = (col2 && col2.tier <= 3) ? `Salto a un Grande (${col2.tierNombre})` : `Pase a Competitivo (${col2 ? col2.tierNombre : "Tradicional"})`;
        promesa2 = `${col2 ? col2.apodo : "El colegio"} te tienta para incorporarte a su escuadra con aspiraciones firmes.`;
        modif2 = "🏆 +4 Nivel General y aspiraciones reales de podio";
      }
    } else if (esCompetitivo) {
      if (this.anioActual <= 2) {
        // Rotar entre Grandes (Tier 3) o Históricos (Tier 2)
        col2 = this._pickRandomColegio(poolColegios.filter(c => c.tier === 3 || c.tier === 2), colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
        rol2 = this.instrumentoBase;
        tipo2 = `Interés de un GRANDE (${col2 ? col2.tierNombre : "Grande"})`;
        promesa2 = this.rubro.id === "baile"
          ? `${col2 ? col2.apodo : "El colegio"} busca reforzar su cuerpo de baile con tu gracia y sincronía.`
          : `${col2 ? col2.apodo : "El colegio"} busca reforzar su fila titular con tu disciplina y sonido.`;
        modif2 = "⭐ +4 Nivel General y galpón propio";
      } else {
        // 3º en adelante: Gigantes o Grandes según OVR
        const pool2 = (this.stats.overall >= 78) ? poolColegios.filter(c => c.tier <= 2) : poolColegios.filter(c => c.tier === 3);
        col2 = this._pickRandomColegio(pool2, colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
        rol2 = (this.stats.overall >= 80) ? formatPilar : this.instrumentoBase;
        tipo2 = (col2 && col2.tier === 1) ? `¡TENTACIÓN DE UN GIGANTE!` : `Propuesta de Élite (${col2 ? col2.tierNombre : "Destacado"})`;
        promesa2 = `${col2 ? col2.apodo : "El colegio"} te ofrece vestir sus colores como ${rol2.toUpperCase()} con recursos colosales.`;
        modif2 = "⚡ +5 Nivel General y favoritismo a la Copa de Oro";
      }
    } else {
      // Si estás en un Gigante o Grande: colegios de élite (Tier 1, 2 o 3) rotativos
      col2 = this._pickRandomColegio(poolColegios.filter(c => c.tier <= 3), colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
      rol2 = (this.anioActual >= 4) ? formatDir : (this.stats.overall >= 76 ? formatPilar : this.instrumentoBase);
      tipo2 = `Oferta de Élite (${col2 ? col2.tierNombre : "Grande"})`;
      promesa2 = `${col2 ? col2.apodo : "El colegio"} te propone incorporarte como ${rol2.toUpperCase()} para pelear la cima.`;
      modif2 = "⭐ +4 Nivel General y mando asegurado";
    }

    if (col2) {
      colegiosElegidos.add(col2.id);
      ofertas.push({
        colegio: col2,
        tipo: tipo2,
        rolOfrecido: rol2,
        promesa: promesa2,
        modificador: modif2
      });
    }

    // --- OFERTA 3: Propuesta Barrial o Colegio en Búsqueda de Liderazgo (Rotación amplia entre Barriales y Tradicionales) ---
    let col3 = null;
    let rol3 = this.instrumentoBase;
    let tipo3 = "";
    let promesa3 = "";
    let modif3 = "";

    if (esGigante || esGrandeOHistorico) {
      // Un colegio barrial o tradicional te entrega la capitanía/dirección (elegido al azar entre Tier 4 y Tier 5)
      const poolSalvador = poolColegios.filter(c => c.tier >= 4);
      col3 = this._pickRandomColegio(poolSalvador, colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
      rol3 = (this.anioActual >= 3) ? formatDir : formatPilar;
      tipo3 = `Capitanía en ${col3 ? col3.tierNombre : "Barrial"}`;
      promesa3 = `${col3 ? col3.apodo : "El colegio"} te entrega el liderazgo total como ${rol3.toUpperCase()} indiscutido para refundar su conjunto.`;
      modif3 = "👑 Máximo liderazgo garantizado y +6 Resistencia";
    } else {
      // Si estás en emergente o competitivo: otro colegio con proyecto barrial/emergente que rota entre los restantes
      const poolBarriales = poolColegios.filter(c => c.tier >= 4);
      col3 = this._pickRandomColegio(poolBarriales, colegiosElegidos) || this._pickRandomColegio(otrosColegios, colegiosElegidos);
      rol3 = (this.anioActual >= 2) ? formatPilar : this.instrumentoBase;
      tipo3 = `Proyecto con Identidad (${col3 ? col3.tierNombre : "Barrial"})`;
      promesa3 = this.rubro.id === "baile"
        ? `${col3 ? col3.apodo : "El colegio"} te asegura el puesto de ${rol3.toUpperCase()} de inmediato para potenciar su cuerpo de baile.`
        : `${col3 ? col3.apodo : "El colegio"} te asegura el puesto de ${rol3.toUpperCase()} de inmediato para consolidar su banda.`;
      modif3 = "👑 Puesto clave garantizado y +4 Hinchada";
    }

    if (col3) {
      colegiosElegidos.add(col3.id);
      ofertas.push({
        colegio: col3,
        tipo: tipo3,
        rolOfrecido: rol3,
        promesa: promesa3,
        modificador: modif3
      });
    }

    // Garantizar que siempre haya 3 ofertas distintas en total
    while (ofertas.length < 3) {
      const fallbackCol = this._pickRandomColegio(otrosColegios, colegiosElegidos);
      if (!fallbackCol) break;
      colegiosElegidos.add(fallbackCol.id);
      ofertas.push({
        colegio: fallbackCol,
        tipo: `Oferta Estudiantil (${fallbackCol.tierNombre})`,
        rolOfrecido: this.instrumentoBase,
        promesa: `${fallbackCol.apodo} te invita a sumarte a su delegación en la Costanera.`,
        modificador: "⭐ +3 Nivel General"
      });
    }

    return {
      esUltimoAnio: false,
      fueExpulsado: false,
      puedeQuedarse: true,
      ofertas
    };
  }

  aceptarOfertaColegio(colegioId, rolOfrecido = null, esPorExpulsion = false) {
    const rubroId = this.rubro?.id || "banda";
    const nuevoColegio = getColegioById(colegioId, rubroId);
    if (!nuevoColegio) return;
    this.colegioActual = nuevoColegio;
    this.maxAnios = this.colegioActual.tecnico ? 6 : 5;

    if (esPorExpulsion) {
      this.esDirector = false;
      this.esPilar = false;
    }

    if (rolOfrecido && typeof rolOfrecido === "string") {
      if (rolOfrecido.toLowerCase().includes("director")) {
        this.esDirector = true;
        this.esPilar = true;
        this.desbloquearLogro("director_leyenda");
        if (this.rubro.id === "baile") {
          this.rol = { id: "directora_baile", nombre: "Directora de Cuerpo de Baile", rango: "Jefatura Suprema" };
        }
      } else if (rolOfrecido.toLowerCase().includes("pilar") || rolOfrecido.toLowerCase().includes("bastonera")) {
        this.esPilar = true;
        this.esDirector = false;
        this.desbloquearLogro("ascenso_pilar");
        if (this.rubro.id === "baile") {
          this.rol = { id: "bastonera_banda", nombre: "Bastonera / Destaque", rango: "Figura Estelar" };
        }
      }
    }

    if (!this.colegiosHistorial.includes(nuevoColegio.id)) {
      this.colegiosHistorial.push(nuevoColegio.id);
    }

    if (!esPorExpulsion) {
      this.desbloquearLogro("traicion_historica");
      this.stats.overall = this._aplicarDelta(this.stats.overall, 2, true);
    } else {
      this.stats.resistencia = Math.min(99, this.stats.resistencia + 3);
    }
  }

  renovarEnColegioActual() {
    this.stats.hinchada = Math.min(99, this.stats.hinchada + 3);
    // En años tempranos (1º a 3º), renovar lealtad puede despertar crecimiento
    if (this.anioActual < 4 && Math.random() < 0.20) {
      this.stats.overall = this._aplicarDelta(this.stats.overall, 1, true);
    }
  }

  avanzarAlSiguienteAnio() {
    if (this.anioActual < this.maxAnios) {
      this.iniciarAnio(this.anioActual + 1);
      return false;
    } else {
      this.concluirCarrera();
      return true;
    }
  }

  concluirCarrera() {
    this.fase = "summary";

    if (this.colegiosHistorial.length === 1) {
      this.desbloquearLogro("lealtad_eterna");
    }

    if (this.stats.overall >= 78) {
      this.desbloquearLogro("egresado_oro");
    }
  }

  desbloquearLogro(id) {
    if (!this.logrosDesbloqueados.includes(id)) {
      this.logrosDesbloqueados.push(id);
    }
  }

  getLogrosDetallados() {
    return LOGROS_DEFINICIONES.map(logro => ({
      ...logro,
      desbloqueado: this.logrosDesbloqueados.includes(logro.id)
    }));
  }

  getTitulosOro() {
    return this.copasGanadas.filter(c => c.puesto === 1 && (c.esCampeonato || c.esChallenger)).length;
  }

  getPodiosTotales() {
    return this.tablaHistorica.filter(t => t.podio >= 1 && t.podio <= 3).length;
  }

  generarApodoPersonalizado() {
    if (this.apodoPersonalizado) return this.apodoPersonalizado;

    const stats = this.stats;
    const col = this.colegioActual;
    const copas1 = this.getTitulosOro();
    const copasChallenger = this.titulosChallenger || 0;
    const esDir = this.esDirector;
    const rubroId = this.rubro ? this.rubro.id : "";
    const rolNombre = (this.rol?.nombre || "").toLowerCase();

    const opciones = [];

    // 1. Por Copas de Oro / Copa Challenger / Gloria de la Estudiantina
    if (copasChallenger >= 1) {
      opciones.push(
        "El Conquistador del Challenger",
        "El Tricampeón Eterno",
        "La Dinastía del Río",
        "El Rey de la Copa Challenger",
        "El Hecho de Oro"
      );
    }
    if (copas1 >= 3) {
      opciones.push(
        "El Rey Midas",
        "El Coleccionista de Oro",
        "Leyenda de la Costanera",
        "El Amo del 1º Puesto",
        "El Patrón de la Bahía",
        "El Emperador de la Costanera"
      );
    } else if (copas1 === 2) {
      opciones.push(
        "El Bicampeón",
        "El Conquistador de la Bahía",
        "El Señor de las Copas",
        "La Fiera de los Podios",
        "El Heredero de la Gloria"
      );
    } else if (copas1 === 1) {
      opciones.push(
        "El Campeón del Pueblo",
        "El Hacedor de Campeones",
        "Bautizado en Oro",
        "El Héroe del Palco",
        "El León Consagrado"
      );
    }

    // 2. Por Liderazgo (Director/a o Pilar)
    if (esDir) {
      opciones.push(
        "El Silbato de Oro",
        "El Gran Mariscal",
        "El Cacique Mayor",
        "La Batuta de Fuego",
        "El General del Asfalto",
        "El Gran Estratega",
        "Silbato Mayor",
        "La Brújula de la Scola",
        "El Jefe Supremo de Banda"
      );
    } else if (this.esPilar) {
      opciones.push(
        "El Pilar Inquebrantable",
        "El Cacique de Fila",
        "El Muro Rítmico",
        "El Guía de Acero",
        "El Bastión de la Batería",
        "El Eje del Compás"
      );
    }

    // 3. Por Instrumento y Rol Específico
    if (rolNombre.includes("cajita")) {
      opciones.push(
        "La Aguja Rítmica",
        "El Repique de la Bahía",
        "La Cajita de Oro",
        "El Taca-Taca Implacable",
        "La Chispa del Redoble",
        "El Filo de la Fila",
        "El Pulso de la Cajita",
        "Pique Eléctrico"
      );
    } else if (rolNombre.includes("ton")) {
      opciones.push(
        "El Trueno del Ton",
        "El Golpeador Fantasma",
        "Acento de Fierro",
        "El Cañón del Medio",
        "El Resonador de la Bahía",
        "El Trueno Guaraní",
        "Mano de Piedra",
        "El Rey del Corte"
      );
    } else if (rolNombre.includes("redoblante")) {
      opciones.push(
        "El Francotirador del Redoble",
        "Furia de Parche",
        "Pique de Seda",
        "Muñeca de Acero",
        "El Huracán del Redoble",
        "Palillos Voladores",
        "El Cirujano del Parche",
        "El Relámpago del Palco"
      );
    } else if (rolNombre.includes("chancha") || rolNombre.includes("surdo") || rolNombre.includes("bombo")) {
      opciones.push(
        "El Bombazo del 4to Tramo",
        "El Retumbe Subterráneo",
        "La Chancha Sagrada",
        "El Tambor Mayor",
        "El Pulso de Tierra Colorada",
        "El Latido del Asfalto",
        "El Coloso de la Fila",
        "El Trueno de Fondo"
      );
    } else if (rolNombre.includes("platillo") || rolNombre.includes("chocallo")) {
      opciones.push(
        "El Destello del Palco",
        "Platillero de Élite",
        "Fuego de Bronce",
        "El Estruendo Dorado",
        "El Chispazo Metálico",
        "El Platillo de Oro"
      );
    } else if (rubroId === "baile" || rubroId === "cuerpo_baile" || rolNombre.includes("baile") || rolNombre.includes("danza") || rolNombre.includes("pasista") || rolNombre.includes("bastonera")) {
      opciones.push(
        "La Sirena del Paraná",
        "La Diosa del Asfalto",
        "Plumas de Fuego",
        "El Encanto de la Pasarela",
        "El Torbellino del Río",
        "La Reina de la Scola",
        "El Paso de Oro",
        "La Perla del 4to Tramo",
        "Elegancia en Vuelo",
        "El Fuego Danzante",
        "La Reina de las Plumas",
        "Destello de la Costanera",
        "El Remolino Guaraní",
        "Carisma de Oro",
        "La Rosa del Asfalto",
        "La Brisa del Paraná",
        "Princesa del Asfalto"
      );
    }

    // 4. Por Atributo Dominante (Máximo)
    const maxStat = Math.max(stats.ritmo, stats.hinchada, stats.resistencia);
    if (maxStat === stats.ritmo) {
      opciones.push(
        "El Metrónomo Humano",
        "El Pulso de Acero",
        "El Reloj Suizo",
        "Manos de Trueno",
        "El Redoble Rápido",
        "Compás de Relojería",
        "El Marcapasos de la Avenida",
        "El Cirujano del Corte",
        "Oído Absoluto",
        "Cadencia Pura",
        "El Relojero de la Scola"
      );
    } else if (maxStat === stats.hinchada) {
      opciones.push(
        "La Voz de la Tribuna",
        "El Alma de la Valla",
        "El Ídolo Popular",
        "El Caudillo de la Calle",
        "Furia de Barra",
        "El Dueño del Tablón",
        "El Agitador de Almas",
        "El Grito Sagrado",
        "Fiebre de Tribuna",
        "El Místico de la Barra",
        "La Garganta de Posadas",
        "El Trueno de la Valla"
      );
    } else if (maxStat === stats.resistencia) {
      opciones.push(
        "El Titán del Asfalto",
        "Pulmón de Hierro",
        "El Incansable",
        "El Gladiador del Río",
        "Corazón de Piedra",
        "El Tanque del Asfalto",
        "Aguante Misionero",
        "El Inagotable",
        "Espalda de Hierro",
        "El Maratonista de la Costanera",
        "Temple de Quebracho",
        "El Resiliente del Playón"
      );
    }

    // 5. Por Mística Tradicional de la Estudiantina de Posadas
    opciones.push(
      "El Terror del Palco 1",
      "El Conquistador del Palco 2",
      "El Dueño del Anfiteatro",
      "El Capataz de la Valla",
      "El Santo Patrono del 4to Tramo",
      "El Místico de la Bajada Vieja",
      "El Ángel del Lapacho",
      "El Rey de la Noche Blanca",
      "El Centinela del Paraná",
      "El Corsario de la Bahía",
      "El Héroe del Tinglado",
      "La Mística del Galpón",
      "El Rompe-Vallas",
      "La Furia de la Costanera",
      "El Duende del Asfalto"
    );

    // 6. Por Colegio Actual (Identidad histórica institucional de los 33 colegios)
    if (col) {
      switch (col.id) {
        case "janssen":
          opciones.push("El Motor Azul y Oro", "El Engranaje Pesado", "El Centinela de la San Martín", "El Coloso de Villa Sarita", "La Dinastía del Janssen", "El Martillo Alemán");
          break;
        case "industrial":
          opciones.push("El Tuerca Mayor", "El Titán Mecánico", "El Herrero de la Indu", "El Martillo de Calle Junín", "El Huracán Blanco y Rojo", "Fuerza Industrial");
          break;
        case "san_basilio":
          opciones.push("El Fuego Santo", "El Teatral", "El Ángel Albiceleste", "La Muralla de Rademacher", "La Pasión del Santo", "El Halcón de San Basilio");
          break;
        case "humanista":
          opciones.push("El Filósofo del Ritmo", "El Místico del Bachi", "El Mago del Humanista", "La Rebelión Verde", "La Leyenda de San Lorenzo", "El Sabio del Samba");
          break;
        case "madre_misericordia":
          opciones.push("La Gracia Eterna", "El Vuelo Carmelita", "La Elegancia de la Miseri", "Reina de la Tradición", "La Pasión Marista", "La Dama de Honor");
          break;
        case "santa_maria":
          opciones.push("La Estrella de Oro", "La Pluma Imperial", "La Majestad del Santa", "El Brillo Centenario", "La Nobleza del Asfalto", "Soberana del Río");
          break;
        case "roque":
          opciones.push("El Rayo Albirrojo", "Furia Roja", "El León de Calle Rioja", "El Guerrero del Roque", "La Huella de González", "El Trueno Albirrojo");
          break;
        case "nacional":
          opciones.push("El Histórico", "Voz Centenaria", "El Coloso del Nacional", "El Bastión del Río", "La Gloria de la Félix de Azara", "El Centenario de Posadas");
          break;
        case "normal_mixta":
          opciones.push("El Fundacional", "El Maestro del Río", "El Prócer de la Normal", "El Pionero del 4to Tramo", "La Escuela Madre", "El Guardián de Belgrano");
          break;
        case "cep_4":
          opciones.push("El Trueno Barrial", "Fuerza del 4", "El Orgullo del Oeste", "El León de Villa Cabello", "El Sentimiento del CEP", "La Voz de Villa Cabello");
          break;
        case "comercio_6":
          opciones.push("El León del Centro", "Rugido Comercial", "El Gladiador de Ayacucho", "La Furia de la 6", "El Emperador Rojo y Negro", "El Corazón Comercial");
          break;
        case "comercio_8":
          opciones.push("El Orgullo de Miguel Lanús", "El Rayo Rojo y Negro", "El Titán de Lanús", "Furia de Villa Lanús", "El Tren de Lanús");
          break;
        case "comercio_18":
          opciones.push("La Brasa Caliente", "El Garra Pura", "El Dragón del Comercio", "El Rayo Verde y Blanco", "Furia de Comercio 18");
          break;
        case "verbo_divino":
          opciones.push("El Swing Brasileño", "El As del Samba", "La Alegría del Verbo", "El Son Misionero", "El Canto de la Bahía");
          break;
        case "mborore":
          opciones.push("La Flecha Guaraní", "El Cacique Misionero", "El Selva Adentro", "Fuerza Aborigen", "El Guardián de la Tierra Colorada");
          break;
        case "san_alberto":
          opciones.push("El Halcón Albiazul", "La Furia de Iturbe", "El Ángel de Villa Sarita", "El Trueno Azul", "La Garra de Iturbe");
          break;
        case "pedro_goyena":
          opciones.push("El Guerrero del Goyena", "El Corte Marcial", "La Garra Marrón", "El Tanque Goyena", "El Gladiador del Goyena");
          break;
        case "normal_10":
          opciones.push("El Orgullo de Villa Sarita", "El Bohemio del Asfalto", "La Cuna del Decano", "El Bohemio Albiceleste", "El Poeta de Sarita");
          break;
        case "jesus_nazareth":
          opciones.push("El Ángel del Asfalto", "El Orgullo Blanco y Marrón", "La Estrella del Naza", "El Resiliente de Eva Perón", "La Furia del Nazareth");
          break;
        case "estrada":
          opciones.push("El Caudillo de Salta", "Verde Guerrero", "El Rebelde del Estrada", "Fuerza Estradense", "El León de Salta");
          break;
        case "san_miguel":
          opciones.push("La Espada del Arcángel", "El Guardián", "El Guerrero de Fátima", "El Ángel Protector", "La Lanza del Arcángel");
          break;
        case "epet_37":
          opciones.push("La Chispa Eléctrica", "El Ingeniero", "El Técnico del 37", "La Fuerza del Taller", "El Trueno Electromecánico");
          break;
        case "epet_34":
          opciones.push("El Innovador", "Luz de Neón", "La Vanguardia de la 34", "El Rayo Cibernético", "El Futuro del Asfalto");
          break;
        case "epet_2":
          opciones.push("El Taladro Técnico", "Manos de Taller", "El Forjador del 2", "El Soldador Mayor", "El Fuego Técnico");
          break;
        case "bop_1":
          opciones.push("El Bastión de Villa Urquiza", "El Sentimiento del 1", "El Aguante de Urquiza", "El Caudillo del BOP");
          break;
        case "bop_9":
          opciones.push("El Orgullo de Itaembé Miní", "El Coloso del Sur", "Furia de Itaembé", "El Trueno Miní");
          break;
        case "inmaculada":
          opciones.push("La Dama Blanca", "La Rosa Mística", "El Vuelo de la Inmaculada", "La Serenidad de Oro");
          break;
        case "santa_catalina":
          opciones.push("La Brisa del Oeste", "La Bandera Barrial", "El Trueno de Santa Catalina", "El Aguante de Urquiza Oeste");
          break;
        case "san_jorge":
          opciones.push("El Dragón Dorado", "El Campeón de Hierro", "La Lanza de San Jorge", "El Escudo Santo");
          break;
        case "del_carmen":
          opciones.push("El Manto del Carmen", "La Paloma del Río", "El Vuelo Carmelo", "La Gracia del Carmen");
          break;
        case "jesus_nino":
          opciones.push("El Semillero de Oro", "La Promesa Eterna", "El Chispa del Niño", "El Ángel Rítmico");
          break;
        case "virgen_itati":
          opciones.push("La Virgen Misionera", "El Milagro de Itatí", "La Devoción de la Valla", "El Manto Sagrado");
          break;
        case "lisandro_torre":
          opciones.push("El Rebelde del Sur", "La Garra Obrera", "El Corazón de la Torre", "El Sentimiento del Sur");
          break;
      }
    }

    // 7. Por Trayectoria y Traspasos Históricos
    if (this.colegiosHistorial && this.colegiosHistorial.length > 1) {
      opciones.push(
        "El Nómada del Río",
        "El Hijo de Dos Casas",
        "El Conquistador Errante",
        "El Doble Camiseta",
        "El Pase Bomba",
        "El Resucitado de las Cenizas"
      );
    }

    // 8. Por OVR de Élite Oficial (>= 88 y >= 90)
    if (stats.overall >= 90) {
      opciones.push(
        "La Leyenda Viviente",
        "El Monarca del Asfalto",
        "El Elegido de Posadas",
        "El Mito del 4to Tramo",
        "El Rey del Paraná",
        "Patrimonio de la Estudiantina",
        "El Inmortal"
      );
    } else if (stats.overall >= 85) {
      opciones.push(
        "El Mariscal del 4to Tramo",
        "El Prodigio Posadeño",
        "La Joya del Río",
        "La Fiera Inmortal"
      );
    }

    const hash = (this.nombre || "Egresado").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      + stats.overall * 17
      + stats.ritmo * 7
      + stats.hinchada * 11
      + stats.resistencia * 13
      + (this.copasGanadas.length * 23)
      + (this.tablaHistorica.length * 31);

    const apodo = opciones[hash % opciones.length] || "El Pulso del Asfalto";
    this.apodoPersonalizado = apodo;
    return apodo;
  }

  generarTextoResumen() {
    const colegioTexto = this.colegiosHistorial.length > 1 
      ? this.colegiosHistorial.map(id => getColegioById(id).apodo).join(" ➔ ")
      : `${this.colegioActual.apodo}`;

    const copas1 = this.getTitulosOro();
    const copasChallenger = this.titulosChallenger || 0;
    const copasTotal = this.getPodiosTotales();
    const subcampeonatos = this.tablaHistorica.filter(t => t.podio === 2).length;
    const tercerosPuestos = this.tablaHistorica.filter(t => t.podio === 3).length;

    let nivelLeyenda = "Estudiante Promesa";
    if (this.stats.overall >= 90) nivelLeyenda = "👑 LEYENDA HISTÓRICA DE LA ESTUDIANTINA";
    else if (this.stats.overall >= 82) nivelLeyenda = "⭐ FIGURA CONSAGRADA DEL 4TO TRAMO";
    else if (this.stats.overall >= 74) nivelLeyenda = "🥁 REFERENTE ESTUDIANTIL";

    let palmaresTexto = "";
    if (copas1 > 0) {
      palmaresTexto = copasChallenger > 0
        ? `${copas1} Título(s) de Oro (incluye ${copasChallenger} Copa Challenger 🌟) • ${copasTotal} Podio(s)`
        : `${copas1} Título(s) de Oro • ${copasTotal} Podio(s) Totales`;
    } else if (copasTotal > 0) {
      const detalle = [];
      if (subcampeonatos > 0) detalle.push(`${subcampeonatos} Subcampeonato(s) 🥈`);
      if (tercerosPuestos > 0) detalle.push(`${tercerosPuestos} 3º Puesto(s) 🥉`);
      palmaresTexto = `${copasTotal} Podio(s) Totales (${detalle.join(", ")}) • 0 Títulos de Oro`;
    } else {
      palmaresTexto = "Mención de Honor Oficial • Sin podios oficiales";
    }

    return `🎓 MI CARRERA EN LA ESTUDIANTINA DE POSADAS 🎓
👤 Estudiante: ${this.nombre}
🏫 Trayectoria: ${colegioTexto}
🎭 Rubro: ${this.rubro.nombre} (${this.getNombreRolActual()})
📅 Años desfilados: ${this.tablaHistorica.length} temporadas (1º a ${this.maxAnios}º Año)
📊 Stats Finales:
   • Rating General: ${this.stats.overall} / 99
   • Ritmo: ${this.stats.ritmo} | Hinchada: ${this.stats.hinchada} | Aguante: ${this.stats.resistencia}
🏆 Palmarés: ${palmaresTexto}
🎖️ Estatus: ${nivelLeyenda}
✨ Simulá tu carrera en: estudiantina.online`;
  }
}
