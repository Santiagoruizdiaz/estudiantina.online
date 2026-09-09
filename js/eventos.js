/**
 * Catálogo Completo de Eventos y Decisiones por Fases
 * Estructura auténtica de cada temporada de la Estudiantina de Posadas:
 * 1. Fase de Ensayos (Playón escolar, Parque Paraguayo, Teatrino)
 * 2. Fase de Pruebas Piloto (1ª y 2ª Prueba Piloto en la Costanera)
 * 3. Fase de Noches de Calle (Las 4 noches oficiales en el 4to tramo)
 * 4. Fase de Show en el Anfiteatro (Anfiteatro Manuel Antonio Ramírez)
 * + Eventos Sorpresa de Mala Suerte y Giros del Destino (Rotura de parches, tendinitis, veedores del jurado, etc.)
 */

import {
  EVENTOS_POR_ROL_BAILE,
  EVENTOS_SORPRESA_POR_ROL_BAILE,
  EVENTOS_BAILE_FASES,
  EVENTOS_SORPRESA_BAILE,
  EVENTOS_BASTONERA,
  EVENTOS_DIRECTORA_BAILE
} from "./eventos_baile.js";

// =========================================================================
// 1. EVENTOS ESTRUCTURADOS POR FASE Y AÑO ESCOLAR
// =========================================================================

export const EVENTOS_POR_FASE = {
  // --- 1º AÑO (El Chipi / Debutante) ---
  1: {
    ensayos: {
      id: "ensayo_1",
      anio: 1,
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "El Bautismo del Playón",
      categoria: "ensayo",
      descripcion: "Es pleno invierno en Posadas, pero a la siesta hacen 32 grados en el playón de cemento. Los de 5to año te miran de reojo para ver si tenés aguante o si tirás los palillos al primer calambre.",
      opciones: [
        {
          id: "darlo_todo",
          texto: "Tocar sin parar hasta que te duelan las muñecas",
          descripcion: "Demostrar tu compromiso inmediato ante la mirada de los caciques de banda.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Te ganaste el respeto instantáneo de los directores! Sos la gran promesa de 1er año."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: -4,
            overall: 0,
            mensaje: "Te dio un mareo por el calor y tuviste que tomar tereré a la sombra de un lapacho (+2 Ritmo, -4 Aguante)."
          }
        },
        {
          id: "ir_al_paso",
          texto: "Aprender con calma y observar a los veteranos",
          descripcion: "Cuidar las manos y memorizar cada corte sin arriesgar el físico.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +3,
            hinchada: +2,
            resistencia: +2,
            overall: +2,
            mensaje: "Aprendiste las bases rítmicas de forma prolija y sin lesiones. Progresión segura."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "piloto_1",
      anio: 1,
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "El Primer Contacto con el Asfalto del Río",
      categoria: "piloto",
      descripcion: "Primera prueba piloto oficial en el 4to tramo. No hay trajes aún, solo remeras del colegio y camperas de promo. Las vallas retumban y el jurado toma las primeras notas de formación.",
      opciones: [
        {
          id: "mirar_al_palco",
          texto: "Fijar la mirada en el Palco 1 y clavar los cortes",
          descripcion: "Concentrarte exclusivamente en los compases técnicos y en no perder la distancia con la fila de adelante.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Corte perfecto! Los veedores del jurado asintieron con la cabeza y anotaron felicitaciones."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +1,
            resistencia: +1,
            overall: -1,
            mensaje: "Te pusiste nervioso al ver a la multitud en las barandas y te adelantaste un compás (-2 Ritmo)."
          }
        },
        {
          id: "arengar_valla",
          texto: "Levantar el instrumento hacia las vallas para encender a la hinchada",
          descripcion: "Ganarte el cariño popular desde la primera pasada de la tarde.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +1,
            hinchada: +6,
            resistencia: +2,
            overall: +2,
            mensaje: "¡La tribuna de tu colegio explotó en aplausos! Ya corean tu nombre entre los nuevos."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +3,
            resistencia: 0,
            overall: 0,
            mensaje: "El director te hizo una seña de atención por desconcentrarte de la fila, pero la hinchada te bancó."
          }
        }
      ]
    },
    noches_calle: {
      id: "calle_1",
      anio: 1,
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "La Mágica Noche de Estreno",
      categoria: "desfile",
      descripcion: "Viernes a la noche, reflectores gigantes encendidos, humo blanco y olor a pochoclo y chipa en la Costanera. Tu colegio está en cabecera esperando el silbato de largada.",
      opciones: [
        {
          id: "mantener_postura",
          texto: "Mantener la formación marcial y tocar con fuerza bruta",
          descripcion: "No aflojar un solo segundo durante los 25 minutos de pasada.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Pasada descomunal! La percusión retumbó en todo el río y dejaste la piel en el asfalto."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -3,
            overall: 0,
            mensaje: "Los hombros te ardieron por el peso de la correa en el Palco 2, pero no bajaste los brazos."
          }
        },
        {
          id: "dosificar_energia",
          texto: "Dosificar el aire y sonreír al público en los tramos intermedios",
          descripcion: "Guardar fuerzas para el remate frente a la rotonda de los pescadores.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "Llegaste entero al final de la pasada mientras otros colegios terminaban arrastrando los pies."
          }
        }
      ]
    },
    anfiteatro: {
      id: "anfi_1",
      anio: 1,
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "El Templo de la Bajada Vieja",
      categoria: "anfiteatro",
      descripcion: "El mítico escenario Alcibíades Alarcón repleto. Las gradas de piedra están colmadas de bengalas de colores y banderas gigantes. Tenés 20 minutos cronometrados para el show final de scola.",
      opciones: [
        {
          id: "solo_improvisado",
          texto: "Meter un pique y corte rápido con tu fila",
          descripcion: "Arriesgar un compás sincopado frente al jurado del anfiteatro.",
          riesgo: "Alto",
          probabilidad: 0.65,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Ovación de pie en el Anfiteatro! Los directores te felicitaron en plena pista con un abrazo."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +1,
            resistencia: -1,
            overall: -1,
            mensaje: "El eco del anfiteatro te jugó una mala pasada y se desfasó medio compás (-3 Ritmo)."
          }
        },
        {
          id: "seguir_partitura",
          texto: "Respetar la marcha oficial a rajatabla sin inventar nada",
          descripcion: "Asegurar los puntos de sincronía y prolijidad técnica del reglamento oficial.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "Sonido limpio y coordinado. Los jurados anotaron excelentes puntajes de afinación."
          }
        }
      ]
    }
  },

  // --- 2º AÑO (Consolidación) ---
  2: {
    ensayos: {
      id: "ensayo_2",
      anio: 2,
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Parque Paraguayo)",
      titulo: "La Densa Humedad del Parque Paraguayo",
      categoria: "ensayo",
      descripcion: "Ya no sos el chipi nuevo. Ahora tenés a tu lado a ingresantes de 1º año que te miran como referencia. El calor y los mosquitos en el parque no dan tregua.",
      opciones: [
        {
          id: "guiar_nuevos",
          texto: "Quedarte después de hora a enseñar los cortes a los nuevos",
          descripcion: "Forjar espíritu de equipo y consolidar la fila rítmica del colegio.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "¡La fila suena unida como un solo trueno! Los de 1ro te idolatran y la comisión te tiene en cuenta."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "Terminaste con la garganta seca y cansado, pero los chicos aprendieron la base."
          }
        },
        {
          id: "entrenamiento_individual",
          texto: "Perfeccionar tu técnica individual de velocidad y muñeca",
          descripcion: "Usar pesas en los palillos para aumentar la velocidad de toque.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +6,
            hinchada: +1,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Tus redobles parecen una ametralladora! Velocidad y precisión de nivel profesional."
          },
          fracaso: {
            ritmo: +2,
            hinchada: 0,
            resistencia: -3,
            overall: 0,
            mensaje: "Te sobrecargaste el tendón del antebrazo y tuviste que ponerte hielo toda la noche."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "piloto_2",
      anio: 2,
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "El Cruce de Hinchadas en la Rotonda",
      categoria: "piloto",
      descripcion: "Al terminar la prueba piloto, tu colegio queda frente a frente en la rotonda con la hinchada del rival tradicional. El ambiente está que arde y los bombos retumban.",
      opciones: [
        {
          id: "tocar_mas_fuerte",
          texto: "Redoblar el volumen y tocar la marcha del colegio con orgullo",
          descripcion: "Demostrar que en el río manda tu escudo sin caer en agresiones físicas.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "¡La hinchada tapó por completo al rival! Toda la Costanera cantó las canciones de tu escuela."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: 0,
            mensaje: "Se rompió una baqueta en el fragor del toque, pero defendieron los colores con honra."
          }
        },
        {
          id: "mantener_cordura",
          texto: "Hacer seña de desconcentración ordenada y subir al camión",
          descripcion: "Priorizar la disciplina y evitar cualquier amonestación disciplinaria del jurado.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +2,
            hinchada: +2,
            resistencia: +2,
            overall: +2,
            mensaje: "Excelente compostura institucional. Los directivos de la organización felicitaron a tu colegio."
          }
        }
      ]
    },
    noches_calle: {
      id: "calle_2",
      anio: 2,
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "El Palco 2 y la Presión del Jurado",
      categoria: "desfile",
      descripcion: "Segunda noche de calle. El jurado oficial en el Palco 2 es conocido por ser el más exigente: penalizan cualquier desfasaje de medio segundo.",
      opciones: [
        {
          id: "concentracion_total",
          texto: "Cerrar filas y clavar cada cambio de ritmo con precisión suiza",
          descripcion: "Priorizar la afinación milimétrica por encima del show para la tribuna.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +3,
            overall: +4,
            mensaje: "¡10 absoluto en la planilla del jurado de música! Quedaron anonadados con la limpieza del sonido."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: +1,
            overall: +1,
            mensaje: "Fue una pasada muy técnica, aunque la tribuna se quedó con ganas de un poco más de fiesta."
          }
        },
        {
          id: "show_alegria",
          texto: "Saltar y tirar pasos coordinados mientras tocan el corte principal",
          descripcion: "Hacer temblar la calle con carisma puro y fiesta posadeña.",
          riesgo: "Medio",
          probabilidad: 0.7,
          exito: {
            ritmo: +3,
            hinchada: +8,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Fiesta total! El público de las vallas se sumó a bailar con ustedes en el asfalto."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +5,
            resistencia: -1,
            overall: +1,
            mensaje: "Un pequeño desajuste rítmico por saltar tanto, pero la alegría fue inigualable."
          }
        }
      ]
    },
    anfiteatro: {
      id: "anfi_2",
      anio: 2,
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro)",
      titulo: "La Batalla del Anfiteatro",
      categoria: "anfiteatro",
      descripcion: "Madrugada en el Manuel Antonio Ramírez. La brisa del río Paraná refresca el escenario, pero la tensión entre los colegios punteros se corta con cuchillo.",
      opciones: [
        {
          id: "corte_acelerado",
          texto: "Subir las pulsaciones y meter un corte de scola a 140 BPM",
          descripcion: "Acelerar el tempo para desatar la locura colectiva en las gradas.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡El anfiteatro tembló! Nadie se quedó sentado en las gradas de piedra."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +3,
            resistencia: -3,
            overall: 0,
            mensaje: "Casi se les escapa el compás por la velocidad, pero lograron frenar a tiempo con el silbato."
          }
        },
        {
          id: "cadencia_firme",
          texto: "Mantener la cadencia pesada que hace vibrar el pecho",
          descripcion: "Compás seguro, firme y contundente sin correr riesgos.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "Paso firme y seguro. Los jurados elogiaron la madurez sonora del colegio."
          }
        }
      ]
    }
  },

  // --- 3º AÑO (Liderazgo y Madurez) ---
  3: {
    ensayos: {
      id: "ensayo_3",
      anio: 3,
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón & Galpón)",
      titulo: "La Discusión del Repertorio Rítmico",
      categoria: "ensayo",
      descripcion: "En la reunión de directores y caciques se debate si incluir un corte brasileño moderno o mantener las marchas históricas de la institución.",
      opciones: [
        {
          id: "innovar_corte",
          texto: "Proponer un corte innovador con síncopas y cambios de dinámica",
          descripcion: "Aportar frescura y modernidad al repertorio del colegio.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +3,
            overall: +5,
            mensaje: "¡El nuevo corte es un éxito demoledor! Todo el playón lo aprendió en dos días."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "A la fila de nuevos les costó memorizarlo y hubo que simplificar algunos golpes."
          }
        },
        {
          id: "mantener_tradicion",
          texto: "Defender la marcha histórica que identifica a la escuela hace 30 años",
          descripcion: "La identidad no se negocia: compás tradicional que eriza la piel de los egresados.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "Los egresados y padres aplaudieron emocionados en el alambrado. Identidad pura."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "piloto_3",
      anio: 3,
      fase: "prueba_piloto",
      faseNombre: "Segunda Prueba Piloto",
      titulo: "El Ensayo General con Cronómetro Oficial",
      categoria: "piloto",
      descripcion: "La última prueba antes del debut. Los veedores del jurado están cronometrando al segundo la parada en cada palco. Si te pasás de 22 minutos, hay descuento de puntos.",
      opciones: [
        {
          id: "marcar_paso_marcial",
          texto: "Ponerte al frente del compás y marcar el ritmo exacto de caminata",
          descripcion: "Usar tu experiencia para que nadie se apure ni se quede rezagado.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Puntualidad británica! 20 minutos clavados de pasada. Los directores te felicitaron."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: 0,
            overall: +1,
            mensaje: "Tuviste que apurar a la fila del fondo en el último tramo, pero entraron en tiempo."
          }
        },
        {
          id: "desborde_energetico",
          texto: "Hacer explotar los parches sin mirar el reloj y que la comisión maneje el tiempo",
          descripcion: "Entregar el 100% de sonido sin ataduras.",
          riesgo: "Medio",
          probabilidad: 0.7,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Una aplanadora sonora! La gente desbordó las vallas para aplaudir."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: -3,
            overall: 0,
            mensaje: "Quedaron al borde del tiempo límite reglamentario, pero el rugido de la banda fue colosal."
          }
        }
      ]
    },
    noches_calle: {
      id: "calle_3",
      anio: 3,
      fase: "noches_calle",
      faseNombre: "Noches de Calle (3ra Noche)",
      titulo: "La Noche de los Candidatos",
      categoria: "desfile",
      descripcion: "Sábado a la noche con récord de público en la Costanera. Se sabe que esta pasada define quiénes pelean los primeros puestos del podio provincial.",
      opciones: [
        {
          id: "toque_perfecto",
          texto: "Concentración absoluta en los redobles de cierre de cada palco",
          descripcion: "No regalar ni media décima en las planillas de los jurados de música.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Impecable! El jurado oficial no encontró un solo detalle para descontar."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: +1,
            overall: +2,
            mensaje: "Una pasada sobria y muy sólida que los mantiene en la pelea de arriba."
          }
        },
        {
          id: "levantar_las_manos",
          texto: "Girar sobre tu eje y hacer señas a las tribunas para que canten el himno del colegio",
          descripcion: "Convertir la Costanera en una caldera de pasión escolar.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +3,
            hinchada: +9,
            resistencia: +4,
            overall: +5,
            mensaje: "¡La Costanera entera coreó el himno de tu colegio! Momento inolvidable de la noche."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +5,
            resistencia: +1,
            overall: +2,
            mensaje: "Te desconcentraste un instante del siguiente corte, pero la hinchada fue una fiesta."
          }
        }
      ]
    },
    anfiteatro: {
      id: "anfi_3",
      anio: 3,
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro)",
      titulo: "El Corte de la Muerte en el Anfi",
      categoria: "anfiteatro",
      descripcion: "El escenario está hirviendo. Los directores te piden que tomes la iniciativa en el corte más difícil del repertorio frente a la mesa examinadora.",
      opciones: [
        {
          id: "clavar_el_corte",
          texto: "Marcar el corte con firmeza y sin titubeos",
          descripcion: "Asumir la responsabilidad del momento cumbre de la temporada.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +7,
            hinchada: +6,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Corte perfecto al milisegundo! El anfiteatro estalló en una ovación inolvidable."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Entraron con un poco de duda, pero la fuerza colectiva tapó el error."
          }
        },
        {
          id: "apoyar_a_companeros",
          texto: "Hacer contacto visual con tus compañeros de fila y sostener la base firme",
          descripcion: "Garantizar que nadie se equivoque en la parte más compleja.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Excelente liderazgo! Gracias a tu seguridad, toda la fila tocó al unísono."
          }
        }
      ]
    }
  },

  // --- 4º Y 5º AÑO (Los Caciques / Directores) ---
  4: {
    ensayos: {
      id: "ensayo_4",
      anio: 4,
      fase: "ensayos",
      faseNombre: "Época de Ensayos (El Mando General)",
      titulo: "La Elección de Directores y Jefes de Fila",
      categoria: "ensayo",
      descripcion: "Llegó el momento que esperaste toda tu secundaria. Los estudiantes de los últimos años se reúnen en el patio para votar democráticamente quiénes llevarán el mando y el silbato de oro.",
      opciones: [
        {
          id: "postularse_lider",
          texto: "Dar un discurso frente a todos y postularte a la Dirección General",
          descripcion: "Poner tus años de trayectoria y pasión sobre la mesa para liderar a todo el colegio.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +5,
            hinchada: +10,
            resistencia: +5,
            overall: +6,
            esDirector: true,
            mensaje: "¡OVACIÓN TOTAL! Tus compañeros te votaron por aclamación. ¡Sos el nuevo DIRECTOR/A de la banda!"
          },
          fracaso: {
            ritmo: +3,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "La votación estuvo peleada y quedaste como Cacique Principal de Fila con mando supremo en pista."
          }
        },
        {
          id: "apoyar_desde_fila",
          texto: "Preferir liderar desde adentro como el Pilar más respetado",
          descripcion: "Menos burocracia con los directivos y más potencia tocando tu instrumento.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "Sos el alma indiscutida del sonido de la escuela. Toda la percusión se guía con tu toque."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "piloto_4",
      anio: 4,
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "El Ajuste Fino de la Formación de Escuadras",
      categoria: "piloto",
      descripcion: "Últimos retoques de sincronía entre el cuerpo de baile y la percusión. Las pasistas necesitan cortes más limpios para sus evoluciones coreográficas frente al palco.",
      opciones: [
        {
          id: "coordinar_con_baile",
          texto: "Coordinar señas visuales con la Directora de Baile para sincronizar cortes",
          descripcion: "Unir la música y la danza en una sola obra de arte.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Sincronía cinematográfica! Baile y música se fundieron a la perfección."
          }
        },
        {
          id: "priorizar_potencia",
          texto: "Subir el volumen de las chanchas para que se escuche hasta Paraguay",
          descripcion: "Que el impacto sónico sea la marca registrada de tu pasada.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Un terremoto en la Costanera! Los autos de la avenida hacían sonar sus alarmas."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +5,
            resistencia: -2,
            overall: +1,
            mensaje: "Demasiado estruendo tapó un poco los arreglos de redoblantes, pero impresionó a todos."
          }
        }
      ]
    },
    noches_calle: {
      id: "calle_4",
      anio: 4,
      fase: "noches_calle",
      faseNombre: "Noches de Calle (Noche de Gala)",
      titulo: "La Coronación de la Calle",
      categoria: "desfile",
      descripcion: "Tu penúltimo o último año en la secundaria. Ya no hay margen de error: es la pasada donde se juega la gloria eterna de tu institución.",
      opciones: [
        {
          id: "desfile_consagratorio",
          texto: "Tocar con el alma y el corazón en cada metro de asfalto",
          descripcion: "Dejar una marca indeleble que los chicos de 1º año recuerden toda su vida.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +6,
            overall: +7,
            mensaje: "¡HISTÓRICO! Los jurados se pusieron de pie a aplaudir el paso de tu colegio."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +5,
            resistencia: -2,
            overall: +3,
            mensaje: "Terminaron agotados y con lágrimas en los ojos de la emoción. Pasada inolvidable."
          }
        },
        {
          id: "disfrutar_la_calle",
          texto: "Disfrutar cada segundo con tus amigos de promoción",
          descripcion: "Cantar, tocar y mirar las estrellas sobre el río sabiendo que estás en tu mejor momento.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +5,
            overall: +5,
            mensaje: "La sonrisa y la alegría sincera contagiaron a las miles de personas en las vallas."
          }
        }
      ]
    },
    anfiteatro: {
      id: "anfi_4",
      anio: 4,
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (El Adiós del Anfiteatro)",
      titulo: "El Silbato Final en la Bajada Vieja",
      categoria: "anfiteatro",
      descripcion: "Tu último show de scolas en el Anfiteatro. Las bengalas iluminan la noche misionera y los cánticos de tu colegio retumban en el río Paraná.",
      opciones: [
        {
          id: "corte_epico_final",
          texto: "Cerrar con el corte más rápido y complejo de la historia del colegio",
          descripcion: "Ir a todo o nada por la Copa de Oro.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +8,
            hinchada: +9,
            resistencia: +6,
            overall: +8,
            mensaje: "¡OBRA MAESTRA! Una de las mejores pasadas registradas en la historia de la Estudiantina."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +6,
            resistencia: -3,
            overall: +3,
            mensaje: "Un toque vertiginoso que desató el delirio de la tribuna, aunque rozó el descontrol."
          }
        },
        {
          id: "himno_con_el_alma",
          texto: "Cerrar con el himno tradicional cantado a capella con la hinchada",
          descripcion: "Un momento emotivo que tocará el corazón de los jurados más veteranos.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +10,
            resistencia: +5,
            overall: +6,
            mensaje: "¡Se te puso la piel de gallina! El anfiteatro entero aplaudió el respeto y la emoción."
          }
        }
      ]
    }
  }
};

// =========================================================================
// 2. EVENTOS SORPRESA (Mala Suerte & Giros del Destino)
// =========================================================================

