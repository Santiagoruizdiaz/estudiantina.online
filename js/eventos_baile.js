/**
 * EVENTOS EXCLUSIVOS PARA EL MODO CUERPO DE BAILE
 * Estudiantina de Posadas - Misiones
 * 
 * Contiene eventos especializados para la danza, coreografías, trajes,
 * espaldares de plumas, bastoneras solistas, desfile en la Costanera
 * y el gran cierre en el Anfiteatro Manuel Antonio Ramírez.
 */

// =========================================================================
// 1. EVENTOS POR ROL DE BAILE (Ensayo, Prueba Piloto, Calle, Anfiteatro)
// =========================================================================

export const EVENTOS_POR_ROL_BAILE = {
  // ---- PASISTA DE ESCUADRA (Ala Central / Baile en Bloque) ----
  pasista_escuadra: {
    ensayo: {
      id: "rol_pasista_escuadra_ensayo",
      fase: "ensayos",
      faseNombre: "Playón de Ensayos (Escuadra Central)",
      titulo: "Sincronía de Escuadra bajo el Sol del Playón",
      categoria: "ensayo",
      descripcion: "Son las 15:30 hs y el sol misionero hace arder el cemento del playón escolar. La coreógrafa exige repetir la bajada de brazos y el paso de samba en 8 tiempos 25 veces consecutivas hasta que las 30 pasistas parezcan una sola.",
      opciones: [
        {
          id: "escuadra_perfeccion",
          texto: "Marcar cada compás con sonrisa intacta y precisión milimétrica",
          descripcion: "Priorizar la estética y el ángulo exacto de brazos y piernas.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Líneas perfectas! La escuadra lució como un bloque hipnótico. La directora te felicitó frente a todas."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: -2,
            overall: 0,
            mensaje: "El calor del playón te recalentó los pies con las zapatillas de lona, pero terminaste la rutina completa."
          }
        },
        {
          id: "escuadra_alentar",
          texto: "Arengar a tus compañeras más cansadas para no desarmar la fila",
          descripcion: "Fortalecer la moral colectiva de la escuadra en el peor momento del ensayo.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +4,
            overall: +3,
            mensaje: "¡Espíritu de scola inquebrantable! El grupo entero sacó fuerzas de donde no había y terminaron cantando."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_pasista_escuadra_piloto",
      fase: "prueba_piloto",
      faseNombre: "Cabecera del 4to Tramo (Prueba Piloto)",
      titulo: "El Asfalto del 4to Tramo y la Primera Marcha",
      categoria: "calle",
      descripcion: "Es la primera vez que pisan el asfalto oficial de la Costanera con la formación completa. El silbato oficial de largada suena y la banda arranca con un corte rápido; la escuadra debe avanzar sin tropezar en los ojos de gato del piso.",
      opciones: [
        {
          id: "escuadra_paso_firme",
          texto: "Marcar el paso de avance saltando las imperfecciones del asfalto con gracia",
          descripcion: "Sostener el ritmo de la marcha sin perder jamás la sonrisa hacia las vallas.",
          riesgo: "Medio",
          probabilidad: 0.80,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Pasada brillante! El público en las vallas ovacionó el dinamismo y la elegancia de tu escuadra."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "Pisaste un desnivel en el cordón pero te recuperaste de inmediato con una pose airosa."
          }
        },
        {
          id: "escuadra_mirada_palco",
          texto: "Clavar la mirada en los jurados oficiales y seducir con expresión teatral",
          descripcion: "Demostrar que el carisma y la presencia escénica mandan en la Costanera.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "Los jurados tomaron notas con sonrisas de aprobación en sus planillas de evaluación artística."
          }
        }
      ]
    },
    calle: {
      id: "rol_pasista_escuadra_calle",
      fase: "noches_calle",
      faseNombre: "Palco 1 - Noche Oficial de Calle",
      titulo: "El Resplandor del Palco 1 ante las Cámaras",
      categoria: "desfile",
      descripcion: "Las torres de iluminación del Palco 1 encandilan. Miles de personas se agolpan contra las vallas y las cámaras de televisión transmiten en vivo a toda la provincia. La banda detona el corte principal y la escuadra se abre en abanico.",
      opciones: [
        {
          id: "escuadra_giro_abanico",
          texto: "Clavar el giro de 360 grados al unísono y abrir los brazos al cielo",
          descripcion: "El movimiento estelar de la escuadra que requiere coordinación absoluta al compás.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "¡DELIRIO TOTAL EN LA COSTANERA! La coreografía en abanico salió perfecta y las tribunas estallaron en aplausos."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "El giro quedó ligeramente desfasado en la última fila, pero la energía del desfile compensó la pasada."
          }
        },
        {
          id: "escuadra_energia_pura",
          texto: "Bailar con el alma, sonreír a las cámaras y dejar todo en el asfalto",
          descripcion: "Transmitir la pasión auténtica de la juventud misionera sin especular.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Sos el alma de la scola! Tu sonrisa salió en primer plano en el noticiero central de Posadas."
          }
        }
      ]
    },
    anfi: {
      id: "rol_pasista_escuadra_anfi",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro Manuel Antonio Ramírez",
      titulo: "La Gran Formación en las Gradas del Alcibíades Alarcón",
      categoria: "show",
      descripcion: "El telón imaginario se abre en el histórico escenario de piedra. Con el río Paraná de fondo y 5000 personas en las gradas, la escuadra debe desplegar el cuadro final ocupando todos los niveles del escenario.",
      opciones: [
        {
          id: "escuadra_salto_gradas",
          texto: "Ejecutar la coreografía bajando los escalones de piedra con gracia y ritmo",
          descripcion: "Arriesgar en el escenario vertical más imponente de Misiones.",
          riesgo: "Medio",
          probabilidad: 0.80,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +4,
            overall: +6,
            mensaje: "¡OVACIÓN DE PIE EN EL ANFITEATRO! El descenso sincronizado fue una obra de arte visual aplaudida por todo Posadas."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "El escalón de piedra estaba húmedo y tuviste que moderar el salto, pero la formación no se rompió."
          }
        },
        {
          id: "escuadra_pose_escultorica",
          texto: "Culminar el cuadro con la pose escultórica final congelada 15 segundos",
          descripcion: "Garantizar una imagen final impecable ante la mesa examinadora del jurado.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Postal dorada! Las estatuas vivientes de la escuadra arrancaron aplausos cerrados de los jurados."
          }
        }
      ]
    }
  },

  // ---- PASISTA DE ESPALDAR (Ala / Traje de Gran Porte con Plumas) ----
  pasista_ala: {
    ensayo: {
      id: "rol_pasista_ala_ensayo",
      fase: "ensayos",
      faseNombre: "Taller y Playón (Línea de Espaldares)",
      titulo: "El Peso del Espaldar de Plumas Gigante",
      categoria: "ensayo",
      descripcion: "Llegó el día de montar el arnés del espaldar completo: 12 kilos de hierro forjado, alambre, strass y plumas de faisán amazónicas de 2 metros de altura. Ajustar las correas acolchadas a los hombros y bailar sin arquear la espalda es una prueba de fuego.",
      opciones: [
        {
          id: "espaldar_postura_reina",
          texto: "Enderezar la columna, apretar el corsé y sostener el paso durante 40 compases",
          descripcion: "Desarrollar la fuerza de espalda y trapecios necesaria para lucir majestuosa.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +6,
            overall: +4,
            mensaje: "¡Porte de reina absoluta! Tus hombros resistieron el arnés con una elegancia imperial que deslumbró al taller."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -3,
            overall: 0,
            mensaje: "Las correas te rasparon la clavícula por la fricción del peso (-3 Resistencia), pero no bajaste los brazos."
          }
        },
        {
          id: "espaldar_calibrar_arnes",
          texto: "Pedir al equipo de vestuario recortar 1 kilo de estructura para ganar soltura",
          descripcion: "Equilibrar el impacto visual con la agilidad y velocidad del movimiento.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "El espaldar quedó perfectamente balanceado sobre el centro de gravedad. Podés girar con total fluidez."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_pasista_ala_piloto",
      fase: "prueba_piloto",
      faseNombre: "Cabecera de la Costanera (Prueba Piloto)",
      titulo: "Resistencia al Viento Cruzado en la Rotonda",
      categoria: "calle",
      descripcion: "En la rotonda del Papa, la brisa del río Paraná sopla con ráfagas traicioneras de 35 km/h. Las plumas gigantes del espaldar actúan como una vela de barco que empuja tu cuerpo hacia un costado. Tenés que desfilar recta ante las autoridades organizadoras.",
      opciones: [
        {
          id: "espaldar_anclar_paso",
          texto: "Bajar el centro de gravedad y bailar con fuerza en los gemelos contra el viento",
          descripcion: "Dominar la aerodinámica del traje con pura potencia física y compostura.",
          riesgo: "Medio",
          probabilidad: 0.78,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Dominio total! Cruzaste la rotonda como un navío dorado sin tambalear ni un centímetro."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Una ráfaga repentina te inclinó unos segundos, pero recuperaste la vertical con un giro teatral."
          }
        },
        {
          id: "espaldar_giro_teatral",
          texto: "Aprovechar la fuerza del viento para girar las plumas en un remolino visual",
          descripcion: "Convertir la dificultad climática en un recurso escénico impactante.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Genio artístico! Las plumas flamearon al compás del viento como un espectáculo de la naturaleza."
          }
        }
      ]
    },
    calle: {
      id: "rol_pasista_ala_calle",
      fase: "noches_calle",
      faseNombre: "Palco 2 y 3 - Noches de Calle",
      titulo: "Desfile de Gala con Espaldar Imponente en Calle",
      categoria: "desfile",
      descripcion: "Es la segunda noche oficial. El asfalto todavía retiene el calor de la tarde, pero el murmullo de la Costanera se convierte en rugido cuando asoma tu espaldar iluminado por tiras micro-LED camufladas entre las plumas y lentejuelas.",
      opciones: [
        {
          id: "espaldar_giro_360",
          texto: "Clavar un giro completo de 360 grados frente a la tribuna central",
          descripcion: "Lucir los detalles de ambos lados de la estructura con una apertura majestuosa.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡BELLEZA COLOSAL! El destello de las plumas y los brillos cegó de admiración al público y al jurado."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "El peso del arnés te exigió un esfuerzo titánico en la cintura, pero completaste la pasada de gala."
          }
        },
        {
          id: "espaldar_caminar_reina",
          texto: "Sostener una marcha regia con zancadas largas, pecho al frente y sonrisa seductora",
          descripcion: "Priorizar la distinción y la presencia de alta costura sobre los saltos continuos.",
          riesgo: "Bajo",
          probabilidad: 0.93,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "Elegancia pura. La hinchada coreó tu apodo y el palco oficial te dedicó un aplauso de pie."
          }
        }
      ]
    },
    anfi: {
      id: "rol_pasista_ala_anfi",
      fase: "anfiteatro",
      faseNombre: "Cierre en el Anfiteatro",
      titulo: "Apertura de Alas en el Escenario Mayor de Posadas",
      categoria: "show",
      descripcion: "Bajo los potentes cañones de luces del Anfiteatro, tu espaldar ocupa el punto más alto del escenario de piedra. La percusión entra en el clímax de la scola y es el momento del despliegue final de vestuario.",
      opciones: [
        {
          id: "espaldar_despliegue_maximo",
          texto: "Abrir las extensiones articuladas del espaldar al ritmo del golpe de chancha",
          descripcion: "El mecanismo manual que expande el traje a 3 metros de ancho sobre el escenario.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡MONUMENTAL! El anfiteatro entero contuvo el aliento antes de estallar en una ovación histórica."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +4,
            resistencia: -1,
            overall: +2,
            mensaje: "El ala izquierda tardó medio segundo en trabar, pero el efecto visual fue igualmente arrebatador."
          }
        },
        {
          id: "espaldar_baile_intenso_anfi",
          texto: "Bailar con saltos enérgicos demostrando que el peso del espaldar no frena tu ritmo",
          descripcion: "Demostrar que una pasista de espaldar tiene tanta o más agilidad que una de escuadra.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Furia y gracia! El jurado calificó con puntaje perfecto la resistencia y el despliegue físico."
          }
        }
      ]
    }
  },

  // ---- BASTONERA DE BANDA / PASISTA DESTAQUE (Figura Estelar / Solista) ----
  bastonera_banda: {
    ensayo: {
      id: "rol_bastonera_ensayo",
      fase: "ensayos",
      faseNombre: "Playón Central (Entrenamiento de Solistas)",
      titulo: "El Giro de Bastón a Doble Tiempo y Lanzamiento Aéreo",
      categoria: "ensayo",
      descripcion: "Como bastonera de banda, vas sola al frente abriendo el paso de la institución. Estás practicando el lanzamiento vertical de 5 metros de altura con recepción por la espalda al compás del redoble más rápido del colegio.",
      opciones: [
        {
          id: "baston_lanzamiento_alto",
          texto: "Lanzar el bastón metálico a 5 metros y atraparlo tras un giro acrobático",
          descripcion: "La maniobra de riesgo supremo que define a las leyendas de la Costanera.",
          riesgo: "Alto",
          probabilidad: 0.75,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +3,
            overall: +6,
            mensaje: "¡CALCULADORA HUMANA! El bastón voló por los cielos del playón y cayó en tu mano como imán. Todos aplaudieron."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "El bastón se te escapó por el sudor y golpeó en el asfalto. Te raspaste la palma pero volviste a intentar."
          }
        },
        {
          id: "baston_rutina_suelo",
          texto: "Perfeccionar el juego de muñeca a ras del cuerpo con cambios veloces de mano",
          descripcion: "Asegurar una rutina vertiginosa, vistosa e infalible sin riesgo de caídas.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Velocidad supersónica! El bastón parecía una hélice metálica brillante en tus dedos."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_bastonera_piloto",
      fase: "prueba_piloto",
      faseNombre: "Cabecera Oficial (Prueba Piloto)",
      titulo: "Lanzamiento y Viento en Cabecera de Pista",
      categoria: "calle",
      descripcion: "El banderillero de pista da la orden. Al salir primero a la pista, sentís todas las miradas de los delegados estudiantiles clavadas en tu figura. El viento costero pone a prueba tu cálculo en cada giro del bastón.",
      opciones: [
        {
          id: "baston_medir_viento",
          texto: "Ajustar la inclinación del lanzamiento compensando la deriva de la brisa",
          descripcion: "Técnica pura de bastonera experimentada frente a las vallas del 4to tramo.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Precisión quirúrgica! El bastón cayó exacto en tu puño y la cabecera completa rugió de emoción."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "El viento desplazó el bastón unos centímetros y tuviste que dar dos pasos rápidos para atraparlo."
          }
        },
        {
          id: "baston_conexion_tribuna",
          texto: "Interactuar con los chicos de la valla, guiñando un ojo y marcando el paso",
          descripcion: "El carisma de la figura solista que conquista los corazones de Posadas.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +3,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Carisma desbordante! Toda la hinchada coreó tu nombre desde la primera cuadra."
          }
        }
      ]
    },
    calle: {
      id: "rol_bastonera_calle",
      fase: "noches_calle",
      faseNombre: "Palco Central - Noche Oficial",
      titulo: "Show Aéreo Frente a la Tribuna Oficial y Jurados",
      categoria: "desfile",
      descripcion: "Llegás al Palco Central. La scola hace un silencio de dos compases y el director de banda te señala: es el solo de la bastonera. Si clavás el triple giro en el aire, el colegio saca ventaja decisiva en el rubro.",
      opciones: [
        {
          id: "baston_triple_giro",
          texto: "Lanzar el bastón con fuerza centrífuga, hacer doble pirueta en el asfalto y atraparlo",
          descripcion: "La acrobacia más difícil y gloriosa de toda la Estudiantina posadeña.",
          riesgo: "Alto",
          probabilidad: 0.72,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +3,
            overall: +6,
            mensaje: "¡LOCURA TOTAL! El bastón brilló bajo los reflectores y lo atrapaste de espaldas. El palco de jurados se puso de pie."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "El bastón rebotó en el suelo, pero hiciste una reverencia de reina con una sonrisa radiante y continuaste sin achicarte."
          }
        },
        {
          id: "baston_coreo_elegante",
          texto: "Ejecutar una secuencia gimnástica en suelo con giros rápidos y saltos divididos",
          descripcion: "Priorizar la plasticidad y la coordinación sin depender del vuelo aéreo.",
          riesgo: "Bajo",
          probabilidad: 0.91,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Flexibilidad y armonía perfecta! El jurado de baile anotó notas sobresalientes."
          }
        }
      ]
    },
    anfi: {
      id: "rol_bastonera_anfi",
      fase: "anfiteatro",
      faseNombre: "Gran Final en el Anfiteatro",
      titulo: "Solo Acrobático en el Cierre del Anfiteatro",
      categoria: "show",
      descripcion: "El cañón seguidor de luz te ilumina en el centro del escenario de piedra. La banda hace un corte vertiginoso y todo el anfiteatro te mira en absoluto silencio esperando tu truco cumbre.",
      opciones: [
        {
          id: "baston_truco_cumbre",
          texto: "Lanzamiento doble bastón iluminado a la noche posadeña",
          descripcion: "Desafiar los límites de la destreza frente a 5000 almas.",
          riesgo: "Alto",
          probabilidad: 0.74,
          exito: {
            ritmo: +8,
            hinchada: +8,
            resistencia: +4,
            overall: +7,
            mensaje: "¡HISTORIA PURA DE LA ESTUDIANTINA! Los dos bastones cayeron sincronizados en tus manos y el anfiteatro rugió."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +4,
            resistencia: -1,
            overall: +2,
            mensaje: "Atrapaste uno con la mano y el otro rodó en las gradas, pero tu presencia escénica salvó el momento."
          }
        },
        {
          id: "baston_giro_vertiginoso",
          texto: "Giro continuo de bastón cruzado en rodilla y espalda a máxima velocidad",
          descripcion: "Asegurar un cierre demoledor que deje al público con la boca abierta.",
          riesgo: "Bajo",
          probabilidad: 0.93,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Impecable! Un final soñado para coronar una temporada estelar como Bastonera."
          }
        }
      ]
    }
  },

  // ---- DIRECTORA DE CUERPO DE BAILE (Jefatura Suprema / Coreógrafa General) ----
  directora_baile: {
    ensayo: {
      id: "rol_directora_baile_ensayo",
      fase: "ensayos",
      faseNombre: "Playón y Aulas (Jefatura de Cuerpo de Baile)",
      titulo: "El Diseño Coreográfico del Desplazamiento",
      categoria: "liderazgo",
      descripcion: "Como Directora General de Cuerpo de Baile, tenés bajo tu mando a 80 pasistas, 4 escuadras y el staff de vestuario. Tenés que definir si la scola apostará a una coreografía clásica de ritmo continuo o a un cambio temático rupturista.",
      opciones: [
        {
          id: "dir_coreo_tematica_audaz",
          texto: "Apostar a un cuadro temático vanguardista con pausas dramáticas y cambios de ritmo",
          descripcion: "Diseñar una propuesta artística que busque el 1º puesto indiscutido de la competencia.",
          riesgo: "Medio",
          probabilidad: 0.80,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Visión magistral! El ensamble de escuadras funcionó como un ballet profesional. Las chicas te ovacionaron."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "A dos escuadras les costó memorizar los cambios y tuviste que quedarte hasta las 21 hs puliendo detalles."
          }
        },
        {
          id: "dir_coreo_clasica_efectiva",
          texto: "Consolidar pasos tradicionales de samba y marcha que todas dominen a la perfección",
          descripcion: "Garantizar sincronía absoluta, cero errores y alegría desbordante.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Sincronía como reloj suizo! La seguridad que transmitís contagió de confianza a todo el cuerpo de baile."
          }
        }
      ]
    },
    prueba_piloto: {
      id: "rol_directora_baile_piloto",
      fase: "prueba_piloto",
      faseNombre: "Costanera (Mando Oficial de Pista)",
      titulo: "Ajuste de Distancias y Tiempos de Pasada",
      categoria: "calle",
      descripcion: "El comisario general de pista te controla con el cronómetro oficial en la mano. La banda acelera el paso y el cuerpo de baile corre riesgo de estirarse demasiado, dejando huecos antiestéticos frente al palco.",
      opciones: [
        {
          id: "dir_ajustar_lineas_silbato",
          texto: "Tocar tu silbato de mando, hacer señas con los brazos y compactar las escuadras en 10 segundos",
          descripcion: "Liderazgo en tiempo real bajo máxima presión reglamentaria.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Mando de hierro! Las escuadras se cerraron con disciplina militar sin perder el compás de baile."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -1,
            overall: +1,
            mensaje: "El ala izquierda tardó en reaccionar, pero lograste entrar al palco dentro del tiempo estricto."
          }
        },
        {
          id: "dir_coordinar_director_banda",
          texto: "Hacer contacto visual con el Director de Banda para que modere los BPM",
          descripcion: "Garantizar la armonía perfecta entre la música y la danza escolar.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Pacto de titanes! La banda bajó dos compases y la scola entera desfiló con holgura y brillo."
          }
        }
      ]
    },
    calle: {
      id: "rol_directora_baile_calle",
      fase: "noches_calle",
      faseNombre: "Palco de Coreografía - Noches Oficiales",
      titulo: "Comandar a 80 Pasistas Frente al Jurado de Danza",
      categoria: "desfile",
      descripcion: "Llegó el palco más temido: el Palco de Jurados de Coreografía y Estética. Al frente de la scola, con tu silbato y tu banda de directora sobre el pecho, tenés que ordenar la transición al cuadro estelar del desfile.",
      opciones: [
        {
          id: "dir_cuadro_estelar_palco",
          texto: "Dar la señal secreta para el quiebre coreográfico sincronizado con el corte de banda",
          descripcion: "El momento de la verdad para consagrar al colegio en el rubro.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +4,
            overall: +6,
            mensaje: "¡APOTEOSIS TOTAL! Las 80 pasistas rompieron filas en un despliegue celestial. Los jurados no pararon de tomar notas elogiosas."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "Dos chicas se adelantaron medio segundo en el paso, pero tu energía al frente disimuló el desajuste."
          }
        },
        {
          id: "dir_alentar_escuadras_exhaustas",
          texto: "Caminar la fila de punta a punta arengando a las pasistas con el corazón",
          descripcion: "Sostener la sonrisa y la emoción de tus compañeras que llevan 2 horas bailando.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +5,
            overall: +5,
            mensaje: "¡Líder nata! Las chicas sacaron lágrimas de emoción y bailaron con el alma hasta el final del tramo."
          }
        }
      ]
    },
    anfi: {
      id: "rol_directora_baile_anfi",
      fase: "anfiteatro",
      faseNombre: "Escenario del Anfiteatro Manuel Antonio Ramírez",
      titulo: "El Clímax de los 19 Minutos 59 Segundos",
      categoria: "show",
      descripcion: "El reloj digital gigante de cómputos descuenta hacia atrás los 20 minutos de tolerancia máxima. Si el cuadro no cierra antes del segundo 0, la scola recibe sanción de descuento de puntos. Como directora, el silbatazo final depende exclusivamente de vos.",
      opciones: [
        {
          id: "dir_cierre_quirurgico",
          texto: "Marcar la pose de cierre a los 19 minutos 45 segundos exactos con silbato en alto",
          descripcion: "Cerrar con margen de seguridad y una explosión artística impecable.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +4,
            overall: +7,
            mensaje: "¡RELOJ SUIZO Y ARTE MAYOR! El silbato sonó a los 19:48, la scola congeló la pose y todo el anfiteatro estalló en aplausos."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +4,
            resistencia: -1,
            overall: +2,
            mensaje: "Cortaron a los 19:56, rozando el límite del reglamento, pero sin penalizaciones del jurado."
          }
        },
        {
          id: "dir_discurso_camarines",
          texto: "Reunir a todo el cuerpo de baile en el camarín de piedra para el abrazo de oro",
          descripcion: "Consagrar el compañerismo y el orgullo de haber dejado todo por la camiseta escolar.",
          riesgo: "Bajo",
          probabilidad: 0.96,
          exito: {
            ritmo: +5,
            hinchada: +8,
            resistencia: +5,
            overall: +6,
            mensaje: "¡Lágrimas y gloria! La unión del grupo quedará grabada en la memoria para toda la vida."
          }
        }
      ]
    }
  }
};

