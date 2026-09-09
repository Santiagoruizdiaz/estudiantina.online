/**
 * Rubros y Roles en la Estudiantina de Posadas
 * En Banda: los roles iniciales son estrictamente Cajita, Redoblante, Ton y Chancha.
 * Pilar y Director son roles de jerarquía avanzada que se ganan por rendimiento o en traspasos.
 */
export const RUBROS = [
  {
    id: "banda",
    nombre: "Banda de Música",
    icono: "🥁",
    descripcion: "El latido del 4to tramo. Percusión pesada, cortes vertiginosos y compás que retumba en el pecho.",
    rolesIniciales: [
      {
        id: "cajita",
        nombre: "Cajita",
        rango: "Línea de Toque Agudo",
        descripcion: "El sonido característico de la Estudiantina. Marcas de compás precisas, velocidad y muñeca ágil.",
        bonus: { ritmo: 10, hinchada: 8, resistencia: 8, overall: 9 }
      },
      {
        id: "redoblante",
        nombre: "Redoblante",
        rango: "Cuerpo Rítmico",
        descripcion: "Metralleta de golpes y redobles afinados. Máxima concentración compás por compás.",
        bonus: { ritmo: 12, hinchada: 7, resistencia: 8, overall: 9 }
      },
      {
        id: "ton",
        nombre: "Ton",
        rango: "Línea de Armonía & Relleno (Tones)",
        descripcion: "Toques con cuerpo y sonido grave medio que dan color y potencia a cada cambio de marcha.",
        bonus: { ritmo: 10, hinchada: 9, resistencia: 10, overall: 10 }
      },
      {
        id: "chancha",
        nombre: "Chancha (Surdo)",
        rango: "Línea de Peso",
        descripcion: "El bajo que hace temblar las vallas de la Costanera. Máximo esfuerzo y resistencia física.",
        bonus: { ritmo: 8, hinchada: 10, resistencia: 14, overall: 10 }
      }
    ],
    // Roles avanzados (solo desbloqueables por promoción o traspaso)
    rolesAvanzados: [
      {
        id: "pilar",
        nombre: "Pilar de Banda",
        rango: "Cacique de Fila",
        descripcion: "Líder técnico del instrumento en la pista. Marcas los cortes, guiás a los nuevos y sostenés el ritmo.",
        bonus: { ritmo: 14, hinchada: 12, resistencia: 12, overall: 13 }
      },
      {
        id: "director_banda",
        nombre: "Director/a de Banda",
        rango: "Jefatura Suprema",
        descripcion: "Silbato de oro en boca, mirada firme, guiando a cientos de estudiantes con cada seña frente al jurado.",
        bonus: { ritmo: 16, hinchada: 15, resistencia: 13, overall: 15 }
      }
    ]
  },
  {
    id: "baile",
    nombre: "Cuerpo de Baile",
    icono: "💃",
    descripcion: "Elegancia, plumas, lentejuelas y coreografías deslumbrantes que hipnotizan al público.",
    rolesIniciales: [
      {
        id: "pasista_escuadra",
        nombre: "Pasista de Escuadra",
        rango: "Ala Central",
        descripcion: "El corazón del baile. Sonrisa incansable, pasos coordinados de principio a fin del desfile.",
        bonus: { ritmo: 10, hinchada: 11, resistencia: 10, overall: 10 }
      },
      {
        id: "pasista_ala",
        nombre: "Pasista de Espaldar",
        rango: "Cuerpo de Danza",
        descripcion: "Traje completo con espaldar de plumas y sincronía en las formaciones de pista.",
        bonus: { ritmo: 11, hinchada: 10, resistencia: 11, overall: 10 }
      }
    ],
    rolesAvanzados: [
      {
        id: "bastonera_banda",
        nombre: "Bastonera de Banda / Pasista Destaque",
        rango: "Figura Estelar",
        descripcion: "Giro de bastón aéreo, destreza acrobática y carisma frente a las cámaras de televisión.",
        bonus: { ritmo: 13, hinchada: 14, resistencia: 11, overall: 13 }
      },
      {
        id: "directora_baile",
        nombre: "Directora de Cuerpo de Baile",
        rango: "Jefatura Suprema",
        descripcion: "Creación de coreografías, mando absoluto de las escuadras y presencia imponente en palcos.",
        bonus: { ritmo: 15, hinchada: 14, resistencia: 12, overall: 15 }
      }
    ]
  }
];

export function getRolById(rubroId, rolId) {
  const rubro = RUBROS.find(r => r.id === rubroId) || RUBROS[0];
  const todosLosRoles = [...rubro.rolesIniciales, ...(rubro.rolesAvanzados || [])];
  const rol = todosLosRoles.find(ro => ro.id === rolId) || rubro.rolesIniciales[0];
  return { rubro, rol };
}