export const EVENTOS_SORPRESA = [
  // --- Mala Suerte: Lesión por sobreentrenamiento ---
  {
    id: "sorpresa_tendinitis",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Tendinitis y Muñeca Abierta!",
    categoria: "urgencia",
    descripcion: "Cinco horas seguidas dándole a la chancha/redoblante con palillos pesados sin elongar te pasaron factura. La muñeca derecha se te hinchó como una pelota a dos días del desfile.",
    opciones: [
      {
        id: "infiltrarse",
        texto: "Vendarte con crema térmica y tocar soportando el dolor",
        descripcion: "No dejar a tu colegio en banda aunque te muerdas los labios del dolor.",
        riesgo: "Alto",
        probabilidad: 0.6,
        exito: {
          ritmo: +3,
          hinchada: +6,
          resistencia: -6,
          overall: +1,
          mensaje: "¡Hazaña de puro coraje! Aguantaste como un titán y la hinchada coreó tu valentía."
        },
        fracaso: {
          ritmo: -8,
          hinchada: +2,
          resistencia: -12,
          overall: -6,
          mensaje: "El dolor te traicionó en el Palco 1 y se te cayó el palillo al asfalto (-8 Ritmo, -12 Resistencia)."
        }
      },
      {
        id: "ceder_lugar_primeros_palcos",
        texto: "Tomar antiinflamatorios y pedir auxilio a un compañero suplente",
        descripcion: "Descansar la primera noche para recuperarte bien de cara al Anfi.",
        riesgo: "Bajo",
        probabilidad: 0.9,
        exito: {
          ritmo: -2,
          hinchada: -1,
          resistencia: +5,
          overall: 0,
          mensaje: "Decisión madura. La muñeca se desinflamó a tiempo para el show decisivo."
        }
      }
    ]
  },

  // --- Mala Suerte: Rotura de Parche en plena pasada ---
  {
    id: "sorpresa_parche_roto",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Parche Rajado a Minutos de Salir!",
    categoria: "urgencia",
    descripcion: "En la cabecera del 4to tramo, probando el último toque antes del silbato oficial, el parche de tu instrumento se rajó de lado a lado. ¡El carro de auxilio no tiene parches de esa medida!",
    opciones: [
      {
        id: "cinta_plateada",
        texto: "Parcharlo de urgencia con cinta adhesiva de embalar y rogar que aguante",
        descripcion: "Solución criolla al límite mientras la cuenta regresiva llega a cero.",
        riesgo: "Alto",
        probabilidad: 0.55,
        exito: {
          ritmo: +2,
          hinchada: +5,
          resistencia: +2,
          overall: +2,
          mensaje: "¡Increíblemente la cinta aguantó! Sonó más seco, pero salvó la pasada con honra."
        },
        fracaso: {
          ritmo: -7,
          hinchada: -3,
          resistencia: -5,
          overall: -5,
          mensaje: "La cinta se despegó en el Palco 2 y tu instrumento sonó a balde de plástico (-7 Ritmo)."
        }
      },
      {
        id: "pedir_colegio_amigo",
        texto: "Correr desesperado al galpón de otro colegio a pedir un parche de repuesto",
        descripcion: "Tragar el orgullo y pedir solidaridad estudiantil a contra reloj.",
        riesgo: "Medio",
        probabilidad: 0.75,
        exito: {
          ritmo: +3,
          hinchada: +4,
          resistencia: -3,
          overall: +2,
          mensaje: "¡Un carrocero solidario te prestó un parche impecable! Llegaste a la fila corriendo justo a tiempo."
        },
        fracaso: {
          ritmo: -4,
          hinchada: -2,
          resistencia: -6,
          overall: -3,
          mensaje: "Tardaste demasiado buscando y entraste a la pista con la pasada ya empezada (-4 Ritmo)."
        }
      }
    ]
  },

  // --- Mala Suerte: Sanción de Veedor del Jurado ---
  {
    id: "sorpresa_veedor_apes",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Planilla Roja del Veedor del Jurado!",
    categoria: "urgencia",
    descripcion: "El colegio de adelante se atrasó 15 minutos en el Palco 1. Tu banda empezó a tocar para mantener caliente a la hinchada, pero un veedor riguroso de la organización se acerca con planilla en mano para amonestarlos por tocar fuera de zona.",
    opciones: [
      {
        id: "negociar_con_veedor",
        texto: "Ir con respeto al veedor, mostrar el reloj y calmar las aguas",
        descripcion: "Usar la diplomacia estudiantil para evitar la quita de puntos.",
        riesgo: "Medio",
        probabilidad: 0.75,
        exito: {
          ritmo: +2,
          hinchada: +5,
          resistencia: +2,
          overall: +3,
          mensaje: "¡Gran cintura política! El veedor guardó la sanción y felicitó tu madurez como vocero."
        },
        fracaso: {
          ritmo: -3,
          hinchada: +1,
          resistencia: -4,
          overall: -3,
          mensaje: "El veedor se puso terco y les clavó una penalización de 2 puntos en disciplina (-3 Overall)."
        }
      },
      {
        id: "frenar_en_seco",
        texto: "Dar la orden inmediata de silencio total y pedir paciencia a la tribuna",
        descripcion: "No darle ningún motivo reglamentario para sancionar.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +1,
          hinchada: -2,
          resistencia: +2,
          overall: +1,
          mensaje: "Se salvó la sanción disciplinaria, aunque la tribuna se impacientó un poco con el silencio."
        }
      }
    ]
  },

  // --- Mala Suerte: Alerta Meteorológica y Diluvio ---
  {
    id: "sorpresa_tormenta_parana",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Diluvio Torrencial sobre el Río Paraná!",
    categoria: "urgencia",
    descripcion: "El cielo se puso negro como carbón y se desató una tormenta de viento y lluvia sobre la Costanera justo cuando bajaban del camión. El agua amenaza con arruinar parches, trajes y espaldares.",
    opciones: [
      {
        id: "cubrir_instrumentos",
        texto: "Cubrir los instrumentos con nylon y proteger el material a toda costa",
        descripcion: "Priorizar la conservación de los equipos de la escuela.",
        riesgo: "Bajo",
        probabilidad: 0.9,
        exito: {
          ritmo: +2,
          hinchada: +3,
          resistencia: +4,
          overall: +3,
          mensaje: "¡Salvaron los instrumentos sin una sola gota! Gran espíritu de equipo."
        }
      },
      {
        id: "tocar_bajo_lluvia",
        texto: "¡Tocar bajo la lluvia como guerreros y enfervorizar a la gente!",
        descripcion: "Hacer de la tormenta un show épico irrepetible.",
        riesgo: "Alto",
        probabilidad: 0.65,
        exito: {
          ritmo: +5,
          hinchada: +10,
          resistencia: -4,
          overall: +6,
          mensaje: "¡ÉPICO! Los videos bajo el agua se hicieron virales en todo Misiones. Fiesta absoluta."
        },
        fracaso: {
          ritmo: -4,
          hinchada: +4,
          resistencia: -10,
          overall: -4,
          mensaje: "Los parches se destensaron por el agua y al día siguiente caíste con 39 de fiebre (-10 Resistencia)."
        }
      }
    ]
  },

  // --- Mala Suerte: Ultimátum de Rectoría por Materias ---
  {
    id: "sorpresa_rectoria_notas",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Ultimátum de Rectoría por Materias!",
    categoria: "urgencia",
    descripcion: "Tus profesores le avisaron al Rector que te estás llevando 3 materias al trimestre por faltar a clases para ensayar. Te llegó una citación: si no aprobás el recuperatorio del lunes, te prohíben desfilar en el Anfi.",
    opciones: [
      {
        id: "estudiar_sin_dormir",
        texto: "Pasar 3 noches sin dormir estudiando después de cada ensayo",
        descripcion: "No aflojarle ni a los libros ni a los parches.",
        riesgo: "Medio",
        probabilidad: 0.7,
        exito: {
          ritmo: +2,
          hinchada: +3,
          resistencia: -8,
          overall: +2,
          mensaje: "¡Aprobaste con 7! La rectoría te levantó la sanción, aunque tenés ojeras hasta el piso."
        },
        fracaso: {
          ritmo: -3,
          hinchada: +1,
          resistencia: -12,
          overall: -5,
          mensaje: "Te quedaste dormido sobre la prueba y te sancionaron una semana sin ensayar (-5 Overall)."
        }
      },
      {
        id: "grupo_apoyo_colegio",
        texto: "Pedirle a los abanderados del colegio que te hagan clases particulares en el recreo",
        descripcion: "Apoyarte en la comunidad escolar para salvar el trimestre.",
        riesgo: "Bajo",
        probabilidad: 0.85,
        exito: {
          ritmo: +2,
          hinchada: +4,
          resistencia: +1,
          overall: +3,
          mensaje: "¡Aprobaste con holgura! Gracias a tus compañeros pudiste desfilar sin ningún cargo de culpa."
        }
      }
    ]
  },

  // --- Buena Suerte: Donación de Leyenda Egresada ---
  {
    id: "sorpresa_donacion_egresado",
    tipo: "buena_suerte",
    titulo: "✨ ¡La Visita de una Leyenda Egresada!",
    categoria: "fortuna",
    descripcion: "Un ex-director mítico de tu colegio de la década de los 90 pasó por el galpón de ensayo. Emocionado al ver el compromiso de las nuevas generaciones, donó baquetas profesionales y un juego nuevo de parches de alta gama.",
    opciones: [
      {
        id: "aprovechar_equipamiento",
        texto: "Afinar todos los instrumentos con los nuevos parches profesionales",
        descripcion: "Subir la calidad del sonido del colegio a nivel de festival internacional.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +5,
          hinchada: +4,
          resistencia: +3,
          overall: +4,
          mensaje: "¡El sonido de la banda ahora parece un trueno afinado! La calidad acústica subió por las nubes."
        }
      },
      {
        id: "pedir_masterclass",
        texto: "Aprovechar su visita y pedirle una clínica exprés de cortes de la vieja escuela",
        descripcion: "Aprender los secretos de los años dorados de la Estudiantina.",
        riesgo: "Medio",
        probabilidad: 0.85,
        exito: {
          ritmo: +6,
          hinchada: +3,
          resistencia: +2,
          overall: +4,
          mensaje: "¡Lección magistral! Les transmitió la mística de los 90 y los cortes salieron con una solidez colosal."
        }
      }
    ]
  },

  // --- Alto Riesgo / Mala Suerte: Parche Rajado en Palco 2 ---
  {
    id: "sorpresa_parche_rajado_furia_alto_riesgo",
    tipo: "mala_suerte",
    titulo: "⚡ ¡Parche Rajado a Mitad de Pasada: Tocar al Doble de Fuerza!",
    categoria: "urgencia",
    descripcion: "A mitad de camino entre el Palco 1 y 2, se abre una grieta de 10 centímetros en el parche sintético de tu instrumento. Si el sonido decae, el jurado penaliza al bloque.",
    opciones: [
      {
        id: "pegarle_en_el_borde_al_doble",
        texto: "Descargar golpes con furia ciega en el centímetro sano del aro para tapar el rajón con volumen bruto",
        descripcion: "Jugártela al todo o nada con una pegada titánica que puede salvar el corte o destrozar el instrumento.",
        riesgo: "Alto",
        probabilidad: 0.52,
        exito: {
          ritmo: +8,
          hinchada: +9,
          resistencia: +3,
          overall: +6,
          mensaje: "¡MILAGRO RÍTMICO! La vibración fue demoledora, el parche aguantó la tensión y la tribuna aplaudió tu garra indomable."
        },
        fracaso: {
          ritmo: -10,
          hinchada: -3,
          resistencia: -5,
          overall: -6,
          mensaje: "¡El parche estalló por completo con un zumbido seco! El instrumento quedó mudo y tuviste que simular los golpes con los dientes apretados (-10 Ritmo, -6 Overall)."
        }
      },
      {
        id: "pedir_repuesto_al_auxilio",
        texto: "Hacer seña discreta a los aguateros del cordón para cambiar de instrumento en la transición",
        descripcion: "Resolver con practicidad y prolijidad sin arriesgar el papelón de la rotura total.",
        riesgo: "Bajo",
        probabilidad: 0.90,
        exito: {
          ritmo: +4,
          hinchada: +3,
          resistencia: +2,
          overall: +3,
          mensaje: "Cambio relámpago impecable. En 5 segundos estabas tocando de nuevo con instrumento fresco."
        }
      }
    ]
  },

  // --- Alto Riesgo / Mala Suerte: Bengala Náutica en Cabecera ---
  {
    id: "sorpresa_bengala_flur_peligro_alto_riesgo",
    tipo: "mala_suerte",
    titulo: "⚡ ¡Bengala Náutica de Fósforo en Plena Cabecera!",
    categoria: "urgencia",
    descripcion: "En la cabecera del desfile, un simpatizante eufórico salta la reja y te pone en las manos una bengala marina de fósforo flúor encendida gritando '¡Para que brillen en la tele!'. El humo espeso arde en los ojos y la policía mira atenta.",
    opciones: [
      {
        id: "levantar_bengala_con_toque_solista",
        texto: "Agarrarla con la mano izquierda, alzarla al cielo y tocar el redoble con una sola baqueta",
        descripcion: "Un momento visual épico y temerario desafiando a las autoridades.",
        riesgo: "Alto",
        probabilidad: 0.55,
        exito: {
          ritmo: +6,
          hinchada: +10,
          resistencia: +3,
          overall: +6,
          mensaje: "¡IMAGEN DE PORTADA! La postal con la bengala flúor y el tambor en llamas recorrió los grupos y canales. Te ganaste el corazón rebelde de Posadas."
        },
        fracaso: {
          ritmo: -5,
          hinchada: +3,
          resistencia: -8,
          overall: -5,
          mensaje: "¡Chispazo en los dedos y acta policial! El fósforo te quemó los guantes, la policía te confiscó la bengala y los veedores del jurado labraron advertencia grave (-8 Aguante, -5 Overall)."
        }
      },
      {
        id: "apagar_bengala_en_balde_bomberos",
        texto: "Tirar la bengala de inmediato en el tacho de agua de los bomberos y concentrarte en el compás",
        descripcion: "Priorizar la seguridad de la pasada y evitar multas para tu colegio.",
        riesgo: "Bajo",
        probabilidad: 0.96,
        exito: {
          ritmo: +4,
          hinchada: +3,
          resistencia: +3,
          overall: +3,
          mensaje: "Reacción ejemplar y madura. Los bomberos y comisarios felicitaron tu templanza."
        }
      }
    ]
  },

  // --- Buena Suerte: Video Viral de 1 Millón en TikTok ---
  {
    id: "sorpresa_tiktok_millon_viral",
    tipo: "buena_suerte",
    titulo: "📱 ¡Video Viral de 1 Millón de Reproducciones en TikTok!",
    categoria: "fortuna",
    descripcion: "Un video en primer plano de tu solo de percusión grabado desde el balcón de un edificio en la Costanera explota en redes: ¡superó el millón de reproducciones en TikTok y Posadas entera comenta tu carisma!",
    opciones: [
      {
        id: "agradecer_video_recrear_paso",
        texto: "Subir un video agradeciendo a los hinchas y recrear el paso característico en la pista",
        descripcion: "Consolidarte como la gran figura pública de la juventud posadeña.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +5,
          hinchada: +10,
          resistencia: +3,
          overall: +7,
          mensaje: "¡Furor total! Miles de chicos fueron a la Costanera solo para verte tocar y la hinchada coreó tu apodo."
        }
      },
      {
        id: "mantener_humildad_de_galpon",
        texto: "Reunir a tus compañeros y decirles: 'Esto no es mío, es de toda la scola; sigamos concentrados'",
        descripcion: "Mantener los pies en la tierra y priorizar la química interna.",
        riesgo: "Bajo",
        probabilidad: 0.98,
        exito: {
          ritmo: +6,
          hinchada: +6,
          resistencia: +5,
          overall: +6,
          mensaje: "¡Liderazgo intachable! Tus compañeros te abrazaron y el respeto de la fila se multiplicó."
        }
      }
    ]
  },

  // --- Mala Suerte: Chubasco Repentino de Primavera ---
  {
    id: "sorpresa_llovizna_parche_resbaladizo",
    tipo: "mala_suerte",
    titulo: "🌧️ ¡Chubasco Repentino de Primavera sobre el Asfalto!",
    categoria: "urgencia",
    descripcion: "Una lluvia fugaz pero intensa de primavera moja los adoquines del 4to tramo justo antes de ingresar al Palco 1. Los parches acumulan gotas que apagan el brillo acústico y el suelo resbala.",
    opciones: [
      {
        id: "sacudir_parches_al_vuelo",
        texto: "Inclinar los instrumentos en cada remate para que el agua salga despedida en spray brillante",
        descripcion: "Convertir la lluvia en un espectáculo visual inolvidable bajo las luces.",
        riesgo: "Medio",
        probabilidad: 0.85,
        exito: {
          ritmo: +6,
          hinchada: +9,
          resistencia: +4,
          overall: +6,
          mensaje: "¡EFECTO CINEMATOGRÁFICO! Las gotas volando iluminadas por las torres de luz crearon la postal del año."
        },
        fracaso: {
          ritmo: +1,
          hinchada: +4,
          resistencia: -3,
          overall: +1,
          mensaje: "Se mojaron las baquetas y resbaló algún golpe (-3 Aguante), pero no aflojaron."
        }
      },
      {
        id: "secar_rapido_con_toallas",
        texto: "Pedir toallas secas a los suplentes en el cambio de tramo para limpiar las membranas",
        descripcion: "Cuidar la afinación y evitar que el sonido suene empastado.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +5,
          hinchada: +4,
          resistencia: +4,
          overall: +4,
          mensaje: "Prolijidad impecable. Los tambores sonaron nítidos y secos frente al jurado."
        }
      }
    ]
  },

  // --- Buena Suerte: Banquete de Sándwiches de Milanesa Caseros ---
  {
    id: "sorpresa_sandwiches_milanesa_padres",
    tipo: "buena_suerte",
    titulo: "🥖 ¡Bandejas de Sándwiches de Milanesa de la Comisión!",
    categoria: "fortuna",
    descripcion: "En la concentración previa a la medianoche, las familias de la comisión de padres llegan con bandejas repletas de sándwiches de milanesa caseros en pan francés crocante con tomate y lechuga.",
    opciones: [
      {
        id: "comer_con_la_tropa_y_brindar",
        texto: "Comer todos juntos en ronda compartiendo anécdotas y cantando los lemas del colegio",
        descripcion: "Recargar calorías y sellar la hermandad antes de entrar a la pista.",
        riesgo: "Bajo",
        probabilidad: 1.0,
        exito: {
          ritmo: +4,
          hinchada: +8,
          resistencia: +8,
          overall: +6,
          mensaje: "¡Baterías al 100%! La energía del alimento casero y el amor familiar los hizo entrar a la pista imparables (+8 Aguante)."
        }
      },
      {
        id: "guardar_porcion_remate",
        texto: "Comer medio sándwich liviano y guardar el resto para festejar al terminar la pasada",
        descripcion: "No competir con la panza llena para mantener máxima agilidad.",
        riesgo: "Bajo",
        probabilidad: 0.98,
        exito: {
          ritmo: +6,
          hinchada: +5,
          resistencia: +5,
          overall: +5,
          mensaje: "Liviano como pluma y rápido de reflejos. Pasada ágil y elegante."
        }
      }
    ]
  },

  // --- Buena Suerte: Donativo Anónimo de Parches Importados ---
  {
    id: "sorpresa_donativo_anonimo_parches",
    tipo: "buena_suerte",
    titulo: "🎁 ¡Donativo Anónimo de Parches y Correas de Primera Marca!",
    categoria: "fortuna",
    descripcion: "Llega al galpón de la escuela una caja misteriosa sellada: un exalumno exitoso donó 15 parches sintéticos importados de alta densidad y correas de cuero acolchadas para toda la batería.",
    opciones: [
      {
        id: "equipar_toda_la_fila_pesada",
        texto: "Instalar los parches nuevos en las chanchas y tones para que el sonido gane 5 decibeles de pegada",
        descripcion: "Aprovechar la acústica superior de los materiales profesionales.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +6,
          hinchada: +6,
          resistencia: +6,
          overall: +6,
          mensaje: "¡Sonido orquestal de élite! La banda sonó con una resonancia profunda que asombró a los directores rivales."
        }
      },
      {
        id: "compartir_repuestos_con_suplentes",
        texto: "Guardar 5 parches de reserva estratégica y equipar a los suplentes más sacrificados",
        descripcion: "Recompensar a los chicos que siempre están listos para apoyar.",
        riesgo: "Bajo",
        probabilidad: 0.98,
        exito: {
          ritmo: +5,
          hinchada: +8,
          resistencia: +5,
          overall: +6,
          mensaje: "¡Justicia y compañerismo! Toda la scola sintió el respaldo y el compromiso fue absoluto."
        }
      }
    ]
  },

  // --- Buena Suerte / Tensión: La Multitud Frena el Cronómetro Oficial ---
  {
    id: "sorpresa_ovacion_frena_cronometro",
    tipo: "buena_suerte",
    titulo: "⏳ ¡La Multitud Desborda las Vallas de Afecto!",
    categoria: "fortuna",
    descripcion: "Frente al Palco 2, la hinchada de tu colegio y el público neutral desbordan las vallas aplaudiendo de pie y coreando el estribillo tan fuerte que los comisarios de pista se miran sin saber si frenar el tiempo.",
    opciones: [
      {
        id: "seguir_tocando_mirando_la_gente",
        texto: "Extender el corte 20 segundos disfrutando el cariño popular y sellar el momento",
        descripcion: "Un baño de gloria popular que quedará para siempre en la memoria.",
        riesgo: "Medio",
        probabilidad: 0.88,
        exito: {
          ritmo: +6,
          hinchada: +10,
          resistencia: +4,
          overall: +7,
          mensaje: "¡IDOLATRÍA POPULAR ABSOLUTA! Los comisarios perdonaron el exceso de tiempo contagiados por la emoción de la gente."
        },
        fracaso: {
          ritmo: +2,
          hinchada: +8,
          resistencia: -1,
          overall: +2,
          mensaje: "Una advertencia de 0.5 puntos por tiempo, pero el cariño de la gente no se paga con nada."
        }
      },
      {
        id: "hacer_seña_y_avanzar_disciplinado",
        texto: "Saludar a la tribuna con las baquetas y avanzar con paso marcial exacto dentro del tiempo",
        descripcion: "Priorizar el reloj oficial para no ceder ni una décima reglamentaria.",
        riesgo: "Bajo",
        probabilidad: 0.98,
        exito: {
          ritmo: +6,
          hinchada: +7,
          resistencia: +5,
          overall: +6,
          mensaje: "Inteligencia y profesionalismo. Aplausos de la gente y felicitación de los cronometristas."
        }
      }
    ]
  },

  // --- Mala Suerte: Ola de Calor Extremo de 40°C ---
  {
    id: "sorpresa_ola_calor_40",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Ola de Calor de 40°C en la Tierra Colorada!",
    categoria: "urgencia",
    descripcion: "La siesta posadeña arde a 40°C a la sombra y el asfalto del 4to tramo parece una sartén hirviente. El calor derrite las suelas y el aire quema los pulmones al tocar.",
    opciones: [
      {
        id: "hidratacion_constante_esponjas",
        texto: "Mojarse la nuca con esponjas de agua helada y regular el consumo de tereré",
        descripcion: "Mantener la temperatura corporal controlada para no colapsar antes del Palco 2.",
        riesgo: "Bajo",
        probabilidad: 0.9,
        exito: {
          ritmo: +3,
          hinchada: +3,
          resistencia: +5,
          overall: +3,
          mensaje: "¡Resistencia colosal! Llegaron enteros al final mientras otros colegios se deshidrataban."
        },
        fracaso: {
          ritmo: +1,
          hinchada: +1,
          resistencia: -2,
          overall: 0,
          mensaje: "El calor igual pasó factura en el tramo final, pero lograron terminar el desfile."
        }
      },
      {
        id: "tocar_furia_ciega_calor",
        texto: "Ignorar el bochorno y tocar con furia ciega para contagiar a la tribuna",
        descripcion: "Demostrar que en Misiones el calor se combate con más percusión.",
        riesgo: "Alto",
        probabilidad: 0.65,
        exito: {
          ritmo: +6,
          hinchada: +8,
          resistencia: -4,
          overall: +5,
          mensaje: "¡Épica bajo el fuego! La tribuna se volvió loca con la entrega sobrehumana de la scola."
        },
        fracaso: {
          ritmo: -4,
          hinchada: +2,
          resistencia: -10,
          overall: -4,
          mensaje: "El golpe de calor te dejó mareado en el Palco 1 y se te nubló la vista (-10 Aguante, -4 Overall)."
        }
      }
    ]
  },

  // --- Buena Suerte: Video Viral en TikTok ---
  {
    id: "sorpresa_video_viral_tiktok",
    tipo: "buena_suerte",
    titulo: "✨ ¡Video Viral en TikTok con 500k Reproducciones!",
    categoria: "fortuna",
    descripcion: "Un video de 15 segundos con el corte sincopado de tu banda en la prueba piloto explotó en TikTok. Tiene más de medio millón de vistas y comentarios de percusionistas de todo el país elogiando el compás posadeño.",
    opciones: [
      {
        id: "capitalizar_furor_redes",
        texto: "Aprovechar la fama para arengar a toda la comunidad y llenar la tribuna de banderas",
        descripcion: "Convertir la viralidad en una marea humana de apoyo en la Costanera.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +4,
          hinchada: +9,
          resistencia: +3,
          overall: +5,
          mensaje: "¡La tribuna desbordó la baranda! Toda la provincia fue a ver a los virales de la Estudiantina."
        }
      },
      {
        id: "mantener_humildad_ensayos",
        texto: "Reunir al grupo y decir: 'Los videos no ganan copas; a concentrarse en los parches'",
        descripcion: "Priorizar la disciplina y evitar que los humos se suban a la cabeza.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +7,
          hinchada: +4,
          resistencia: +5,
          overall: +6,
          mensaje: "Madurez de campeones. El enfoque no se desvió y el sonido en pista fue una sinfonía perfecta."
        }
      }
    ]
  },

  // --- Mala Suerte: Pérdida de Bandera Insignia ---
  {
    id: "sorpresa_perdida_bandera",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Pérdida de la Bandera Insignia de Cabecera!",
    categoria: "urgencia",
    descripcion: "A 20 minutos de que empiece el desfile, los abanderados se dan cuenta de que la bandera oficial bordada con el escudo del colegio no está en el camión de utilería. ¡Sin bandera no los dejan largar en pista!",
    opciones: [
      {
        id: "correr_remis_galpon",
        texto: "Mandar a dos colaboradores en moto al galpón a toda velocidad a buscarla",
        descripcion: "Recuperar el estandarte sagrado contra reloj por las calles de Posadas.",
        riesgo: "Medio",
        probabilidad: 0.8,
        exito: {
          ritmo: +3,
          hinchada: +5,
          resistencia: -2,
          overall: +3,
          mensaje: "¡Llegaron derrapando con la bandera flameando en el minuto cero! Ovación en cabecera."
        },
        fracaso: {
          ritmo: -3,
          hinchada: -2,
          resistencia: -4,
          overall: -3,
          mensaje: "El tránsito en la avenida los demoró y tuvieron que largar con un banderín provisorio (-3 Ritmo)."
        }
      },
      {
        id: "pedir_prestada_egresados",
        texto: "Pedirle la bandera histórica a la hinchada de exalumnos en la tribuna",
        descripcion: "Desfilar con el manto de los veteranos cargado de mística.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +2,
          hinchada: +8,
          resistencia: +3,
          overall: +4,
          mensaje: "¡Mística conmovedora! Desfilar con la bandera de los egresados unió a todas las generaciones."
        }
      }
    ]
  },

  // --- Buena Suerte: El Tereré Mágico con Yuyos del Monte ---
  {
    id: "sorpresa_terere_magico",
    tipo: "buena_suerte",
    titulo: "✨ ¡El Tereré Mágico con Yuyos del Monte!",
    categoria: "fortuna",
    descripcion: "La madre de un carrocero trajo un termo gigante de tereré helado con una mezcla secreta de burrito, menta, cedrón y gotas de limón misionero. El primer trago te quita el dolor de garganta y revive las muñecas fatigadas.",
    opciones: [
      {
        id: "compartir_con_toda_scola",
        texto: "Pasar el mate de tereré por toda la fila para que todos recuperen energía",
        descripcion: "Compartir la frescura comunitaria antes de la bajada.",
        riesgo: "Bajo",
        probabilidad: 1.0,
        exito: {
          ritmo: +4,
          hinchada: +5,
          resistencia: +8,
          overall: +5,
          mensaje: "¡Efecto revitalizante inmediato! Toda la scola recuperó el aliento y la energía física."
        }
      },
      {
        id: "agradecer_con_toque_especial",
        texto: "Dedicarle el primer corte del ensayo a las familias que siempre bancan con tereré",
        descripcion: "Reconocer el esfuerzo silencioso de los padres en el playón.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +5,
          hinchada: +7,
          resistencia: +4,
          overall: +5,
          mensaje: "¡Emoción a flor de piel! El agradecimiento fortaleció el corazón de la hinchada."
        }
      }
    ]
  },

  // --- Mala Suerte: Inspección Sorpresa de Carnets Oficiales ---
  {
    id: "sorpresa_inspeccion_carnets",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Inspección Sorpresa de Carnets Oficiales!",
    categoria: "urgencia",
    descripcion: "Tres veedores estrictos de la comisión fiscalizadora se plantan en la valla con carpetas: exigen cotejar DNI, carnet habilitante y constancia de alumno regular de cinco integrantes titulares elegidos al azar.",
    opciones: [
      {
        id: "carpeta_prolija_delegado",
        texto: "Presentar la carpeta del delegado con toda la documentación foliada y en regla",
        descripcion: "Superar el control burocrático con pulcritud institucional.",
        riesgo: "Bajo",
        probabilidad: 0.9,
        exito: {
          ritmo: +3,
          hinchada: +3,
          resistencia: +2,
          overall: +3,
          mensaje: "¡Inspección superada con honores! Los veedores felicitaron la seriedad de tu colegio."
        },
        fracaso: {
          ritmo: 0,
          hinchada: +1,
          resistencia: -2,
          overall: 0,
          mensaje: "Faltaba una fotocopia de DNI, pero con una llamada al Rector autorizaron la pasada a tiempo."
        }
      },
      {
        id: "negociar_solidaridad_apes",
        texto: "Explicar con respeto la situación de los chicos del interior y solicitar firma de acta condicional",
        descripcion: "Evitar que dejen afuera a un compañero que viajó horas para desfilar.",
        riesgo: "Medio",
        probabilidad: 0.78,
        exito: {
          ritmo: +4,
          hinchada: +6,
          resistencia: +2,
          overall: +4,
          mensaje: "¡Cintura humana! El comisario firmó el acta y el compañero pudo tocar con lágrimas en los ojos."
        },
        fracaso: {
          ritmo: -3,
          hinchada: +1,
          resistencia: -3,
          overall: -2,
          mensaje: "Tuvieron que poner un suplente a último momento desajustando la primera fila (-3 Ritmo)."
        }
      }
    ]
  },

  // --- Buena Suerte: Sponsor de Frutas y Bebidas Isotónicas ---
  {
    id: "sorpresa_sponsor_bebidas",
    tipo: "buena_suerte",
    titulo: "✨ ¡Sponsor Solidario de Frutas y Bebidas!",
    categoria: "fortuna",
    descripcion: "Un comercio emblemático de la Costanera y exalumnos donaron 20 cajones de bananas, naranjas frescas y botellas de bebidas isotónicas frías para toda la delegación de tu escuela.",
    opciones: [
      {
        id: "reparto_nutricional_estratégico",
        texto: "Organizar postas de recarga de sales minerales entre el Palco 1 y el Palco 2",
        descripcion: "Garantizar aguante aeróbico en el tramo más desgastante del desfile.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +4,
          hinchada: +4,
          resistencia: +8,
          overall: +5,
          mensaje: "¡Cero calambres! La scola desfiló liviana, ágil y con un aguante de acero hasta la rotonda."
        }
      },
      {
        id: "compartir_con_otros_colegios",
        texto: "Regalar tres cajones de fruta al colegio que desfila antes que ustedes",
        descripcion: "Fomentar la hermandad estudiantil genuina de la juventud de Posadas.",
        riesgo: "Bajo",
        probabilidad: 1.0,
        exito: {
          ritmo: +3,
          hinchada: +8,
          resistencia: +5,
          overall: +5,
          mensaje: "¡Hermandad estudiantil posadeña! Los dos colegios se aplaudieron mutuamente en un gesto que conmovió a la organización."
        }
      }
    ]
  },

  // --- Mala Suerte: Pánico Escénico de Compañero Clave ---
  {
    id: "sorpresa_panico_escenico",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Bloqueo y Pánico Escénico en la Fila!",
    categoria: "urgencia",
    descripcion: "Al ver la marea humana de 10.000 personas en las gradas de la Costanera, el titular de redoblante o de chancha del centro se paraliza: tiembla, tira la baqueta y dice que no puede dar un solo paso.",
    opciones: [
      {
        id: "abrazo_respiracion_empatia",
        texto: "Abrazarlo fuerte, mirarlo a los ojos y respirar juntos: 'Mirame a mí, no mires la tribuna'",
        descripcion: "Contener emocionalmente a tu compañero con humanidad fraternal.",
        riesgo: "Bajo",
        probabilidad: 0.88,
        exito: {
          ritmo: +4,
          hinchada: +7,
          resistencia: +3,
          overall: +5,
          mensaje: "¡Recuperó el temple! El chico levantó el instrumento con orgullo y tocó la mejor pasada de su vida."
        },
        fracaso: {
          ritmo: +1,
          hinchada: +3,
          resistencia: -1,
          overall: +1,
          mensaje: "Le costó los primeros dos compases, pero logró entrar en ritmo al pasar el primer puente."
        }
      },
      {
        id: "reemplazo_rapido_suplente",
        texto: "Dar aviso inmediato al suplente que esperaba en el cordón de la vereda",
        descripcion: "Asegurar que la fila entre completa sin arriesgar baches sonoros.",
        riesgo: "Bajo",
        probabilidad: 0.9,
        exito: {
          ritmo: +3,
          hinchada: +3,
          resistencia: +2,
          overall: +3,
          mensaje: "Reemplazo quirúrgico. El suplente entró motivadísimo y cumplió con solvencia."
        }
      }
    ]
  },

  // --- Buena Suerte: Abrazo de Egresados en el Muelle ---
  {
    id: "sorpresa_abrazo_egresados",
    tipo: "buena_suerte",
    titulo: "✨ ¡El Abrazo de los Egresados en el Muelle!",
    categoria: "fortuna",
    descripcion: "Al doblar en la rotonda del muelle de pescadores, una multitud de egresados de promociones históricas (desde los años 80 hasta la del año pasado) encienden bengalas azules y doradas cantando la marcha de tu colegio a capela.",
    opciones: [
      {
        id: "responder_corte_homenaje",
        texto: "Clavar un corte especial en seco y tocar el repique clásico dedicado a los egresados",
        descripcion: "Hacer temblar el río Paraná con el homenaje más sentido de la Estudiantina.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +6,
          hinchada: +10,
          resistencia: +4,
          overall: +7,
          mensaje: "¡ÉXTASIS EMOCIONAL! Egresados llorando en las vallas, abrazos y cánticos que se escucharon en toda Posadas."
        }
      },
      {
        id: "sostener_mirada_marcial",
        texto: "Mantener la vista al frente con el mentón en alto saludando con el instrumento",
        descripcion: "Demostrar que la nueva generación custodia el honor del colegio con máxima hidalguía.",
        riesgo: "Bajo",
        probabilidad: 1.0,
        exito: {
          ritmo: +5,
          hinchada: +7,
          resistencia: +5,
          overall: +5,
          mensaje: "Porte marcial y orgullo inquebrantable. Los veteranos aplaudieron la disciplina intachable."
        }
      }
    ]
  },

  // --- Mala Suerte: Ampollas y Manos Sangrantes ---
  {
    id: "sorpresa_ampollas_sangrantes",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Ampollas y Manos Sangrantes en el Asfalto!",
    categoria: "urgencia",
    descripcion: "Tantas horas continuas de toque con calor y sudor te rompieron las ampollas de las palmas. La piel está en carne viva y cada golpe de baqueta te manda punzadas de dolor hasta el antebrazo.",
    opciones: [
      {
        id: "encintar_manos_resina",
        texto: "Encintarse los dedos con cinta adhesiva de tela, apretar las mandíbulas y seguir",
        descripcion: "Aguantar con coraje espartano sin bajar el volumen del toque.",
        riesgo: "Medio",
        probabilidad: 0.75,
        exito: {
          ritmo: +4,
          hinchada: +7,
          resistencia: -5,
          overall: +2,
          mensaje: "¡Coraje puro de Estudiantina! Manchaste la baqueta pero jamás dejaste de tocar con toda el alma."
        },
        fracaso: {
          ritmo: -5,
          hinchada: +2,
          resistencia: -9,
          overall: -4,
          mensaje: "El ardor te hizo soltar el palillo por un segundo en el Palco 2 (-5 Ritmo, -9 Aguante)."
        }
      },
      {
        id: "usar_guantes_ciclista",
        texto: "Ponerte unos guantes cortos de ciclista que un compañero tenía en la mochila",
        descripcion: "Proteger la piel para poder terminar la noche con técnica prolija.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +3,
          hinchada: +3,
          resistencia: +3,
          overall: +3,
          mensaje: "Alivio salvador. Los guantes amortiguaron el impacto y pudiste redoblar con total claridad."
        }
      }
    ]
  },

  // --- Buena Suerte: Noche Fresca con Viento a Favor ---
  {
    id: "sorpresa_noche_fresca_parana",
    tipo: "buena_suerte",
    titulo: "✨ ¡Noche Fresca Ideal a Orillas del Paraná!",
    categoria: "fortuna",
    descripcion: "Tras semanas de calor sofocante, entró una suave brisa fresca de 21°C desde el río Paraná. El cielo está despejado, las estrellas brillan sobre el agua y la temperatura es un paraíso para desfilar sin fatigarse.",
    opciones: [
      {
        id: "explotar_fisico_maximo",
        texto: "Aprovechar el aire limpio para acelerar el ritmo y bailar con despliegue físico total",
        descripcion: "Dar una demostración de poderío aeróbico arrollador de principio a fin.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +6,
          hinchada: +6,
          resistencia: +7,
          overall: +6,
          mensaje: "¡Pasada apoteótica! Nadie transpiró de más y el ritmo de la scola fue una máquina demoledora."
        }
      },
      {
        id: "lucir_afinacion_brillante",
        texto: "Aprovechar que los parches no se aflojan con el calor para clavar afinación de orquesta",
        descripcion: "Priorizar la resonancia perfecta en los palcos oficiales.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +7,
          hinchada: +4,
          resistencia: +5,
          overall: +6,
          mensaje: "¡Sonido cristalino! El frío templó los cueros y los redobles sonaron con una nitidez de estudio."
        }
      }
    ]
  },

  // --- Mala Suerte: Apagón en Ensayo Nocturno ---
  {
    id: "sorpresa_corte_luz_ensayo",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Corte de Luz en Pleno Ensayo Nocturno!",
    categoria: "urgencia",
    descripcion: "A las 21:30 hs, en el clímax del ensayo en el playón, un transformador del barrio explota y todo queda en penumbras. Faltan 4 días para la primera noche de calle y los cortes nuevos aún necesitan práctica.",
    opciones: [
      {
        id: "tocar_a_ciegas_oido",
        texto: "Formar en ronda cerrada y tocar en la oscuridad guiándose exclusivamente por el oído",
        descripcion: "Agudizar la audición colectiva para afinar la sincronía sin depender de la vista.",
        riesgo: "Bajo",
        probabilidad: 0.88,
        exito: {
          ritmo: +6,
          hinchada: +4,
          resistencia: +3,
          overall: +5,
          mensaje: "¡Oído absoluto de scola! Tocar a oscuras consolidó el ensamble como nunca antes."
        },
        fracaso: {
          ritmo: +2,
          hinchada: +2,
          resistencia: 0,
          overall: +1,
          mensaje: "Hubo un par de choques entre chanchas, pero terminaron el compás con risas y compañerismo."
        }
      },
      {
        id: "iluminar_con_celulares",
        texto: "Pedir a padres y suplentes que iluminen la pista con las linternas de sus teléfonos",
        descripcion: "Mantener la visibilidad de los cortes y no perder tiempo de práctica.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +4,
          hinchada: +6,
          resistencia: +3,
          overall: +4,
          mensaje: "Posta de película. El playón iluminado a mano fue pura mística de la Estudiantina."
        }
      }
    ]
  },

  // --- Buena Suerte: Fiesta y Hermandad en la Rotonda ---
  {
    id: "sorpresa_clima_fiesta_rotonda",
    tipo: "buena_suerte",
    titulo: "✨ ¡Hermandad y Duelo Amistoso en la Rotonda!",
    categoria: "fortuna",
    descripcion: "Al desconcentrar en la rotonda de los pescadores, tu banda se cruza con el colegio rival. Lejos de haber disturbios, los directores se saludan con un choque de puños y ambas scolas arman una 'roda' gigantesca tocando juntas.",
    opciones: [
      {
        id: "zapada_conjunta_bateria",
        texto: "Sumarse al centro del círculo a improvisar repiques compartidos",
        descripcion: "Celebrar la fiesta de los estudiantes en su máxima expresión de respeto.",
        riesgo: "Bajo",
        probabilidad: 0.98,
        exito: {
          ritmo: +6,
          hinchada: +8,
          resistencia: +5,
          overall: +6,
          mensaje: "¡MOMENTO HISTÓRICO! Toda la Costanera aplaudió el ejemplo de convivencia y pasión compartida."
        }
      },
      {
        id: "tocar_marcha_institucional",
        texto: "Hacer una reverencia con los tambores en alto y marchar hacia el colectivo con paso triunfal",
        descripcion: "Cerrar la jornada con señorío y distinción colegial.",
        riesgo: "Bajo",
        probabilidad: 1.0,
        exito: {
          ritmo: +4,
          hinchada: +6,
          resistencia: +4,
          overall: +5,
          mensaje: "Nobleza y respeto mutuo. La prensa posadeña destacó el ejemplar cierre de noche."
        }
      }
    ]
  },

  // --- Mala Suerte: Correa Cortada en el 4to Tramo ---
  {
    id: "sorpresa_correa_cortada_calle",
    tipo: "mala_suerte",
    titulo: "⚠️ ¡Se Rompió el Mosquetón de la Correa en Plena Pasada!",
    categoria: "urgencia",
    descripcion: "A mitad de la pasada entre el Palco 1 y 2, el mosquetón de hierro de la correa de tu instrumento cede por el peso. El bombo/chancha/redoblante se te cae encima de la rodilla.",
    opciones: [
      {
        id: "sostener_rodilla_muslo",
        texto: "Trabar el instrumento contra el muslo y la rodilla izquierda y seguir tocando con una mano",
        descripcion: "Proeza física extrema para que no se apague el compás.",
        riesgo: "Medio",
        probabilidad: 0.75,
        exito: {
          ritmo: +3,
          hinchada: +8,
          resistencia: -4,
          overall: +3,
          mensaje: "¡Hazaña sobre el asfalto! La gente en las barandas vio tu sacrificio y coreó tu coraje."
        },
        fracaso: {
          ritmo: -6,
          hinchada: +2,
          resistencia: -8,
          overall: -4,
          mensaje: "El peso venció tu pierna (-8 Aguante, -6 Ritmo), teniendo que arrastrarte hasta la vereda."
        }
      },
      {
        id: "atar_alambre_urgencia",
        texto: "Pedir auxilio al utilero del cordón para hacer un nudo marinero con alambre de fardo",
        descripcion: "Solución exprés mientras das pasos cortos al trote.",
        riesgo: "Bajo",
        probabilidad: 0.9,
        exito: {
          ritmo: +2,
          hinchada: +4,
          resistencia: +1,
          overall: +2,
          mensaje: "¡Atadura salvadora! El utilero fue un rayo y te reincorporaste antes de que el jurado lo notara."
        }
      }
    ]
  },

  // --- Buena Suerte: Elogio de una Gloria Radial de la Estudiantina ---
  {
    id: "sorpresa_visita_locutor_historico",
    tipo: "buena_suerte",
    titulo: "✨ ¡La Arenga de la Voz Histórica de la Costanera!",
    categoria: "fortuna",
    descripcion: "Un mítico locutor de radio que transmitió la Estudiantina durante más de 30 años se acerca a la cabecera. Toma el micrófono de la tarima oficial y les dedica unas palabras que erizan la piel de toda la formación.",
    opciones: [
      {
        id: "responder_toque_de_honor",
        texto: "Hacer un repique de honor al unísono con todos los parches saludando al micrófono",
        descripcion: "Rendir tributo a las voces que llevaron la fiesta a los hogares misioneros.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +5,
          hinchada: +7,
          resistencia: +4,
          overall: +6,
          mensaje: "¡Conexión mágica! La voz del locutor tembló de emoción al aire y el colegio se llenó de gloria."
        }
      },
      {
        id: "concentrar_furia_largada",
        texto: "Guardar la emoción en el pecho, apretar las baquetas y salir a demoler el asfalto",
        descripcion: "Canalizar la adrenalina hacia la máxima potencia de desfile.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +6,
          hinchada: +6,
          resistencia: +5,
          overall: +6,
          mensaje: "Salida furiosa y arrolladora. Los primeros compases retumbaron hasta el puente internacional."
        }
      }
    ]
  }
];