// =========================================================================
// 2. EVENTOS SORPRESA POR ROL DE BAILE (Mala suerte y dilemas específicos)
// =========================================================================

export const EVENTOS_SORPRESA_POR_ROL_BAILE = {
  pasista_escuadra: [
    {
      id: "sorpresa_escuadra_suela",
      fase: "sorpresa",
      faseNombre: "Imprevisto de Pista",
      titulo: "⚠️ ¡Suela de la Botita Despegada a Mitad de Calle!",
      categoria: "urgencia",
      descripcion: "En plena pasada frente al Palco 2, la suela de tu zapatilla de baile se despegó por el calor del asfalto. Si pisás mal podés doblarte el tobillo o caerte frente a las cámaras.",
      opciones: [
        {
          id: "suela_seguir_puntas",
          texto: "Bailar en puntas de pie apoyando solo el metatarso con una sonrisa de acero",
          descripcion: "Demostrar que una pasista de verdad no se rinde ante nada.",
          riesgo: "Alto",
          probabilidad: 0.70,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Heroína de la pista! Nadie notó la rotura y tu entereza arrancó aplausos de quienes lo vieron."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +3,
            resistencia: -4,
            overall: -1,
            mensaje: "Terminaste con una ampolla sangrante en el pie por el asfalto ardiente (-4 Resistencia)."
          }
        },
        {
          id: "suela_cinta_staff",
          texto: "Aprovechar un corte estático para que el staff te encinte la bota en 5 segundos",
          descripcion: "Resolver el problema técnico rápido con ayuda de las madres y colaboradores.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +2,
            overall: +2,
            mensaje: "La cinta adhesiva negra aguantó firme hasta la rotonda y pudiste bailar con seguridad."
          }
        }
      ]
    },
    {
      id: "sorpresa_escuadra_calambre",
      fase: "sorpresa",
      faseNombre: "Exigencia Física Extrema",
      titulo: "⚠️ ¡Calambre Feroz de Gemelo por el Asfalto Caliente!",
      categoria: "urgencia",
      descripcion: "Llevás 40 minutos saltando en el asfalto a 32 grados de sensación térmica. El gemelo derecho se te endurece como una piedra justo cuando la banda cambia a la marcha más rápida.",
      opciones: [
        {
          id: "calambre_disimular_ritmo",
          texto: "Flexionar la pierna en movimiento, disimular el dolor y bailar con la cintura",
          descripcion: "Mantener la simetría de la escuadra sin delatar el sufrimiento físico.",
          riesgo: "Medio",
          probabilidad: 0.75,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Puro temple y coraje! El músculo cedió poco a poco y lograste disimular el calambre."
          },
          fracaso: {
            ritmo: -2,
            hinchada: +2,
            resistencia: -3,
            overall: -1,
            mensaje: "Tuviste que frenar dos compases para elongar el talón contra el asfalto (-2 Ritmo)."
          }
        },
        {
          id: "calambre_recibir_sal",
          texto: "Pedirle a una colaboradora de staff un sobre de sal y agua mineral en la pasada",
          descripcion: "Recuperar electrolitos de urgencia mientras seguís sonriendo a las vallas.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +4,
            overall: +3,
            mensaje: "El sodio te revivió las piernas en 2 minutos y completaste la pasada a toda máquina."
          }
        }
      ]
    },
    {
      id: "sorpresa_escuadra_tocado",
      fase: "sorpresa",
      faseNombre: "Incidente de Vestuario",
      titulo: "⚠️ ¡Las Horquillas del Tocado se Zafaron en un Giro!",
      categoria: "urgencia",
      descripcion: "Con el sudor y los movimientos enérgicos de cabeza, el tocado bordado con strass y plumas comenzó a deslizarse hacia atrás. Si se cae al piso, se rompe y los jurados restan puntos por desprolijidad.",
      opciones: [
        {
          id: "tocado_sostener_giro",
          texto: "Acomodarlo con una mano en medio de una pose elegante y seguir sonriendo",
          descripcion: "Integrar el gesto de arreglo personal como parte de la actuación teatral.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +2,
            overall: +3,
            mensaje: "¡Cintura de bailarina profesional! Pareció un ademán ensayado y el tocado quedó en su lugar."
          }
        },
        {
          id: "tocado_sacarselo_reina",
          texto: "Retirártelo con un movimiento triunfal y revolearlo al staff como una diva",
          descripcion: "Quedarte con el pelo suelto al viento y encender a la tribuna con desfachatez.",
          riesgo: "Medio",
          probabilidad: 0.80,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "¡LOCURA EN LAS VALLAS! El gesto audaz levantó a toda la tribuna al grito de ovación."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -1,
            overall: 0,
            mensaje: "La coreógrafa te miró con el ceño fruncido por alterar el reglamento de vestuario, pero salvaste la pasada."
          }
        }
      ]
    }
  ],

  pasista_ala: [
    {
      id: "sorpresa_ala_arnes",
      fase: "sorpresa",
      faseNombre: "Urgencia de Espaldar",
      titulo: "⚠️ ¡Arnés del Espaldar Descalibrado a Minutos de Largada!",
      categoria: "urgencia",
      descripcion: "Faltan 5 minutos para que la scola entre a la pista y el tornillo central del arnés de hierro cedió por el peso de las plumas. El espaldar se inclina 30 grados hacia la izquierda.",
      opciones: [
        {
          id: "arnes_precintos_urgencia",
          texto: "Asegurar la estructura con tres precintos plásticos gruesos y cinta gaffer",
          descripcion: "La solución clásica de los galpones de estudiantina para salvar la pasada.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +3,
            hinchada: +3,
            resistencia: +3,
            overall: +3,
            mensaje: "¡Ingeniería estudiantil al rescate! Los precintos aguantaron como acero y saliste impecable."
          }
        },
        {
          id: "arnes_bancar_hombro",
          texto: "Apretar los dientes y compensar la inclinación con fuerza de trapecios y cintura",
          descripcion: "Salir a la pista como sea y dejar la piel por los colores escolares.",
          riesgo: "Alto",
          probabilidad: 0.70,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Fuerza titánica! Bailaste con tal convicción que nadie notó la falla mecánica del arnés."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -4,
            overall: -1,
            mensaje: "Terminaste con una contractura cervical intensa en el cuello (-4 Resistencia)."
          }
        }
      ]
    },
    {
      id: "sorpresa_ala_pluma_rota",
      fase: "sorpresa",
      faseNombre: "Incidente de Vestuario",
      titulo: "⚠️ ¡Pluma de Faisán Gigante Quebrada por un Cable Bajo!",
      categoria: "urgencia",
      descripcion: "Al doblar en la curva de concentración, la pluma principal de 2 metros rozó un cable de sonido y quedó partida por la mitad, colgando de manera deslucida frente a los ojos del jurado.",
      opciones: [
        {
          id: "pluma_desprender_elegante",
          texto: "Desprenderla disimuladamente y entregarla al staff con una sonrisa majestuosa",
          descripcion: "Mantener la simetría del espaldar sin que se note el faltante.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "El espaldar quedó limpio y proporcionado. La gente ni se enteró del percance."
          }
        },
        {
          id: "pluma_reparar_alambre",
          texto: "Entutorar la pluma con alambre dulce fino en 20 segundos antes de largar",
          descripcion: "Salvar la pieza más costosa del traje para impresionar al jurado de estética.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Restauración perfecta! La pluma volvió a flamear erguida y cosechó aplausos de los curiosos."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "El alambre se venció a mitad de camino y la pluma bailó de lado, pero la energía del desfile tapó el defecto."
          }
        }
      ]
    }
  ],

  bastonera_banda: [
    {
      id: "sorpresa_baston_humedad",
      fase: "sorpresa",
      faseNombre: "Riesgo Acrobático",
      titulo: "⚠️ ¡Bastón Resbaladizo por el 95% de Humedad de Posadas!",
      categoria: "urgencia",
      descripcion: "La noche posadeña está cargada de humedad subtropical. El caño de acero pulido de tu bastón transpira y se te resbala entre los dedos a 30 segundos de iniciar el solo solista.",
      opciones: [
        {
          id: "baston_resina_magnesio",
          texto: "Frotarte las manos con resina vegetal o tiza de redoblante para ganar agarre",
          descripcion: "El truco de los viejos acróbatas de circo aplicado a la Estudiantina.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Grip de titanio! El bastón se pegó a tus dedos y pudiste girar a velocidad de vértigo."
          }
        },
        {
          id: "baston_adaptar_fuerza",
          texto: "Apretar más los dedos en cada giro y prescindir de los lanzamientos ciegos",
          descripcion: "Priorizar la seguridad y la elegancia sin arriesgar una caída vergonzosa.",
          riesgo: "Bajo",
          probabilidad: 0.88,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +3,
            mensaje: "Una pasada sobria, firme e impecable que aseguró los puntos sin sobresaltos."
          }
        }
      ]
    },
    {
      id: "sorpresa_baston_rebote",
      fase: "sorpresa",
      faseNombre: "Momento Crítico en Palco",
      titulo: "⚠️ ¡El Bastón Rebota en el Asfalto Frente al Palco!",
      categoria: "urgencia",
      descripcion: "En un lanzamiento de 4 metros, una ráfaga cruzada rozó la punta del bastón y este cayó golpeando contra el suelo frente a la mesa del jurado fiscalizador. Todo el 4to tramo contuvo la respiración.",
      opciones: [
        {
          id: "baston_pirueta_rescate",
          texto: "Hacer un giro gimnástico, recogerlo en el aire tras el rebote y saludar sonriendo",
          descripcion: "Transformar el error en un acto de magia y destreza teatral inigualable.",
          riesgo: "Medio",
          probabilidad: 0.78,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡GENIALIDAD ABSOLUTA! Pareció parte de la rutina y las gradas se vinieron abajo en aplausos ensordecedores."
          },
          fracaso: {
            ritmo: -1,
            hinchada: +3,
            resistencia: -1,
            overall: 0,
            mensaje: "Tuviste que agacharte a juntarlo, pero levantaste los brazos con gracia y no perdiste el compás."
          }
        },
        {
          id: "baston_reverencia_reina",
          texto: "Frenar en pose de reina, levantar el bastón con lentitud dramática y seguir con furia",
          descripcion: "Apelar al porte escénico y a la seducción para minimizar el descuido.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +2,
            overall: +3,
            mensaje: "El aplauso del público premió tu actitud digna y serena ante la adversidad."
          }
        }
      ]
    }
  ],

  directora_baile: [
    {
      id: "sorpresa_dir_descompensada",
      fase: "sorpresa",
      faseNombre: "Crisis de Conducción",
      titulo: "⚠️ ¡Pasista Descompuesta por el Calor a Mitad de Pasada!",
      categoria: "urgencia",
      descripcion: "A mitad del 4to tramo, la pasista titular del ala derecha se desmaya por el calor agobiante. El staff de primeros auxilios entra a asistirla y queda un hueco visible en la formación de escuadras frente a los jurados.",
      opciones: [
        {
          id: "dir_rediseñar_escuadra",
          texto: "Hacer una seña rápida con el silbato y redistribuir las distancias en 15 segundos",
          descripcion: "Capacidad de reacción táctica y liderazgo supremo.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Brillante resolución! La escuadra cerró filas de inmediato y el jurado felicitó tu capacidad de mando."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "La reorganización demoró unos compases pero el grupo recuperó la simetría antes del siguiente palco."
          }
        },
        {
          id: "dir_ingresar_suplente",
          texto: "Hacer ingresar a la pasista suplente que estaba lista con el traje de repuesto",
          descripcion: "Confiar en la preparación previa y en el trabajo del banco de suplentes.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "La suplente entró con una energía arrolladora y el cuadro continuó sin fisuras."
          }
        }
      ]
    },
    {
      id: "sorpresa_dir_apes_comisario",
      fase: "sorpresa",
      faseNombre: "Tensión Reglamentaria",
      titulo: "⚠️ ¡comisario de pista Amenaza con Sanción por Demora!",
      categoria: "urgencia",
      descripcion: "El comisario general de pista se acerca corriendo a tu puesto de mando gritando que la scola lleva 3 minutos parada en el Palco 1 y que tienen que despejar la pista ya mismo o les quitan 5 puntos.",
      opciones: [
        {
          id: "dir_hacer_valer_reglamento",
          texto: "Mostrarle tu cronómetro oficial y demostrarle con firmeza que están dentro del tiempo reglamentario",
          descripcion: "Defender a tu colegio con templanza, conocimiento de las reglas y autoridad.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +5,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Victoria institucional! El comisario revisó su planilla, admitió su error y la scola brilló sin apuros."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -2,
            overall: 0,
            mensaje: "Hubo un cruce tenso de palabras pero aceleraste la salida para evitar problemas mayores."
          }
        },
        {
          id: "dir_acelerar_trotada",
          texto: "Dar el toque de silbato para iniciar la marcha rápida de avance hacia el Palco 2",
          descripcion: "Priorizar la tranquilidad y no exponer al colegio a sanciones burocráticas.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Transición dinámica y sin roces. La scola avanzó al son de la música con ritmo imparable."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 3. POOL GENERAL DE FASES PARA CUERPO DE BAILE
// =========================================================================

export const EVENTOS_BAILE_FASES = {
  // ---- ENSAYOS DE CUERPO DE BAILE ----
  ensayos: [
    {
      id: "baile_ensayo_playon_sol",
      fase: "ensayos",
      faseNombre: "Playón de la Institución (Ensayos de Danza)",
      titulo: "☀️ La Furia del Sol Misionero en el Playón",
      categoria: "ensayo",
      descripcion: "El termómetro marca 34 grados en el playón descubierto de la escuela. Las zapatillas de lona arden contra el cemento y el sudor hace correr el protector solar. La coreógrafa pide 10 repeticiones más de la entrada principal.",
      opciones: [
        {
          id: "sol_aguantar_entero",
          texto: "Ponerle el pecho al calor, tomar un trago de agua y clavar los 10 compases sin aflojar",
          descripcion: "Forjar el aguante físico que distingue a los grandes del asfalto.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +5,
            overall: +4,
            mensaje: "¡Cuerpo de acero! La rutina quedó fijada en la memoria muscular de todas."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: -3,
            overall: 0,
            mensaje: "El calor te dejó con dolor de cabeza, pero el compromiso con el grupo fue intachable."
          }
        },
        {
          id: "sol_repartir_hielo",
          texto: "Ayudar a repartir toallas húmedas con hielo picado entre las chicas de la fila",
          descripcion: "Cuidar la salud del grupo y sostener la armonía del conjunto.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +4,
            overall: +3,
            mensaje: "El playón entero agradeció el gesto y el ensayo concluyó con una energía renovada."
          }
        }
      ]
    },
    {
      id: "baile_ensayo_ensamble_banda",
      fase: "ensayos",
      faseNombre: "Avenida o Playón Deportivo",
      titulo: "🥁 El Ensamble Crítico con la Banda de Música",
      categoria: "ensayo",
      descripcion: "Primer ensayo conjunto del año entre el cuerpo de baile y los 120 chicos de la banda. El estruendo de los redoblantes y las chanchas es ensordecedor: tienen que aprender a coordinar los giros en el compás exacto de los cortes.",
      opciones: [
        {
          id: "ensamble_escuchar_cajitas",
          texto: "Fijar el oído en el repique agudo de las cajitas para anticipar la caída del corte",
          descripcion: "Sincronización rítmica fina entre la percusión pesada y la coreografía.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Corte quirúrgico! El cuerpo de baile cayó de rodillas justo en el golpe seco de la chancha."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -1,
            overall: 0,
            mensaje: "El volumen de la percusión tapó la cuenta inicial, pero en la segunda pasada ensamblaron perfecto."
          }
        },
        {
          id: "ensamble_arenga_mutua",
          texto: "Gritar el cántico escolar al unísono con los bombistas en la entrada",
          descripcion: "Potenciar la hermandad escolar entre músicos y bailarinas.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Mística pura! La scola entera sonó y vibró como un solo corazón."
          }
        }
      ]
    },
    {
      id: "baile_ensayo_lentejuelas_trasnoche",
      fase: "ensayos",
      faseNombre: "Taller de Vestuario Escolar",
      titulo: "✨ Noche de Lentejuelas, Silicona Caliente y Strass",
      categoria: "ensayo",
      descripcion: "Faltan semanas para el debut. El aula de plástica está tapizada de tules, mostacillas, pistolas de silicona y plumas. Entre mates y risas, se quedan hasta las 3 AM bordando los corsés y decorando los espaldares.",
      opciones: [
        {
          id: "vestuario_bordar_minucioso",
          texto: "Coser mostacillas y piedras de strass una por una con hilo reforzado",
          descripcion: "Asegurar que ningún brillo se desprenda en medio del frenesí de la pista.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +3,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Obra de arte! Tu traje resplandece como una joya y resistirá los 4 palcos sin romperse."
          }
        },
        {
          id: "vestuario_innovar_diseno",
          texto: "Proponer un degradeé de colores neón en las hombreras para impactar de noche",
          descripcion: "Aportar creatividad al concepto visual temático del colegio.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +2,
            overall: +4,
            mensaje: "La comisión de madres y la coreógrafa adoptaron tu idea para toda la escuadra central."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Se quedaron sin silicona caliente a medianoche y tuvieron que improvisar con pegamento de contacto."
          }
        }
      ]
    },
    {
      id: "baile_ensayo_alineacion_milimetrica",
      fase: "ensayos",
      faseNombre: "Playón de Ensayos",
      titulo: "📏 La Cuerda Guía y la Simetría de Escuadras",
      categoria: "ensayo",
      descripcion: "Para erradicar las diagonales torcidas, la coreógrafa ata dos sogas de 50 metros a lo largo del playón. Las pasistas deben marchar entre las cuerdas manteniendo exactamente 1 metro de distancia entre hombro y hombro.",
      opciones: [
        {
          id: "alineacion_disciplina_estricta",
          texto: "Memorizar el espacio visual periférico sin mirar al piso ni a los costados",
          descripcion: "Aprender a sentir la posición de las compañeras con la visión lateral.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +5,
            hinchada: +3,
            resistencia: +4,
            overall: +4,
            mensaje: "¡Geometría humana! La escuadra avanzó recta como una flecha plateada."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +1,
            resistencia: -1,
            overall: 0,
            mensaje: "Pisaste la soga en un compás rápido, pero corregiste la pisada de inmediato."
          }
        },
        {
          id: "alineacion_comunicacion_senas",
          texto: "Establecer señas discretas con las manos entre las puntas de fila",
          descripcion: "Coordinación interna para regular la velocidad de avance del grupo.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "La comunicación silenciosa funcionó a la perfección y ninguna escuadra se desfasó."
          }
        }
      ]
    },
    {
      id: "baile_ensayo_drop_coreografico",
      fase: "ensayos",
      faseNombre: "Playón Central",
      titulo: "🔥 El Drop Acrobático del Cambio de Marcha",
      categoria: "ensayo",
      descripcion: "La scola incorporó una figura de alto impacto: un salto con caída en split y apertura de brazos que coincide con la explosión de los tonos graves de la banda. El asfalto duro no perdona errores.",
      opciones: [
        {
          id: "drop_arriesgar_split",
          texto: "Ejecutar la caída en split completo amortiguando con la musculatura del cuádriceps",
          descripcion: "La maniobra gimnástica que arranca los mayores puntajes de acrobacia.",
          riesgo: "Medio",
          probabilidad: 0.78,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "¡IMPACTO VISUAL TOTAL! La coreógrafa felicitó tu elasticidad y potencia atlética."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +2,
            resistencia: -3,
            overall: 0,
            mensaje: "Te golpeaste la rodilla contra el cemento duro (-3 Resistencia), pero te levantaste sonriendo."
          }
        },
        {
          id: "drop_variante_elegante",
          texto: "Realizar una flexión suave en cuclillas con giro de torso y brazos en flor",
          descripcion: "Priorizar la belleza estética y cuidar las articulaciones para las noches de calle.",
          riesgo: "Bajo",
          probabilidad: 0.93,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Elegante y sin riesgos. El movimiento quedó fluido y muy armónico."
          }
        }
      ]
    }
  ],

  // ---- PRUEBA PILOTO DE CUERPO DE BAILE ----
  prueba_piloto: [
    {
      id: "baile_piloto_viento_parana",
      fase: "prueba_piloto",
      faseNombre: "Costanera de Posadas (4to Tramo)",
      titulo: "🌊 La Ráfaga Helada del Río Paraná en el 4to Tramo",
      categoria: "calle",
      descripcion: "Cae la noche sobre la Costanera y el río Paraná sopla con ráfagas cruzadas que ponen a prueba los espaldares y los tocados en la cabecera. Es el momento de sentir el verdadero viento de la Estudiantina.",
      opciones: [
        {
          id: "viento_bailar_contra_viento",
          texto: "Avanzar con la frente en alto y usar la brisa para darle vuelo dramático al vestuario",
          descripcion: "Aprovechar la fuerza del viento del río como un elemento escenográfico natural.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Postales del río! Las plumas flamearon como olas doradas ante la multitud en las vallas."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -2,
            overall: 0,
            mensaje: "Una ráfaga te hizo tambalear un instante, pero te afirmaste en el compás sin perder la sonrisa."
          }
        },
        {
          id: "viento_proteger_traje",
          texto: "Moderar los giros bruscos para asegurar que ninguna pluma ni tocado sufra desprendimientos",
          descripcion: "Cuidar la inversión en vestuario de cara a las noches puntuables.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +3,
            overall: +3,
            mensaje: "El traje llegó al final del tramo en estado impecable. Calibración perfecta."
          }
        }
      ]
    },
    {
      id: "baile_piloto_camaras_tv",
      fase: "prueba_piloto",
      faseNombre: "Palco 1 (Prueba Piloto)",
      titulo: "📹 La Invasión de Camarógrafos Locales en Pista",
      categoria: "calle",
      descripcion: "En la primera prueba, los canales locales y fotógrafos de redes se meten entre las escuadras para sacar primeros planos de los rostros con glitter y las coreografías.",
      opciones: [
        {
          id: "camaras_actuar_sonreir",
          texto: "Buscar el lente de la cámara, regalar una sonrisa magnética y clavar la pose",
          descripcion: "Ganar el favoritismo de los medios y el público posadeño.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +2,
            overall: +4,
            mensaje: "¡Foto de portada! Tu imagen fue la foto del día en los portales de noticias de Misiones."
          }
        },
        {
          id: "camaras_cuidar_formacion",
          texto: "No distraerse con las cámaras y mantener la concentración estricta en el paso del bloque",
          descripcion: "Priorizar la disciplina grupal antes que el lucimiento individual.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +5,
            hinchada: +4,
            resistencia: +3,
            overall: +4,
            mensaje: "Impecable concentración profesional. La coreógrafa te puso un 10 en su libreta."
          }
        }
      ]
    },
    {
      id: "baile_piloto_rotonda_pescadores",
      fase: "prueba_piloto",
      faseNombre: "Rotonda de Pescadores",
      titulo: "🔄 El Giro Panorámico en la Rotonda de Pescadores",
      categoria: "calle",
      descripcion: "Al llegar a la rotonda, el público rodea la pista en 360 grados. El cuerpo de baile tiene que abrirse en un círculo gigante giratorio mientras la banda toca el tema principal.",
      opciones: [
        {
          id: "rotonda_giro_continuo",
          texto: "Sostener el trote de giro continuo en puntas de pie durante los 3 minutos de rotonda",
          descripcion: "Un despliegue de cardio y gracia que levanta a las dos cabeceras.",
          riesgo: "Medio",
          probabilidad: 0.80,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Vórtice de belleza! El círculo giratorio salió perfecto y la rotonda fue una fiesta."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "El mareo por el giro continuo se hizo sentir en las últimas vueltas, pero no aflojaste."
          }
        },
        {
          id: "rotonda_saludo_cruzado",
          texto: "Marcar paradas estáticas saludando alternadamente al río y a la avenida",
          descripcion: "Garantizar que todos los sectores de la multitud reciban la gracia del colegio.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "Aplausos de pie desde los canteros y las veredas de la Costanera."
          }
        }
      ]
    }
  ],

  // ---- NOCHES DE CALLE DE CUERPO DE BAILE ----
  noches_calle: [
    {
      id: "baile_calle_palco_1_estallido",
      fase: "noches_calle",
      faseNombre: "Palco 1 - Noche Oficial de Desfile",
      titulo: "👑 El Estallido Triunfal Frente al Palco 1",
      categoria: "desfile",
      descripcion: "Las torres de iluminación están al 100%. Diez mil personas colman las tribunas tubulares de la Costanera. El silbato inicial detona la pasada puntuable y el cuerpo de baile entra demoliendo con su coreografía de gala.",
      opciones: [
        {
          id: "palco1_explosion_ritmica",
          texto: "Desplegar la coreografía a máxima velocidad y potencia de salto",
          descripcion: "Dar el golpe de efecto desde el primer metro para impresionar al jurado.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +3,
            overall: +6,
            mensaje: "¡ENTRADA MONUMENTAL! El Palco 1 fue un delirio de brillos, aplausos y gritos de aliento."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "El ritmo vertiginoso exigió al límite a las pasistas de los extremos, pero cumplieron con creces."
          }
        },
        {
          id: "palco1_gracia_seductora",
          texto: "Priorizar la plasticidad de brazos, la mirada fija al jurado y una sonrisa encantadora",
          descripcion: "Conquistar por elegancia y distinción en lugar de saltos acrobáticos.",
          riesgo: "Bajo",
          probabilidad: 0.93,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "Puntaje altísimo en el ítem Expresión y Simpatía. Una pasada señorial."
          }
        }
      ]
    },
    {
      id: "baile_calle_3er_tramo_aguante",
      fase: "noches_calle",
      faseNombre: "3er Tramo de la Costanera",
      titulo: "🔥 El Muro del 3er Tramo: Dolor y Corazón",
      categoria: "desfile",
      descripcion: "Son la 1:30 AM. La scola lleva más de 1 hora marchando sobre el asfalto. Las piernas arden, las espaldas duelen por los espaldares y el cansancio hace mella. Queda el último tramo frente al río.",
      opciones: [
        {
          id: "muro_sacar_garra",
          texto: "Apretar los dientes, cantar el himno escolar con las compañeras y saltar más alto",
          descripcion: "Demostrar la mística y el amor incondicional por la camiseta escolar.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +5,
            overall: +6,
            mensaje: "¡LEOPARDAS DEL ASFALTO! La scola renació de sus cenizas y cruzó el 3er tramo con una fuerza descomunal."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -3,
            overall: +1,
            mensaje: "Terminaste agotada y con las piernas temblando, pero la satisfacción del deber cumplido no te la quita nadie."
          }
        },
        {
          id: "muro_marcha_controlada",
          texto: "Bajar la intensidad del salto a un trote rítmico elegante para no desfallecer",
          descripcion: "Administrar las reservas de energía para rematar con todo en el último palco.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +4,
            overall: +4,
            mensaje: "Estrategia inteligente. Llegaron al Palco 4 con resto físico para el sprint final."
          }
        }
      ]
    },
    {
      id: "baile_calle_bengalas_humo",
      fase: "noches_calle",
      faseNombre: "Palco de la Hinchada",
      titulo: "🎆 La Humareda de Colores de la Hinchada Escolar",
      categoria: "desfile",
      descripcion: "Al llegar a la tribuna donde está la hinchada de tu colegio, encienden bengalas de humo con los colores oficiales que cubren la pista de una nube mística y vibrante.",
      opciones: [
        {
          id: "humo_bailar_en_la_niebla",
          texto: "Atravesar la nube de humo bailando a ciegas guiada solo por el retumbar de los bombos",
          descripcion: "Una experiencia épica e inolvidable en el corazón de la fiesta estudiantil.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +3,
            overall: +6,
            mensaje: "¡IMAGEN CINEMATOGRÁFICA! Surgieron del humo como diosas del asfalto y la hinchada enloqueció."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "El humo picó en la garganta y costó respirar unos segundos, pero la emoción fue total."
          }
        },
        {
          id: "humo_agitar_brazos",
          texto: "Acercarte a las vallas a cantar y saltar con los estudiantes de la tribuna",
          descripcion: "Unir al cuerpo de baile con el corazón de la tribuna popular.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Comunión total! Los cantos hicieron temblar las estructuras de la Costanera."
          }
        }
      ]
    }
  ],

  // ---- ANFITEATRO DE CUERPO DE BAILE ----
  anfiteatro: [
    {
      id: "baile_anfi_paredon_piedra",
      fase: "anfiteatro",
      faseNombre: "Escenario Mayor Alcibíades Alarcón",
      titulo: "🏛️ El Escenario Mítico de Piedra del Alcibíades Alarcón",
      categoria: "show",
      descripcion: "El histórico paredón de piedra del anfiteatro abraza al cuerpo de baile. Con la luna sobre el río Paraná y las tribunas repletas en desnivel, la coreografía debe adaptarse al suelo de piedra rugoso y escalonado.",
      opciones: [
        {
          id: "anfi_dominio_escenario",
          texto: "Ocupar todo el ancho del escenario distribuyendo escuadras en tres niveles de altura",
          descripcion: "Aprovechar la arquitectura del anfiteatro para un impacto visual escenográfico.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +7,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡PUESTA EN ESCENA MAGISTRAL! El anfiteatro pareció un teatro griego iluminado por la pasión misionera."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "El desnivel de piedra requirió máxima atención en los giros, pero el cuadro no perdió solidez."
          }
        },
        {
          id: "anfi_energia_central",
          texto: "Concentrar la fuerza en el proscenio central a metros del jurado",
          descripcion: "Impactar con la cercanía, la fuerza de los pasos y la expresividad de los rostros.",
          riesgo: "Bajo",
          probabilidad: 0.93,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "El jurado sintió el viento y la energía de cada salto. Calificaciones excelentes."
          }
        }
      ]
    },
    {
      id: "baile_anfi_cuadro_final_tematico",
      fase: "anfiteatro",
      faseNombre: "Cierre de Temporada en el Anfiteatro",
      titulo: "🎭 La Representación Teatral del Tema Escolar",
      categoria: "show",
      descripcion: "Llega el cuadro alegórico final: la representación teatral danzada del tema anual de tu colegio (mitología, selva misionera, leyendas o fantasía futurista). Es la última oportunidad de sellar la Copa de Oro.",
      opciones: [
        {
          id: "anfi_teatro_apoteotico",
          texto: "Entregar el alma en la interpretación dramática culminando con el abrazo colectivo",
          descripcion: "La emoción pura del último año escolar volcada en la danza.",
          riesgo: "Medio",
          probabilidad: 0.88,
          exito: {
            ritmo: +8,
            hinchada: +9,
            resistencia: +5,
            overall: +7,
            mensaje: "¡HISTÓRICO! Toda la platea aplaudió de pie con lágrimas en los ojos. Una pasada que entra en la leyenda."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +5,
            resistencia: -1,
            overall: +2,
            mensaje: "La emoción te quebró la voz en el grito final, pero el corazón que dejaron en el escenario fue sublime."
          }
        },
        {
          id: "anfi_pose_triunfal",
          texto: "Culminar con la pirámide humana central elevando a la figura estelar del colegio",
          descripcion: "El clímax acrobático tradicional que corona a las campeonas.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Postal inolvidable! La elevación salió limpia y los flashes iluminaron la noche posadeña."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 4. EVENTOS SORPRESA GENERALES DE BAILE (Urgencias y giros del destino)
// =========================================================================

export const EVENTOS_SORPRESA_BAILE = [
  {
    id: "sorpresa_baile_glitter_ojo",
    fase: "sorpresa",
    faseNombre: "Imprevisto de Maquillaje",
    titulo: "✨ ¡Glitter y Pestaña Postiza en el Ojo en Pleno Desfile!",
    categoria: "urgencia",
    descripcion: "Por el sudor y el viento de la Costanera, un grano de glitter grueso y la punta de una pestaña postiza se te meten en el ojo izquierdo a metros del Palco 1. El ardor te hace lagrimear sin parar.",
    opciones: [
      {
        id: "glitter_parpadear_sonreir",
        texto: "Parpadear fuerte, no frotarte para no correr el maquillaje y seguir sonriendo con un ojo",
        descripcion: "Sostener el show cueste lo que cueste con profesionalismo férreo.",
        riesgo: "Medio",
        probabilidad: 0.80,
        exito: {
          ritmo: +4,
          hinchada: +5,
          resistencia: +3,
          overall: +3,
          mensaje: "¡Temple de acero! La lágrima limpió el glitter y el maquillaje quedó intacto."
        },
        fracaso: {
          ritmo: -1,
          hinchada: +2,
          resistencia: -3,
          overall: -1,
          mensaje: "El ojo te quedó colorado por la irritación (-3 Resistencia), pero no perdiste un solo compás."
        }
      },
      {
        id: "glitter_espejo_staff",
        texto: "Acercarte a la vereda en un cambio de escuadra para que una compañera te sople el ojo",
        descripcion: "Resolver el dolor en 3 segundos con ayuda solidaria.",
        riesgo: "Bajo",
        probabilidad: 0.92,
        exito: {
          ritmo: +3,
          hinchada: +3,
          resistencia: +3,
          overall: +3,
          mensaje: "Alivio instantáneo. Te reincorporaste a la fila en el tiempo justo."
        }
      }
    ]
  },
  {
    id: "sorpresa_baile_duelo_rotonda",
    fase: "sorpresa",
    faseNombre: "Folclore Estudiantil",
    titulo: "💃 Duelo Espontáneo de Baile en la Desconcentración",
    categoria: "urgencia",
    descripcion: "Al salir del 4to tramo, tu cuerpo de baile se cruza en la rotonda con el cuerpo de baile del colegio rival histórico. Lejos de la violencia, las directoras se desafían a un mano a mano de pasos de samba frente a cientos de curiosos.",
    opciones: [
      {
        id: "duelo_romperla_samba",
        texto: "Aceptar el desafío, ponerte al frente y clavar un repique de pies endiablado",
        descripcion: "Demostrar en la pista quién tiene la mejor técnica de Posadas.",
        riesgo: "Medio",
        probabilidad: 0.82,
        exito: {
          ritmo: +6,
          hinchada: +7,
          resistencia: +3,
          overall: +5,
          mensaje: "¡CLANDESTINO HISTÓRICO! Tus pasos dejaron sin palabras al rival y ambas scolas terminaron bailando juntas entre abrazos."
        },
        fracaso: {
          ritmo: +2,
          hinchada: +3,
          resistencia: -2,
          overall: +1,
          mensaje: "El asfalto estaba resbaladizo por las botellas de gaseosa, pero defendiste el honor del colegio."
        }
      },
      {
        id: "duelo_abrazo_hermandad",
        texto: "Proponer una ronda de baile compartida mezclando las camisetas de ambos colegios",
        descripcion: "Dar un mensaje de paz y fraternidad que emocione a toda la comunidad.",
        riesgo: "Bajo",
        probabilidad: 0.95,
        exito: {
          ritmo: +4,
          hinchada: +8,
          resistencia: +4,
          overall: +5,
          mensaje: "¡Espíritu de la Estudiantina en su máxima expresión! La foto del abrazo se viralizó en toda la provincia."
        }
      }
    ]
  },
  {
    id: "sorpresa_baile_nina_admiradora",
    fase: "sorpresa",
    faseNombre: "Emoción en las Vallas",
    titulo: "👧 Una Nena del Público te Pide una Pluma de Recuerdo",
    categoria: "urgencia",
    descripcion: "Frente a las vallas del Palco 3, una nena de 6 años con una vincha improvisada te mira con ojos brillantes de admiración y estira la mano pidiéndote una plumita de tu traje.",
    opciones: [
      {
        id: "nina_regalar_pluma",
        texto: "Sacar una pequeña pluma secundaria de tu tocado y regalársela con una sonrisa",
        descripcion: "Inspirar a la próxima generación de pasistas de la Estudiantina.",
        riesgo: "Bajo",
        probabilidad: 0.96,
        exito: {
          ritmo: +3,
          hinchada: +8,
          resistencia: +3,
          overall: +5,
          mensaje: "¡Momento mágico! Toda la tribuna de familias aplaudió conmovida tu generosidad y ternura."
        }
      },
      {
        id: "nina_guiño_baile",
        texto: "Guiñarle un ojo, bailar un compás mirando hacia ella y lanzarle un beso en el aire",
        descripcion: "Cuidar el vestuario estricto sin dejar de ser cariñosa con la nena.",
        riesgo: "Bajo",
        probabilidad: 0.94,
        exito: {
          ritmo: +4,
          hinchada: +6,
          resistencia: +2,
          overall: +4,
          mensaje: "La nena empezó a saltar de alegría al ver que le bailaste en persona. Carisma puro."
        }
      }
    ]
  },
  {
    id: "sorpresa_baile_lluvia_caliente",
    fase: "sorpresa",
    faseNombre: "Clima Subtropical Misionero",
    titulo: "🌧️ Chaparrón Misionero Repentino en Pleno Desfile",
    categoria: "urgencia",
    descripcion: "El cielo de Posadas se abre y cae una lluvia torrencial pero tibia de 10 minutos. El asfalto se convierte en un espejo brillante y el agua empapa plumas, remeras y espaldares.",
    opciones: [
      {
        id: "lluvia_bailar_bajo_agua",
        texto: "Gritar de euforia, saltar en los charcos y bailar bajo el agua con más pasión que nunca",
        descripcion: "Convertir la tormenta en una fiesta épica que nadie olvidará jamás.",
        riesgo: "Medio",
        probabilidad: 0.84,
        exito: {
          ritmo: +7,
          hinchada: +9,
          resistencia: +5,
          overall: +7,
          mensaje: "¡ÉPICA INMORTAL! El público se sumó a cantar bajo la lluvia y la scola brilló como nunca en su historia."
        },
        fracaso: {
          ritmo: +1,
          hinchada: +4,
          resistencia: -3,
          overall: +1,
          mensaje: "El agua volvió pesadísimo el espaldar mojado (-3 Resistencia), pero la ovación fue apoteótica."
        }
      },
      {
        id: "lluvia_cuidar_pasos",
        texto: "Acortar la zancada para no patinar en las líneas blancas pintadas del asfalto",
        descripcion: "Priorizar la seguridad física y evitar resbalones peligrosos.",
        riesgo: "Bajo",
        probabilidad: 0.92,
        exito: {
          ritmo: +4,
          hinchada: +5,
          resistencia: +4,
          overall: +4,
          mensaje: "Pasada segura, sólida y sin accidentes. Sostuvieron la dignidad de la scola."
        }
      }
    ]
  }
];

// =========================================================================
// 5. EVENTOS EXCLUSIVOS PARA BASTONERAS DE BANDA / DESTAQUES (PILARES DE BAILE)
// =========================================================================

export const EVENTOS_BASTONERA = {
  ensayos: [
    {
      id: "bastonera_ensayo_resistencia",
      fase: "ensayos",
      faseNombre: "Ensayos de Figura Estelar",
      titulo: "⭐ El Cardio Extremo de la Bastonera de Banda",
      categoria: "liderazgo",
      descripcion: "Como figura al frente de la scola, no tenés compañeras al lado con quién disimular el cansancio. Tenés que trotar y girar el bastón durante 50 compases continuos a 140 BPM bajo la mirada severa del jurado escolar.",
      opciones: [
        {
          id: "bast_cardio_puro",
          texto: "Completar la rutina sin detenerte ni un solo segundo para tomar agua",
          descripcion: "Construir una capacidad pulmonar digna de atleta de alto rendimiento.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +6,
            overall: +5,
            mensaje: "¡Pulmones de acero! Terminaste impecable y el director de banda te rindió pleitesía."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -2,
            overall: +1,
            mensaje: "El ácido láctico te quemó los gemelos, pero cruzaste la línea de meta del playón."
          }
        },
        {
          id: "bast_tecnica_respiro",
          texto: "Alternar giros lentos de muñeca para regular la respiración en los descansos",
          descripcion: "Inteligencia kinésica para dosificar las energías.",
          riesgo: "Bajo",
          probabilidad: 0.94,
          exito: {
            ritmo: +4,
            hinchada: +4,
            resistencia: +4,
            overall: +4,
            mensaje: "Ritmo perfectamente controlado. Tu resistencia está en el punto justo."
          }
        }
      ]
    },
    {
      id: "bastonera_ensayo_coreo_solista",
      fase: "ensayos",
      faseNombre: "Playón Central",
      titulo: "⭐ Creación del Solo de Pista para la Costanera",
      categoria: "liderazgo",
      descripcion: "La coreógrafa te da libertad absoluta para inventar los 30 segundos de solo individual que realizarás frente a los 4 palcos. ¿Qué impronta le darás a tu rutina?",
      opciones: [
        {
          id: "bast_acrobatica_pura",
          texto: "Diseñar una secuencia acrobática con medialuna sin manos y lanzamiento aéreo",
          descripcion: "Apuesta de máxima dificultad técnica para buscar el puntaje perfecto.",
          riesgo: "Medio",
          probabilidad: 0.78,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +3,
            overall: +6,
            mensaje: "¡RUTINA DE ORO! Una coreografía electrizante que será el comentario de toda la ciudad."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "El aterrizaje de la medialuna requiere más práctica, pero el impacto visual es enorme."
          }
        },
        {
          id: "bast_ritmo_seduccion",
          texto: "Diseñar un juego de bastón rítmico a ras del piso con pasos de samba y simpatía",
          descripcion: "Enfocarte en la conexión visual con el público y el jurado.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +5,
            hinchada: +6,
            resistencia: +3,
            overall: +5,
            mensaje: "Pura magia y carisma. Una rutina infalible y encantadora."
          }
        }
      ]
    }
  ],

  prueba_piloto: [
    {
      id: "bastonera_piloto_liderazgo",
      fase: "prueba_piloto",
      faseNombre: "Cabecera del 4to Tramo",
      titulo: "⭐ Abrir el Desfile de la Institución",
      categoria: "liderazgo",
      descripcion: "Sos la primera persona de tu colegio que pisa el asfalto. Detrás tuyo vienen 200 estudiantes marchando. Tu porte, tu seguridad y tu primer lanzamiento marcan el tono de toda la pasada escolar.",
      opciones: [
        {
          id: "bast_entrada_arrolladora",
          texto: "Avanzar con zancada imperial, lanzar el bastón a lo alto y gritar el nombre del colegio",
          descripcion: "Encender la mecha de la scola con un liderazgo imponente.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +6,
            hinchada: +7,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Entrada legendaria! El grito contagió a las escuadras y la banda entró demoliendo."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "El bastón cayó un poco desviado por el viento, pero tu actitud regia tapó el desfasaje."
          }
        },
        {
          id: "bast_contacto_vallas",
          texto: "Caminar mirando a los hinchas de las vallas y dedicarles el primer giro",
          descripcion: "Fidelizar el cariño de la gente de Posadas desde la primera cuadra.",
          riesgo: "Bajo",
          probabilidad: 0.93,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +3,
            overall: +4,
            mensaje: "¡Ovación inmediata! La gente en las tribunas coreó tu nombre."
          }
        }
      ]
    }
  ],

  sorpresas: [
    {
      id: "bastonera_sorpresa_presion",
      fase: "sorpresa",
      faseNombre: "Presión Mediática",
      titulo: "⭐ Entrevista en Vivo para la Televisión Provincial a Minutos de Salir",
      categoria: "urgencia",
      descripcion: "El canal de televisión más visto de Misiones te pone el micrófono en la boca a 2 minutos de la largada. Quieren saber si tu colegio va a pelear la Copa de Oro este año.",
      opciones: [
        {
          id: "bast_declaracion_picante",
          texto: "Declarar con orgullo y picardía que este año el colegio se lleva el 1º puesto",
          descripcion: "Encender la rivalidad estudiantil y motivar a tu scola al máximo.",
          riesgo: "Medio",
          probabilidad: 0.80,
          exito: {
            ritmo: +4,
            hinchada: +8,
            resistencia: +2,
            overall: +5,
            mensaje: "¡Frase viral del año! La hinchada estalló en cánticos y el video circuló por todas las redes."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "La declaración generó abucheos del colegio rival en el retén, pero alimentó tu fuego competitivo."
          }
        },
        {
          id: "bast_humildad_trabajo",
          texto: "Agradecer a las familias, al cuerpo de baile y prometer dejar el corazón en la pista",
          descripcion: "Transmitir madurez, respeto y altura institucional.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +3,
            overall: +4,
            mensaje: "Aplausos de toda la comunidad escolar por tu humildad y don de gente."
          }
        }
      ]
    }
  ],

  noches_calle: [
    {
      id: "bastonera_calle_palco_dorado",
      fase: "noches_calle",
      faseNombre: "Palco Central",
      titulo: "⭐ La Consagración Solista Frente al Jurado",
      categoria: "desfile",
      descripcion: "En la tercera noche de calle, el Palco Central está abarrotado. La banda frena el toque para tu solo individual. Es tu momento de brillar ante la historia de la Estudiantina.",
      opciones: [
        {
          id: "bast_lanzamiento_estratosferico",
          texto: "Lanzar el bastón a 6 metros de altura, girar tres veces sobre tu eje y atraparlo con la izquierda",
          descripcion: "La máxima proeza acrobática posible en la Costanera.",
          riesgo: "Alto",
          probabilidad: 0.76,
          exito: {
            ritmo: +8,
            hinchada: +8,
            resistencia: +4,
            overall: +7,
            mensaje: "¡BOMBAZO EN LA COSTANERA! El bastón rozó los cables de luz y cayó en tu mano como una pluma. Ovación histórica."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +4,
            resistencia: -2,
            overall: +1,
            mensaje: "El bastón tocó el asfalto pero lo recuperaste con un salto mortal que salvó el momento."
          }
        },
        {
          id: "bast_rutina_fluida",
          texto: "Ejecutar la secuencia rápida de cambios de mano y giros alrededor del cuerpo",
          descripcion: "Seguridad absoluta, ritmo constante y cero margen de error.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +5,
            mensaje: "Brillante y limpia como el agua del Paraná. Notas excelentes en la planilla."
          }
        }
      ]
    }
  ],

  anfiteatro: [
    {
      id: "bastonera_anfi_cierre_gloria",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro",
      titulo: "⭐ La Gran Despedida en el Alcibíades Alarcón",
      categoria: "show",
      descripcion: "El Anfiteatro ruge con bengalas encendidas. Es tu última pasada como Bastonera antes de egresar. En el centro del escenario mayor, el reflector blanco te enfoca para la última pirueta.",
      opciones: [
        {
          id: "bast_final_emocion",
          texto: "Lanzar el bastón al cielo de Posadas, atraparlo de rodillas y besar el escudo del colegio",
          descripcion: "El broche de oro emotivo que quedará en los anales del colegio.",
          riesgo: "Medio",
          probabilidad: 0.86,
          exito: {
            ritmo: +8,
            hinchada: +9,
            resistencia: +5,
            overall: +7,
            mensaje: "¡LEYENDA ETERNA! El estadio entero se puso de pie para ovacionar a la mejor bastonera de la década."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +5,
            resistencia: -1,
            overall: +2,
            mensaje: "Las lágrimas te nublaron la vista al atraparlo, pero el gesto conmovió a toda la Costanera."
          }
        },
        {
          id: "bast_agradecer_banda",
          texto: "Girar hacia los músicos y dedicarles el último corte coordinado con el tambor mayor",
          descripcion: "Reconocer que el brillo de la bastonera nace de la fuerza de la banda.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +6,
            hinchada: +8,
            resistencia: +4,
            overall: +6,
            mensaje: "Hermandad inquebrantable. Los músicos te levantaron en andas al finalizar la pasada."
          }
        }
      ]
    }
  ]
};