export function getEventosPorAnioYFases(anio) {
  const anioKey = Math.min(4, Math.max(1, anio));
  const fases = EVENTOS_POR_FASE[anioKey];
  return [
    fases.ensayos,
    fases.prueba_piloto,
    fases.noches_calle,
    fases.anfiteatro
  ];
}

// =========================================================================
// 3. EVENTOS ESPECÍFICOS Y PERSONALES POR ROL DE BANDA
// =========================================================================

export const EVENTOS_POR_ROL = {
  // ---- CAJITA (Línea de Toque Agudo - Repique a 140 BPM) ----
  cajita: {
    ensayo: {
      id: "rol_cajita_ensayo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Línea de Cajitas)",
      titulo: "El Vuelo de Muñeca de la Cajita",
      categoria: "ensayo",
      descripcion: "El director exige que las cajitas repiquen a 140 BPM durante 40 compases seguidos sin titubear. Las varillas de madera te vibran en los dedos índices y el calor del mediodía te llena las manos de sudor resbaladizo.",
      opciones: [
        {
          id: "repique_filoso",
          texto: "Encintarte los dedos y clavar el repique continuo con muñeca ágil",
          descripcion: "Mantener el sonido metálico cortante que define la entrada exacta de la banda.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Corte quirúrgico! Las cajitas sonaron al unísono como un enjambre afinado. El director te felicitó."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +1,
            resistencia: -2,
            overall: 0,
            mensaje: "Se te acalambró el pulgar en el compás 32 por la tensión acumulada (-2 Aguante)."
          }
        },
        {
          id: "afinar_tirabordona",
          texto: "Pedir un minuto para ajustar la tensión del tirabordona y buscar claridad",
          descripcion: "Priorizar que cada golpe suene limpio y nítido antes de quemar los tendones.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +3,
            hinchada: +2,
            resistencia: +3,
            overall: +2,
            mensaje: "La cajita quedó afinada con una resonancia brillante impecable. Ganaste técnica pura."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_cajita_piloto",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "El Corte de Entrada de Cajitas en Cabecera",
      categoria: "piloto",
      descripcion: "El semáforo de largada oficial se pone en verde. La banda entera depende de la primera ráfaga de las cajitas para arrancar cuadrada frente al Palco 1. Si entran desfasadas medio tiempo, la formación colapsa.",
      opciones: [
        {
          id: "marcar_con_furia",
          texto: "Gritar la cuenta de 4 y entrar con un golpe seco de varilla al aro",
          descripcion: "Liderar a tus compañeros de fila con convicción absoluta.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Entrada perfecta! Las cajitas estallaron y la banda despegó como una máquina aceitada."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +2,
            resistencia: 0,
            overall: -1,
            mensaje: "Por el viento del río Paraná no se escuchó bien la cuenta y una cajita entró una corchea antes (-2 Ritmo)."
          }
        },
        {
          id: "mirar_al_director",
          texto: "Clavar la mirada en la mano del director general y entrar por señas visuales",
          descripcion: "Jugar sobre seguro sin arriesgar el compás general de la escuela.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +2,
            resistencia: +2,
            overall: +2,
            mensaje: "Entrada prolija y segura. Los veedores anotaron compás regular sin titubeos."
          }
        }
      ]
    },
    calle: {
      id: "rol_cajita_calle",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "Ametralladora de Cajitas Frente a la Multitud",
      categoria: "desfile",
      descripcion: "25 minutos a paso redoblado. El asfalto del 4to tramo está repleto. La línea de cajitas va adelante de la percusión, sonriendo al público mientras las manos vuelan a una velocidad sobrehumana.",
      opciones: [
        {
          id: "juego_visual_varillas",
          texto: "Girar las varillas en el aire entre corte y corte para encender la valla",
          descripcion: "Añadir destreza visual de showman al repique sin perder un solo compás.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +3,
            hinchada: +6,
            resistencia: +2,
            overall: +3,
            mensaje: "¡La tribuna explotó con los malabares de varillas! El público coreó el nombre de tu colegio."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +3,
            resistencia: +1,
            overall: 0,
            mensaje: "Una varilla rebotó en el aro, pero la atrapaste en el aire antes de que tocara el asfalto (-2 Ritmo)."
          }
        },
        {
          id: "cadencia_blindada",
          texto: "Foco 100% en la precisión milimétrica del toque agudo frente al palco",
          descripcion: "Garantizar el puntaje perfecto de los jurados oficiales de percusión.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "Planilla de jurado con 10 en coordinación de agudos. Un reloj suizo."
          }
        }
      ]
    },
    anfi: {
      id: "rol_cajita_anfi",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro Manuel Antonio Ramírez",
      titulo: "El Solo Agudo Bajo los Reflectores del Anfi",
      categoria: "show",
      descripcion: "El Anfiteatro está en penumbras. Un reflector blanco te ilumina directo: el director general pide el puente rítmico donde solo suenan las cajitas antes de la explosión final de toda la banda.",
      opciones: [
        {
          id: "repique_epico_anfi",
          texto: "Clavar un redoble acelerando el pulso hasta que vibren las gradas de piedra",
          descripcion: "Demostrar que la cajita es el alma de la velocidad en la Costanera.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Ovación de pie en el Anfi! El puente de cajitas fue el momento más aplaudido de la noche."
          },
          fracaso: {
            ritmo: 0,
            hinchada: +3,
            resistencia: -2,
            overall: 0,
            mensaje: "La emoción te aceleró dos compases de más, pero el golpe de chancha final tapó el desfasaje."
          }
        },
        {
          id: "corte_quirurgico_anfi",
          texto: "Marcar los compases con precisión quirúrgica y dinámica suave",
          descripcion: "Priorizar el puntaje técnico perfecto sin arriesgar desfasajes con la banda.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Reloj suizo en el Anfiteatro! El jurado oficial tomó nota de la limpieza de las cajitas."
          }
        }
      ]
    }
  },

  // ---- REDOBLANTE (Cuerpo Rítmico - Redobles y Rimshots) ----
  redoblante: {
    ensayo: {
      id: "rol_redoblante_ensayo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Fila de Redoblantes)",
      titulo: "La Metralleta del Redoblante: El Toque de Aro",
      categoria: "ensayo",
      descripcion: "En el playón se debate la afinación del parche batidor. Si el redoblante está muy flojo, suena a tambor apagado; si está muy tenso, el parche se quiebra en los rimshots con los que se marcan los cambios de marcha.",
      opciones: [
        {
          id: "tension_maxima",
          texto: "Apretar los tornillos con la llave hasta lograr el sonido 'látigo' seco",
          descripcion: "Buscar el sonido penetrante que corta el rugido de las chanchas.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +2,
            overall: +3,
            mensaje: "¡El redoble suena como una ráfaga militar perfecta! Los pilares de banda te elogiaron la afinación."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +1,
            resistencia: -2,
            overall: 0,
            mensaje: "La tensión excesiva deformó un poco el aro metálico y tuviste que recalibrar (-2 Aguante)."
          }
        },
        {
          id: "perfeccionar_redobles",
          texto: "Practicar el 'mama-papa' lento hasta emparejar la fuerza de ambas manos",
          descripcion: "Garantizar que tu mano izquierda golpee con la misma solidez que la derecha.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +2,
            resistencia: +3,
            overall: +3,
            mensaje: "Tus redobles triples ahora son limpios y fluidos como un espejo. Progresión técnica pura."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_redoblante_piloto",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "El Redoble Continuo Frente al Palco 1",
      categoria: "piloto",
      descripcion: "El jurado oficial se para al borde de la baranda del Palco 1 para escuchar la sincronía de la fila de redoblantes. Si uno solo de los 30 redoblantes arrastra el golpe medio milisegundo, se nota al instante.",
      opciones: [
        {
          id: "redoble_espejo",
          texto: "Mirar de reojo los palillos del pilar de fila y duplicar cada golpe como un espejo",
          descripcion: "Priorizar la disciplina de fila sobre el lucimiento personal.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "¡La fila de redoblantes pareció un solo instrumento titánico! Planilla perfecta del jurado."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +2,
            resistencia: +1,
            overall: 0,
            mensaje: "Te desconcentraste con una pancarta en las vallas, pero recuperaste el compás en el siguiente acento."
          }
        },
        {
          id: "redoble_con_acento",
          texto: "Marcar un acento seco con el palillo izquierdo para dar empuje al compás",
          descripcion: "Aportar energía y brillo al sonido del cuerpo rítmico.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Acento perfecto! El jurado tomó nota de la firmeza rítmica de los redoblantes."
          },
          fracaso: {
            ritmo: 0,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "El golpe sonó un poco fuerte de más, pero no afectó la armonía general."
          }
        }
      ]
    },
    calle: {
      id: "rol_redoblante_calle",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "Duelo de Rimshots y Cortes en la Rotonda",
      categoria: "desfile",
      descripcion: "Noche de calle a tope. La fila de redoblantes mete los cortes sincopados más violentos de la Estudiantina. Las chanchas marcan el suelo y los redoblantes rasgan el aire.",
      opciones: [
        {
          id: "meter_toque_fuerte",
          texto: "Pegar con el hombro entero al borde del aro en cada acento",
          descripcion: "Que cada golpe de rimshot retumbe contra los edificios de la Costanera.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Poderío total! La Costanera tembló con la potencia de la fila de redoblantes."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -3,
            overall: 0,
            mensaje: "El palillo se te astilló contra el aro, pero lo diste vuelta y seguiste tocando con la base (-3 Aguante)."
          }
        },
        {
          id: "toque_seguro_redoblante",
          texto: "Sostener el ritmo con golpe centrado cuidando la bordonera y el aguante físico",
          descripcion: "Asegurar que la banda llegue con potencia intacta hasta el final del tramo.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +4,
            overall: +3,
            mensaje: "Toque sólido e incansable. Mantuviste a la banda marchando como un tanque."
          }
        }
      ]
    },
    anfi: {
      id: "rol_redoblante_anfi",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro Manuel Antonio Ramírez",
      titulo: "El Rulo Infinito de Redoblantes Bajo la Luna",
      categoria: "show",
      descripcion: "El show final en el Anfi. El tema de la escuela llega a su clímax y los redoblantes sostienen un rulo ascendente que dura 30 segundos mientras el cuerpo de baile despliega las banderas gigantes.",
      opciones: [
        {
          id: "rulo_maximo",
          texto: "Apretar los dientes y hacer crecer el redoble de pianissimo a fortissimo descomunal",
          descripcion: "Dejar hasta la última gota de energía en las gradas del río.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Momento sublime de la noche! El rulo de redoblantes hizo estallar el aplauso de todo el anfiteatro."
          }
        },
        {
          id: "corte_sincopado_anfi",
          texto: "Rematar el rulo con un quiebre sincopado al borde del aro mirando a la tribuna",
          descripcion: "Meter un toque de autor para coronar la actuación con sello propio.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +2,
            overall: +5,
            mensaje: "¡Locura en el Anfiteatro! El quiebre fue ovacionado por propios y extraños."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "Salió con un toque de demora, pero la fuerza del cierre lo tapó con honra."
          }
        }
      ]
    }
  },

  // ---- TON (Línea de Armonía & Relleno - Molinetes) ----
  ton: {
    ensayo: {
      id: "rol_ton_ensayo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Fila de Tones)",
      titulo: "El Golpe Seco y los Molinetes del Ton",
      categoria: "ensayo",
      descripcion: "El ton no solo aporta el relleno melódico entre el agudo y el grave: ¡es el show visual de la banda! Los directores exigen que suban los brazos al cielo con los palillos y hagan molinetes giratorios sin pifiarle al compás.",
      opciones: [
        {
          id: "molinete_perfecto",
          texto: "Girar el palillo en el aire y caer con golpe certero en el centro del parche",
          descripcion: "Coordinar la pirueta visual con la contundencia acústica.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Coreografía rítmica impecable! La fila de tones levantó la vista de todos en el playón."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "El palillo te golpeó en el antebrazo durante el giro, pero no soltaste el instrumento (-2 Aguante)."
          }
        },
        {
          id: "foco_armonia",
          texto: "Concentrarte en los golpes cruzados de relleno armónico para empujar a las cajitas",
          descripcion: "Asegurar que la base musical tenga cuerpo y profundidad sin arriesgar golpes.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +2,
            resistencia: +3,
            overall: +3,
            mensaje: "El timbre del ton quedó empastado a la perfección con el resto de la banda."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_ton_piloto",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "La Coordinación de Ton en el Desnivel del Asfalto",
      categoria: "piloto",
      descripcion: "El 4to tramo tiene pendientes y desniveles en los adoquines. Llevar el ton a la cintura y mantener el compás mientras saltás exige sincronía absoluta con tus compañeros de hilera.",
      opciones: [
        {
          id: "marcar_el_paso",
          texto: "Cantar el corte en voz alta para que la fila no se desordene al saltar",
          descripcion: "Asumir la voz de mando en tu sector de la pista.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "La hilera de tones marchó como un batallón unificado. Los veedores felicitaron la postura."
          }
        },
        {
          id: "salto_con_molinete",
          texto: "Saltar flexionando las rodillas y rematar con giro rápido de palillos frente a la baranda",
          descripcion: "Brindar show visual arriesgando un poco la precisión del paso.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Impacto escénico brutal! Las vallas aplaudieron el salto coordinado de los tones."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "El aterrizaje fue un poco pesado en los adoquines, pero no perdiste la sonrisa."
          }
        }
      ]
    },
    calle: {
      id: "rol_ton_calle",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "La Potencia Envolvente del Ton Frente al Jurado",
      categoria: "desfile",
      descripcion: "Llegás al Palco 2. Las luces son enceguecedoras y el público grita contra las vallas. El corte especial de tones arranca: es la hora de darle color y fuerza a la noche.",
      opciones: [
        {
          id: "golpear_con_todo",
          texto: "Descargar cada golpe de palillo con toda la fuerza del torso hacia el centro del parche",
          descripcion: "Hacer que el sonido del ton envuelva a toda la costanera.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Poder y estética en su máxima expresión! La tribuna deliró con el show de tones."
          }
        },
        {
          id: "armonia_controlada",
          texto: "Priorizar el empaste melódico con las cajitas sin saturar el volumen general",
          descripcion: "Garantizar que el sonido de la banda mantenga claridad y equilibrio musical.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Equilibrio acústico perfecto! Los jurados de música elogiaron la prolijidad del ton."
          }
        }
      ]
    },
    anfi: {
      id: "rol_ton_anfi",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro Manuel Antonio Ramírez",
      titulo: "Molinete Triunfal de Ton en el Escenario del Río",
      categoria: "show",
      descripcion: "La última noche del año escolar. Los palillos de ton brillan con cinta refractaria bajo los focos del Anfiteatro frente a miles de personas.",
      opciones: [
        {
          id: "cierre_ton_dorado",
          texto: "Rematar el corte con salto al unísono y golpe final de palillo en alto",
          descripcion: "La postal inolvidable de tu secundaria con tu instrumento.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Consagración absoluta en el Anfi! Una pasada para la historia grande de tu colegio."
          }
        },
        {
          id: "doble_molinete_anfi",
          texto: "Arriesgar un doble molinete sincronizado de espaldas a la tribuna del río",
          descripcion: "El toque maestro de showmanship para ganarte el cariño eterno de Posadas.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +2,
            overall: +5,
            mensaje: "¡Ovación descomunal! El Anfiteatro rugió de admiración ante la destreza de los tones."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -1,
            overall: +1,
            mensaje: "Casi se engancha un palillo con la cinta, pero lo rescataste en el aire con reflejos de crack."
          }
        }
      ]
    }
  },

  // ---- CHANCHA / SURDO (Línea de Peso - El Latido de la Costanera) ----
  chancha: {
    ensayo: {
      id: "rol_chancha_ensayo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Fila de Chanchas)",
      titulo: "El Bautismo del Chanchero: 15 Kilos al Hombro",
      categoria: "ensayo",
      descripcion: "Ser chanchero no es para cualquiera. Son 15 kilos de metal colgados con una faja cruzada en la clavícula durante 4 horas de siesta en el playón. El hombro te quema y el mazo pesado exige fuerza de atleta.",
      opciones: [
        {
          id: "aguantar_sin_chistar",
          texto: "Morderte los labios, aguantar la faja en el hombro y golpear con el alma",
          descripcion: "Ganarte el respeto del galpón de chanchas a pura garra y aguante.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +3,
            hinchada: +4,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Te recibiste de chanchero de ley! El golpe retumbó en las casas vecinas y tus compañeros te chocaron las manos."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -3,
            overall: 0,
            mensaje: "La faja te dejó la clavícula al rojo vivo y tuviste que ponerte hielo en el descanso (-3 Aguante)."
          }
        },
        {
          id: "ajustar_postura",
          texto: "Acolchonar la faja con una toalla doblada y cuidar la postura lumbar",
          descripcion: "Prevenir desgarros de espalda para llegar entero a las noches de calle.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +2,
            resistencia: +4,
            overall: +3,
            mensaje: "Inteligencia física. Aguantaste todo el ensayo sin lesiones y con sonido demoledor."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_chancha_piloto",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "Hacer Temblar el Asfalto del Río Paraná",
      categoria: "piloto",
      descripcion: "Primera prueba piloto oficial. Cuando la chancha arranca con el golpe de compás 1, el asfalto del 4to tramo vibra literalmente bajo las zapatillas. La hinchada no canta hasta que la chancha marca el pulso.",
      opciones: [
        {
          id: "golpe_de_pecho",
          texto: "Marcar el acento con golpe hondo en el centro para que retumbe en el río",
          descripcion: "Demostrar por qué la chancha de tu escuela es el terror de los rivales.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Poder demoledor! Las barandas metálicas de la Costanera vibraron al compás de tu chancha."
          }
        },
        {
          id: "arenga_chanchera",
          texto: "Gritar la cuenta de largada con la voz ronca y levantar el mazo hacia el cielo",
          descripcion: "Encender el fuego de la percusión desde el primer segundo.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Grito de guerra que levantó a la tribuna entera! La banda arrancó con el empuje de un huracán."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -1,
            overall: 0,
            mensaje: "El esfuerzo te dejó la garganta seca, pero la actitud fue intachable."
          }
        }
      ]
    },
    calle: {
      id: "rol_chancha_calle",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "El Pulmón del Chanchero en los 30 Minutos de Calle",
      categoria: "desfile",
      descripcion: "Noche oficial de calle. El calor, el humo de bengalas y los 15 kilos al cuello. Pasando el Palco 1 las piernas te tiemblan, pero la fila de chanchas no puede aflojar ni un solo golpe o la banda se viene abajo.",
      opciones: [
        {
          id: "saltar_y_golpear",
          texto: "Saltar en cada corte levantando los 15 kilos del instrumento al aire",
          descripcion: "Locura total en la pista que enloquece a la tribuna de tu escuela.",
          riesgo: "Alto",
          probabilidad: 0.7,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Heroica pasada de chanchero! La hinchada coreó tu nombre y te convertiste en ídolo de la Costanera."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: -4,
            overall: 0,
            mensaje: "Casi se te dobla el tobillo en un adoquín falso al caer del salto, pero mantuviste el compás como un titán."
          }
        },
        {
          id: "paso_firme_marcial",
          texto: "Paso firme, espalda erguida y golpe de maza constante y demoledor",
          descripcion: "Garantizar la perfección del ritmo sin arriesgar una caída.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +4,
            overall: +3,
            mensaje: "Pasada marcial perfecta. Impecable resistencia de chanchero."
          }
        }
      ]
    },
    anfi: {
      id: "rol_chancha_anfi",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro Manuel Antonio Ramírez",
      titulo: "El Trueno Final de Chancha Frente a la Bahía",
      categoria: "show",
      descripcion: "El show decisivo en el Anfiteatro. La acústica de piedra amplifica los graves de manera brutal. Cuando la chancha remata, el sonido rebota en la barranca del río.",
      opciones: [
        {
          id: "trueno_anfi",
          texto: "Pegar el último golpe de chancha de tu secundaria con la fuerza de tu vida entera",
          descripcion: "Cerrar tu historia en la Costanera dejando una marca eterna en el Anfi.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Retumbe histórico! El golpe final de chancha cerró el desfile con una ovación ensordecedora."
          }
        },
        {
          id: "redoble_de_chanchas",
          texto: "Meter un puente de golpes rápidos cruzados con tu compañero de fila antes del remate",
          descripcion: "Sorprender al jurado con un despliegue de coordinación pesada.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "¡El Anfiteatro tembló hasta los cimientos! El jurado se puso de pie para anotar el 10."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "El golpe final se desfasó medio segundo por el cansancio en los brazos, pero la fuerza fue titánica."
          }
        }
      ]
    }
  },
  ...EVENTOS_POR_ROL_BAILE
};

// =========================================================================
// 4. EVENTOS ÚNICOS CON EL FOLCLORE AUTÉNTICO DE CADA COLEGIO
// =========================================================================

export const EVENTOS_UNICOS_COLEGIO = {
  // ---- EL JANSSEN (Gigante Técnico - Disciplina de Acero) ----
  janssen: [
    {
      id: "colegio_janssen_disciplina",
      fase: "ensayos",
      faseNombre: "Playón de Santa Catalina (El Janssen)",
      titulo: "⚙️ La Disciplina Espartana del Yansen",
      categoria: "colegio_especial",
      descripcion: "En el playón de la avenida Santa Catalina, la exigencia técnica del Janssen es legendaria: formaciones milimétricas, remeras azules empapadas de sudor y directores que no toleran medio compás de error. Acá se forjan los gigantes.",
      opciones: [
        {
          id: "mística_janssen",
          texto: "Cantar el himno del Janssen con el pecho inflado y cumplir la rutina estricta",
          descripcion: "Abrazar la cultura técnica de potencia que hace temblar a toda la ciudad.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Furia azul y oro! Te ganaste los galones de respeto en el playón más exigente de Misiones."
          }
        },
        {
          id: "corte_matematico_janssen",
          texto: "Quedarte una hora extra al rayo del sol practicando los quiebres matemáticos de banda",
          descripcion: "Buscar la perfección milimétrica que distingue al gigante técnico.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +6,
            hinchada: +3,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Maestría rítmica! Los caciques del Janssen te señalaron como uno de los líderes del futuro."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: -2,
            overall: 0,
            mensaje: "Terminaste agotado por el calor del cemento, pero la base técnica quedó grabada a fuego."
          }
        }
      ]
    },
    {
      id: "colegio_janssen_clasico_indu",
      fase: "prueba_piloto",
      faseNombre: "Cabecera del 4to Tramo (Clásico de Gigantes)",
      titulo: "⚙️ Cruzarse con La Indu en la Rotonda",
      categoria: "colegio_especial",
      descripcion: "Tu colegio está terminando la prueba piloto justo cuando La Indu llega en fila con sus buzos de taller. El cruce de hinchadas en la rotonda es electrizante: banderas gigantes, cánticos ensordecedores y miradas que sacan chispas.",
      opciones: [
        {
          id: "corte_desafiante",
          texto: "Clavar el corte más potente de tu instrumento mirando fijo a la cabecera rival",
          descripcion: "Demostrar que en la Costanera manda la potencia del Janssen.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +2,
            overall: +4,
            mensaje: "¡La tribuna del Janssen enloqueció de orgullo! El duelo de gigantes quedó sellado a tu favor."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: 0,
            overall: 0,
            mensaje: "El veedor oficial pidió calma a los directores para no demorar la grilla, pero la hinchada te bancó."
          }
        },
        {
          id: "formacion_marcial_janssen",
          texto: "Ignorar las provocaciones y mantener la formación marcial perfecta frente a los palcos",
          descripcion: "Demostrar superioridad a través de la disciplina y el sonido arrollador.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Cátedra de compostura técnica! Los jurados anotaron la seriedad impecable de la pasada."
          }
        }
      ]
    }
  ],

  // ---- LA INDU / EPET 1 (Gigante Técnico - Taller, Soldadura y Sirena) ----
  industrial: [
    {
      id: "colegio_indu_taller",
      fase: "ensayos",
      faseNombre: "Galpón de Talleres de la EPET N° 1 (La Indu)",
      titulo: "🔧 Noche Blanca de Soldadura y Herrajes Forjados",
      categoria: "colegio_especial",
      descripcion: "Son las 3 de la mañana en los talleres de la Indu. Olor a electrodo quemado, chispas de amoladora y grasa de engranajes. Los alumnos de electromecánica forjaron soportes de acero reforzado para los tambores de la banda.",
      opciones: [
        {
          id: "mano_de_obra_indu",
          texto: "Calibrar los herrajes forjados a mano y reforzar la estructura de tu instrumento",
          descripcion: "Aprovechar el ingenio técnico obrero de la escuela técnica más antigua de la provincia.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +4,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Fierro puro! Tu instrumento ahora es indestructible y suena con una acústica metálica brutal."
          }
        },
        {
          id: "soldar_con_carroceros",
          texto: "Agarrar la máscara de soldar y ayudar a terminar los movimientos de la carroza ingeniosa",
          descripcion: "Unirte a la fraternidad de taller entre banda y carroceros de la Indu.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +2,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Mística obrera inquebrantable! Te ganaste el respeto eterno de los galpones de carroza."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: 0,
            mensaje: "El cansancio de la noche de taller se sintió en los brazos, pero la carroza quedó lista."
          }
        }
      ]
    },
    {
      id: "colegio_indu_sirena",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "🔧 El Bramido de la Sirena de la Indu",
      categoria: "colegio_especial",
      descripcion: "La carroza mecanizada de la Indu arranca con sus motores hidráulicos y de golpe suena la mítica sirena industrial que se escucha hasta la otra orilla de Encarnación. Es la señal para que la banda entre demoliendo el asfalto.",
      opciones: [
        {
          id: "entrar_con_la_sirena",
          texto: "Sincronizar el primer corte de tu instrumento justo en el pico del aullido de la sirena",
          descripcion: "Un momento icónico del folclore de la Estudiantina que hiela la sangre de los rivales.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Estruendo colosal! La Costanera entera coreó el grito obrero de la Indu."
          }
        },
        {
          id: "toque_marcial_pesado",
          texto: "Mantener un toque pesado y constante como el motor de una fábrica en marcha",
          descripcion: "La contundencia inalterable que caracteriza a la percusión industrial.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Potencia continua demoledora! La banda avanzó sin perder un milímetro de compás."
          }
        }
      ]
    }
  ],

  // ---- EL NACIONAL (Histórico - Cuna de 1917) ----
  nacional: [
    {
      id: "colegio_nacional_mistica",
      fase: "ensayos",
      faseNombre: "Escalinatas de Catamarca y San Lorenzo (El Nacional)",
      titulo: "🏛️ La Mística Centenaria del 'Nacio'",
      categoria: "colegio_especial",
      descripcion: "Ensayando frente al histórico edificio de El Nacional, fundado en 1917. En la vereda se frenan exalumnos de hace 40 años que se emocionan al escuchar los mismos compases con los que salieron campeones en su juventud.",
      opciones: [
        {
          id: "abrazar_historia",
          texto: "Tocar con orgullo tradicional demostrando la vigencia del colegio más histórico",
          descripcion: "Hacer honor a las generaciones que construyeron la Estudiantina posadeña.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Piel de gallina! Los exalumnos aplaudieron con lágrimas en los ojos: el Nacio sigue más vivo que nunca."
          }
        },
        {
          id: "canto_popular_nacio",
          texto: "Entonar los versos históricos del colegio levantando los palillos al aire",
          descripcion: "Encender la vereda de Catamarca con la canción más famosa del Martín de Moussy.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +7,
            resistencia: +2,
            overall: +4,
            mensaje: "¡El centro de Posadas cantó con ustedes! Emoción y orgullo azul y blanco desbordante."
          }
        }
      ]
    },
    {
      id: "colegio_nacional_clasico_normal",
      fase: "prueba_piloto",
      faseNombre: "Costanera de Posadas (El Clásico Centenario)",
      titulo: "🏛️ ¡Que se Escuche Hasta la Normal!",
      categoria: "colegio_especial",
      descripcion: "Es el clásico más antiguo de Posadas: El Nacional frente a La Normal. La hinchada copó las vallas y te pide un corte demoledor para marcar territorio en el 4to tramo.",
      opciones: [
        {
          id: "corte_clasico_nacional",
          texto: "Descargar el corte clásico del Nacio con toda la furia azul y blanca",
          descripcion: "Poner de pie a las miles de personas que coparon las vallas.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Fiesta absoluta en las vallas! El clásico centenario resonó con gloria para el Nacional."
          }
        },
        {
          id: "temple_firme_nacio",
          texto: "Tocar con temple sereno y cadencia tradicional intachable",
          descripcion: "Demostrar que la historia se defiende con solidez y sin desesperarse.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Lección de temple! La pasada del Nacional cosechó felicitaciones de veedores y público."
          }
        }
      ]
    }
  ],

  // ---- LA NORMAL (Histórica - Elegancia, Cuna de Maestros) ----
  normal_mixta: [
    {
      id: "colegio_normal_tradicion",
      fase: "ensayos",
      faseNombre: "Belgrano y Junín (Escuela Normal)",
      titulo: "📖 La Mística Señorial de la Escuela de Maestros",
      categoria: "colegio_especial",
      descripcion: "En el corazón de Posadas, los ensayos de la Normal Mixta tienen un brillo especial: coordinación impecable con las escuadras de baile y una percusión limpia que no necesita estridencias para conmover.",
      opciones: [
        {
          id: "elegancia_normal",
          texto: "Cuidar la compostura y la precisión compás por compás con distinción señorial",
          descripcion: "Defender la tradición de la escuela que educó a generaciones enteras de misioneros.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Elegancia suprema! Los profes y directores aplaudieron la prolijidad técnica."
          }
        },
        {
          id: "alegria_maestra_normal",
          texto: "Sumar un adorno rítmico alegre que contagie la sonrisa a toda la fila de baile",
          descripcion: "El espíritu festivo que fundó la Estudiantina en la década del 50.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Luz y alegría en la pista! El ensamble de baile y percusión deslumbró al jurado."
          }
        }
      ]
    }
  ],

  // ---- EL SANBA (Grande - La Pasión de Villa Sarita) ----
  san_basilio: [
    {
      id: "colegio_sanba_sarita",
      fase: "noches_calle",
      faseNombre: "4to Tramo (La Marea de Villa Sarita)",
      titulo: "🛡️ La Locura de Villa Sarita Baja a la Costanera",
      categoria: "colegio_especial",
      descripcion: "El San Basilio Magno juega de local con el corazón del barrio de la Franja. La hinchada baja con bombos gigantes, humo rojo y azul, y una energía salvaje que empuja a la banda como un vendaval.",
      opciones: [
        {
          id: "fuego_sanba",
          texto: "Acompañar los cantos de Villa Sarita golpeando tu instrumento al borde del trance",
          descripcion: "Dejarte llevar por la mística más apasionada de la ciudad.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Delirio total! La Costanera fue una fiesta verde, roja y azul. El Sanba se adueñó de la noche."
          }
        },
        {
          id: "ancla_ritmica_sanba",
          texto: "Sostener el pulso con firmeza para que la emoción de la tribuna no acelere el tempo",
          descripcion: "Ser el pilar frío que mantiene a la banda afinada en medio de la locura barrial.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Temple de campeón! El Sanba desfiló con la fuerza de un volcán pero con compás de reloj suizo."
          }
        }
      ]
    }
  ],

  // ---- EL BACHI (Grande - Rigor Humanista, Cantos en Latín) ----
  bachillerato_humanista: [
    {
      id: "colegio_bachi_latin",
      fase: "noches_calle",
      faseNombre: "4to Tramo (Mística Humanista)",
      titulo: "📜 El Himno y el Gaudeamus en la Percusión",
      categoria: "colegio_especial",
      descripcion: "El Bachillerato Humanista tiene una mística única: coros afinados, cantos solemnes que de pronto rompen en una percusión demoledora que asombra al jurado por su originalidad y fuerza cultural.",
      opciones: [
        {
          id: "precision_humanista",
          texto: "Tocar los cortes sincopados con rigor milimétrico mientras la escuadra canta",
          descripcion: "La marca registrada del Bachi que enamora al jurado intelectual.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Excelencia pura! Un 10 unánime de los jurados de originalidad y ensamble musical."
          }
        },
        {
          id: "arenga_epica_bachi",
          texto: "Gritar el lema humanista a viva voz y clavar un redoble que sacuda las barandas",
          descripcion: "Ponerle garra y mística combativa al desfile de la escuela.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Épica total! El público aplaudió de pie el mensaje y la potencia arrolladora del Bachi."
          }
        }
      ]
    }
  ],

  // ---- LA MADRE / SANTA MARÍA (Grande - Coordinación y Multitud) ----
  santa_maria: [
    {
      id: "colegio_madre_buenos_aires",
      fase: "ensayos",
      faseNombre: "Calle Buenos Aires (El Santa)",
      titulo: "⚜️ La Marea Bordó y Blanco de La Madre",
      categoria: "colegio_especial",
      descripcion: "Los ensayos del Santa María son multitudinarios: cientos de pasistas deslumbrantes y una banda que ensaya como un reloj. Coordinar la percusión con el desfile de plumas más grande de Posadas es una responsabilidad gigantesca.",
      opciones: [
        {
          id: "ensamble_madre",
          texto: "Adaptar el golpe a la coreografía de las alas para lograr un impacto visual y sonoro único",
          descripcion: "La fórmula con la que La Madre ha ganado tantas copas de oro en la historia.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Armonía total! Pasistas y banda se fundieron en un espectáculo que anticipa campeonato."
          }
        },
        {
          id: "empuje_ritmico_madre",
          texto: "Aumentar la potencia del compás para sostener el ritmo en los 35 minutos de pasada",
          descripcion: "Garantizar que las cientos de pasistas nunca pierdan el impulso en el asfalto.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Fuerza imponente! La marea bordó y blanco avanzó como un torrente imparable."
          }
        }
      ]
    }
  ],

  // ---- LA EPET 2 (Grande - Técnica Obrera y Rebelde) ----
  epet_2: [
    {
      id: "colegio_epet2_garra",
      fase: "prueba_piloto",
      faseNombre: "Costanera de Posadas (La Técnica 2)",
      titulo: "🔨 La Rebeldía de la EPET 2: Parches Zurcidos y Pura Garra",
      categoria: "colegio_especial",
      descripcion: "La técnica obrera no tiene los presupuestos millonarios de los colosos céntricos, pero tiene un corazón que emociona: parches zurcidos a mano, herrajes de taller y pibes que tocan con el alma para pelearle de igual a igual a cualquiera.",
      opciones: [
        {
          id: "garra_epet2",
          texto: "Demostrar que la pasión de la técnica 2 vale más que cualquier presupuesto",
          descripcion: "Ganarte el aplauso espontáneo de todo el público neutral de la Costanera.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Ovación de pie en el 4to tramo! El público reconoció la garra de la Técnica 2."
          }
        },
        {
          id: "golpe_de_hierro_epet2",
          texto: "Apretar los dientes y tocar al límite de la resistencia física con orgullo técnico",
          descripcion: "Dejar en claro que los de la EPET 2 nunca se achican ante los gigantes.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Rugió la Técnica 2! Un golpe de autoridad en plena cabecera que sorprendió a todos."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: 0,
            mensaje: "Se sintió el esfuerzo en los brazos, pero la actitud conmovió a los jurados."
          }
        }
      ]
    }
  ],

  // --- C.E.P. Nº 4 ---
  cep_4: [
    {
      id: "cep4_ensayo_tacuari",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón de Tambor de Tacuarí)",
      titulo: "⚡ El Fervor Barrial de Tambor de Tacuarí",
      categoria: "ensayo",
      descripcion: "En el playón del CEP 4, a metros de la transitada avenida Tambor de Tacuarí, los vecinos salen a las veredas con mates y tereré para ver pasar la batería azul y blanca. El director pide una demostración de potencia que se escuche hasta Villa Urquiza.",
      opciones: [
        {
          id: "cep4_acelerar_barrial",
          texto: "Acelerar el compás con golpes de aro secos y hacer temblar los ventanales del barrio",
          descripcion: "Demostrar la bravura popular del CEP 4 con ritmo crudo y pesado.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡El playón del CEP 4 fue una caldera! Los vecinos aplaudieron de pie desde las rejas."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "El volumen fue tremendo aunque costó cuadrar la última bajada de redoblantes."
          }
        },
        {
          id: "cep4_orden_marcial",
          texto: "Priorizar la disciplina y la formación compacta para deslumbrar a los veedores",
          descripcion: "Demostrar que el CEP 4 tiene la prolijidad técnica de las grandes instituciones.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Formación de hierro. Los profesores felicitaron la seriedad y el temple del grupo."
          }
        }
      ]
    }
  ],

  // --- INSTITUTO SUPERIOR JESUS DE NAZARETH ("EL NAZA") ---
  jesus_nazareth: [
    {
      id: "nazareth_ensayo_sombras_estrellas",
      fase: "ensayos",
      faseNombre: "Playón de Av. Eva Perón (El Naza)",
      titulo: "✨ La Alegoría de Sombras y Estrellas",
      categoria: "colegio_especial",
      descripcion: "Cae la noche en el playón de Av. Eva Perón (Península Iprodha / Villa Cabello). Los alumnos de Jesús de Nazareth ensayan bajo el histórico lema: 'De los desafíos nacen los sueños'. La scola ajusta una puesta en escena de contrastes visuales, luces tenues y estallidos de redoble.",
      opciones: [
        {
          id: "nazareth_luces_contrastes",
          texto: "Coordinar los quiebres de baquetas con los destellos de luces del cuerpo de baile",
          descripcion: "Plasmar la alegoría de superación que emociona a las tribunas de la Costanera.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Impacto artístico colosal! El juego de luces y tambores arrancó lágrimas de emoción en los profesores."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -1,
            overall: +1,
            mensaje: "Una tira de luces parpadeó a destiempo, pero el golpe de los surdos mantuvo la magia en el aire."
          }
        },
        {
          id: "nazareth_redoble_marcial",
          texto: "Priorizar la afinación y potencia acústica de los repiques y redoblantes",
          descripcion: "Asegurar que el mensaje de resiliencia del Naza retumbe con claridad sonora inquebrantable.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Solidez percusiva! El Naza demostró un bloque instrumental limpio y contundente."
          }
        }
      ]
    },
    {
      id: "nazareth_ensayo_celestial",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Patio de Nazareth)",
      titulo: "🕊️ La Entrada Triunfal del Naza: Pasión Blanca y Marrón",
      categoria: "colegio_especial",
      descripcion: "En el corazón de Villa Cabello, el patio del Jesús de Nazareth se llena de banderas blancas y marrones con el escudo del Naza. Los directores ensayan una transición coreográfica dramática: una pausa celestial que estalla en repique de fiesta.",
      opciones: [
        {
          id: "nazareth_giro_dorado",
          texto: "Ejecutar el cambio de ritmo con un giro sincronizado abriendo los mantos blancos y marrones al viento",
          descripcion: "Combinar la devoción con la espectacularidad teatral de la scola.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡IMPACTO VISUAL Y SONORO! La coreografía arrancó aplausos espontáneos de toda la comunidad."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "Una tela rozó el aro de un tambor, pero la armonía general se salvó con altura."
          }
        },
        {
          id: "nazareth_base_solida",
          texto: "Sostener una marcha pareja y majestuosa cuidando la afinación de los parches",
          descripcion: "Garantizar que cada compás suene limpio y distinguido frente al jurado.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Cadencia majestuosa. Nazareth demostró un nivel técnico impecable."
          }
        }
      ]
    },
    {
      id: "nazareth_piloto_peninsula",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera (4to Tramo)",
      titulo: "🕊️ La Caravana del Naza copando el 4to Tramo",
      categoria: "colegio_especial",
      descripcion: "Llegan los micros repletos desde la Península Iprodha. En la cabecera del 4to tramo, los directores arengan a la scola de Jesús de Nazareth. El comisario de pista activa el cronómetro de prueba y la hinchada enciende bengalas de humo blanco y marrón.",
      opciones: [
        {
          id: "nazareth_arenga_directores",
          texto: "Lanzar el grito de guerra del Naza y clavar el primer corte con potencia arrolladora",
          descripcion: "Demostrar que la banda de música de Eva Perón no le teme a ningún gigante de la Costanera.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡EXPLOSIÓN EN LA ROTONDA! El arranque fue arrollador y el jurado oficial tomó nota del entusiasmo."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "El ímpetu hizo acelerar medio segundo la marcha, pero la garra del Naza encendió a la gente."
          }
        },
        {
          id: "nazareth_despliegue_disciplinado",
          texto: "Asegurar la marcha de 3 metros exactos con concentración marcial impecable",
          descripcion: "Priorizar la prolijidad técnica y evitar penalizaciones de tiempo.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Planilla oficial perfecta. El espaciado de las filas y la cadencia fueron ejemplares."
          }
        }
      ]
    },
    {
      id: "nazareth_calle_caleidoscopio",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (Palco Oficial 1)",
      titulo: "🌟 El Caleidoscopio de Luces frente al Jurado",
      categoria: "colegio_especial",
      descripcion: "Llegando frente al Palco Oficial en la noche de calle, el cuerpo de baile de Jesús de Nazareth despliega abanicos de colores bajo el destello de los reflectores. La banda de música ejecuta un quiebre de ritmos sincopados que eriza la piel del público.",
      opciones: [
        {
          id: "nazareth_corte_virtuoso",
          texto: "Ejecutar el quiebre sincopado con cruce de baquetas al aire y remate furioso",
          descripcion: "Llevar la destreza al límite frente a las cámaras de transmisión en vivo.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +3,
            overall: +6,
            mensaje: "¡DELIRIO EN EL PALCO! El quiebre fue perfecto, la tribuna aplaudió de pie y los jurados felicitaron la propuesta."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +5,
            resistencia: -2,
            overall: +1,
            mensaje: "Un palillo rebotó en el aro, pero la pasión y el brillo del Naza taparon cualquier detalle."
          }
        },
        {
          id: "nazareth_toque_firme",
          texto: "Sostener un toque noble y parejo con todo el corazón mirando a la tribuna",
          descripcion: "Transmitir la calidez y el espíritu de unión que caracteriza a Jesús de Nazareth.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +5,
            overall: +5,
            mensaje: "Toque sublime y emotivo. El Naza dejó una huella imborrable en el asfalto posadeño."
          }
        }
      ]
    }
  ],

  // --- ESCUELA DE COMERCIO Nº 8 ---
  comercio_8: [
    {
      id: "comercio8_furia_oeste",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Miguel Lanús)",
      titulo: "🔥 La Furia Roja y Negra en el Corazón de Miguel Lanús",
      categoria: "ensayo",
      descripcion: "La histórica Escuela de Comercio Nº 8 saca su banda de música a la calle. Los bombos y chanchas rojas y negras retumban en Miguel Lanús. La identidad y el orgullo del sur posadeño se sienten en el aire con la meta de conquistar los palcos de la Costanera.",
      opciones: [
        {
          id: "comercio8_scola_caliente",
          texto: "Acelerar el tempo y afinar los cortes de redoblantes con máxima precisión",
          descripcion: "Hacer temblar a todo Miguel Lanús con la potencia y sincronización de Comercio 8.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Locura roja y negra! La banda de música sonó demoledora y todo Miguel Lanús salió a alentar."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -3,
            overall: +1,
            mensaje: "El ritmo fue extenuante por la velocidad, pero la actitud de la banda fue gigantesca."
          }
        },
        {
          id: "comercio8_chanchas_pesadas",
          texto: "Concentrarse en el golpe hondo de las chanchas para que vibre el pavimento",
          descripcion: "Asegurar la base rítmica y potencia que sostendrá a toda la banda en la Costanera.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Graves de acero. La banda de música de la 8 tiene una pegada temible para los palcos."
          }
        }
      ]
    }
  ],

  // --- INSTITUTO JOSE MANUEL ESTRADA ---
  estrada: [
    {
      id: "estrada_mistica_salta",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón de Calle Salta)",
      titulo: "📚 La Mística Guerrera de Calle Salta",
      categoria: "ensayo",
      descripcion: "El histórico Estrada ensaya bajo el calor de la tarde posadeña. Los colores verde y blanco cubren el patio. Exalumnos de distintas camadas se acercan a templar parches y recordar que el Estrada jamás se achica en la Costanera.",
      opciones: [
        {
          id: "estrada_marcha_clasica",
          texto: "Redoblar con la marcha clásica del colegio que cantan todas las generaciones",
          descripcion: "Inyectar la mística histórica del Estrada en cada integrante.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Piel de gallina! Los veteranos cantaron a la par de la banda con lágrimas de orgullo."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: +1,
            overall: +2,
            mensaje: "Ensayo muy emotivo que reforzó la unión y el compromiso colectivo."
          }
        },
        {
          id: "estrada_corte_innovador",
          texto: "Probar un quiebre rítmico moderno propuesto por los jóvenes de la fila",
          descripcion: "Sorprender al jurado con arreglos frescos sin perder la esencia.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Arreglo perfecto! El corte sonó moderno, preciso y con pegada contundente."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Hizo falta repetir tres veces el remate para emparejar la entrada del bombo."
          }
        }
      ]
    }
  ],

  // --- INSTITUTO SAN MIGUEL ---
  san_miguel: [
    {
      id: "sanmiguel_guardia_arcangel",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Patio San Miguel)",
      titulo: "🛡️ La Guardia del Arcángel y las Alas de Victoria",
      categoria: "ensayo",
      descripcion: "Bajo la mirada protectora del Arcángel Miguel, los alumnos del San Miguel preparan trajes con corazas celestiales, espadas y alas doradas. El cuerpo de baile y la percusión deben sincronizar un salto de combate al unísono.",
      opciones: [
        {
          id: "sanmiguel_salto_sincronizado",
          texto: "Coordinar el golpe de impacto en el platillo con el salto de las pasistas",
          descripcion: "Crear una postal visual y sonora impactante para las tribunas del 4to tramo.",
          riesgo: "Medio",
          probabilidad: 0.86,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Sincronía divina! El choque de platillo y el vuelo de alas pareció de una película épica."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "Un leve retraso en la caída, pero la garra del San Miguel contagió a todos."
          }
        },
        {
          id: "sanmiguel_marcha_blindada",
          texto: "Asegurar el paso firme y los redobles marciales sin arriesgar saltos complejos",
          descripcion: "Priorizar que la formación avance compacta como una verdadera legión.",
          riesgo: "Bajo",
          probabilidad: 0.96,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Formación inexpugnable. El San Miguel pisa fuerte y seguro."
          }
        }
      ]
    },
    {
      id: "sanmiguel_vuelo_dorado_costanera",
      fase: "prueba_piloto",
      faseNombre: "Costanera de Posadas (San Miguel)",
      titulo: "🛡️ La Legión del San Miguel Despliega sus Alas en el 4to Tramo",
      categoria: "desfile",
      descripcion: "Tu colegio entra a la prueba piloto con el brillo imponente de las túnicas granates y doradas. El público familiar y la hinchada del San Miguel colman las gradas agitando banderas con la espada del Arcángel.",
      opciones: [
        {
          id: "sanmiguel_corte_celestial",
          texto: "Comandar el despliegue del cuerpo de baile con giros acrobáticos y redoble ensordecedor",
          descripcion: "Hacer notar la identidad combativa y vistosa del San Miguel.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Impacto escénico colosal! La tribuna del San Miguel estalló en ovación y los veedores felicitaron la creatividad."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -1,
            overall: +1,
            mensaje: "Una capa se enganchó con un arnés, pero la actitud fiera disimuló el tropiezo."
          }
        },
        {
          id: "sanmiguel_desfile_cadencia_pura",
          texto: "Cuidar la distancia entre filas y sostener la cadencia perfecta hasta la desconcentración",
          descripcion: "Asegurar los puntos de orden y limpieza en la planilla oficial.",
          riesgo: "Bajo",
          probabilidad: 0.97,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Desfile prolijo y señorial. El San Miguel demostró categoría de punta a punta."
          }
        }
      ]
    }
  ],

  // --- ESCUELA NORMAL SUPERIOR Nº 10 ---
  normal_10: [
    {
      id: "normal10_compas_saritense",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Villa Sarita)",
      titulo: "🎓 El Compás Saritense Bajo los Lapachos de la Bajada Vieja",
      categoria: "ensayo",
      descripcion: "A pocas cuadras del Parque Paraguayo y la cancha de Guaraní, la Normal 10 ensaya con el río Paraná asomando entre los árboles. El espíritu bohemio de Villa Sarita llena de alegría y ritmo limpio a la muchachada celeste y blanca.",
      opciones: [
        {
          id: "normal10_swing_bohemio",
          texto: "Soltar el repique con cadencia alegre y festejar con los vecinos que se acercan",
          descripcion: "Enamorar a la Costanera con la calidez y el carisma tradicional saritense.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Alegría contagiosa pura! La Normal 10 tiene una vibra que conquista a cualquiera."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: 0,
            overall: +2,
            mensaje: "Mucho festejo y risas que sirvieron para aflojar los nervios del debut."
          }
        },
        {
          id: "normal10_afinacion_costanera",
          texto: "Buscar el sonido más nítido posible en las trompetas y los redoblantes",
          descripcion: "Competir de igual a igual con las escuelas más grandes de la ciudad.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Afinación brillante! La Normal 10 demostró que tiene técnica de escuela histórica."
          }
        }
      ]
    }
  ],

  // --- E.P.E.T. Nº 37 ---
  epet_37: [
    {
      id: "epet37_taller_ingenioso",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Galpón Técnico de la 37)",
      titulo: "⚙️ La Carroza Electromecánica y los Circuitos LED de la 37",
      categoria: "ensayo",
      descripcion: "Entre chispas de soldadura y placas electrónicas, los estudiantes técnicos de la EPET 37 ultiman los detalles de su carroza ingeniosa. Quieren que los pistones y las secuencias de luces respondan en tiempo real a los golpes del tambor mayor.",
      opciones: [
        {
          id: "epet37_sincronizar_luces_chancha",
          texto: "Conectar los sensores piezoeléctricos del bombo al controlador de luces de la carroza",
          descripcion: "Crear un show audiovisual automático único en la Costanera.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +3,
            overall: +6,
            mensaje: "¡TECNOLOGÍA DE VANGUARDIA! Cada golpe de bombo disparó un haz de luz cegador. El público quedó maravillado."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "Saltó un fusible en la primera prueba, pero lo reemplazaron con pericia técnica."
          }
        },
        {
          id: "epet37_chasis_reforzado",
          texto: "Reforzar el eje y la estructura de hierro para no sufrir los desniveles del asfalto",
          descripcion: "Garantizar que la carroza ruede suave de punta a punta sin frenar la pasada.",
          riesgo: "Bajo",
          probabilidad: 0.96,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +5,
            overall: +5,
            mensaje: "Estructura blindada. La carroza de la 37 rueda como una seda por el 4to tramo."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 5. EVENTOS SORPRESA TAILORED (Mala Suerte & Giros Específicos por Instrumento)
// =========================================================================

export const EVENTOS_SORPRESA_POR_ROL = {
  // ---- Mala Suerte para CAJITA (¡Imposible que hable de chanchas!) ----
  cajita: [
    {
      id: "sorpresa_cajita_varilla",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Varilla de Cajita Astillada en Mitad del Corte!",
      categoria: "urgencia",
      descripcion: "En plena pasada frente al Palco 1, la varilla derecha de madera fina se astilló por el repique furioso a 140 BPM. Si se termina de partir en el compás fuerte, la cajita queda muda en la parte clave.",
      opciones: [
        {
          id: "sacar_repuesto_bolsillo",
          texto: "Sacar a ciegas la varilla de repuesto del bolsillo trasero sin perder el compás",
          descripcion: "Maniobra acrobática de 2 segundos que exige sangre fría de profesional.",
          riesgo: "Alto",
          probabilidad: 0.65,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Reflejos de ninja! Cambiaste la varilla en una milésima de segundo y la fila ni se enteró."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +2,
            resistencia: -2,
            overall: -1,
            mensaje: "La varilla nueva se te resbaló por el sudor y tuviste que tocar con la rota hasta la cabecera (-3 Ritmo)."
          }
        },
        {
          id: "tocar_con_la_base",
          texto: "Girar la varilla rota y tocar con la base más gruesa soportando la vibración en la mano",
          descripcion: "Salvar la pasada aunque te queden los dedos entumecidos.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "Sonó un poco más pesado, pero no aflojaste un solo compás de la pasada."
          }
        }
      ]
    },
    {
      id: "sorpresa_cajita_muñeca",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Muñeca Abierta por Repique Continuo de Cajita!",
      categoria: "urgencia",
      descripcion: "Las cajitas tocan el doble de notas que cualquier otro instrumento. La muñeca derecha se te abrió por la inflamación del túnel carpiano a 24 horas del desfile oficial.",
      opciones: [
        {
          id: "vendar_muneca_cajita",
          texto: "Vendarte la muñeca con cinta elástica compresiva y crema térmica",
          descripcion: "Inmovilizar la articulación para poder tocar los 30 minutos de pasada.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +2,
            mensaje: "¡Aguante supremo! El vendaje resistió la fricción y clavaste todos los cortes con honra."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +1,
            resistencia: -4,
            overall: -2,
            mensaje: "El dolor te quitó velocidad en los redobles de cierre (-3 Ritmo, -4 Aguante)."
          }
        },
        {
          id: "descanso_hielo_cajita",
          texto: "Poner la muñeca en agua con hielo y delegar los redobles iniciales al pilar",
          descripcion: "Cuidar la articulación para no arriesgar una lesión permanente.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +1,
            hinchada: +2,
            resistencia: +2,
            overall: +1,
            mensaje: "Llegaste a la Costanera desinflamado y cumpliste tu pasada con sobriedad."
          }
        }
      ]
    },
    {
      id: "sorpresa_cajita_tirabordona",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Tirabordona de Cajita Flojo a Minutos de Salir!",
      categoria: "urgencia",
      descripcion: "El mecanismo que tensa la bordonera de la cajita se zafó por la vibración. La cajita suena como un tupper vacío en vez de su clásico chillido brillante metálico.",
      opciones: [
        {
          id: "ajuste_urgencia_pinza",
          texto: "Pedir una pinza prestada a un carrocero y recalibrar la tuerca al límite",
          descripcion: "Solución de taller a contrarreloj en plena cabecera.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +2,
            resistencia: +2,
            overall: +2,
            mensaje: "¡Sonido recuperado! La cajita volvió a cortar el aire con su brillo característico."
          }
        },
        {
          id: "encintar_bordonera_cajita",
          texto: "Tensar la bordona pegándola firme al parche inferior con cinta de embalar",
          descripcion: "Ardid criollo de emergencia para no perder el sonido seco.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +1,
            overall: +2,
            mensaje: "¡Zafaste con viveza! El sonido no fue perfecto pero cortó con fuerza suficiente."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +1,
            resistencia: -1,
            overall: 0,
            mensaje: "La cinta se despegó un poco con la humedad, pero terminaste la pasada."
          }
        }
      ]
    }
  ],

  // ---- Mala Suerte para CHANCHA (¡Puro peso, hombros y cuero de 24"!) ----
  chancha: [
    {
      id: "sorpresa_chancha_faja",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Faja de Chancha Deshilachada y Hombro en Llamas!",
      categoria: "urgencia",
      descripcion: "Los 16 kilos de la chancha están sostenidos por una faja de lona que se rajó a la mitad en pleno calentamiento. La chancha se te cae al asfalto si no hacés algo ya.",
      opciones: [
        {
          id: "sostener_con_la_rodilla",
          texto: "Hacer un nudo ciego marinero con alambre dulce y apoyar el tambor en la rodilla",
          descripcion: "Coraje de chanchero para no dejar caer el instrumento más imponente de la escuela.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +2,
            hinchada: +5,
            resistencia: +3,
            overall: +3,
            mensaje: "¡El nudo aguantó los 16 kilos! Salvaste la pasada de tu fila y la hinchada te ovacionó."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +2,
            resistencia: -5,
            overall: -1,
            mensaje: "La faja te cortó la piel de la clavícula y terminaste con el hombro sangrando pero de pie (-5 Aguante)."
          }
        },
        {
          id: "pedir_faja_reserva",
          texto: "Pedirle la faja de repuesto a los colaboradores del camión de aguatero",
          descripcion: "Cambiarla en 3 minutos antes de que el banderillero dé la orden de largar.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +2,
            hinchada: +3,
            resistencia: +3,
            overall: +2,
            mensaje: "Faja nueva colocada y ajustada a tu medida. Largaste con total seguridad."
          }
        }
      ]
    },
    {
      id: "sorpresa_chancha_mazo",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Mazo Pesado de Chancha Partido en Dos!",
      categoria: "urgencia",
      descripcion: "En la cabecera del 4to tramo, descargando el golpe de prueba, el palo de madera de la maza de chancha se quebró seco por el impacto.",
      opciones: [
        {
          id: "encintar_con_alambre",
          texto: "Encintar el mango con cinta aisladora negra y tela de trapo",
          descripcion: "La clásica solución criolla de los galpones de chanchas.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +2,
            overall: +2,
            mensaje: "El mazo quedó más pesado que antes pero firme como una roca. Buen sonido."
          }
        },
        {
          id: "pedir_mazo_companero",
          texto: "Compartir mazo suplente con el chanchero de al lado golpeando por turnos en los cortes",
          descripcion: "Solidaridad pura de fila para no dejar ningún hueco en la percusión.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Hermandad chanchera! Se cubrieron mutuamente y la pasada fue una fiesta."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "Se hizo pesado el intercambio entre cortes, pero nunca se apagó la chancha."
          }
        }
      ]
    },
    {
      id: "sorpresa_chancha_parche_24",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Explosión del Parche de Chancha de 24 Pulgadas!",
      categoria: "urgencia",
      descripcion: "¡BUM! Un cañonazo seco y el parche de tu chancha se abrió de punta a punta a 10 minutos de entrar al Palco 1.",
      opciones: [
        {
          id: "pedir_parche_solidario",
          texto: "Correr al carro de apoyo de la escuela o pedir solidaridad a un colegio hermano",
          descripcion: "Tragar el orgullo y salir a buscar auxilio a la carrera.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +3,
            hinchada: +4,
            resistencia: -2,
            overall: +2,
            mensaje: "¡Un egresado solidario tenía un parche en el baúl del auto! Llegaste a la fila corriendo justo a tiempo."
          }
        },
        {
          id: "encintar_gaffer_emergencia",
          texto: "Encintar la rajadura con cinta gaffer y cinta ancha de embalar en cruz",
          descripcion: "El clásico remiendo de emergencia de los galpones para sostener la tensión del grave.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +2,
            hinchada: +3,
            resistencia: +2,
            overall: +2,
            mensaje: "¡El parche aguantó! Sonó un poco más apagado por la cinta, pero la chancha nunca se calló y la banda mantuvo el compás."
          }
        }
      ]
    }
  ],

  // ---- Mala Suerte para REDOBLANTE ----
  redoblante: [
    {
      id: "sorpresa_redoblante_parche",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Parche Batidor de Redoblante Rajado por Rimshot!",
      categoria: "urgencia",
      descripcion: "En el último ensayo antes de la noche de desfile, le pegaste con tanta fuerza al aro que el parche batidor se rajó 5 centímetros al costado de la bordona.",
      opciones: [
        {
          id: "cambiar_parche_rapido",
          texto: "Desarmar el aro con la llave de afinar y montar un parche nuevo en tiempo récord",
          descripcion: "Operación de precisión mecánica antes de que el jurado pase lista.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +2,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Afinación impecable en 6 minutos! El redoblante quedó cantando como nuevo."
          }
        },
        {
          id: "parche_cinta_cruzada",
          texto: "Cruzar cinta gaffer transparente por debajo y por arriba de la rajadura",
          descripcion: "Frenar la fisura para llegar hasta el Anfiteatro sin desarmar el tambor.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +2,
            overall: +2,
            mensaje: "La cinta amortiguó el daño y el parche aguantó los rimshots con solvencia."
          },
          fracaso: {
            ritmo: 0,
            hinchada: +1,
            resistencia: -1,
            overall: 0,
            mensaje: "El parche perdió algo de resonancia, pero zafaste del papelón."
          }
        }
      ]
    },
    {
      id: "sorpresa_redoblante_bordonera",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Bordonera de Alambre Cortada a Segundos de Largada!",
      categoria: "urgencia",
      descripcion: "Los hilos de acero de la bordonera inferior se cortaron y rozan el asfalto. Si tocás así, el redoblante parece un tacho de basura sordo.",
      opciones: [
        {
          id: "cortar_hilos_sobrantes",
          texto: "Arrancar los hilos cortados y retensar los restantes con una moneda",
          descripcion: "Salvar la acústica del redoble con lo que tengas a mano.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +2,
            overall: +2,
            mensaje: "¡La bordonera quedó respondiendo con brillo! Zafaste con astucia de veterano."
          }
        },
        {
          id: "pedir_bordonera_auxiliar",
          texto: "Pedir al suplente de banda que te alcance un juego de alambres de repuesto",
          descripcion: "Hacer el recambio rápido antes de que la cabecera baje la bandera.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +2,
            resistencia: +2,
            overall: +3,
            mensaje: "Bordonera colocada con limpieza. El redoblante cortó el aire como una hoja de afeitar."
          }
        }
      ]
    }
  ],

  // ---- Mala Suerte para TON ----
  ton: [
    {
      id: "sorpresa_ton_mazo_volador",
      tipo: "mala_suerte",
      titulo: "⚠️ ¡Mazo de Ton que Vuela Hacia la Tribuna!",
      categoria: "urgencia",
      descripcion: "En pleno molinete aéreo de brazos en alto, las manos transpiradas te jugaron una mala pasada: el mazo de ton se te resbaló y voló 4 metros hacia las barandas.",
      opciones: [
        {
          id: "agarrar_mazo_auxilio",
          texto: "Tocar con una mano marcando el aro y pedir al compañero de fila que te pase el mazo auxiliar",
          descripcion: "Mantener la calma teatral sin que el jurado note el pánico.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +2,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "¡El público te devolvió el mazo aplaudiendo de pie tu actitud! Show puro."
          }
        },
        {
          id: "seguir_con_mano_limpia",
          texto: "Golpear el parche con la mano abierta estilo conga hasta que termine el compás",
          descripcion: "Improvisar un golpe percusivo latino para no dejar el tono en silencio.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +3,
            hinchada: +4,
            resistencia: +1,
            overall: +2,
            mensaje: "¡Aplausos por la cintura y la rapidez mental! Salvaste el puente armónico."
          }
        }
      ]
    }
  ],
  ...EVENTOS_SORPRESA_POR_ROL_BAILE
};