// =========================================================================
// 6. EVENTOS EXCLUSIVOS PARA DIRECTORA DE CUERPO DE BAILE
// =========================================================================

export const EVENTOS_DIRECTORA_BAILE = {
  ensayos: [
    {
      id: "dir_ensayo_gestion_bajas",
      fase: "ensayos",
      faseNombre: "Dirección de Cuerpo de Baile",
      titulo: "👑 El Cuaderno Maestro de Asistencias y Disciplina",
      categoria: "liderazgo",
      descripcion: "Faltan 3 semanas y 6 pasistas faltaron reiteradamente a los ensayos de siesta. Las demás están molestas porque no pueden practicar las figuras completas. Tenés que decidir si aplicás el reglamento estricto y las bajás de escuadra o les das una última chance.",
      opciones: [
        {
          id: "dir_disciplina_estricta",
          texto: "Bajar a las faltadoras a la fila de suplentes y subir a las chicas que no faltaron nunca",
          descripcion: "Imponer la cultura del mérito y el respeto por el esfuerzo del grupo.",
          riesgo: "Medio",
          probabilidad: 0.85,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Autoridad intachable! El grupo valoró tu justicia y la disciplina del ensayo subió al 100%."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +2,
            resistencia: -2,
            overall: +1,
            mensaje: "Hubo quejas y roces con algunos padres, pero mantuviste tu palabra con firmeza."
          }
        },
        {
          id: "dir_ensayo_recuperatorio",
          texto: "Citar a las rezagadas a un ensayo intensivo el sábado a la mañana para nivelarlas",
          descripcion: "Contener a todas las integrantes y no perder trajes ya confeccionados.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +4,
            overall: +4,
            mensaje: "Las chicas respondieron con gratitud y recuperaron el nivel de baile en tiempo récord."
          }
        }
      ]
    },
    {
      id: "dir_ensayo_pacto_director_banda",
      fase: "ensayos",
      faseNombre: "Reunión de Jefatura Escolar",
      titulo: "👑 Negociación Feroz con el Director de Banda",
      categoria: "liderazgo",
      descripcion: "El Director de Banda quiere acelerar la marcha a 150 BPM para que los percusionistas se luzcan, pero a esa velocidad las pasistas de espaldar no pueden mantener la elegancia de los giros. La discusión en el buffet del colegio saca chispas.",
      opciones: [
        {
          id: "dir_defender_cuerpo_baile",
          texto: "Plantarte con firmeza y acordar un tempo exacto de 136 BPM que potencie a los dos rubros",
          descripcion: "Hacer respetar el peso artístico y la necesidad física de tus bailarinas.",
          riesgo: "Medio",
          probabilidad: 0.82,
          exito: {
            ritmo: +6,
            hinchada: +6,
            resistencia: +4,
            overall: +6,
            mensaje: "¡Acuerdo maestro! La scola encontró el balance perfecto entre potencia rítmica y gracia coreográfica."
          },
          fracaso: {
            ritmo: +2,
            hinchada: +3,
            resistencia: -1,
            overall: +1,
            mensaje: "La charla fue acalorada, pero llegaron a un punto intermedio que permitió avanzar."
          }
        },
        {
          id: "dir_coreo_adaptable",
          texto: "Aceptar los compases rápidos en dos tramos a cambio de que la banda baje el volumen en el solo de danza",
          descripcion: "Estrategia de concesiones mutuas para sorprender al jurado con contrastes dinámicos.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +5,
            hinchada: +5,
            resistencia: +4,
            overall: +5,
            mensaje: "Excelente visión táctica. El contraste entre la furia y la calma maravilló a todos."
          }
        }
      ]
    }
  ],

  prueba_piloto: [
    {
      id: "dir_piloto_orden_pista",
      fase: "prueba_piloto",
      faseNombre: "Costanera (Cabecera Oficial)",
      titulo: "👑 Conducción de la Scola en la Prueba de Fuego",
      categoria: "liderazgo",
      descripcion: "Tenés que posicionar a las 4 escuadras sobre el asfalto en menos de 90 segundos antes de que el banderillero baje la bandera verde. La tensión es máxima.",
      opciones: [
        {
          id: "dir_silbato_señas_maestras",
          texto: "Usar tu código de silbato y señas de brazos para alinear a las 80 chicas en 45 segundos",
          descripcion: "Demostrar que el colegio tiene una jefatura de nivel profesional.",
          riesgo: "Bajo",
          probabilidad: 0.92,
          exito: {
            ritmo: +6,
            hinchada: +5,
            resistencia: +3,
            overall: +5,
            mensaje: "¡Alineación perfecta! Las autoridades organizadoras quedaron impactadas por la rapidez y orden de la scola."
          }
        },
        {
          id: "dir_arenga_circulo",
          texto: "Juntar las manos con las caciques de escuadra y dar una arenga que ponga la piel de gallina",
          descripcion: "Inyectar confianza ciega en cada integrante antes de salir a la pista.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +4,
            hinchada: +7,
            resistencia: +4,
            overall: +5,
            mensaje: "¡Furia en los ojos! Las chicas salieron a comerse la Costanera con una sonrisa imbatible."
          }
        }
      ]
    }
  ],

  sorpresas: [
    {
      id: "dir_sorpresa_flete_espaldares",
      fase: "sorpresa",
      faseNombre: "Crisis Logística de Urgencia",
      titulo: "👑 El Flete de los Espaldares Quedó Varado por Tránsito",
      categoria: "urgencia",
      descripcion: "A 2 horas de la concentración en la Costanera, el camión que transporta los 20 espaldares gigantes quedó atascado en un corte de tránsito en la avenida Mitre. Las pasistas están al borde del llanto.",
      opciones: [
        {
          id: "dir_operativo_rescate_motos",
          texto: "Organizar a los padres y egresados en camionetas y autos particulares para trasvasar los trajes uno por uno",
          descripcion: "Liderar la logística de emergencia con temple y rapidez mental.",
          riesgo: "Medio",
          probabilidad: 0.84,
          exito: {
            ritmo: +5,
            hinchada: +8,
            resistencia: +3,
            overall: +5,
            mensaje: "¡RESCATE EXITOSO! Todos los espaldares llegaron al 4to tramo 30 minutos antes de la largada. La comunidad celebró como un gol."
          },
          fracaso: {
            ritmo: +1,
            hinchada: +4,
            resistencia: -3,
            overall: 0,
            mensaje: "Llegaron con el tiempo justo y tuvieron que montar los arneses corriendo, pero no faltó ningún traje."
          }
        },
        {
          id: "dir_negociar_apes_demora",
          texto: "Acudir al palco de autoridades organizadoras para permutar el orden de salida con el colegio siguiente",
          descripcion: "Negociar con astucia diplomática para ganar 40 minutos de oxígeno.",
          riesgo: "Bajo",
          probabilidad: 0.90,
          exito: {
            ritmo: +4,
            hinchada: +5,
            resistencia: +3,
            overall: +4,
            mensaje: "El jurado aceptó el cambio de turno y la scola pudo prepararse con absoluta tranquilidad."
          }
        }
      ]
    }
  ],

  noches_calle: [
    {
      id: "dir_calle_mando_supremo",
      fase: "noches_calle",
      faseNombre: "Noches Oficiales de Calle",
      titulo: "👑 El Despliegue Estratégico de Punta a Punta",
      categoria: "desfile",
      descripcion: "Durante los 2 kilómetros de desfile oficial, caminás de atrás para adelante por la vereda con tu libreta y silbato, corrigiendo espaldas, alentando pasistas y marcando los ritmos de paso frente a cada palco de jurados.",
      opciones: [
        {
          id: "dir_conduccion_impecable",
          texto: "Mantener una vigilancia milimétrica de cada escuadra sin descuidar el ritmo de avance",
          descripcion: "Garantizar una pasada regular, prolija y deslumbrante de principio a fin.",
          riesgo: "Medio",
          probabilidad: 0.86,
          exito: {
            ritmo: +7,
            hinchada: +7,
            resistencia: +4,
            overall: +6,
            mensaje: "¡CÁTEDRA DE DIRECCIÓN! Tu conducción fue señalada por los relatores de TV como la más lúcida de la noche."
          },
          fracaso: {
            ritmo: +3,
            hinchada: +3,
            resistencia: -2,
            overall: +1,
            mensaje: "El desgaste físico de caminar y correr 2 kilómetros fue demoledor, pero la scola cumplió una labor soberbia."
          }
        },
        {
          id: "dir_inyeccion_anímica",
          texto: "Cantar junto a las escuadras en el 3er tramo levantando el ánimo de las chicas agotadas",
          descripcion: "Liderar con el ejemplo humano y la pasión contagiosa.",
          riesgo: "Bajo",
          probabilidad: 0.95,
          exito: {
            ritmo: +5,
            hinchada: +8,
            resistencia: +5,
            overall: +6,
            mensaje: "¡Inspiración pura! El cuerpo de baile sacó fuerzas sobrehumanas y terminó bailando con una sonrisa inmortal."
          }
        }
      ]
    }
  ],

  anfiteatro: [
    {
      id: "dir_anfi_consagracion",
      fase: "anfiteatro",
      faseNombre: "Show en el Anfiteatro Manuel Antonio Ramírez",
      titulo: "👑 El Silbatazo de Oro que Corona la Temporada",
      categoria: "show",
      descripcion: "Llegó el último compás del show en el Anfiteatro. Con 5000 personas aplaudiendo y el reloj oficial a punto de expirar, te parás en el borde del escenario de piedra para dar el silbatazo final que sella la pasada del año.",
      opciones: [
        {
          id: "dir_silbatazo_consagracion",
          texto: "Dar el toque de silbato definitivo con el puño en alto y fundirte en el abrazo de egresadas",
          descripcion: "La culminación perfecta de años de entrega, sudor y amor por el colegio.",
          riesgo: "Medio",
          probabilidad: 0.90,
          exito: {
            ritmo: +8,
            hinchada: +9,
            resistencia: +5,
            overall: +8,
            mensaje: "¡DIRECTORA DE LEYENDA! La scola se coronó con honores supremos. Te alzaron en andas ante todo Posadas."
          },
          fracaso: {
            ritmo: +4,
            hinchada: +6,
            resistencia: +2,
            overall: +3,
            mensaje: "El silbato sonó cargado de lágrimas y emoción. La misión está cumplida para siempre."
          }
        },
        {
          id: "dir_agradecer_a_todas",
          texto: "Tomar el micrófono del escenario y dedicar el show a las 80 familias que acompañaron el sueño",
          descripcion: "Cerrar con broche de oro institucional y humano.",
          riesgo: "Bajo",
          probabilidad: 0.96,
          exito: {
            ritmo: +6,
            hinchada: +9,
            resistencia: +4,
            overall: +6,
            mensaje: "Aplausos de pie de todas las hinchadas presentes. Grandeza absoluta."
          }
        }
      ]
    }
  ]
};