export {
  EVENTOS_BAILE_FASES,
  EVENTOS_SORPRESA_BAILE,
  EVENTOS_BASTONERA,
  EVENTOS_DIRECTORA_BAILE
};

// =========================================================================
// 6. EVENTOS EXCLUSIVOS PARA PILARES (CACIQUES DE FILA)
// =========================================================================

export const EVENTOS_PILAR = {
  ensayos: [
    {
      id: "pilar_ensayo_calibracion",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Jefatura de Fila)",
      titulo: "⭐ La Calibración de Fila del Pilar",
      categoria: "liderazgo",
      descripcion: "Como Pilar de fila, sos el responsable de que ningún instrumento suene destemplado o sucio. La humedad del río aflojó los tensores de los chicos de primer año y el director te exige orden antes del toque general en el playón.",
      opciones: [
        {
          id: "afinar_uno_por_uno",
          texto: "Afinar instrumento por instrumento con tu llave y colocar sordinas de tela",
          descripcion: "Garantizar una resonancia uniforme, seca y quirúrgica en toda tu línea percusiva.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Afinación perfecta! Tu fila suena como un solo bloque compacto y arrollador."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: -2,
            overall: +1,
            mensaje: "Terminaste con las manos doloridas de ajustar tuercas, pero la fila mejoró notablemente."
          }
        },
        {
          id: "ensenar_a_afinar",
          texto: "Reunir a la fila en círculo y enseñarles a templar el cuero de oído",
          descripcion: "Transmitir el oficio de pilar para que los nuevos aprendan a escuchar su propio sonido.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Espíritu de scola inquebrantable! Los chicos ganaron confianza y te ven como un referente indiscutido."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "Costó que afinaran parejo al principio, pero asimilaron las bases acústicas."
          }
        }
      ]
    },
    {
      id: "pilar_ensayo_tempo_disputa",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "⭐ El Pulso del Ensayo: Duelo de Tempos",
      categoria: "liderazgo",
      descripcion: "El director quiere apurar el cambio de marcha a 145 BPM, pero notas que los más chicos pierden el aire a los 10 compases. Como pilar, tenés la autoridad de marcar el compás real en la pista.",
      opciones: [
        {
          id: "marcar_tempo_solido",
          texto: "Plantar los pies, bajar a 138 BPM con un golpe seco de autoridad y sostener el groove",
          descripcion: "Priorizar que suene prolijo, pesado y potente antes que rápido y desprolijo.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Groove demoledor! El director entendió tu lectura y la scola entera sonó con una fuerza colosal."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +1,
            resistencia: -1,
            overall: 0,
            mensaje: "Hubo un cruce de miradas tenso con el director, pero el ritmo se estabilizó prolijo."
          }
        },
        {
          id: "exigir_velocidad_maxima",
          texto: "Arengar a tu fila a bancar los 145 BPM dándolo todo sin aflojar",
          descripcion: "Exigir el máximo rendimiento aeróbico para marcar la diferencia.",
          riesgo: "Alto",
          probabilidad: 0.7,
          exito: {
            ritmo: +7,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Furia percusiva! Tu fila aguantó el vértigo y el playón entero tembló de emoción."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +2,
            resistencia: -5,
            overall: -2,
            mensaje: "Dos integrantes se acalambraron en el compás 30 y el ritmo se empastó (-3 Ritmo, -5 Aguante)."
          }
        }
      ]
    },
    {
      id: "pilar_ensayo_apadrinar_chipi",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Mística de Scola)",
      titulo: "⭐ Apadrinar al Chipi de la Fila",
      categoria: "companerismo",
      descripcion: "Un ingresante de primer año está al borde de las lágrimas en el playón: se le caen las baquetas en el cambio de marcha y los veteranos se ríen. Como cacique de fila, tu actitud define el destino del grupo.",
      opciones: [
        {
          id: "quedarse_a_solas",
          texto: "Frenar las burlas con una mirada, apartarlo a la sombra y enseñarle el rebote correcto",
          descripcion: "Forjar un nuevo crack de banda con paciencia de maestro.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Mística pura de Estudiantina! El chipi clavó el corte y te abrazó emocionado. La hinchada aplaudió tu nobleza."
          }
        },
        {
          id: "hacerle_doble_marca",
          texto: "Ponerlo pegado a tu hombro para que copie tus muñecas como un espejo",
          descripcion: "Guiarlo en tiempo real durante la marcha continua.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +2,
            overall: +3,
            mensaje: "Sincronía lograda. El chico se acopló al compás y no volvió a titubear."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -1,
            overall: +1,
            mensaje: "Le costó un poco coordinar los pies con las manos, pero no perdió el ritmo."
          }
        }
      ]
    }
  ],
  prueba_piloto: [
    {
      id: "pilar_piloto_vanguardia",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "⭐ La Vanguardia de la Fila en el 4to Tramo",
      categoria: "piloto",
      descripcion: "En la primera prueba piloto oficial, vas encabezando tu fila. El comisario general de pista viene midiendo con cinta el espaciado de 3 metros exactos con la escuadra delantera. Un desvío cuesta penalización.",
      opciones: [
        {
          id: "marcar_zancada_milimetrica",
          texto: "Marcar la zancada marcial al compás del bombo con concentración absoluta",
          descripcion: "Garantizar formación impecable y simetría total frente a las cámaras de la transmisión.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Formación perfecta! La planilla oficial destacó la disciplina de tu fila con puntaje 10."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: +1,
            overall: +1,
            mensaje: "La distancia varió un par de centímetros en la curva, pero mantuvieron la línea."
          }
        },
        {
          id: "meter_paso_show",
          texto: "Agregar un medio paso saltado con giro de instrumento que arengue a la tribuna",
          descripcion: "Romper la monotonía marcial con impronta y carisma de pilar consagrado.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +2,
            overall: +5,
            mensaje: "¡Explosión de aplausos en las vallas! Tu fila se contagió del paso y la Costanera entera festejó."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +4,
            resistencia: -2,
            overall: 0,
            mensaje: "El pibe de atrás pisó tu zapatilla al girar (-2 Ritmo), aunque la tribuna festejó el intento."
          }
        }
      ]
    },
    {
      id: "pilar_piloto_eco_costanera",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "⭐ El Eco Traicionero de los Edificios del Río",
      categoria: "piloto",
      descripcion: "Al llegar a la altura del edificio de La Costa, el rebote acústico crea un eco falso de medio tiempo que confunde a los integrantes de atrás. Tu fila empieza a abrirse y a perder el unísono.",
      opciones: [
        {
          id: "golpe_seco_referencia",
          texto: "Levantar el instrumento por encima de tu cabeza y clavar un golpe seco de referencia",
          descripcion: "Hacer callar el eco con un impacto atronador que unifique a todos al instante.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Corte salvador! La fila captó tu señal y el sonido volvió a ser un mazo de demolición afinado."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -1,
            overall: +1,
            mensaje: "Tardaron dos compases en reacomodarse, pero recuperaron la cadencia antes del Palco 1."
          }
        },
        {
          id: "cantar_compas_voz_cuello",
          texto: "Girar el torso y gritar el '¡un, dos, tres, va!' a viva voz",
          descripcion: "Guiar a la tropa con el corazón y las cuerdas vocales.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: -2,
            overall: +3,
            mensaje: "¡La fila te siguió como a un general de batalla! Salvaron la pasada con puro coraje posadeño."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -4,
            overall: 0,
            mensaje: "Te quedaste ronco para el resto de la noche (-4 Aguante), pero la fila no se desarmó."
          }
        }
      ]
    }
  ],
  sorpresas: [
    {
      id: "pilar_sorpresa_director_mudo",
      tipo: "urgencia_pilar",
      titulo: "⭐ ¡El Silbato Mudo del Director General!",
      categoria: "liderazgo",
      descripcion: "En la cabecera de largada de la Costanera, al director general le da un ataque de tos feroz y se le cae el silbato entre las piedras de la orilla. Quedan 30 segundos para la largada y te mira desesperado a vos como Pilar principal.",
      opciones: [
        {
          id: "tomar_mando_palillos",
          texto: "Dar el toque de llamada con los palillos en alto y ordenar la salida de la scola",
          descripcion: "Asumir la conducción de la banda de emergencia con autoridad de pilar supremo.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +3,
            overall: +6,
            mensaje: "¡Hazaña de líder histórico! La banda largó a tiempo perfecta y el colegio te ovacionó de pie."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +4,
            resistencia: -2,
            overall: 0,
            mensaje: "El cambio tomó por sorpresa a las cajitas del fondo, pero lograste encaminar la marcha."
          }
        },
        {
          id: "silbato_auxilio",
          texto: "Prestarle tu silbato de repuesto y darle palmadas en la espalda con tereré",
          descripcion: "Rescatar a tu director y mantener la estructura formal de mando.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Compañerismo de oro! El director recuperó el aire y te agradeció con lágrimas en los ojos."
          }
        }
      ]
    },
    {
      id: "pilar_sorpresa_baquetas_luthier",
      tipo: "fortuna_pilar",
      titulo: "⭐ ¡El Homenaje del Luthier de la Bajada Vieja!",
      categoria: "fortuna",
      descripcion: "Un histórico artesano y luthier de Posadas que fabricó tambores en los años 70 te vio tocar en los ensayos. Se acerca con una caja de madera lustrada: un juego de palillos torneados en guatambú misionero calibrados con tu peso ideal.",
      opciones: [
        {
          id: "estrenar_palillos_luthier",
          texto: "Agradecer de rodillas y estrenar los palillos legendarios en la pasada de calle",
          descripcion: "Sentir el balance y la mística de la madera misionera en cada redoble.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +7,
            hinchada: +5,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Sonido celestial! Las baquetas vuelan solas en tus muñecas. Tu técnica parece de otro planeta."
          }
        },
        {
          id: "compartir_con_fila",
          texto: "Agradecerle y pedirle que bendiga los instrumentos de toda tu fila",
          descripcion: "Compartir la bendición artesanal con todos los integrantes de la scola.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Mística posadeña total! Toda la fila tocó inspirada por la historia viva de nuestra tierra."
          }
        }
      ]
    },
    {
      id: "pilar_sorpresa_motin_fila",
      tipo: "urgencia_pilar",
      titulo: "⭐ ¡Tensión y Discusión Fuerte en la Fila!",
      categoria: "urgencia",
      descripcion: "A 10 minutos de entrar al Palco 2, dos veteranos de tu fila empiezan a insultarse y empujarse por quién va al lado de la baranda para salir en la foto de los diarios. La formación se parte al medio.",
      opciones: [
        {
          id: "imponer_disciplina_pilar",
          texto: "Interponerte en el medio, agarrar a ambos del hombro y sentenciar: '¡Acá se juega por el colegio o se van los dos!'",
          descripcion: "Liderazgo frontal y corte de raíz de cualquier ego personal.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Autoridad suprema de pilar! Ambos agacharon la cabeza, se estrecharon la mano y tocaron como hermanos."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Quedó un aire tenso, pero nadie volvió a romper filas en toda la noche."
          }
        },
        {
          id: "rotar_puestos_salomonico",
          texto: "Proponer una rotación salomónica: mitad de pasada uno y mitad el otro",
          descripcion: "Resolver el conflicto con cintura diplomática sin generar resentimientos.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +3,
            hinchada: +4,
            resistencia: +2,
            overall: +3,
            mensaje: "Solución inteligente. La armonía del grupo quedó a salvo y ambos rindieron al 100%."
          }
        }
      ]
    }
  ],
  noches_calle: [
    {
      id: "pilar_calle_corte_solista",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "⭐ El Corte Solista de Fila en el Palco 1",
      categoria: "desfile",
      descripcion: "Llegando al Palco Oficial, la marcha hace un silencio total de tres tiempos y te toca a vos como Pilar ejecutar el corte solista que desata la furia de la batería. Las cámaras de televisión están apuntadas a tus muñecas.",
      opciones: [
        {
          id: "corte_sincopado_virtuoso",
          texto: "Meter un repique sincopado con cruce de baquetas en el aire y remate furioso",
          descripcion: "Deslumbrar al jurado técnico con virtuosismo y velocidad pura.",
          riesgo: "Medio",
          probabilidad: 0.78,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +3,
            overall: +6,
            mensaje: "¡DELIRIO EN LA COSTANERA! El corte fue quirúrgico, la tribuna explotó y los jurados aplaudieron con las dos manos."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +3,
            resistencia: -2,
            overall: -1,
            mensaje: "Un palillo rozó el borde del aro (-3 Ritmo), pero el remate final tapó la pifia con fuerza."
          }
        },
        {
          id: "corte_pesado_marcial",
          texto: "Clavar el golpe clásico con peso descomunal y mirada fija al jurado",
          descripcion: "Asegurar el impacto acústico seco sin margen de error.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Solidez de roca. La percusión entró con un poderío devastador que sacudió las vallas."
          }
        }
      ]
    },
    {
      id: "pilar_calle_humo_cegador",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "⭐ Navegar a Ciegas entre las Bengalas de Humo",
      categoria: "desfile",
      descripcion: "La hinchada de tu colegio encendió 50 bengalas de humo de colores al mismo tiempo. El asfalto queda envuelto en una niebla espesa; no se ve a un metro de distancia y los ojos arden por la pólvora.",
      opciones: [
        {
          id: "guiar_por_memoria_muscular",
          texto: "Cerrar los ojos, respirar por la boca y guiar a la fila con el pulso exacto de memoria muscular",
          descripcion: "Confiar ciegamente en los meses de ensayo en el playón.",
          riesgo: "Bajo",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Proeza de veterano! Salieron de la nube de humo en formación impecable tocando al unísono."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -3,
            overall: +1,
            mensaje: "Terminaste tosiendo por el humo, pero la fila no aflojó ni un compás."
          }
        },
        {
          id: "abrir_paso_baston",
          texto: "Levantar la voz para ordenar paso corto y marcar cada compás con el talón contra el asfalto",
          descripcion: "Hacer sentir el piso a tus compañeros para que nadie tropiece.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "Control absoluto del terreno. Ningún integrante perdió la zancada en medio del caos festivo."
          }
        }
      ]
    }
  ],
  anfiteatro: [
    {
      id: "pilar_anfi_bajada_vieja",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "⭐ El Rugido de la Bajada Vieja en el Templo",
      categoria: "anfiteatro",
      descripcion: "El Anfiteatro Manuel Antonio Ramírez está desbordado. El escenario Alcibíades Alarcón vibra con el viento del río. Como Pilar, salís a la pista marcando la entrada de los parches pesados frente al jurado definitivo.",
      opciones: [
        {
          id: "arriesgar_repiques_dobles",
          texto: "Apostar a repiques dobles y aceleraciones milimétricas en las gradas de piedra",
          descripcion: "Dejar la vida en la prueba final que define los podios de la Estudiantina.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +8,
            hinchada: +8,
            resistencia: +4,
            overall: +7,
            mensaje: "¡ÉXTASIS TOTAL! Las 5000 personas del Anfiteatro saltaron de sus asientos. Tu actuación como pilar es histórica."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +4,
            resistencia: -2,
            overall: 0,
            mensaje: "El cansancio acumulado te hizo fallar medio compás al final (-3 Ritmo), pero el estadio reconoció tu entrega."
          }
        },
        {
          id: "sostener_fuerza_marcial",
          texto: "Respetar la marcha de scola a rajatabla con fuerza bruta y perfección matemática",
          descripcion: "Asegurar la máxima puntuación en prolijidad y técnica de orquesta percusiva.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +5,
            overall: +5,
            mensaje: "Pasada maestra. La planilla de jurados calificó el show con elogios unánimes."
          }
        }
      ]
    },
    {
      id: "pilar_anfi_tremolo_apoteosis",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "⭐ El Trémolo Final de Scola",
      categoria: "anfiteatro",
      descripcion: "Quedan 30 segundos del show en el Anfiteatro. El director da la seña de trémolo continuo: redoble a máxima velocidad sin pausa hasta que baje la mano. Los músculos de los brazos te queman como lava volcánica.",
      opciones: [
        {
          id: "dar_todo_hasta_desmayo",
          texto: "Apretar los dientes y tocar con toda la potencia de tu alma sin aflojar un milímetro",
          descripcion: "Vaciar el tanque de energía por el honor de tu colegio.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +7,
            hinchada: +9,
            resistencia: +5,
            overall: +6,
            mensaje: "¡CLÍMAX INOLVIDABLE! El estruendo final estremeció las orillas del Paraná. Los aplausos no pararon durante diez minutos."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +5,
            resistencia: -4,
            overall: +2,
            mensaje: "Terminaste con calambres en ambos brazos (-4 Aguante), pero coronaste una noche soñada."
          }
        },
        {
          id: "regular_fuerza_constante",
          texto: "Mantener una velocidad prolija y constante usando el rebote elástico de las baquetas",
          descripcion: "Asegurar un trémolo nítido sin agotar las articulaciones.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Técnica depurada y profesional. El cierre fue limpio, brillante y digno de campeones."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 7. EVENTOS EXCLUSIVOS PARA DIRECTORES (SILBATO DE ORO Y JEFATURA SUPREMA)
// =========================================================================

export const EVENTOS_DIRECTOR = {
  ensayos: [
    {
      id: "director_ensayo_cortes_maestros",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Jefatura Suprema)",
      titulo: "👑 El Manuscrito de los Cortes Maestros",
      categoria: "direccion",
      descripcion: "Con el silbato de oro en el pecho, tenés que definir la estructura musical de la temporada para los 250 integrantes. Podés apostar por una fusión rítmica innovadora y arriesgada, o blindar la clásica marcha de tradición que nunca falla.",
      opciones: [
        {
          id: "fusion_ritmica_innovadora",
          texto: "Componer una fusión audaz: cambio de compás con síncopa y quiebre brasileño-misionero",
          descripcion: "Buscar la gloria con una propuesta vanguardista que revolucione la Estudiantina.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +8,
            hinchada: +6,
            resistencia: +3,
            overall: +6,
            mensaje: "¡OBRA DE ARTE! La scola asimiló los cortes y suena como un espectáculo de primer nivel mundial."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +2,
            resistencia: -2,
            overall: -1,
            mensaje: "A las chanchas les costó el contratiempo (-3 Ritmo), debiendo dedicarle noches extras de ensayo."
          }
        },
        {
          id: "marcha_tradicion_pesada",
          texto: "Perfeccionar la marcha histórica del colegio con peso marcial y cortes demoledores",
          descripcion: "Garantizar contundencia, orgullo de pertenencia y cero fallas en pista.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +5,
            overall: +5,
            mensaje: "¡El clásico invencible! El sonido es un tren de carga imparable que emociona a los exalumnos."
          }
        }
      ]
    },
    {
      id: "director_ensayo_arenga_playon",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "👑 La Arenga del Silbato de Oro",
      categoria: "liderazgo",
      descripcion: "Tras una semana fría con asistencias desparejas, el ánimo de la banda decayó. Te subís a una tarima en medio del playón con todos los integrantes formados esperando tus palabras de director/a general.",
      opciones: [
        {
          id: "discurso_emocional_mistica",
          texto: "Dar un discurso apasionado recordando la historia del colegio, el sacrificio y los colores",
          descripcion: "Tocar la fibra íntima de cada estudiante para encender la llama del compromiso.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +9,
            resistencia: +5,
            overall: +6,
            mensaje: "¡Lágrimas y piel de gallina! Toda la escuela terminó abrazada al grito de guerra del colegio."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: +2,
            overall: +2,
            mensaje: "El discurso fue sentido y levantó la energía del playón de inmediato."
          }
        },
        {
          id: "exigencia_mano_dura",
          texto: "Imponer disciplina militar: lista de asistencia obligatoria y suplencia para los que falten",
          descripcion: "Priorizar el rigor institucional por sobre las emociones pasajeras.",
          riesgo: "Medio",
          probabilidad: 0.78,
          exito: {
            ritmo: +7,
            hinchada: +2,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Asistencia perfecta del 100%! La formación se convirtió en un ejército de percusión afinada."
          },
          fracaso: {
            ritmo: +3,
            hinchada: -3,
            resistencia: +1,
            overall: 0,
            mensaje: "Hubo quejas por la dureza (-3 Hinchada), pero nadie volvió a llegar tarde."
          }
        }
      ]
    },
    {
      id: "director_ensayo_caja_chica",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Gestión y Logística)",
      titulo: "👑 La Administración de los Fondos del Galpón",
      categoria: "gestion",
      descripcion: "La comisión estudiantil juntó fondos con la venta de empanadas y rifas. Tenés que decidir el destino del presupuesto: comprar parches de repuesto de máxima calidad o alquilar reflectores y sonido para ensayar hasta la medianoche.",
      opciones: [
        {
          id: "parches_alta_gama",
          texto: "Invertir en parches importados de doble capa para todas las chanchas y redoblantes",
          descripcion: "Blindar el sonido acústico frente a cualquier imprevisto de rotura.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +3,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Calidad acústica insuperable! Los tambores tienen un cuerpo y un brillo dignos de un festival."
          }
        },
        {
          id: "luces_ensayo_nocturno",
          texto: "Alquilar reflectores gigantes para extender los ensayos de noche con clima fresco",
          descripcion: "Aprovechar las noches frescas posadeñas para ganar aguante y horas de práctica.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +7,
            overall: +5,
            mensaje: "¡Productividad total! Ensayar de noche evitó el calor agobiante y la resistencia del grupo se duplicó."
          }
        }
      ]
    }
  ],
  prueba_piloto: [
    {
      id: "director_piloto_guerra_cronometro",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "👑 La Batalla del Cronómetro Oficial",
      categoria: "piloto",
      descripcion: "En la cabecera del 4to tramo, el comisario de pista te advierte que el colegio anterior se retrasó y te exige largar en 30 segundos o te aplica 5 puntos de descuento por demora de cronograma.",
      opciones: [
        {
          id: "negociar_firmeza_reglamentaria",
          texto: "Plantarte con el reglamento en mano: 'Exijo los 3 minutos de alineación que otorga el estatuto'",
          descripcion: "Defender a tu gente con aplomo de líder sin dejarse intimidar por la presión.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Cintura política de oro! El veedor reconoció tu razón, la banda formó prolija y salieron impecables."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "Hubo discusión acalorada, pero conseguiste que no te apliquen la quita de puntos."
          }
        },
        {
          id: "silbatazo_inmediato",
          texto: "Tocar tres silbatazos cortos y ordenar largada relámpago con garra",
          descripcion: "Demostrar que tu colegio está listo para salir en cualquier segundo.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Reflejos y respuesta épica! La scola respondió en un pestañeo y el jurado felicitó la agilidad."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "Las filas del fondo entraron apuradas (-2 Ritmo), aunque evitaron la penalización."
          }
        }
      ]
    },
    {
      id: "director_piloto_sena_maestra",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "👑 La Seña Maestra en el Palco 1",
      categoria: "piloto",
      descripcion: "Llegás al primer palco de prueba con 1500 personas en las vallas. Tenés que dar la seña del cambio dinámico: ¿hacer la seña clásica con brazos en alto o subirte a la tarima con una coreografía de dirección impactante?",
      opciones: [
        {
          id: "show_tarima_direccion",
          texto: "Subirte a la tarima frente al jurado, girar sobre tus talones y dar el silbatazo con acrobacia",
          descripcion: "Marcar presencia escénica y carisma de director/a consagrado/a.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +5,
            hinchada: +8,
            resistencia: +3,
            overall: +6,
            mensaje: "¡IMPACTO VISUAL ABSOLUTO! Los medios de prensa te sacaron fotos para la portada y el público enloqueció."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: -1,
            overall: +1,
            mensaje: "Casi perdés el equilibrio en la tarima, pero la seña salió limpia."
          }
        },
        {
          id: "direccion_marcial_limpia",
          texto: "Quedarte en el centro de la pista con gestos marciales claros y miradas directas a cada pilar",
          descripcion: "Priorizar la claridad de las señas para que ningún instrumento titubee.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +3,
            overall: +5,
            mensaje: "Dirección de manual. Cada línea respondió con la precisión de un reloj suizo."
          }
        }
      ]
    }
  ],
  sorpresas: [
    {
      id: "director_sorpresa_apagon_costanera",
      tipo: "urgencia_director",
      titulo: "👑 ¡Apagón General en la Cabecera de Largada!",
      categoria: "urgencia",
      descripcion: "Se corta la energía eléctrica en todo el 4to tramo justo antes de que tu colegio entre a pista. Quedan a oscuras con 300 chicos formados y la gente empieza a impacientarse en las gradas.",
      opciones: [
        {
          id: "batucada_a_oscuras",
          texto: "Ordenar encender linternas de celulares y arrancar una batucada acústica a oscuras",
          descripcion: "Convertir la crisis en un espectáculo místico inolvidable.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +6,
            hinchada: +9,
            resistencia: +4,
            overall: +7,
            mensaje: "¡MOMENTO MÁGICO DE LA ESTUDIANTINA! Cientos de luces titilando en la noche posadeña con tu ritmo de fondo. Viral nacional."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +5,
            resistencia: +1,
            overall: +3,
            mensaje: "La gente celebró la iniciativa y la luz volvió a los 5 minutos sin incidentes."
          }
        },
        {
          id: "mantener_orden_estricto",
          texto: "Hacer seña de descanso con silbato, mantener las filas formadas y aguardar al generador",
          descripcion: "Evitar cualquier desorden o desbande en la oscuridad.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +4,
            overall: +3,
            mensaje: "Compostura impecable. Cuando volvió la luz, tu colegio estaba listo para desfilar como si nada."
          }
        }
      ]
    },
    {
      id: "director_sorpresa_humo_descontrol",
      tipo: "urgencia_director",
      titulo: "👑 ¡La Hinchada Desborda con Bengalas No Autorizadas!",
      categoria: "urgencia",
      descripcion: "La hinchada de tu colegio prendió bengalas de humo antes de tiempo y el presidente de la comisión te advierte en persona: '¡O frenás a tu gente en 60 segundos o le descuento 10 puntos a tu escuela en la tabla general!'",
      opciones: [
        {
          id: "correr_a_la_valla_arengar",
          texto: "Correr a la baranda, subirte a la valla con el megáfono y pedir cordura: '¡Por los chicos que tocan, apaguen eso ya!'",
          descripcion: "Usar tu peso moral de Director General para calmar a la tribuna.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Liderazgo legendario! La hinchada apagó el humo inmediatamente y empezó a corear tu nombre. El tribunal retiró la sanción."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "Tardaron un minuto en apagarlo todo, pero lograste que solo apliquen una advertencia verbal."
          }
        },
        {
          id: "seguir_tocando_con_furia",
          texto: "Desentenderte de la tribuna, dar la espalda a la valla y enfocar a la scola en tocar más fuerte",
          descripcion: "No dejar que factores externos te desconcentren de la pista.",
          riesgo: "Alto",
          probabilidad: 0.6,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +2,
            overall: +2,
            mensaje: "La policía intervino en la tribuna y el show continuó con energía desbordante."
          },
          fracaso: {
            ritmo: -4,
            hinchada: -2,
            resistencia: -2,
            overall: -4,
            mensaje: "El tribunal les descontó 4 puntos en disciplina por falta de colaboración de los directores (-4 Overall)."
          }
        }
      ]
    },
    {
      id: "director_sorpresa_movil_canal12",
      tipo: "fortuna_director",
      titulo: "👑 ¡En Vivo para Toda la Provincia por Canal 12!",
      categoria: "prensa",
      descripcion: "A 5 minutos de la largada oficial, el móvil en vivo de Canal 12 te pone el micrófono con transmisión para toda la provincia de Misiones. Tenés la oportunidad de dedicar la pasada de tu vida.",
      opciones: [
        {
          id: "mensaje_comunidad_provincial",
          texto: "Agradecer a las familias, profesores, carroceros y dedicar el show a la juventud misionera",
          descripcion: "Dar una imagen institucional impecable y conmovedora.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Ovación provincial! Tu mensaje emocionó a Posadas entera y los mensajes de apoyo colapsaron las redes."
          }
        },
        {
          id: "arenga_guerrera_colegio",
          texto: "Gritar el lema histórico de tu colegio a los cuatro vientos mirando fijo a la cámara",
          descripcion: "Encender el orgullo barrial y estudiantil con furia competitiva.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +9,
            resistencia: +3,
            overall: +5,
            mensaje: "¡La tribuna explotó en gritos de guerra! Toda la scola sintió el fuego sagrado en el pecho."
          }
        }
      ]
    },
    {
      id: "director_sorpresa_rumores_jurado",
      tipo: "urgencia_director",
      titulo: "👑 ¡Guerra Psicológica y Audios Virales!",
      categoria: "urgencia",
      descripcion: "En los grupos de WhatsApp de la promo se viraliza el rumor de que el jurado favoreció descaradamente al colegio rival en la noche anterior. Varios chicos están desanimados diciendo que 'ya está todo arreglado'.",
      opciones: [
        {
          id: "reunion_pilares_juramento",
          texto: "Juntar a los pilares y decirles: 'Nosotros no dependemos de nadie; si tocamos perfecto, el Oro es nuestro'",
          descripcion: "Desactivar la mala vibra y enfocar el orgullo en la autosuperación.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Blindaje mental de campeones! La banda salió a la pista con sed de gloria y dio su mejor versión."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: +1,
            overall: +2,
            mensaje: "Lograste calmar los ánimos y la tropa respondió con disciplina en la pista."
          }
        },
        {
          id: "exigir_reunion_apes",
          texto: "Presentar una nota de fiscalización formal ante la mesa directiva fiscalizadora",
          descripcion: "Hacer respetar el reglamento por los canales institucionales.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "La comisión garantizó veedores imparciales y felicitó la prolijidad de tu reclamo formal."
          },
          fracaso: {
            ritmo: 0,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Perdiste tiempo de concentración en trámites burocráticos, pero sentaste postura."
          }
        }
      ]
    }
  ],
  noches_calle: [
    {
      id: "director_calle_matices_palco",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "👑 La Sinfonía de Matices frente al Palco 2",
      categoria: "desfile",
      descripcion: "En el palco más técnico de la Costanera, decidís demostrar que tu banda no solo tiene potencia, sino también musicalidad y matices: conducir a 200 percusionistas desde un pianísimo casi inaudible hasta un fortissimo atronador.",
      opciones: [
        {
          id: "matiz_pianisimo_a_fortisimo",
          texto: "Bajar las palmas al ras del suelo para el pianísimo y levantarlas al cielo en un segundo para la explosión",
          descripcion: "Ejecutar la dinámica orquestal más difícil de la Estudiantina.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +8,
            hinchada: +7,
            resistencia: +4,
            overall: +7,
            mensaje: "¡CÁTEDRA MUSICAL! El silencio súbito y la explosión posterior dejaron boquiabierto al jurado. Puntuación perfecta."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +3,
            resistencia: -1,
            overall: 0,
            mensaje: "Dos tambores se adelantaron en el silencio (-2 Ritmo), aunque la explosión final fue descomunal."
          }
        },
        {
          id: "mantener_volumen_pesado",
          texto: "Sostener un volumen atronador parejo y constante de principio a fin de la pasada",
          descripcion: "Asegurar que la potencia acústica no decaiga un solo instante.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +5,
            overall: +5,
            mensaje: "Potencia bruta demoledora. La percusión retumbó en la bahía de Posadas sin fisuras."
          }
        }
      ]
    },
    {
      id: "director_calle_emergencia_pista",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "👑 Emergencia y Aplomo en Plena Pista",
      categoria: "desfile",
      descripcion: "A mitad de camino entre el Palco 1 y 2, una pasista del cuerpo de baile o un chico de chanchas se dobla el tobillo y queda en el suelo. La pasada no puede frenarse porque el tiempo sigue corriendo.",
      opciones: [
        {
          id: "coordinar_auxilio_sin_frenar",
          texto: "Hacer seña discreta a los camilleros de la Cruz Roja mientras abrís la formación para cubrir el hueco con el compás intacto",
          descripcion: "Proteger al compañero lesionado manteniendo la marcha con frialdad y profesionalismo.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Aplausos de pie del jurado por tu humanidad y presencia de mando! La pasada continuó impecable."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: +1,
            overall: +2,
            mensaje: "Hubo un pequeño titubeo de dos compases, pero evacuaron al compañero sin peligro."
          }
        },
        {
          id: "frenar_scola_un_minuto",
          texto: "Detener la scola con un silbatazo largo, asistir al compañero vos mismo y retomar con redoble de pie",
          descripcion: "Priorizar la salud de un estudiante por encima de cualquier puntaje de competencia.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +10,
            resistencia: +4,
            overall: +6,
            mensaje: "¡La Costanera entera ovacionó tu nobleza! El jurado perdonó el tiempo por tu gesto ejemplar."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +6,
            resistencia: -2,
            overall: 0,
            mensaje: "El tribunal descontó 1 punto por tiempo detenido, pero la comunidad educativa te coronó como un héroe moral."
          }
        }
      ]
    }
  ],
  anfiteatro: [
    {
      id: "director_anfi_escalinatas_miticas",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "👑 El Descenso al Manuel Antonio Ramírez",
      categoria: "anfiteatro",
      descripcion: "Llegó la noche culminante. Te parás en la cima de las escalinatas de piedra del Anfiteatro frente a la Bajada Vieja. Miles de antorchas y bengalas iluminan la noche del río. Al primer silbatazo, 300 almas bajarán detrás de vos hacia el escenario.",
      opciones: [
        {
          id: "descenso_triunfal_arenga",
          texto: "Levantar el silbato de oro hacia el cielo, soltar el grito del colegio y bajar con paso marcial",
          descripcion: "Consagrarte como la figura máxima de la Estudiantina posadeña.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +8,
            hinchada: +10,
            resistencia: +5,
            overall: +8,
            mensaje: "¡MOMENTO HISTÓRICO! El estadio tembló al unísono. La entrada al anfiteatro fue la más imponente de la década."
          },
          fracaso: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "La entrada fue emocionante y colmó el anfiteatro de euforia pura."
          }
        },
        {
          id: "descenso_prolijo_cadencia",
          texto: "Marcar una cadencia lenta y pesada para que ningún instrumento tropiece en las gradas de piedra",
          descripcion: "Asegurar que toda la scola pise el escenario mayor en óptimas condiciones.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +6,
            overall: +6,
            mensaje: "Entrada marcial perfecta. Todos llegaron enteros y concentrados al escenario Alcibíades Alarcón."
          }
        }
      ]
    },
    {
      id: "director_anfi_silbatazo_1959",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "👑 El Silbatazo de los 19 Minutos 59 Segundos",
      categoria: "anfiteatro",
      descripcion: "El reloj gigante oficial descuenta hacia atrás los 20 minutos reglamentarios. Si cortás antes de los 19m 30s te penalizan por show corto; si te pasás de los 20m 00s te descalifican. El cronómetro marca 19m 50s...",
      opciones: [
        {
          id: "corte_cronometrico_quirurgico",
          texto: "Esperar el segundo 58 mirando el cronómetro y clavar el silbatazo final exactamente en 19m 59s",
          descripcion: "Arriesgarlo todo al milisegundo para lograr el remate más perfecto jamás visto.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +10,
            hinchada: +10,
            resistencia: +5,
            overall: +9,
            mensaje: "¡19m 59s CLAVADOS! El jurado se puso de pie aplaudiendo con lágrimas en los ojos. ¡EL ORO ES DE TU COLEGIO!"
          },
          fracaso: {
            ritmo: -4,
            hinchada: +4,
            resistencia: -2,
            overall: -2,
            mensaje: "El silbatazo cayó en 20m 02s (-4 Ritmo): hubo penalización de 2 puntos, aunque el show fue brillante."
          }
        },
        {
          id: "corte_seguro_1945",
          texto: "Dar el corte seguro en 19 minutos 45 segundos con margen de sobra",
          descripcion: "Evitar cualquier riesgo de descalificación por tiempo reglamentario.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +5,
            overall: +6,
            mensaje: "Corte impecable y dentro del reglamento. Gran ovación y puntaje altísimo en disciplina."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 8. POOL DE EVENTOS GENERALES VARIADOS (BUENOS Y MALOS PARA TODAS LAS FASES)
// =========================================================================

export const EVENTOS_POOL_FASES = {
  ensayos: [
    {
      id: "ensayo_repique_160bpm_alto_riesgo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "⚡ El Repique Supersónico a 160 BPM",
      categoria: "ensayo",
      descripcion: "Los directores quieren probar un corte de velocidad extrema nunca antes ejecutado: acelerar el ritmo a 160 BPM en seco. Los antebrazos queman y el riesgo de contractura o descoordinación es brutal.",
      opciones: [
        {
          id: "acelerar_160_a_fondo",
          texto: "Apretar los dientes, soltar las muñecas y tocar a 160 BPM al límite biomecánico",
          descripcion: "Intentar una hazaña de velocidad descomunal que marcará época en el colegio.",
          riesgo: "Alto",
          probabilidad: 0.55,
          exito: {
            ritmo: +9,
            hinchada: +6,
            resistencia: +4,
            overall: +6,
            mensaje: "¡VELOCIDAD RELAMPAGUEANTE! El corte a 160 BPM salió con una precisión quirúrgica. Los directores quedaron atónitos."
          },
          fracaso: {
            ritmo: -4,
            hinchada: +2,
            resistencia: -8,
            overall: -3,
            mensaje: "¡Contractura severa en el antebrazo! Perdiste el control del palillo y el corte se descalabró por completo (-8 Aguante, -4 Ritmo)."
          }
        },
        {
          id: "mantener_tempo_seguro",
          texto: "Aconsejar estabilizar el corte en 138 BPM para asegurar la prolijidad técnica de la fila",
          descripcion: "Priorizar la disciplina y evitar lesiones de los compañeros.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "Sensatez de veterano. La fila ensayó limpia y sin bajas físicas."
          }
        }
      ]
    },
    {
      id: "ensayo_merienda_chipa_bueno",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "✨ La Sagrada Merienda de Chipa y Mate Cocido Quemado",
      categoria: "fortuna",
      descripcion: "A mitad de la tarde, madres y padres de la comisión llegan al playón con canastos humeantes de chipitas calientes recién horneadas y jarras de mate cocido quemado. El aroma invade el patio.",
      opciones: [
        {
          id: "merendar_y_charlar",
          texto: "Tomarse 15 minutos para comer juntos, reír y forjar unión de grupo",
          descripcion: "Nutrir el alma de la scola con calor de hogar posadeño.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +3,
            hinchada: +6,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Grupo unido y corazón contento! Volvieron a tocar con el triple de energía y entusiasmo."
          }
        },
        {
          id: "seguir_tocando_con_chipa",
          texto: "Comer una chipa al paso sin soltar las baquetas para no cortar la inspiración",
          descripcion: "Mantener el estado de trance rítmico.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Compromiso total! Los directores elogiaron tu hambre de gloria."
          }
        }
      ]
    },
    {
      id: "ensayo_goteras_tormenta_malo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Galpón Escolar)",
      titulo: "⚠️ Tormenta Tropical y Goteras en el Tinglado",
      categoria: "urgencia",
      descripcion: "Se desata una tormenta subtropical misionera de viento y agua. El tinglado del colegio tiene chapas rajadas y empiezan a caer cataratas de agua directo sobre la línea de chanchas y redoblantes.",
      opciones: [
        {
          id: "proteger_tambores_nylon",
          texto: "Correr a tapar los parches con nylon negro y trasladar todo al pasillo de aulas",
          descripcion: "Salvar los instrumentos a expensas de quedar empapado de pies a cabeza.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +2,
            hinchada: +5,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Salvataje exitoso! Ni un solo parche se arruinó y la unión del grupo se hizo de fierro."
          },
          fracaso: {
            ritmo: 0,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Se mojaron un par de baquetas, pero evitaron una catástrofe mayor."
          }
        },
        {
          id: "tocar_bajo_el_agua",
          texto: "Salir al playón descubierto a tocar bajo la lluvia torrencial como en un rito tribal",
          descripcion: "Desatar la locura juvenil posadeña frente a la tormenta.",
          riesgo: "Alto",
          probabilidad: 0.65,
          exito: {
            ritmo: +5,
            hinchada: +9,
            resistencia: +4,
            overall: +5,
            mensaje: "¡ÉPICA INOLVIDABLE! El agua salpicaba con cada golpe y el video del ensayo bajo la lluvia fue furor."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +3,
            resistencia: -7,
            overall: -3,
            mensaje: "Se destemplaron tres cueros con el agua y dos chicos pescaron un resfrío fuerte (-7 Aguante)."
          }
        }
      ]
    },
    {
      id: "ensayo_visita_rector_bueno",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Institucional)",
      titulo: "✨ La Bendición del Rector y Fondos para Sordinas",
      categoria: "fortuna",
      descripcion: "El rector y el cuerpo docente del colegio bajan al playón al final de la jornada. Sorprendidos por el respeto, la limpieza y la calidad de la música, anuncian un subsidio especial del colegio para comprar insumos.",
      opciones: [
        {
          id: "agradecer_con_marcha",
          texto: "Tocar la marcha oficial del colegio con su máxima potencia como agradecimiento",
          descripcion: "Rendir homenaje a las autoridades que apoyan la cultura estudiantil.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Orgullo de pertenencia! El rector se emocionó y duplicó el presupuesto para parches."
          }
        },
        {
          id: "pedir_autorizacion_horarios",
          texto: "Aprovechar la buena predisposición para pedir 30 minutos extra de ensayo por noche",
          descripcion: "Ganar valioso tiempo de pista antes de la Costanera.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Autorización concedida! Esas horas extras marcaron un salto de calidad abismal."
          }
        }
      ]
    },
    {
      id: "ensayo_ruidos_molestos_malo",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Convivencia Vecinal)",
      titulo: "⚠️ Denuncia Vecinal por Ruidos Molestos a Medianoche",
      categoria: "urgencia",
      descripcion: "Son las 22:30 hs y el repique de las cajitas se escucha a diez cuadras. Dos patrulleros de la policía se detienen en el portón del colegio tras reiteradas quejas de vecinos del barrio por los ruidos.",
      opciones: [
        {
          id: "dialogar_respeto_policia",
          texto: "Acercarse con el permiso municipal sellado y comprometerse a apagar los bombos pesados ya",
          descripcion: "Manejar el conflicto vecinal con educación y madurez.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +2,
            hinchada: +3,
            resistencia: +2,
            overall: +3,
            mensaje: "Acuerdo pacífico. La policía felicitó la amabilidad y les permitió seguir con señas en silencio."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +1,
            resistencia: -1,
            overall: 0,
            mensaje: "Tuvieron que suspender el ensayo antes de tiempo, pero evitaron cualquier multa."
          }
        },
        {
          id: "practica_palillos_aire",
          texto: "Guardar los tambores y pasar los cortes golpeando palillo con palillo al aire",
          descripcion: "Seguir memorizando los compases sin hacer vibrar las membranas.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +2,
            overall: +3,
            mensaje: "Ingenio posadeño. La sincronía de baquetas quedó grabada a fuego sin molestar a nadie."
          }
        }
      ]
    },
    {
      id: "ensayo_guerra_manguera_posadas",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "☀️ La Siesta de 38°C y el Manguerazo en el Playón",
      categoria: "fortuna",
      descripcion: "El termómetro trepa a 38°C en el playón de cemento y el sol misionero no da tregua. Los directores consiguen conectar la manguera de riego del patio y rocían una nube de agua fría sobre los 200 estudiantes entre carcajadas.",
      opciones: [
        {
          id: "manguerazo_y_arenga_mojada",
          texto: "Tocar empapado bajo la lluvia artificial con una sonrisa de oreja a oreja",
          descripcion: "Convertir el calor extremo en una fiesta inolvidable de compañerismo.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Éxtasis de verano! La moral del colegio se disparó a las nubes y tocaron con frescura renovada."
          }
        },
        {
          id: "proteger_parches_sombra",
          texto: "Llevar los instrumentos bajo el alero para cuidar la tensión de los parches",
          descripcion: "Priorizar el cuidado técnico de los instrumentos ante la humedad.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +4,
            overall: +4,
            mensaje: "Cuidado profesional de luthier. La afinación de los tambores quedó intacta."
          }
        }
      ]
    },
    {
      id: "ensayo_bendicion_rector_autoridad",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "🕊️ La Visita Institucional y Palabras del Rector",
      categoria: "ensayo",
      descripcion: "Las máximas autoridades del colegio bajan al playón para presenciar la pasada completa. El rector toma el micrófono y dedica unas palabras conmovedoras sobre el honor de defender los colores escolares en la Costanera.",
      opciones: [
        {
          id: "tocar_himno_institucional",
          texto: "Ejecutar la marcha institucional del colegio con máxima marcialidad y postura firme",
          descripcion: "Dejar en claro el compromiso solemne con la historia de la escuela.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Emoción institucional! El rector felicitó a la scola y garantizó apoyo total en presupuesto."
          }
        },
        {
          id: "pedir_apoyo_combis_transporte",
          texto: "Aprovechar la presencia de autoridades para solicitar combis de traslado para los ensayos nocturnos",
          descripcion: "Garantizar seguridad y logística para los estudiantes que viven lejos.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +3,
            hinchada: +8,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Gestión exitosa! El colegio contrató transporte para las noches de ensayo. Alivio total."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: +2,
            overall: +2,
            mensaje: "El presupuesto fue acotado, pero lograron organizar grupos de colectivos seguros."
          }
        }
      ]
    },
    {
      id: "ensayo_duelo_acustico_barrial",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "⚔️ El Duelo de Cortes con el Colegio Vecino",
      categoria: "ensayo",
      descripcion: "A seis cuadras, en una plaza barrial, ensaya otro colegio. Cuando ellos cortan, se escucha su estruendo; cuando cortan ustedes, ustedes les responden. Se arma una competencia acústica invisible a la distancia.",
      opciones: [
        {
          id: "redoblar_fuerza_corte_pesado",
          texto: "Descargar el corte más demoledor de la scola hacia la dirección del viento",
          descripcion: "Hacer temblar las ventanas del barrio para que sepan quién manda en la zona.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Potencia avasallante! El eco resonó en todo el barrio y el colegio rival se quedó en silencio escuchando."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "Mucho volumen pero se aceleró el tempo (-2 Aguante). De todas formas metieron respeto."
          }
        },
        {
          id: "enfocarse_en_limpieza_interna",
          texto: "Ignorar los tambores lejanos y pulir la sincronía milimétrica de las cajitas",
          descripcion: "No caer en provocaciones y priorizar la técnica del jurado oficial.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Madurez de campeones. El toque interno quedó limpio como un reloj suizo."
          }
        }
      ]
    },
    {
      id: "ensayo_soldadura_nocturna_taller",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "🔧 Taller a Medianoche: Reparación de Soportes",
      categoria: "urgencia",
      descripcion: "A días del debut, los herrajes y correas de tres chanchas se vencieron por el peso. Los estudiantes del taller abren el galpón de noche para soldar y reforzar las estructuras con amoladora y chapa gruesa.",
      opciones: [
        {
          id: "reforzar_con_soldadura_reforzada",
          texto: "Quedarse hasta la madrugada soldando con electrodos y probando la resistencia con golpes secos",
          descripcion: "Asegurar que los instrumentos soporten saltos y desniveles sin quebrarse.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +6,
            overall: +5,
            mensaje: "¡Trabajo de orfebrería de taller! Los soportes quedaron indestructibles para toda la Costanera."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -3,
            overall: +1,
            mensaje: "La soldadura aguantó pero las ojeras al día siguiente se sintieron (-3 Aguante)."
          }
        },
        {
          id: "repartir_peso_arneses_suplentes",
          texto: "Usar arneses de reserva acolchados y asegurar con precintos de alta resistencia",
          descripcion: "Solución práctica inmediata sin trasnochar.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +4,
            overall: +3,
            mensaje: "Solución rápida y efectiva. Los tambores quedaron listos para rodar."
          }
        }
      ]
    },
    {
      id: "ensayo_siesta_42_grados_fuego",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "🔥 La Siesta de 42°C: Prueba de Fuego en el Cemento",
      categoria: "ensayo",
      descripcion: "Son las tres de la tarde en Posadas. El asfalto del playón irradia un calor que derrite las suelas. El director de banda desafía a toda la scola a una pasada completa sin parar, con el sol de frente y el aire hirviendo.",
      opciones: [
        {
          id: "pasada_siesta_a_fondo_fuego",
          texto: "Exigir la pasada completa a máxima potencia y sin pedir tregua ni agua",
          descripcion: "Demostrar temple de acero en el peor momento de la canícula misionera.",
          riesgo: "Alto",
          probabilidad: 0.60,
          exito: {
            ritmo: +8,
            hinchada: +7,
            resistencia: +8,
            overall: +6,
            mensaje: "¡TEMPLE DE ACERO MISIONERO! La scola tocó como una máquina implacable bajo el rayo del sol. Se ganaron la chapa de indestructibles."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +2,
            resistencia: -8,
            overall: -2,
            mensaje: "Golpe de calor feroz: dos compañeros terminaron mareados a la sombra y el compás final se desinfló por agotamiento (-8 Aguante, -3 Ritmo)."
          }
        },
        {
          id: "hidratacion_terere_cedron",
          texto: "Pautar pausas escalonadas de hidratación con tereré con menta y cedrón bajo los árboles",
          descripcion: "Cuidar el físico de los ingresantes y mantener la disciplina sin golpes de calor.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +3,
            mensaje: "Hidratación inteligente y ritmo prolijo. La scola terminó entera y con la moral en alto."
          }
        }
      ]
    },
    {
      id: "ensayo_corte_bajada_vieja_sincopado",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "🥁 El Corte Sincopado 'Samba-Reggae de la Bajada Vieja'",
      categoria: "ensayo",
      descripcion: "La fila de redoblantes y tones propone un corte experimental con un quiebre rítmico sincopado a contratiempo, inspirado en la cadencia histórica de la Bajada Vieja. Si sale perfecto, pondrá a bailar a todo el Palco 1; si un solo palillo se pierde, la scola entera descarrila.",
      opciones: [
        {
          id: "quiebre_sincopado_aereo_arriesgado",
          texto: "Clavar el quiebre sincopado con cruces de palillos aéreos y acento en el segundo compás",
          descripcion: "Desafío de coordinación extrema que puede transformar el sonido del colegio.",
          riesgo: "Alto",
          probabilidad: 0.55,
          exito: {
            ritmo: +9,
            hinchada: +7,
            resistencia: +4,
            overall: +6,
            mensaje: "¡LOCURA TOTAL EN EL PLAYÓN! El corte quebró el ritmo con una sabrosura descomunal. Hasta los vecinos salieron a aplaudir a los balcones."
          },
          fracaso: {
            ritmo: -5,
            hinchada: +1,
            resistencia: -3,
            overall: -3,
            mensaje: "El redoble aéreo se trabó con la fila de chanchas y el quiebre quedó en un silencio incómodo (-5 Ritmo)."
          }
        },
        {
          id: "compas_cuadrado_seguro",
          texto: "Simplificar la síncopa con un compás marcado de 4 tiempos firme y sin malabares",
          descripcion: "Asegurar que toda la scola suene al unísono sin fisuras rítmicas.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "Base sólida y compás redondito. El corte quedó pulcro y seguro para la pasada."
          }
        }
      ]
    },
    {
      id: "ensayo_mistica_bengalas_teatrino",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Parque Paraguayo)",
      titulo: "✨ Mística Nocturna: Ensayo con Bengalas en el Parque Paraguayo",
      categoria: "ensayo",
      descripcion: "La subcomisión de hinchada lleva bengalas de humo con los colores del colegio al ensayo nocturno en el Teatrino del Parque Paraguayo. Quieren ensayar la entrada visual exacta que verá el jurado bajo la niebla de humo y la euforia de la tribuna.",
      opciones: [
        {
          id: "desfilar_a_ciegas_en_humo",
          texto: "Avanzar tocando a ciegas en medio de la cortina densa de humo con los ojos ardiendo",
          descripcion: "Ensayar en condiciones visuales límite para que la Costanera sea pan comido.",
          riesgo: "Alto",
          probabilidad: 0.60,
          exito: {
            ritmo: +7,
            hinchada: +9,
            resistencia: +5,
            overall: +6,
            mensaje: "¡POSTAL ÉPICA DE ESTUDIANTINA! Traspasaron el humo tocando al unísono con una presencia escénica electrizante. La hinchada enloqueció."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +4,
            resistencia: -6,
            overall: -2,
            mensaje: "El humo irritó la garganta de varios y los redoblantes perdieron la referencia visual de la primera fila (-6 Aguante, -3 Ritmo)."
          }
        },
        {
          id: "bengalas_a_los_costados_limpias",
          texto: "Pedir encender las bengalas a los costados de la pista para priorizar la visibilidad del desfile",
          descripcion: "Garantizar aire limpio y mantener la sincronización visual perfecta.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +3,
            mensaje: "Desfile vistoso, aire limpio y ejecución coreográfica perfecta."
          }
        }
      ]
    },
    {
      id: "ensayo_aguacero_tropical_playon",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "🌧️ Aguacero Tropical: Ensayo Furioso Bajo la Tormenta",
      categoria: "ensayo",
      descripcion: "Una cortina de lluvia de verano cae de golpe sobre el playón descubierto a minutos de terminar el ensayo general. El agua rebota en los parches pero la energía del colegio está por las nubes. Los caciques tienen que decidir si resguardan el instrumental o van por la gloria.",
      opciones: [
        {
          id: "tocar_bajo_lluvia_furiosa",
          texto: "Cubrir los cascos con film transparente y tocar a matar o morir bajo el diluvio",
          descripcion: "Temple místico y aguante puro: forjar el espíritu de batalla del colegio.",
          riesgo: "Alto",
          probabilidad: 0.58,
          exito: {
            ritmo: +8,
            hinchada: +9,
            resistencia: +7,
            overall: +6,
            mensaje: "¡ÉPICA INOLVIDABLE! Tocaron como gigantes bajo la lluvia torrencial. Las gotas saltaban de los parches con cada golpe. El colegio se convirtió en leyenda barrial."
          },
          fracaso: {
            ritmo: -4,
            hinchada: +3,
            resistencia: -7,
            overall: -3,
            mensaje: "El agua ablandó los parches de cuero, las baquetas se resbalaron de las manos mojadas y terminaron todos empapados y resfriados (-7 Aguante, -4 Ritmo)."
          }
        },
        {
          id: "alero_cantos_acapela",
          texto: "Resguardar los instrumentos bajo el alero del colegio y ensayar los cantos y cortes a capela",
          descripcion: "Proteger el instrumental costoso y reforzar la garganta de la hinchada.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +4,
            overall: +3,
            mensaje: "Se cuidaron los instrumentos impecables y la hinchada afinó los coros con gran fervor."
          }
        }
      ]
    },
    {
      id: "ensayo_piques_baquetas_pesadas",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "⚡ Duelo de Piques con Baquetas de Madera Pesada",
      categoria: "ensayo",
      descripcion: "Para conseguir un sonido atronador que tape la música ambiente del 4to tramo, el preparador rítmico trae baquetas torneadas de madera de guatambú extra-pesada. Requieren una fuerza descomunal en los dedos y muñecas para mantener los piques rápidos.",
      opciones: [
        {
          id: "piques_triples_sostenidos_guatambu",
          texto: "Meter piques triples sostenidos con las baquetas pesadas durante los 40 minutos del corte",
          descripcion: "Explotar la potencia sonora de la fila al límite físico de la resistencia.",
          riesgo: "Alto",
          probabilidad: 0.62,
          exito: {
            ritmo: +9,
            hinchada: +6,
            resistencia: +5,
            overall: +6,
            mensaje: "¡VOLUMEN DE CAÑÓN! Los piques sonaron con una potencia devastadora que hizo temblar las chapas del tinglado."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +2,
            resistencia: -7,
            overall: -2,
            mensaje: "Ampollas abiertas y principio de tendinitis en las manos. Hubo que vendar muñecas de urgencia (-7 Aguante, -3 Ritmo)."
          }
        },
        {
          id: "alternar_baquetas_livianas",
          texto: "Alternar baquetas livianas y pesadas para acostumbrar la musculatura sin forzar lesiones",
          descripcion: "Cuidar las articulaciones de los percusionistas novatos.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +3,
            resistencia: +4,
            overall: +3,
            mensaje: "Evolución técnica progresiva y manos sanas para la prueba piloto."
          }
        }
      ]
    },
    {
      id: "ensayo_sobrecarga_arneses_pasada",
      fase: "ensayos",
      faseNombre: "Época de Ensayos (Playón Escolar)",
      titulo: "🎽 Pasada con Sobrecarga: Arneses de Acero y Marcha Firme",
      categoria: "ensayo",
      descripcion: "La comisión de ritmo propone ensayar la coreografía completa cargando peso adicional en los arneses de chanchas y surdos, para que la noche de calle los instrumentos se sientan livianos como una pluma en el asfalto.",
      opciones: [
        {
          id: "tres_pasadas_con_sobrecarga_trote",
          texto: "Completar tres pasadas enteras del playón al trote con sobrecarga y sin soltar la postura",
          descripcion: "Entrenamiento militar de alta intensidad para ganar potencia cardiovascular.",
          riesgo: "Alto",
          probabilidad: 0.60,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +9,
            overall: +6,
            mensaje: "¡CONDICIÓN FÍSICA MONSTRUOSA! El aguante de la fila llegó al nivel de los atletas de élite. La Costanera será un paseo para ellos."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +2,
            resistencia: -8,
            overall: -2,
            mensaje: "Contractura dorsal masiva en los cargadores de chancha. Hubo que suspender la práctica antes de tiempo (-8 Aguante)."
          }
        },
        {
          id: "marcha_calibrada_sin_sobrecarga",
          texto: "Calibrar la marcha con peso normal pero duplicar el tiempo de baile coreográfico",
          descripcion: "Priorizar la gracia estética y el ritmo constante sin castigar la columna.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +5,
            overall: +4,
            mensaje: "Equilibrio ideal: coordinación estética impecable y resistencia tonificada."
          }
        }
      ]
    }
  ],
  prueba_piloto: [
    {
      id: "piloto_desafio_rotonda_alto_riesgo",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "⚡ El Desafío de la Marcha en Zona de Vallas Neutras",
      categoria: "desfile",
      descripcion: "Al doblar en la rotonda hacia el 4to tramo, la hinchada de tu eterno rival te espera apiñada sobre las barandas silbando y arrojando papel picado. El reglamento exige pasar en silencio de concentración.",
      opciones: [
        {
          id: "romper_silencio_con_toque_de_guerra",
          texto: "Desobedecer el silencio neutral y clavar la marcha de guerra más pesada mirando a su tribuna",
          descripcion: "Un acto de audacia extrema para demostrar supremacía psicológica en territorio neutral.",
          riesgo: "Alto",
          probabilidad: 0.55,
          exito: {
            ritmo: +6,
            hinchada: +10,
            resistencia: +3,
            overall: +6,
            mensaje: "¡EXPLOSIÓN DE POPULARIDAD! Toda la bahía rugió con tu osadía. Tu hinchada enloqueció y el rival quedó mudo ante tu temple."
          },
          fracaso: {
            ritmo: -3,
            hinchada: +6,
            resistencia: -3,
            overall: -5,
            mensaje: "¡Acta de advertencia del tribunal! Los comisarios labraron infracción por provocación en zona neutral y descontaron puntaje reglamentario (-5 Overall)."
          }
        },
        {
          id: "mirada_altiva_silencio_marcial",
          texto: "Cruzar la zona en silencio absoluto con las baquetas en alto y la mirada fija al horizonte",
          descripcion: "Demostrar disciplina espartana e inmunidad total a las provocaciones.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Elegancia y porte de campeones. La organización felicitó la conducta impecable de tu delegación."
          }
        }
      ]
    },
    {
      id: "piloto_atardecer_brete_bueno",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "✨ Atardecer de Oro en la Bahía de El Brete",
      categoria: "fortuna",
      descripcion: "Tu colegio inicia la pasada justo cuando el sol cae rojo y dorado sobre el río Paraná. La brisa del agua es fresca, la luz natural hace brillar los metales y el público en las barandas aplaude con devoción.",
      opciones: [
        {
          id: "desplegar_ritmo_magico",
          texto: "Tocar con una cadencia envolvente contagiando la belleza del atardecer misionero",
          descripcion: "Fusionar la música estudiantil con el paisaje más hermoso de la provincia.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Postal soñada! Los fotógrafos de los diarios no pararon de disparar sus cámaras. Pasada inolvidable."
          }
        },
        {
          id: "acelerar_climax_rotonda",
          texto: "Aprovechar la euforia para acelerar el ritmo en la rotonda con un remate ensordecedor",
          descripcion: "Hacer temblar la bahía con percusión furiosa.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +2,
            overall: +6,
            mensaje: "¡Ovación descomunal! La gente en los bares y restaurantes de la Costanera aplaudió de pie."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "Las cajitas tuvieron un leve traspié en la curva, pero la energía tapó todo."
          }
        }
      ]
    },
    {
      id: "piloto_viento_sudestada_malo",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "⚠️ La Sudestada y las Ráfagas del Río Paraná",
      categoria: "urgencia",
      descripcion: "De golpe entra una sudestada con ráfagas de 50 km/h provenientes del río. El viento embolsa los espaldares de plumas del baile, vuela las gorras y apaga la acústica de los instrumentos más livianos.",
      opciones: [
        {
          id: "cerrar_filas_contra_viento",
          texto: "Pegar las filas, inclinar el torso hacia adelante y golpear los cueros con doble peso",
          descripcion: "Luchar contra el viento con firmeza corporal espartana.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Aguante supremo! La scola avanzó como un buque rompehielos sin perder la línea ni el compás."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "El viento frenó un poco la marcha, pero completaron el tramo con dignidad."
          }
        },
        {
          id: "proteger_al_cuerpo_baile",
          texto: "Cercar a las pasistas con los bombos en los laterales para cortar el viento",
          descripcion: "Solidaridad absoluta entre banda y cuerpo de baile.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Gesto ejemplar de compañerismo! Las chicas pudieron bailar y la tribuna aplaudió la caballerosidad."
          }
        }
      ]
    },
    {
      id: "piloto_hinchada_desborde_bueno",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "✨ Marea Humana en las Barandas del Río",
      categoria: "fortuna",
      descripcion: "La convocatoria de tu colegio supera todos los pronósticos: más de 3000 simpatizantes copan las barandas del 4to tramo con banderas de 40 metros de largo, cornetas y humo de colores.",
      opciones: [
        {
          id: "alimentarse_del_aliento",
          texto: "Mirar a la tribuna, levantar los brazos y tocar en comunión con los cánticos de la hinchada",
          descripcion: "Fundir el ritmo de la banda con el canto del corazón popular.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +9,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Una sola voz y un solo tambor! El aliento ensordecedor tapó a los demás colegios por completo."
          }
        },
        {
          id: "mantener_foco_tecnico",
          texto: "Agradecer con un cabeceo pero mantener los ojos clavados en la seña del director",
          descripcion: "No dejarse embriagar por el ruido para no perder la rigurosidad técnica.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +7,
            hinchada: +4,
            resistencia: +4,
            overall: +6,
            mensaje: "Concentración de hierro. El jurado anotó puntaje perfecto en disciplina y coordinación."
          }
        }
      ]
    },
    {
      id: "piloto_demora_dos_horas_malo",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "⚠️ Demora de Dos Horas en Pista y Músculos Fríos",
      categoria: "urgencia",
      descripcion: "Una carroza con fallas mecánicas de un colegio anterior trabó la pista. Tu scola lleva dos horas parada sobre el asfalto esperando el silbato de largada; el cuerpo se enfría y el cansancio hace mella.",
      opciones: [
        {
          id: "elongacion_y_calentamiento_trotando",
          texto: "Organizar tandas de salto y trote en el lugar para mantener los músculos calientes",
          descripcion: "Evitar calambres y desgarros con preparación física inteligente.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Salieron como un resorte! Mientras otros colegios salían dormidos, ustedes largaron con fuego en las venas."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +1,
            resistencia: -2,
            overall: 0,
            mensaje: "La espera fue larga y pesada, pero la zancada se mantuvo firme."
          }
        },
        {
          id: "rueda_de_mates_y_anecdotas",
          texto: "Sentarse en el pasto a tomar mate y distender la mente con anécdotas de la promo",
          descripcion: "Relajar el estrés de la competencia antes del pitazo inicial.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +3,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "Mente despejada y camaradería al 100%. Entraron a la pista sin un gramo de nerviosismo."
          }
        }
      ]
    },
    {
      id: "piloto_arco_triunfo_banderas",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "🏁 El Túnel de Banderas de 15 Metros en la Largada",
      categoria: "fortuna",
      descripcion: "En la cabecera de largada del 4to tramo, simpatizantes y compañeros de la promo despliegan banderas gigantes formando un túnel ondeante de tela sobre la formación. Al silbatazo, la scola arranca cruzando el arco de triunfo.",
      opciones: [
        {
          id: "cruzar_tunel_con_toque_arrollador",
          texto: "Arrancar con el corte más furioso de la scola al atravesar el túnel",
          descripcion: "Hacer temblar la tela con la presión sonora de los parches.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Salida colosal! El estruendo debajo de las banderas puso la piel de gallina a toda la bahía."
          }
        },
        {
          id: "mantener_paso_marcial_solemne",
          texto: "Marcha rígida sin acelerar para cuidar la distancia con la scola de adelante",
          descripcion: "Priorizar la disciplina de pista ante la tentación de la euforia.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "Impecable prolijidad. Los comisarios de pista anotaron felicitaciones por la prolijidad."
          }
        }
      ]
    },
    {
      id: "piloto_cordon_veteranos_costanera",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "💙 El Abrazo del Cordón de Egresados Históricos",
      categoria: "fortuna",
      descripcion: "A la altura del monumento al Papa, un grupo de 40 egresados de promociones históricas forman un cordón humano con remeras viejas del colegio. Aplauden con lágrimas en los ojos al ver que la mística sigue viva.",
      opciones: [
        {
          id: "saludar_egresados_corte_retro",
          texto: "Girar los tambores hacia el cordón y tocar un corte clásico de los años 90 en homenaje",
          descripcion: "Un puente generacional que despierta el orgullo más profundo de tu escuela.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +9,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Abrazo histórico! Los veteranos corearon tu nombre y te pasaron la bendición de las viejas glorias."
          }
        },
        {
          id: "mirada_al_frente_sin_distracciones",
          texto: "Asentir con la cabeza con orgullo marcial sin perder medio compás",
          descripcion: "Demostrar que la scola actual tiene concentración de acero.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "Porte de campeones. La seriedad de la pasada impresionó a todos."
          }
        }
      ]
    },
    {
      id: "piloto_calzado_desprendido_urgencia",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "⚠️ Pérdida de Calzado sobre las Vías del Tren",
      categoria: "urgencia",
      descripcion: "Al pisar el cruce de vías férreas de la Costanera, la zapatilla o sandalia de un integrante de tu fila se traba en el riel y se desprende. Quedan 100 metros de pasada y el asfalto quema.",
      opciones: [
        {
          id: "seguir_descalzo_con_aguante",
          texto: "Pisar firme descalzo sobre el asfalto caliente sin aflojar ni un solo compás",
          descripcion: "Demostrar coraje espartano ante el dolor físico.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +6,
            overall: +5,
            mensaje: "¡Garra sobrehumana! Todo el público en la baranda aplaudió de pie la entrega del integrante."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: -4,
            overall: +1,
            mensaje: "Una ampolla dolorosa en la planta del pie (-4 Aguante), pero no soltó el instrumento."
          }
        },
        {
          id: "auxilio_rapido_cordon",
          texto: "Hacer seña discreta a los aguateros para que alcancen la zapatilla en la transición",
          descripcion: "Resolver con practicidad técnica sin exponer el cuerpo.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "Auxilio relámpago coordinado. Calzado puesto en 3 segundos."
          }
        }
      ]
    },
    {
      id: "piloto_duelo_canticos_el_brete",
      fase: "prueba_piloto",
      faseNombre: "Prueba Piloto en la Costanera",
      titulo: "🗣️ La Desconcentración Pacífica en El Brete",
      categoria: "desfile",
      descripcion: "En la zona de desconcentración en el playón de El Brete, tu hinchada y la de otro colegio coinciden a 30 metros. No hay violencia: es un mano a mano de cánticos, palmas y banderas donde gana el que cante con más garganta.",
      opciones: [
        {
          id: "arengar_a_la_hinchada_con_tambores",
          texto: "Subir a los hombros de un compañero y dirigir los cánticos de la hinchada con el silbato",
          descripcion: "Encender el orgullo estudiantil y ganar el duelo de alientos de punta a punta.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +4,
            hinchada: +9,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Triunfo popular en El Brete! Tu colegio cantó con el alma y selló la noche con una fiesta pacífica."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +5,
            resistencia: -3,
            overall: +2,
            mensaje: "Garganta rasposa de tanto gritar (-3 Aguante), pero la hinchada quedó eufórica."
          }
        },
        {
          id: "mantener_orden_desconcentrar",
          texto: "Agradecer los aplausos y ordenar la subida ordenada a los colectivos de regreso",
          descripcion: "Cuidar la seguridad de los más chicos y evitar roces nocturnos.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +5,
            overall: +5,
            mensaje: "Conducta ejemplar. Directivos y padres felicitaron la madurez de la delegación."
          }
        }
      ]
    }
  ],
  noches_calle: [
    {
      id: "calle_solo_acrobatico_valla_alto_riesgo",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "⚡ El Salto Acrobático desde la Baranda en Palco 1",
      categoria: "desfile",
      descripcion: "Frente al Palco Oficial 1, con las cámaras de Canal 12 transmitiendo en vivo para toda la provincia, se abre un claro junto a la valla de contención. La euforia de la multitud te tienta a un solo acrobático inolvidable.",
      opciones: [
        {
          id: "trepar_y_saltar_en_giro",
          texto: "Subir de un salto a la valla, rematar el corte en el aire y caer al asfalto en un solo compás",
          descripcion: "La maniobra más arriesgada jamás intentada en la Costanera de Posadas.",
          riesgo: "Alto",
          probabilidad: 0.52,
          exito: {
            ritmo: +9,
            hinchada: +10,
            resistencia: +4,
            overall: +8,
            mensaje: "¡LOCURA TOTAL EN POSADAS! Caíste perfecto en el asfalto clavando el golpe en el segundo exacto. La tribuna y las redes sociales explotaron con la jugada del año."
          },
          fracaso: {
            ritmo: -7,
            hinchada: +4,
            resistencia: -9,
            overall: -4,
            mensaje: "¡Caída estrepitosa al asfalto! Te raspaste las rodillas, se te partió un palillo y tardaste 3 compases en levantarte adolorido (-9 Aguante, -7 Ritmo)."
          }
        },
        {
          id: "quedarse_en_la_pista_marcial",
          texto: "Tocar plantado en el asfalto con postura impecable y mirada clavada en el jurado",
          descripcion: "Asegurar los puntos de técnica y evitar una lesión que arruine la temporada.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Firmeza absoluta. Los jueces de disciplina valoraron tu concentración profesional."
          }
        }
      ]
    },
    {
      id: "calle_palco1_gloria_bueno",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "✨ Ovación Unánime en el Palco Oficial",
      categoria: "fortuna",
      descripcion: "Pasada magistral frente al Palco 1: los cambios de ritmo entraron limpios, las chanchas hicieron vibrar las tribunas de madera y las autoridades se pusieron de pie a aplaudir el despliegue escénico.",
      opciones: [
        {
          id: "rematar_con_furia_hacia_palco2",
          texto: "Aprovechar la inercia ganadora para redoblar la marcha rumbo al Palco 2",
          descripcion: "Mantener la voracidad competitiva sin conformarse con un solo tramo.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Aplanadora rítmica! La segunda mitad del desfile fue aún más apoteótica que la primera."
          }
        },
        {
          id: "regular_aire_conservar_fuerzas",
          texto: "Dosificar las fuerzas en el tramo intermedio para llegar frescos al remate",
          descripcion: "Inteligencia táctica sobre el asfalto posadeño.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +6,
            overall: +5,
            mensaje: "Control milimétrico del desgaste físico. Llegaron enteros a la desconcentración."
          }
        }
      ]
    },
    {
      id: "calle_carroza_atascada_malo",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "⚠️ Carroza Varada y Marcha Estática en el Lugar",
      categoria: "urgencia",
      descripcion: "A mitad de la segunda noche de calle, la carroza ingeniosa de tu colegio pincha una rueda y queda trabada frente a la rotonda. El reglamento prohíbe frenar la música: tienen que tocar en el mismo lugar sin avanzar durante 8 minutos.",
      opciones: [
        {
          id: "sostener_repique_estatico_aguantando",
          texto: "Apretar los dientes y tocar el compás en el lugar marcando el paso sin parar un segundo",
          descripcion: "Exigir los músculos gemelos y los hombros al límite.",
          riesgo: "Medio",
          probabilidad: 0.8,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Aguante titánico! La gente festejó la resistencia y la carroza pudo destrabarse con aplausos."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +3,
            resistencia: -6,
            overall: -1,
            mensaje: "El cansancio de tocar parados en el lugar pasó factura en los hombros (-6 Aguante)."
          }
        },
        {
          id: "meter_ritmos_alternativos_juego",
          texto: "Improvisar juegos rítmicos interactuando con las palmas del público en las barandas",
          descripcion: "Transformar el bache en una fiesta callejera inolvidable.",
          riesgo: "Bajo",
          probabilidad: 0.9,
          exito: {
            ritmo: +5,
            hinchada: +9,
            resistencia: +3,
            overall: +6,
            mensaje: "¡Genialidad callejera! Toda la Costanera se puso a batir palmas con ustedes. Los jurados elogiaron la cintura."
          }
        }
      ]
    },
    {
      id: "calle_lluvia_papel_picado_malo",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "⚠️ Lluvia Cegadora de Serpentina y Papel Picado",
      categoria: "urgencia",
      descripcion: "La tribuna del colegio rival les tira bolsas enteras de papel picado fino y serpentinas desde la baranda. El viento mete papelillos en los ojos de los integrantes justo en el cambio de marcha.",
      opciones: [
        {
          id: "cerrar_ojos_guiarse_por_toque",
          texto: "Bajar la cabeza, entornar los ojos y tocar guiándose puramente por el pulso de la fila",
          descripcion: "No desconcentrarse por las provocaciones del folklore estudiantil.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Temple de acero! Pasaron la lluvia de papeles sin errar un solo golpe."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "A dos chicos se les metió serpentina en los ojos, pero se limpiaron rápido con la manga."
          }
        },
        {
          id: "sonreir_festejar_papel",
          texto: "Sacudirse los papeles con una sonrisa y gritarle a la tribuna: '¡Tiren más que nos encanta!'",
          descripcion: "Tomarse el folklore con alegría y carisma desarmante.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Cátedra de buena onda! La hinchada rival terminó aplaudiendo la simpatía y el carisma."
          }
        }
      ]
    },
    {
      id: "calle_pasada_perfecta_bueno",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "✨ La Noche de las Cuatro Pistas Sincronizadas",
      categoria: "fortuna",
      descripcion: "Todo sale como en los sueños: no hubo viento en contra, la temperatura fue ideal, la hinchada alentó sin invadir la pista y los cuatro palcos oficiales fueron clavados con precisión atómica.",
      opciones: [
        {
          id: "celebrar_con_el_grito_colegio",
          texto: "Soltar el grito del colegio al unísono al cruzar la línea de llegada del 4to tramo",
          descripcion: "Descargar toda la adrenalina acumulada tras una pasada soñada.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +5,
            overall: +7,
            mensaje: "¡PERFECCIÓN ABSOLUTA! Los veedores del jurado calificaron la pasada como candidata inmediata al campeonato."
          }
        },
        {
          id: "desconcentrar_en_silencio_marcial",
          texto: "Mantener la formación con la frente en alto y retirarse con paso marcial intachable",
          descripcion: "Dejar una imagen de disciplina inquebrantable de colegio grande.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +6,
            overall: +6,
            mensaje: "Elegancia y señorío. Toda la prensa destacó el respeto y la seriedad de tu institución."
          }
        }
      ]
    },
    {
      id: "calle_niebla_fluvial_parana",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "🌫️ El Manto de Niebla Fluvial del Paraná",
      categoria: "desfile",
      descripcion: "A las dos de la mañana, un espeso banco de niebla baja desde la costa del río Paraná cubriendo los adoquines del 4to tramo. Las torres de luces parecen soles fantasmagóricos y la humedad enfría las manos.",
      opciones: [
        {
          id: "tocar_a_traves_de_la_bruma",
          texto: "Fijar la vista en el pilar de adelante y redoblar con sonido seco y penetrante",
          descripcion: "Hacer que el sonido de la banda atraviese la niebla como un rayo acústico.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Clima cinematográfico! La scola emergiendo de la niebla fue una de las postales más mágicas de la noche."
          }
        },
        {
          id: "friccionar_palillos_calor",
          texto: "Frotar las manos en los bolsillos en los compases de silencio para mantener la flexibilidad",
          descripcion: "Evitar que el frío del río entumezca los dedos antes del Palco 2.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +6,
            overall: +4,
            mensaje: "Músculos calientes y toque preciso. Gran preparación física."
          }
        }
      ]
    },
    {
      id: "calle_palco3_remate_desesperado",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "🔥 La Última Furia Acústica en el Palco 3",
      categoria: "desfile",
      descripcion: "El último palco antes de la desconcentración. Las piernas pesan 20 kilos cada una, la espalda del chanchero arde y la garganta está seca. El jurado oficial tiene los bolígrafos listos para la calificación final de la noche.",
      opciones: [
        {
          id: "descargar_resto_de_vida",
          texto: "Soltar todo el aire que te queda en el pecho y golpear el parche con furia indomable",
          descripcion: "Dejar el alma en el asfalto posadeño sin guardarse una sola gota de sudor.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +7,
            hinchada: +9,
            resistencia: +5,
            overall: +7,
            mensaje: "¡ÉPICA DEMOLEDORA! El Palco 3 tembló con la explosión final. Calificación récord de los jueces."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +5,
            resistencia: -4,
            overall: +2,
            mensaje: "Llegaste sin aire al final de la pasada (-4 Aguante), pero diste hasta la última gota de orgullo."
          }
        },
        {
          id: "paso_firme_sin_desesperar",
          texto: "Sostener el pulso metronómico con compostura marcial hasta cruzar la línea de llegada",
          descripcion: "Asegurar que el cierre sea prolijo y sin fisuras técnicas.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "Cierre soberbio y ordenado. Puntajes altos en disciplina."
          }
        }
      ]
    },
    {
      id: "calle_cruz_roja_aguateros",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "💧 El Alivio de los Aguateros en Plena Marcha",
      categoria: "fortuna",
      descripcion: "A mitad del tramo 2, cuando el cansancio empezaba a pasar factura, el equipo de aguateros del colegio y voluntarios de la Cruz Roja sincronizan para alcanzar bolsitas de agua helada y caramelos ácidos sin cortar el paso.",
      opciones: [
        {
          id: "tomar_agua_al_paso_y_seguir",
          texto: "Morder la bolsita de agua helada con los dientes y tragar mientras las manos siguen tocando",
          descripcion: "Hidratación ninja de desfile callejero.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +7,
            overall: +5,
            mensaje: "¡Resucitaste en pista! La frescura del agua fría te devolvió el alma al cuerpo (+7 Aguante)."
          }
        },
        {
          id: "compartir_con_compañero_fatigado",
          texto: "Pasarle la bolsita al compañero de fila que venía tambaleando del esfuerzo",
          descripcion: "Nobleza y compañerismo puro en medio de la pasada.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +5,
            overall: +6,
            mensaje: "¡Salvaste a tu compañero! La scola no se quebró y marcharon unidos hasta el final."
          }
        }
      ]
    },
    {
      id: "calle_piramide_baile_espectacular",
      fase: "noches_calle",
      faseNombre: "Noches de Calle (4to Tramo)",
      titulo: "🌟 La Pirámide Humana del Cuerpo de Baile",
      categoria: "desfile",
      descripcion: "Frente al Palco 2, el cuerpo de baile coordina una coreografía acrobática con las pasistas y los estandartes: una pirámide humana de 3 niveles que exige sincronía exacta con el corte de percusión.",
      opciones: [
        {
          id: "marcar_corte_milimetrico_apoyo",
          texto: "Ejecutar el corte de tambores con un crescendo tenso que marque la subida y remate al elevar la punta",
          descripcion: "Musicalizar la acrobacia con dramatismo digno del Carnaval de Río.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +7,
            hinchada: +9,
            resistencia: +4,
            overall: +7,
            mensaje: "¡PERFECCIÓN ESCÉNICA! La pirámide se elevó perfecta y el corte explotó en el segundo exacto. Ovación unánime del jurado."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +5,
            resistencia: -1,
            overall: +2,
            mensaje: "Una pequeña vacilación al bajar, pero la figura impactó fuertemente en el público."
          }
        },
        {
          id: "mantener_base_continua_sin_riesgo",
          texto: "Sostener una marcha constante de respaldo para dar seguridad a las pasistas",
          descripcion: "Priorizar la estabilidad de las compañeras de baile.",
          riesgo: "Bajo",
          probabilidad: 0.96,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "Base sólida como roca. La coreografía brilló con prolijidad."
          }
        }
      ]
    }
  ],
  anfiteatro: [
    {
      id: "anfi_pirotecnia_fria_bueno",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "✨ El Clímax de Pirotecnia Fría en la Bajada Vieja",
      categoria: "fortuna",
      descripcion: "En el escenario Alcibíades Alarcón, durante el remate de la scola, se activan bengalas de pirotecnia fría plateada y dorada que iluminan el cielo sobre el río. El efecto visual y sonoro es de una belleza descomunal.",
      opciones: [
        {
          id: "acelerar_al_infinito_con_chispas",
          texto: "Redoblar con los ojos encandilados por las chispas y meter aceleración furiosa",
          descripcion: "Cerrar la noche con un crescendo que haga vibrar las gradas de piedra.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +8,
            hinchada: +10,
            resistencia: +5,
            overall: +8,
            mensaje: "¡APOTEOSIS PURA! El Anfiteatro rugió en una ovación que se escuchó hasta Paraguay."
          }
        },
        {
          id: "corte_seco_en_silencio",
          texto: "Clavar un corte seco milimétrico mientras caen las últimas chispas doradas",
          descripcion: "Lograr el contraste perfecto entre el estruendo y el silencio.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +5,
            overall: +7,
            mensaje: "¡Corte de orquesta filarmónica! Los jurados anotaron 10 unánime en impacto artístico."
          }
        }
      ]
    },
    {
      id: "anfi_acople_microfonos_malo",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "⚠️ Acople Estridente en el Escenario Mayor",
      categoria: "urgencia",
      descripcion: "Al comenzar la rutina en el escenario del Anfiteatro, los micrófonos ambientales del jurado generan un acople ensordecedor que aturde a los músicos de primera fila e interrumpe el compás inicial.",
      opciones: [
        {
          id: "ignorar_pitido_tocar_fuerte",
          texto: "Tocar con el doble de volumen para tapar el chillido de los parlantes y recuperar el hilo",
          descripcion: "Vencer el fallo técnico con potencia acústica cruda.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Sonido demoledor! La percusión tapó el acople y el sonidista pudo corregir la ganancia."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "El acople molestó dos compases, pero la scola salvó la pasada con solvencia."
          }
        },
        {
          id: "hacer_seña_visual_director",
          texto: "Buscar con la mirada al director y seguir estrictamente sus brazos sin guiarse por el audio",
          descripcion: "Confiar en la referencia visual para no desfasarse.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +3,
            overall: +5,
            mensaje: "Disciplina impecable. La sincronía se mantuvo intacta gracias a las señas de mando."
          }
        }
      ]
    },
    {
      id: "anfi_jurado_cantando_bueno",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "✨ El Jurado Oficial Cantando la Marcha de Pie",
      categoria: "fortuna",
      descripcion: "El carisma, la prolijidad y la alegría de tu colegio contagian a todo el palco del Anfiteatro: hasta los jurados más serios dejan las planillas, aplauden al compás y cantan las canciones de tu colegio.",
      opciones: [
        {
          id: "guinar_ojo_saludar_jurado",
          texto: "Saludar al jurado con la baqueta en alto y rematar con paso de scola",
          descripcion: "Sellar la complicidad con el tribunal calificador.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +9,
            resistencia: +4,
            overall: +7,
            mensaje: "¡Copa asegurada! La conexión con los jueces fue total y los puntajes volaron por las nubes."
          }
        },
        {
          id: "dedicar_show_al_anfiteatro",
          texto: "Girar los tambores hacia las gradas populares de la Bajada Vieja",
          descripcion: "Agradecer al pueblo posadeño que llenó el anfiteatro.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +5,
            hinchada: +10,
            resistencia: +5,
            overall: +7,
            mensaje: "¡Idolatría total! Toda la tribuna gritó el nombre de tu colegio como un solo corazón."
          }
        }
      ]
    },
    {
      id: "anfi_piso_humedo_malo",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "⚠️ Condensación Fluvial y Lajas Resbaladizas",
      categoria: "urgencia",
      descripcion: "La brisa del río Paraná condensó humedad sobre las lajas de piedra del escenario Alcibíades Alarcón. El piso parece una pista de patinaje sobre hielo y dos integrantes patinan peligrosamente con los instrumentos pesados.",
      opciones: [
        {
          id: "marcar_paso_plano_sin_saltos",
          texto: "Apoyar la planta del pie completa y no realizar giros bruscos",
          descripcion: "Asegurar estabilidad biomecánica para no terminar en el suelo.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Equilibrio perfecto! Nadie se cayó y el toque mantuvo una cadencia soberbia."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Un pequeño resbalón en la cabecera, pero se recuperaron sin soltar el instrumento."
          }
        },
        {
          id: "tirar_aserrin_o_talco",
          texto: "Pedir a los suplentes que echen un poco de tierra o aserrín discretamente en los bordes",
          descripcion: "Solucionar la adherencia del escenario de inmediato.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "Solución astuta. El suelo agarró adherencia y pudieron cerrar el show con saltos y piruetas."
          }
        }
      ]
    },
    {
      id: "anfi_bajada_escalinatas_ciegas_alto_riesgo",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "⚡ El Descenso al Manuel Antonio Ramírez Tocando de Espaldas",
      categoria: "anfiteatro",
      descripcion: "En la boca de entrada al mítico anfiteatro, mirando el río Paraná de noche y las miles de banderas flameando, decidís encarar las empinadas escalinatas de piedra de espaldas al escenario, tocando a ciegas mientras mirás a la hinchada.",
      opciones: [
        {
          id: "bajar_de_espaldas_a_ciegas",
          texto: "Bajar los escalones históricos de espaldas saltando al compás del corte de scola",
          descripcion: "Una demostración de confianza ciega en tu instrumento que quedará grabada en el bronce.",
          riesgo: "Alto",
          probabilidad: 0.50,
          exito: {
            ritmo: +10,
            hinchada: +10,
            resistencia: +5,
            overall: +9,
            mensaje: "¡CONSAGRACIÓN MÍTICA EN EL ANFI! Tocaste de espaldas cada escalón sin mirar ni una sola vez. El estadio entero se puso de pie en una ovación histórica que se escuchó hasta Encarnación."
          },
          fracaso: {
            ritmo: -7,
            hinchada: +3,
            resistencia: -10,
            overall: -5,
            mensaje: "¡Patinada en una laja húmeda! Rodaste dos escalones y chocaste a tu compañero de fila. Se salvó el instrumento de milagro pero quedaste rengueando (-10 Aguante, -7 Ritmo)."
          }
        },
        {
          id: "bajada_marcial_mirando_frente",
          texto: "Descenso frontal tradicional marcando cada escalón con paso firme y hombros erguidos",
          descripcion: "Asegurar la llegada impecable al escenario mayor Alcibíades Alarcón.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "Entrada marcial solemne. La banda pisó el escenario con autoridad de gigante."
          }
        }
      ]
    },
    {
      id: "anfi_acustica_pared_piedra",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "🏛️ El Eco de Piedra del Alcibíades Alarcón",
      categoria: "show",
      descripcion: "El histórico paredón de piedra del anfiteatro genera una reverberación acústica legendaria. Si tocás con la fuerza adecuada, cada golpe de percusión se duplica con un eco envolvente que rebota hacia el río Paraná.",
      opciones: [
        {
          id: "proyectar_hacia_la_pared",
          texto: "Inclinar los parches hacia el muro de piedra para disparar la resonancia natural hacia la tribuna",
          descripcion: "Aprovechar la acústica del templo mayor como un luthier experto.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡CATEDRAL DEL RITMO! La percusión retumbó como un trueno continuo en toda la bahía de Posadas."
          }
        },
        {
          id: "tocar_hacia_las_gradas_directo",
          texto: "Apuntar directamente al jurado oficial con sonido seco sin rebote",
          descripcion: "Garantizar la nitidez de cada nota para la planilla de calificación.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "Precisión de laboratorio. Los jurados de técnica aplaudieron la nitidez."
          }
        }
      ]
    },
    {
      id: "anfi_humo_color_grada_popular",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "🎆 La Niebla de Color sobre la Bajada Vieja",
      categoria: "fortuna",
      descripcion: "Desde la cima de las gradas populares que dan a la Bajada Vieja, la hinchada enciende botes de humo con los colores exactos de tu colegio. Una nube densa y brillante cubre el anfiteatro creando una postal mística.",
      opciones: [
        {
          id: "levantar_brazos_hacia_el_humo",
          texto: "Alzar las baquetas hacia el cielo teñido y acelerar el compás al ritmo de los fuegos",
          descripcion: "Fusionar la entrega de la scola con la pasión popular de la tribuna.",
          riesgo: "Bajo",
          probabilidad: 0.96,
          exito: {
            ritmo: +6,
            hinchada: +10,
            resistencia: +4,
            overall: +7,
            mensaje: "¡Éxtasis total! La imagen del colegio envuelto en humo y percusión fue tapa de todos los diarios al día siguiente."
          }
        },
        {
          id: "proteger_respiracion_corte_marcial",
          texto: "Bajar la cabeza un instante para no inhalar el humo y marcar el corte con los ojos cerrados",
          descripcion: "Demostrar que conocés los compases de memoria sin depender de la vista.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +7,
            hinchada: +6,
            resistencia: +5,
            overall: +6,
            mensaje: "¡Maestría a ciegas! Tocaste con el corazón y el corte salió quirúrgico."
          }
        }
      ]
    },
    {
      id: "anfi_silencio_cinco_segundos",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "🤫 Los Cinco Segundos de Silencio Absoluto",
      categoria: "show",
      descripcion: "En el quiebre de la mitad del show, los directores ordenan el efecto más arriesgado de la música: frenar a los 250 integrantes en seco. Si alguien tose, se cae un palillo o pifia medio golpe, el truco se arruina.",
      opciones: [
        {
          id: "clavar_estatua_absoluta",
          texto: "Contener la respiración, clavar la mirada en las gradas y no mover un solo músculo durante 5 segundos",
          descripcion: "Crear una tensión dramática insoportable antes de la explosión final.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +8,
            hinchada: +9,
            resistencia: +4,
            overall: +7,
            mensaje: "¡CÁTEDRA DE DISCIPLINA! El silencio congeló el estadio entero. Cuando explotó el redoble posterior, el Anfi casi se cae de la ovación."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "Un chanchero rozó el parche en el segundo 4, pero el estallido siguiente tapó el detalle."
          }
        },
        {
          id: "mantener_redoble_pianisimo",
          texto: "Bajar a un redoble casi inaudible pero constante para no arriesgar el silencio total",
          descripcion: "Asegurar el control rítmico sin exponerse al silencio absoluto.",
          riesgo: "Bajo",
          probabilidad: 0.98,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "Dinámica orquestal prolija. Muy elogiada por los jueces de música."
          }
        }
      ]
    },
    {
      id: "anfi_lagrimas_egresados_despedida",
      fase: "anfiteatro",
      faseNombre: "Show de Scolas (Anfiteatro Manuel Antonio Ramírez)",
      titulo: "🎓 La Última Marcha de los Egresados",
      categoria: "show",
      descripcion: "Los últimos compases del show en el Anfiteatro. Mirás a tus compañeros de fila y ves las lágrimas rodando por las mejillas de los chicos que terminan 5º y 6º año. Es el final de una etapa que nunca más se repetirá.",
      opciones: [
        {
          id: "tocar_con_el_alma_en_la_garganta",
          texto: "Gritar el lema del colegio con el nudo en la garganta y dar los últimos golpes con lágrimas en los ojos",
          descripcion: "Dejar grabada la pasión de tu juventud en las piedras del río Paraná.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +7,
            hinchada: +10,
            resistencia: +6,
            overall: +8,
            mensaje: "¡EMOCIÓN ETERNA! No importan los puntos ni las copas: diste tu vida por tu colegio y la Estudiantina te recordará para siempre."
          }
        },
        {
          id: "abrazar_al_companero_al_corte",
          texto: "Clavar el último golpe perfecto y fundirte en un abrazo apretado con toda tu fila",
          descripcion: "Celebrar la hermandad forjada en meses de sudor y playón.",
          riesgo: "Bajo",
          probabilidad: 1.0,
          exito: {
            ritmo: +6,
            hinchada: +9,
            resistencia: +6,
            overall: +7,
            mensaje: "¡HERMANDAD DE POR VIDA! Las familias en la tribuna lloraron de orgullo. Misión cumplida."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 8.5. EVENTO ULTRA-RARO DE SUSPENSIÓN HISTÓRICA DISCIPLINARIA (1 A 3 AÑOS)
// =========================================================================

export function generarEventoSuspensionAPES(colegio, duracion, anioActual, maxAnios) {
  const colegioApodo = colegio?.apodo || "tu colegio";

  const antecedentes = [
    `Tras la Prueba Piloto, un grave enfrentamiento de hinchadas en los alrededores de la Plaza 9 de Julio y calle San Lorenzo terminó con vidrieras dañadas y disturbios. En asamblea extraordinaria de emergencia, la comisión organizadora y el Ministerio de Educación resolvieron suspender a ${colegioApodo} durante ${duracion} año(s) de toda competencia oficial.`,
    `En plena pasada frente al Palco 1, simpatizantes de ${colegioApodo} encendieron bombas de humo y bengalas náuticas de fósforo prohibidas que intoxicaron a veedores y obligaron a evacuar la pista durante 40 minutos. El tribunal de disciplina fiscalizador aplicó una sanción histórica: ${duracion} año(s) de suspensión total.`,
    `Una incursión nocturna no autorizada al galpón de carrozas de la Costanera provocó daños en las estructuras mecánicas del colegio rival. La investigación policial y el sumario disciplinario derivaron en una sanción ejemplificadora: ${colegioApodo} queda suspendido de la Estudiantina por ${duracion} año(s).`,
    `Reiteradas invasiones de pista de la hinchada saltando las vallas de seguridad e increpando a los comisarios de pista colmaron la paciencia de las autoridades. Tras varias advertencias desoídas, El tribunal dictaminó la suspensión institucional de ${colegioApodo} por ${duracion} año(s).`
  ];

  const antecedenteSeleccionado = pickRandom(antecedentes);

  return {
    id: `suspension_apes_${Date.now()}`,
    fase: "sorpresa",
    faseNombre: "Resolución Extraordinaria del Tribunal",
    titulo: `🚨 ¡SANCIÓN HISTÓRICA DISCIPLINARIA: ${colegioApodo.toUpperCase()} SUSPENDIDO!`,
    categoria: "urgencia",
    esSuspensionAPES: true,
    duracionSancion: duracion,
    descripcion: `FALLO DEL TRIBUNAL DISCIPLINARIO OFICIAL:\n\n"${antecedenteSeleccionado}"\n\nTu colegio queda oficialmente excluido de la Estudiantina durante ${duracion} año(s). ¿Qué harás con tu carrera?`,
    opciones: [
      {
        id: "traspaso_emergencia_sancion",
        texto: "Tramitar pase de emergencia y fichar por otro colegio para no perder tus años de desfile",
        descripcion: "Buscar cobijo inmediato en otra escuela para seguir compitiendo en la Costanera.",
        riesgo: "Medio",
        probabilidad: 0.90,
        exito: {
          overall: +1,
          hinchada: +2,
          mensaje: "Obtuviste el pase de emergencia extraordinario. Te toca elegir tu nuevo destino.",
          abrirTraspasoEmergencia: true
        },
        fracaso: {
          overall: 0,
          mensaje: "Trámite exprés aprobado con lo justo. Elegí tu nuevo colegio.",
          abrirTraspasoEmergencia: true
        }
      },
      {
        id: "lealtad_bancar_sancion",
        texto: `Quedarte en ${colegioApodo} a bancar los ${duracion} año(s) de suspensión entrenando a puertas cerradas`,
        descripcion: `Demostrar lealtad inquebrantable: la scola resiste en el patio escolar esperando el regreso triunfal.`,
        riesgo: "Bajo",
        probabilidad: 1.0,
        exito: {
          hinchada: +8,
          resistencia: +6,
          overall: +2,
          mensaje: `¡Lealtad histórica! Aguantaron los ${duracion} año(s) de suspensión ensayando a puertas cerradas. Cuando vuelvan a la Costanera, Posadas temblará.`,
          bancarSuspension: true,
          duracionSancion: duracion
        }
      }
    ]
  };
}

// =========================================================================
// 8.9. EVENTOS ESPECIALES DE RIVALIDAD HISTÓRICA RECIENTE (NORMAL vs NACIONAL)
// =========================================================================

export const EVENTO_ESPECIAL_NORMAL_ROBO_CHANCHAS = {
  id: "evento_especial_normal_robo_chanchas",
  fase: "sorpresa",
  faseNombre: "Tensión Histórica de la Estudiantina",
  titulo: "🚨 El Robo de las Chanchas al Nacional (La Revancha del Cartel)",
  categoria: "urgencia",
  descripcion: "Durante la Prueba Piloto en el 4to tramo, la hinchada del Nacional exhibió un cartel gigante con burlas y provocaciones directas hacia La Normal que encendió la furia de toda la comunidad escolar. En busca de revancha por la ofensa pública en la Costanera, un grupo clandestino de La Normal planea una incursión comando nocturna al galpón del Nacional para robarles sus legendarias chanchas pesadas y dejarlos sin graves en el desfile. Te convocan para sumarte al operativo. ¿Qué decidís hacer?",
  opciones: [
    {
      id: "normal_robar_chanchas",
      texto: "Participar en la incursión comando para robarles las chanchas al Nacional",
      descripcion: "Vengarse del cartel provocador: 50% de chances de zafar sin consecuencias, o 50% de recibir 1 año de suspensión disciplinaria.",
      riesgo: "Alto",
      probabilidad: 0.50,
      exito: {
        ritmo: +4,
        hinchada: +8,
        resistencia: +2,
        overall: +3,
        mensaje: "¡ZAFARON DE MILAGRO! Ocultaron las chanchas del Nacional y escaparon antes de que llegue la policía. La hinchada festeja la revancha por el cartel con impunidad absoluta (+8 Hinchada)."
      },
      fracaso: {
        ritmo: -3,
        hinchada: +2,
        resistencia: -4,
        overall: -3,
        esSuspensionAPES: true,
        bancarSuspension: true,
        duracionSancion: 1,
        motivoSuspension: "robo_chanchas",
        mensaje: "🚨 ¡LOS ATRAPÓ LA POLICÍA Y LAS AUTORIDADES! Descubrieron las chanchas robadas y las cámaras del centro delataron a los implicados. Las autoridades y el Tribunal dictaminaron 1 AÑO DE SUSPENSIÓN TOTAL para La Normal."
      }
    },
    {
      id: "normal_no_robar",
      texto: "Negarte a participar y responder al cartel del Nacional tocando mejor en la pista",
      descripcion: "Cuidar a La Normal, evitar a la policía y no caer en la provocación del cartel rival.",
      riesgo: "Bajo",
      probabilidad: 1.0,
      exito: {
        ritmo: +4,
        hinchada: +3,
        resistencia: +4,
        overall: +3,
        mensaje: "Actitud madura y ejemplar. No caíste en la trampa del cartel provocador, evitaste la clausura del colegio y la scola concentró toda su energía en la música."
      }
    }
  ]
};

export const EVENTO_ESPECIAL_NACIONAL_MOLOTOV = {
  id: "evento_especial_nacional_molotov",
  fase: "sorpresa",
  faseNombre: "Tensión Histórica de la Estudiantina",
  titulo: "🚨 Ataque con Bombas Molotov a La Normal (Venganza por las Chanchas)",
  categoria: "urgencia",
  descripcion: "¡El escándalo sacude a Posadas! En venganza por los carteles de la prueba piloto, un grupo comando de La Normal se infiltró en el galpón y les robó las chanchas pesadas al Nacional, dejándolos desarmados a días del desfile. La furia y la humillación desbordan a un sector enardecido de la hinchada del Nacional, que preparó botellas con combustible (bombas molotov) para arrojarlas frente a la Escuela Normal en señal de represalia extrema. Te instan a sumarte al ataque. ¿Qué decidís hacer?",
  opciones: [
    {
      id: "nacional_tirar_molotov",
      texto: "Sumarte a la represalia armada y arrojar las bombas molotov contra La Normal",
      descripcion: "Venganza ciega por el robo de las chanchas: 50% de chances de zafar en la confusión, o 50% de recibir 1 año de suspensión disciplinaria y causa penal.",
      riesgo: "Alto",
      probabilidad: 0.50,
      exito: {
        ritmo: +3,
        hinchada: +8,
        resistencia: +2,
        overall: +2,
        mensaje: "¡ZAFARON EN LA CONFUSIÓN! El estallido y el fuego causaron pánico, pero la multitud se dispersó en la noche sin detenidos identificados. El tribunal abrió sumario pero no hubo sanción firme."
      },
      fracaso: {
        ritmo: -4,
        hinchada: +2,
        resistencia: -5,
        overall: -4,
        esSuspensionAPES: true,
        bancarSuspension: true,
        duracionSancion: 1,
        motivoSuspension: "bombas_molotov",
        mensaje: "🚨 ¡ESCÁNDALO Y CLAUSURA DISCIPLINARIA! La policía intervino de inmediato e identificó a los responsables con botellas de nafta. El tribunal dictaminó 1 AÑO DE SUSPENSIÓN INMEDIATA para El Nacional."
      }
    },
    {
      id: "nacional_no_molotov",
      texto: "Repudiar el ataque con fuego y exigir recuperar las chanchas tocando con orgullo en la Costanera",
      descripcion: "Defender la tradición centenaria del Martín de Moussy sin caer en la locura de la violencia.",
      riesgo: "Bajo",
      probabilidad: 1.0,
      exito: {
        ritmo: +5,
        hinchada: +4,
        resistencia: +4,
        overall: +4,
        mensaje: "Demostraste la verdadera grandeza del Nacional. Pese a la impotencia por el robo de las chanchas, frenaste una tragedia, salvaste al colegio de la clausura y canalizaron la bronca en un toque demoledor."
      }
    }
  ]
};

// =========================================================================
// 9. GENERADOR INTELIGENTE DE EVENTOS POR TEMPORADA (EXPANDIDO Y BALANCEADO)
// =========================================================================

function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Arma los 5 eventos de la temporada con alta variedad adaptados a:
 * - Si es DIRECTOR/A: eventos exclusivos con silbato de oro y jefatura de scola.
 * - Si es PILAR: eventos de cacique de fila, calibración y liderazgo percusivo.
 * - Si es ROL REGULAR: enorme catálogo de eventos buenos, malos, escolares y de instrumento.
 * - NUNCA repite la misma secuencia en diferentes temporadas.
 */
export function getEventosPorTemporada({ anio, rolId, rubroId, esPilar, esDirector, colegio }) {
  const anioKey = Math.min(4, Math.max(1, anio || 1));
  const baseFases = EVENTOS_POR_FASE[anioKey];
  const colegioId = colegio?.id || "";

  let eventoEnsayos = null;
  let eventoPiloto = null;
  let eventoSorpresa = null;
  let eventoCalle = null;
  let eventoAnfi = null;

  // =========================================================================
  // RAMA CUERPO DE BAILE (Eventos 100% dedicados a danza, coreografía y vestuario)
  // =========================================================================
  if (rubroId === "baile") {
    // CASO B1: DIRECTORA GENERAL DE CUERPO DE BAILE
    if (esDirector) {
      eventoEnsayos = pickRandom(EVENTOS_DIRECTORA_BAILE.ensayos);
      eventoPiloto = pickRandom(EVENTOS_DIRECTORA_BAILE.prueba_piloto);
      eventoSorpresa = pickRandom(EVENTOS_DIRECTORA_BAILE.sorpresas);
      eventoCalle = pickRandom(EVENTOS_DIRECTORA_BAILE.noches_calle);
      eventoAnfi = pickRandom(EVENTOS_DIRECTORA_BAILE.anfiteatro);
    }
    // CASO B2: BASTONERA DE BANDA / PASISTA DESTAQUE
    else if (esPilar) {
      eventoEnsayos = pickRandom(EVENTOS_BASTONERA.ensayos);
      eventoPiloto = pickRandom(EVENTOS_BASTONERA.prueba_piloto);
      eventoSorpresa = pickRandom(EVENTOS_BASTONERA.sorpresas);
      eventoCalle = pickRandom(EVENTOS_BASTONERA.noches_calle);
      eventoAnfi = pickRandom(EVENTOS_BASTONERA.anfiteatro);
    }
    // CASO B3: PASISTA REGULAR (Escuadra, Espaldar)
    else {
      // 1. ENSAYOS DE BAILE
      if (rolId && EVENTOS_POR_ROL[rolId]?.ensayo && Math.random() < 0.35) {
        eventoEnsayos = EVENTOS_POR_ROL[rolId].ensayo;
      } else {
        eventoEnsayos = pickRandom(EVENTOS_BAILE_FASES.ensayos);
      }

      // 2. PRUEBA PILOTO DE BAILE
      if (rolId && EVENTOS_POR_ROL[rolId]?.prueba_piloto && Math.random() < 0.35) {
        eventoPiloto = EVENTOS_POR_ROL[rolId].prueba_piloto;
      } else {
        eventoPiloto = pickRandom(EVENTOS_BAILE_FASES.prueba_piloto);
      }

      // 3. EVENTO SORPRESA DE BAILE
      const sorpresasRol = rolId ? EVENTOS_SORPRESA_POR_ROL[rolId] : null;
      if (sorpresasRol && sorpresasRol.length > 0 && Math.random() < 0.35) {
        eventoSorpresa = pickRandom(sorpresasRol);
      } else {
        eventoSorpresa = pickRandom(EVENTOS_SORPRESA_BAILE);
      }

      // 4. NOCHES DE CALLE DE BAILE
      if (rolId && EVENTOS_POR_ROL[rolId]?.calle && Math.random() < 0.35) {
        eventoCalle = EVENTOS_POR_ROL[rolId].calle;
      } else {
        eventoCalle = pickRandom(EVENTOS_BAILE_FASES.noches_calle);
      }

      // 5. ANFITEATRO DE BAILE
      if (rolId && EVENTOS_POR_ROL[rolId]?.anfi && Math.random() < 0.35) {
        eventoAnfi = EVENTOS_POR_ROL[rolId].anfi;
      } else {
        eventoAnfi = pickRandom(EVENTOS_BAILE_FASES.anfiteatro);
      }
    }

    // Fallbacks seguros de baile
    if (!eventoEnsayos) eventoEnsayos = pickRandom(EVENTOS_BAILE_FASES.ensayos);
    if (!eventoPiloto) eventoPiloto = pickRandom(EVENTOS_BAILE_FASES.prueba_piloto);
    if (!eventoSorpresa) eventoSorpresa = pickRandom(EVENTOS_SORPRESA_BAILE);
    if (!eventoCalle) eventoCalle = pickRandom(EVENTOS_BAILE_FASES.noches_calle);
    if (!eventoAnfi) eventoAnfi = pickRandom(EVENTOS_BAILE_FASES.anfiteatro);
  }
  // =========================================================================
  // RAMA BANDA DE MÚSICA (Percusión tradicional)
  // =========================================================================
  else {
    // CASO 1: DIRECTOR / DIRECTORA GENERAL (Eventos de máxima jerarquía y silbato de oro)
    if (esDirector) {
      eventoEnsayos = pickRandom(EVENTOS_DIRECTOR.ensayos);
      eventoPiloto = pickRandom(EVENTOS_DIRECTOR.prueba_piloto);
      eventoSorpresa = pickRandom(EVENTOS_DIRECTOR.sorpresas);
      eventoCalle = pickRandom(EVENTOS_DIRECTOR.noches_calle);
      eventoAnfi = pickRandom(EVENTOS_DIRECTOR.anfiteatro);
    }
    // CASO 2: PILAR DE FILA (Eventos de cacique de instrumento y guía rítmico)
    else if (esPilar) {
      eventoEnsayos = pickRandom(EVENTOS_PILAR.ensayos);
      eventoPiloto = pickRandom(EVENTOS_PILAR.prueba_piloto);
      eventoSorpresa = pickRandom(EVENTOS_PILAR.sorpresas);
      eventoCalle = pickRandom(EVENTOS_PILAR.noches_calle);
      eventoAnfi = pickRandom(EVENTOS_PILAR.anfiteatro);
    }
    // CASO 3: INTEGRANTE REGULAR (Con enorme variedad de eventos por fases)
    else {
      // 1. ENSAYOS: 35% colegio si existe, 20% rol específico, resto pool variado de ensayos
      const eventosCol = EVENTOS_UNICOS_COLEGIO[colegioId];
      const colEnsayos = eventosCol ? eventosCol.filter(e => !e.fase || e.fase === "ensayos") : [];
      if (colEnsayos.length > 0 && Math.random() < 0.35) {
        eventoEnsayos = pickRandom(colEnsayos);
      } else if (rolId && EVENTOS_POR_ROL[rolId]?.ensayo && Math.random() < 0.25) {
        eventoEnsayos = EVENTOS_POR_ROL[rolId].ensayo;
      } else {
        const poolEnsayos = [baseFases.ensayos, ...EVENTOS_POOL_FASES.ensayos];
        eventoEnsayos = pickRandom(poolEnsayos);
      }

      // 2. PRUEBA PILOTO: 30% colegio si existe, 25% rol específico, resto pool variado de piloto
      const colPiloto = eventosCol ? eventosCol.filter(e => e.fase === "prueba_piloto") : [];
      if (colPiloto.length > 0 && Math.random() < 0.30) {
        eventoPiloto = pickRandom(colPiloto);
      } else if (rolId && EVENTOS_POR_ROL[rolId]?.prueba_piloto && Math.random() < 0.25) {
        eventoPiloto = EVENTOS_POR_ROL[rolId].prueba_piloto;
      } else {
        const poolPiloto = [baseFases.prueba_piloto, ...EVENTOS_POOL_FASES.prueba_piloto];
        eventoPiloto = pickRandom(poolPiloto);
      }

      // 3. EVENTO SORPRESA (Mala suerte o Buena suerte): Catálogo masivo con alta alternancia
      const sorpresasRol = rolId ? EVENTOS_SORPRESA_POR_ROL[rolId] : null;
      if (sorpresasRol && sorpresasRol.length > 0 && Math.random() < 0.20) {
        eventoSorpresa = pickRandom(sorpresasRol);
      } else {
        eventoSorpresa = getRandomEventoSorpresa({ rolId, colegio });
      }

      // 4. NOCHES DE CALLE: 30% colegio si existe, 25% rol específico, resto pool variado de noches de calle
      const colCalle = eventosCol ? eventosCol.filter(e => e.fase === "noches_calle") : [];
      if (colCalle.length > 0 && Math.random() < 0.30) {
        eventoCalle = pickRandom(colCalle);
      } else if (rolId && EVENTOS_POR_ROL[rolId]?.calle && Math.random() < 0.25) {
        eventoCalle = EVENTOS_POR_ROL[rolId].calle;
      } else {
        const poolCalle = [baseFases.noches_calle, ...EVENTOS_POOL_FASES.noches_calle];
        eventoCalle = pickRandom(poolCalle);
      }

      // 5. ANFITEATRO: 25% rol específico, 75% pool variado de anfiteatro
      if (rolId && EVENTOS_POR_ROL[rolId]?.anfi && Math.random() < 0.25) {
        eventoAnfi = EVENTOS_POR_ROL[rolId].anfi;
      } else {
        const poolAnfi = [baseFases.anfiteatro, ...EVENTOS_POOL_FASES.anfiteatro];
        eventoAnfi = pickRandom(poolAnfi);
      }
    }

    // Fallbacks seguros por si cualquier elemento resulta nulo
    if (!eventoEnsayos) eventoEnsayos = baseFases.ensayos;
    if (!eventoPiloto) eventoPiloto = baseFases.prueba_piloto;
    if (!eventoSorpresa) eventoSorpresa = getRandomEventoSorpresa({ rolId, colegio });
    // Evento especial de rivalidad histórica reciente:
    // La Normal le roba las chanchas al Nacional / El Nacional tira molotov a La Normal
    // 25% de probabilidad de ocurrir para cada institución en cualquier temporada
    if (colegioId === "normal_mixta" && Math.random() < 0.25) {
      eventoSorpresa = EVENTO_ESPECIAL_NORMAL_ROBO_CHANCHAS;
    } else if (colegioId === "nacional" && Math.random() < 0.25) {
      eventoSorpresa = EVENTO_ESPECIAL_NACIONAL_MOLOTOV;
    }

    if (!eventoCalle) eventoCalle = baseFases.noches_calle;
    if (!eventoAnfi) eventoAnfi = baseFases.anfiteatro;
  }

  const listaEventos = [
    eventoEnsayos,
    eventoPiloto,
    eventoSorpresa,
    eventoCalle,
    eventoAnfi
  ];

  // Salvaguarda absoluta: NUNCA permitir un evento con menos de 2 opciones
  listaEventos.forEach(ev => {
    if (ev && (!ev.opciones || ev.opciones.length < 2)) {
      if (!ev.opciones) ev.opciones = [];
      if (ev.opciones.length === 1) {
        ev.opciones.push({
          id: "opcion_segura_conservadora",
          texto: "Mantener el paso firme, asegurar el compás y no arriesgar la pasada",
          descripcion: "Priorizar la disciplina y el temple colectivo del colegio.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +2,
            resistencia: +3,
            overall: +2,
            mensaje: "Sostuviste el ritmo con serenidad y prolijidad."
          }
        });
      }
    }
  });

  return listaEventos;
}

export function getRandomEventoSorpresa(contexto = {}) {
  const rolId = contexto.rolId;
  let evento = null;
  // Si el rol tiene eventos de mala suerte específicos, considerarlos
  if (rolId && EVENTOS_SORPRESA_POR_ROL[rolId]?.length > 0 && Math.random() < 0.35) {
    const lista = EVENTOS_SORPRESA_POR_ROL[rolId];
    evento = pickRandom(lista);
  } else {
    evento = pickRandom(EVENTOS_SORPRESA);
  }

  if (!evento) {
    evento = EVENTOS_SORPRESA[0];
  }

  if (evento && (!evento.opciones || evento.opciones.length < 2)) {
    if (!evento.opciones) evento.opciones = [];
    if (evento.opciones.length === 1) {
      evento.opciones.push({
        id: "opcion_segura_conservadora_sorpresa",
        texto: "Mantener la calma, respirar hondo y resolver con sobriedad",
        descripcion: "No desesperarse ante la urgencia y seguir tocando.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +2,
          hinchada: +2,
          resistencia: +2,
          overall: +2,
          mensaje: "Resolviste el imprevisto con madurez de veterano."
        }
      });
    }
  }

  return evento;
}
