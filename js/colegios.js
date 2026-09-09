/**
 * Base de datos oficial de las 33 instituciones participantes de la Estudiantina de Posadas de la Estudiantina de Posadas
 * Actualizado con los colores y prendas de los uniformes escolares oficiales (chomba, campera y vivos).
 */
export const COLEGIOS = [
  // ================= 1. COLEGIO =================
  {
    id: "janssen",
    nombre: "El Janssen",
    apodo: "El Janssen",
    lema: "¡Furia y potencia azul y oro!",
    tier: 1,
    tierNombre: "Gigante",
    exigencia: 72,
    potencialCopa: 1.5,
    hinchadaBase: 98,
    presupuesto: "Colosal",
    colores: {
      primary: "#1d4ed8",
      secondary: "#facc15",
      accent: "#60a5fa",
      glow: "rgba(29, 78, 216, 0.45)",
      collar: "#1d4ed8",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca reglamentaria (camisa celeste en taller) con cuello azul marino y amarillo oro, campera azul marino y amarillo.",
    especialidad: "Banda de Música",
    categoria: "A",
    tecnico: true,
    rivalHistorico: "industrial",
    escudo: "⚙️",
    descripcion: "Uno de los dos gigantes históricos de la Estudiantina. Banda de música descomunal, chanchas demoledoras y una exigencia máxima.",
    tentacionTexto: "El gigante azul y oro te pone al frente de su legendaria línea de chanchas pesadas con galpón propio."
  },

  // ================= 2. COLEGIO =================
  {
    id: "industrial",
    nombre: "La Indu",
    apodo: "La Indu",
    lema: "¡Ingenio, hierro y pasión!",
    tier: 1,
    tierNombre: "Gigante",
    exigencia: 76,
    potencialCopa: 1.5,
    hinchadaBase: 97,
    presupuesto: "Colosal",
    colores: {
      primary: "#0284c7",
      secondary: "#f1f5f9",
      accent: "#38bdf8",
      glow: "rgba(2, 132, 199, 0.45)",
      collar: "#0284c7",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba celeste industrial (o grafa en taller) con vivos blancos, campera azul marino y celeste con blanco plata.",
    especialidad: "Carroza Ingeniosa",
    categoria: "A",
    tecnico: true,
    rivalHistorico: "janssen",
    escudo: "🔧",
    descripcion: "Gigante de la Estudiantina. Maestros absolutos de las carrozas ingeniosas con movimientos hidráulicos titánicos y una banda ensordecedora.",
    tentacionTexto: "La Indu te entrega la jefatura de su gigante mecánico y herramientas de soldadura pesada para dominar la Costanera."
  },

  // ================= 3. COLEGIO =================
  {
    id: "santa_maria",
    nombre: "El Santa",
    apodo: "El Santa",
    lema: "¡Brillo, elegancia y tradición!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 66,
    potencialCopa: 1.34,
    hinchadaBase: 91,
    presupuesto: "Alto",
    colores: {
      primary: "#1e40af",
      secondary: "#eab308",
      accent: "#3b82f6",
      glow: "rgba(30, 64, 175, 0.45)",
      collar: "#1e40af",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello y vivos azul marino y oro, campera azul marino con vivos dorados, pollera kilt azul y gris.",
    especialidad: "Cuerpo de Baile",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "roque",
    escudo: "⭐",
    descripcion: "Elegancia, plumas y scola con gran trayectoria que pelea los primeros lugares en cada edición.",
    tentacionTexto: "El Santa te ofrece un lugar de honor en la coreografía central con respaldo total de vestuario."
  },

  // ================= 4. COLEGIO =================
  {
    id: "roque",
    nombre: "El Roque",
    apodo: "El Roque",
    lema: "¡El corazón albirrojo en la Costanera!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 68,
    potencialCopa: 1.35,
    hinchadaBase: 93,
    presupuesto: "Alto",
    colores: {
      primary: "#dc2626",
      secondary: "#ffffff",
      accent: "#f87171",
      glow: "rgba(220, 38, 38, 0.45)",
      collar: "#dc2626",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca reglamentaria con cuello rojo albirrojo, campera roja con vivos blancos y pantalón gris.",
    especialidad: "Cuerpo de Baile",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "santa_maria",
    escudo: "⚡",
    descripcion: "Fuerza competitiva arrolladora. Especialistas en Cuerpo de Baile de altísima precisión y sincronía milimétrica.",
    tentacionTexto: "El Roque te asegura espaldar de faisán de lujo y posición de estrella en la scola de baile."
  },

  // ================= 5. COLEGIO =================
  {
    id: "san_basilio",
    nombre: "El Sanba",
    apodo: "El Sanba",
    lema: "¡La fuerza y el fuego verde y rojo!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 67,
    potencialCopa: 1.36,
    hinchadaBase: 94,
    presupuesto: "Alto",
    colores: {
      primary: "#16a34a",
      secondary: "#dc2626",
      accent: "#4ade80",
      glow: "rgba(22, 163, 74, 0.45)",
      collar: "#16a34a",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello verde y vivos rojos, campera verde con mangas rojas y pantalón gris.",
    especialidad: "Banda de Música",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "humanista",
    escudo: "🛡️",
    descripcion: "Un grande de ley. Puestas en escena monumentales, trajes teatrales cinematográficos y una hinchada pasional.",
    tentacionTexto: "El Sanba te tienta con un rol estelar en su puesta teatral de primer nivel para pelear la punta."
  },

  // ================= 6. COLEGIO =================
  {
    id: "madre_misericordia",
    nombre: "La Madre",
    apodo: "La Madre",
    lema: "¡Gracia, ritmo y devoción!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 65,
    potencialCopa: 1.32,
    hinchadaBase: 90,
    presupuesto: "Medio-Alto",
    colores: {
      primary: "#0d9488",
      secondary: "#ffffff",
      accent: "#2dd4bf",
      glow: "rgba(13, 148, 136, 0.45)",
      collar: "#0d9488",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca reglamentaria con cuello verde petróleo y vivos blancos, campera verde petróleo y jumper azul marino.",
    especialidad: "Cuerpo de Baile",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "santa_maria",
    escudo: "🕊️",
    descripcion: "Una de las grandes instituciones. Pasistas con carisma radiante y una scola prolija que siempre da batalla en el podio.",
    tentacionTexto: "La Madre te abre las puertas para capitanear su cuerpo de baile con trajes de ensueño."
  },

  // ================= 7. COLEGIO =================
  {
    id: "pedro_goyena",
    nombre: "El Goyena",
    apodo: "El Goyena",
    lema: "¡Espíritu guerrero en cada corte!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 55,
    potencialCopa: 1.15,
    hinchadaBase: 83,
    presupuesto: "Medio",
    colores: {
      primary: "#0284c7",
      secondary: "#1e3a8a",
      accent: "#38bdf8",
      glow: "rgba(2, 132, 199, 0.45)",
      collar: "#0284c7",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba celeste institucional bordada, pantalón/pollera azul marino y campera azul índigo con vivos celestes.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "san_alberto",
    escudo: "⚔️",
    descripcion: "Disciplina y ritmo apretado en las filas de chanchas y redoblantes.",
    tentacionTexto: "El Goyena te ofrece capitanear la línea de choque rítmico."
  },

  // ================= 8. COLEGIO =================
  {
    id: "nacional",
    nombre: "El Nacional",
    apodo: "El Nacional",
    lema: "¡La historia viva de Posadas!",
    tier: 2,
    tierNombre: "Histórico",
    exigencia: 64,
    potencialCopa: 1.28,
    hinchadaBase: 92,
    presupuesto: "Alto",
    colores: {
      primary: "#0284c7",
      secondary: "#ffffff",
      accent: "#38bdf8",
      glow: "rgba(2, 132, 199, 0.45)",
      collar: "#0284c7",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello azul marino y vivos celestes patrios, campera azul marino y celeste con blanco.",
    especialidad: "Banda de Música",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "normal_mixta",
    escudo: "🏛️",
    descripcion: "Pilar histórico de Posadas. Cuna de generaciones de estudiantes, orgullo inquebrantable y compás clásico de tradición pura.",
    tentacionTexto: "Te invitan a ser la figura del Nacional para devolverle a este histórico la gloria dorada en la Costanera."
  },

  // ================= 9. COLEGIO =================
  {
    id: "normal_mixta",
    nombre: "La Normal Mixta",
    apodo: "La Normal Mixta",
    lema: "¡Cuna de maestros y fiesta!",
    tier: 2,
    tierNombre: "Histórico",
    exigencia: 63,
    potencialCopa: 1.25,
    hinchadaBase: 91,
    presupuesto: "Alto",
    colores: {
      primary: "#059669",
      secondary: "#ffffff",
      accent: "#34d399",
      glow: "rgba(5, 150, 105, 0.45)",
      collar: "#059669",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello verde esperanza y vivos blancos, campera verde con blanco y pantalón azul/gris.",
    especialidad: "Banda de Música",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "nacional",
    escudo: "📖",
    descripcion: "Institución histórica fundacional. Marcó las raíces de la Estudiantina con sus redoblantes limpios y alma de fiesta eterna.",
    tentacionTexto: "La Normal te busca para comandar sus filas rítmicas con toda la mística de su historia centenaria."
  },

  // ================= 10. COLEGIO =================
  {
    id: "humanista",
    nombre: "El Bachi",
    apodo: "El Bachi",
    lema: "¡Arte, intelecto y mística!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 66,
    potencialCopa: 1.35,
    hinchadaBase: 91,
    presupuesto: "Alto",
    colores: {
      primary: "#7c3aed",
      secondary: "#fde047",
      accent: "#a78bfa",
      glow: "rgba(124, 58, 237, 0.45)",
      collar: "#7c3aed",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello/corbata bordeaux y dorado, campera violeta bordeaux con vivos dorados y pantalón gris.",
    especialidad: "Carroza Artística",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "san_basilio",
    escudo: "🎭",
    descripcion: "Un grande del arte y la estética. Famoso por sus carrozas artísticas premiadas, conceptos mitológicos y alta costura.",
    tentacionTexto: "El Bachi te ofrece libertad creativa total para diseñar y lucirte en su carroza artística multipremiada."
  },

  // ================= 11. COLEGIO =================
  {
    id: "cep_4",
    nombre: "El CEP 4",
    apodo: "El CEP 4",
    lema: "¡Fuerza, ritmo y compañerismo en la calle!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 54,
    potencialCopa: 1.12,
    hinchadaBase: 82,
    presupuesto: "Medio",
    colores: {
      primary: "#1e3a8a",
      secondary: "#38bdf8",
      accent: "#60a5fa",
      glow: "rgba(30, 58, 138, 0.45)",
      collar: "#1e3a8a",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba azul reglamentaria, buzo y campera azul marino con vivos celestes y pantalón azul marino.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "bop_9",
    escudo: "⚡",
    descripcion: "Gran unión estudiantil y potencia percusiva que crece año tras año con estilo propio.",
    tentacionTexto: "El CEP 4 te convoca para ser el referente de su banda de música y conquistar la Costanera."
  },

  // ================= 12. COLEGIO =================
  {
    id: "virgen_itati",
    nombre: "Itatí",
    apodo: "Itatí",
    lema: "¡Bajo el manto azul y plata!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 52,
    potencialCopa: 1.1,
    hinchadaBase: 81,
    presupuesto: "Medio",
    colores: {
      primary: "#2563eb",
      secondary: "#e2e8f0",
      accent: "#60a5fa",
      glow: "rgba(37, 99, 235, 0.45)",
      collar: "#2563eb",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello azul mariano y vivos plata, campera azul con plata y pantalón azul marino.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "inmaculada",
    escudo: "👑",
    descripcion: "Danzas elegantes, bastoneras coordinadas y trajes brillantes con mucha devoción.",
    tentacionTexto: "Te proponen el liderazgo de las bastoneras de Itatí con un traje especial."
  },

  // ================= 13. COLEGIO =================
  {
    id: "comercio_6",
    nombre: "Comercio 6",
    apodo: "Comercio 6",
    lema: "¡El León del centro copando la calle!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 65,
    potencialCopa: 1.32,
    hinchadaBase: 94,
    presupuesto: "Alto",
    colores: {
      primary: "#1e40af",
      secondary: "#ffffff",
      accent: "#60a5fa",
      glow: "rgba(30, 64, 175, 0.45)",
      collar: "#1e40af",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello y mangas azul institucional, campera azul con vivos y pantalón azul marino reglamentario.",
    especialidad: "Banda de Música",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "comercio_18",
    escudo: "🦁",
    descripcion: "El León del centro. Una hinchada multitudinaria y ruidosa que hace temblar el 4to tramo de la Costanera.",
    tentacionTexto: "Comercio 6 te ofrece tocar con una hinchada apasionada que copará la avenida Costanera."
  },

  // ================= 14. COLEGIO =================
  {
    id: "mborore",
    nombre: "El Mbororé",
    apodo: "El Mbororé",
    lema: "¡La epopeya guaraní en cada repique!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 56,
    potencialCopa: 1.18,
    hinchadaBase: 84,
    presupuesto: "Medio",
    colores: {
      primary: "#854d0e",
      secondary: "#16a34a",
      accent: "#ca8a04",
      glow: "rgba(133, 77, 14, 0.45)",
      collar: "#854d0e",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello marrón tierra misionera y vivos verdes, campera marrón y verde selva.",
    especialidad: "Scola do Samba",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "verbo_divino",
    escudo: "🏹",
    descripcion: "Ritmos de la selva misionera, gran calidez y scola do samba con identidad auténtica.",
    tentacionTexto: "Te ofrecen comandar la scola del Mbororé con un repertorio guaraní lleno de energía."
  },

  // ================= 15. COLEGIO =================
  {
    id: "san_alberto",
    nombre: "San Alberto",
    apodo: "San Alberto",
    lema: "¡Furia albiazul!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 55,
    potencialCopa: 1.16,
    hinchadaBase: 84,
    presupuesto: "Medio",
    colores: {
      primary: "#1e40af",
      secondary: "#f8fafc",
      accent: "#60a5fa",
      glow: "rgba(30, 64, 175, 0.45)",
      collar: "#1e40af",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello azul Francia y vivos blancos, campera azul Francia y blanco (Albiazul).",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "pedro_goyena",
    escudo: "🦅",
    descripcion: "Crecimiento constante, percusión sólida y una hinchada fiel que acompaña en cada palco.",
    tentacionTexto: "San Alberto te ofrece ser la bandera del colegio para buscar el podio de honor."
  },

  // ================= 16. COLEGIO =================
  {
    id: "del_carmen",
    nombre: "El Carmen",
    apodo: "El Carmen",
    lema: "¡Tradición y alegría carmelita!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 54,
    potencialCopa: 1.12,
    hinchadaBase: 82,
    presupuesto: "Medio",
    colores: {
      primary: "#92400e",
      secondary: "#fef3c7",
      accent: "#d97706",
      glow: "rgba(146, 64, 14, 0.45)",
      collar: "#92400e",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba crema o blanca con cuello marrón carmelita y dorado, campera marrón y crema dorada.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "santa_catalina",
    escudo: "✨",
    descripcion: "Coreografías cuidadas y calidez con trajes artesanales brillantes.",
    tentacionTexto: "El Carmen te da el rol de bastonera de gala con traje a medida."
  },

  // ================= 17. COLEGIO =================
  {
    id: "jesus_nino",
    nombre: "Jesús Niño",
    apodo: "Jesús Niño",
    lema: "¡Alegría y corazón en la Costanera!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 53,
    potencialCopa: 1.1,
    hinchadaBase: 81,
    presupuesto: "Medio",
    colores: {
      primary: "#1e40af",
      secondary: "#dc2626",
      accent: "#16a34a",
      glow: "rgba(30, 64, 175, 0.45)",
      collar: "#1e40af",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca reglamentaria con insignia tricolor (azul, rojo y verde), campera azul marino con vivos rojos y pantalón azul marino.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "virgen_itati",
    escudo: "🌟",
    descripcion: "Orgullo de la zona oeste posadeña con una banda muy trabajada y comprometida.",
    tentacionTexto: "Te ofrecen ser el motor de la banda de Jesús Niño para pelear el trofeo."
  },

  // ================= 18. COLEGIO =================
  {
    id: "inmaculada",
    nombre: "La Inmaculada",
    apodo: "La Inmaculada",
    lema: "¡Pureza, arte y fiesta!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 53,
    potencialCopa: 1.12,
    hinchadaBase: 82,
    presupuesto: "Medio",
    colores: {
      primary: "#0284c7",
      secondary: "#ffffff",
      accent: "#7dd3fc",
      glow: "rgba(2, 132, 199, 0.45)",
      collar: "#0284c7",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca purísima con cuello celeste cielo y vivos blancos, campera celeste y blanco.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "virgen_itati",
    escudo: "🕊️",
    descripcion: "Alas blancas y brillo bajo los reflectores de la Costanera con coreografías sincronizadas.",
    tentacionTexto: "Te aseguran traje de destaque con alas iluminadas en la escuadra principal."
  },

  // ================= 19. COLEGIO =================
  {
    id: "epet_2",
    nombre: "La EPET 2",
    apodo: "La EPET 2",
    lema: "¡Manos creadoras y ritmo de taller!",
    tier: 3,
    tierNombre: "Grande",
    exigencia: 64,
    potencialCopa: 1.32,
    hinchadaBase: 89,
    presupuesto: "Alto",
    colores: {
      primary: "#475569",
      secondary: "#e11d48",
      accent: "#94a3b8",
      glow: "rgba(71, 85, 105, 0.45)",
      collar: "#475569",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca o gris plomo con cuello carmesí y negro, campera gris técnico y carmesí con pantalón de grafa gris.",
    especialidad: "Carroza Ingeniosa",
    categoria: "A",
    tecnico: true,
    rivalHistorico: "epet_34",
    escudo: "⚙️",
    descripcion: "Institución técnica grande y combativa. Orgullo de taller, gran capacidad mecánica y una carroza ingeniosa temible.",
    tentacionTexto: "La EPET 2 te busca para comandar su taller técnico y llevar su carroza a lo más alto de la Costanera."
  },

  // ================= 20. COLEGIO =================
  {
    id: "jesus_nazareth",
    nombre: "El Naza",
    apodo: "El Naza",
    lema: "¡De los desafíos nacen los sueños!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 52,
    potencialCopa: 1.12,
    hinchadaBase: 82,
    presupuesto: "Medio",
    colores: {
      primary: "#5c2c10",
      secondary: "#ffffff",
      accent: "#8b4513",
      glow: "rgba(92, 44, 16, 0.45)",
      collar: "#5c2c10",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello y vivos marrón chocolate, campera marrón con detalles blancos y pantalón reglamentario.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "san_miguel",
    escudo: "🕊️",
    descripcion: "Orgullo de la zona oeste de Posadas (Av. Eva Perón / Península Iprodha). Famoso por su tradicional identidad blanco y marrón, la garra barrial de 'El Naza', sus alegorías estelares con contrastes de luces y una percusión apasionada.",
    tentacionTexto: "El Naza te entrega la batuta de su scola y el corte de ritmo para emocionar a toda la Costanera con su mística blanca y marrón."
  },

  // ================= 21. COLEGIO =================
  {
    id: "comercio_8",
    nombre: "Comercio 8",
    apodo: "Comercio 8",
    lema: "¡La pasión comercial de Miguel Lanús en la Costanera!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 54,
    potencialCopa: 1.14,
    hinchadaBase: 83,
    presupuesto: "Medio",
    colores: {
      primary: "#dc2626",
      secondary: "#18181b",
      accent: "#f87171",
      glow: "rgba(220, 38, 38, 0.45)",
      collar: "#dc2626",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello rojo y vivos negros, campera roja y negra (Orgullo de Miguel Lanús).",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "comercio_18",
    escudo: "🔥",
    descripcion: "Orgullo y potencia roja y negra de Miguel Lanús. Banda de música con fuerza arrolladora, redoblantes sincronizados y una hinchada leal que copa las vallas.",
    tentacionTexto: "Comercio 8 te entrega la batuta de su banda de música para hacer rugir a todo Miguel Lanús en el 4to tramo."
  },

  // ================= 22. COLEGIO =================
  {
    id: "lisandro_torre",
    nombre: "Lisandro de la Torre",
    apodo: "Lisandro de la Torre",
    lema: "¡Voz y fuerza del estudiante!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 51,
    potencialCopa: 1.08,
    hinchadaBase: 79,
    presupuesto: "Medio-Bajo",
    colores: {
      primary: "#e11d48",
      secondary: "#1e1b4b",
      accent: "#fb7185",
      glow: "rgba(225, 29, 72, 0.45)",
      collar: "#e11d48",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello carmesí y vivos azul noche, campera carmesí con azul y pantalón azul noche.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "bop_9",
    escudo: "🚩",
    descripcion: "Coreografías comprometidas, gran empuje juvenil y trajes confeccionados con pasión.",
    tentacionTexto: "Te invitan a ser la pasista estrella que guíe al Lisandro de la Torre en la Costanera."
  },

  // ================= 23. COLEGIO =================
  {
    id: "epet_34",
    nombre: "La 34",
    apodo: "La 34",
    lema: "¡Furia técnica roja y negra!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 48,
    potencialCopa: 1.02,
    hinchadaBase: 78,
    presupuesto: "Medio-Bajo",
    colores: {
      primary: "#dc2626",
      secondary: "#18181b",
      accent: "#f87171",
      glow: "rgba(220, 38, 38, 0.45)",
      collar: "#dc2626",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca o negra con corbata y vivos rojos, campera roja y negra institucional y pantalón grafa negro/gris.",
    especialidad: "Carroza Ingeniosa",
    categoria: "B",
    tecnico: true,
    rivalHistorico: "epet_2",
    escudo: "💡",
    descripcion: "Jóvenes técnicos de Itaembé Guazú con circuitos LED, pasión roja y negra y ganas de innovar en cada edición.",
    tentacionTexto: "La 34 te entrega el mando de su carroza para dar la gran sorpresa tecnológica con sus colores rojo y negro."
  },

  // ================= 24. COLEGIO =================
  {
    id: "bop_9",
    nombre: "El BOP 9",
    apodo: "El BOP 9",
    lema: "¡Garra y sentimiento popular de barrio!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 46,
    potencialCopa: 0.98,
    hinchadaBase: 79,
    presupuesto: "Bajo",
    colores: {
      primary: "#15803d",
      secondary: "#fde047",
      accent: "#4ade80",
      glow: "rgba(21, 128, 61, 0.45)",
      collar: "#15803d",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello verde y vivos amarillo sol, campera verde con vivos amarillos y pantalón azul marino.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "bop_1",
    escudo: "🍀",
    descripcion: "Baile entusiasta y compañerismo incondicional en las noches de fiesta posadeña.",
    tentacionTexto: "Te ofrecen liderazgo y cariño incondicional de toda la comunidad del BOP 9."
  },

  // ================= 25. COLEGIO =================
  {
    id: "estrada",
    nombre: "El Estrada",
    apodo: "El Estrada",
    lema: "¡Garra y ritmo que hacen vibrar el río!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 47,
    potencialCopa: 1.0,
    hinchadaBase: 78,
    presupuesto: "Medio-Bajo",
    colores: {
      primary: "#7f1d1d",
      secondary: "#d97706",
      accent: "#1e40af",
      glow: "rgba(127, 29, 29, 0.45)",
      collar: "#7f1d1d",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con rayas beige, azul y bordó; pullover y campera deportiva bordó con mangas azules y vivos beige, pantalón/pollera beige.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "san_jorge",
    escudo: "📚",
    descripcion: "Compañerismo puro, dedicación en cada ensayo y ritmo enérgico que crece con fuerza.",
    tentacionTexto: "El Estrada te ofrece el puesto de director rítmico para llevar al colegio al podio."
  },

  // ================= 26. COLEGIO =================
  {
    id: "san_jorge",
    nombre: "San Jorge",
    apodo: "San Jorge",
    lema: "¡El dragón despierta en la Costanera!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 46,
    potencialCopa: 0.98,
    hinchadaBase: 78,
    presupuesto: "Medio-Bajo",
    colores: {
      primary: "#15803d",
      secondary: "#86efac",
      accent: "#22c55e",
      glow: "rgba(21, 128, 61, 0.45)",
      collar: "#15803d",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello verde dragón y vivos claros, campera verde dragón con blanco y pantalón azul marino.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "estrada",
    escudo: "🐉",
    descripcion: "Fuerza debutante con ganas de crecer y destacar ante miles de personas.",
    tentacionTexto: "Te convocan como referente estelar para su banda en crecimiento."
  },

  // ================= 27. COLEGIO =================
  {
    id: "san_miguel",
    nombre: "San Miguel",
    apodo: "San Miguel",
    lema: "¡Protección, fuerza y fiesta misionera!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 48,
    potencialCopa: 1.02,
    hinchadaBase: 80,
    presupuesto: "Medio-Bajo",
    colores: {
      primary: "#701a75",
      secondary: "#f59e0b",
      accent: "#a21caf",
      glow: "rgba(112, 26, 117, 0.45)",
      collar: "#701a75",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca reglamentaria con cuello púrpura obispo y dorado, campera púrpura con vivos dorados.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "jesus_nazareth",
    escudo: "🛡️",
    descripcion: "Juventud comprometida, trajes de guerreros angelicales y una hinchada con cánticos contagiosos.",
    tentacionTexto: "San Miguel te busca para liderar su escuadra de baile con alas doradas."
  },

  // ================= 28. COLEGIO =================
  {
    id: "verbo_divino",
    nombre: "El Verbo",
    apodo: "El Verbo",
    lema: "¡Pura scola do samba y calor de fiesta!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 60,
    potencialCopa: 1.25,
    hinchadaBase: 88,
    presupuesto: "Medio-Alto",
    colores: {
      primary: "#b45309",
      secondary: "#15803d",
      accent: "#f59e0b",
      glow: "rgba(180, 83, 9, 0.45)",
      collar: "#b45309",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello cobrizo y verde selva, campera cobriza con detalles en verde selva y pantalón azul/marrón.",
    especialidad: "Scola do Samba",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "comercio_18",
    escudo: "🌴",
    descripcion: "Maestros del swing brasileño y repique rápido. Ritmo contagioso que levanta a todas las tribunas.",
    tentacionTexto: "El Verbo te busca como solista de repique para ganar el rubro de Scola do Samba."
  },

  // ================= 29. COLEGIO =================
  {
    id: "normal_10",
    nombre: "La Normal 10",
    apodo: "La Normal 10",
    lema: "¡Juventud de Villa Sarita con alegría y orgullo!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 55,
    potencialCopa: 1.15,
    hinchadaBase: 84,
    presupuesto: "Medio",
    colores: {
      primary: "#475569",
      secondary: "#18181b",
      accent: "#94a3b8",
      glow: "rgba(71, 85, 105, 0.45)",
      collar: "#18181b",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba gris con cuello negro reglamentario, campera gris y negra con vivos blancos y pantalón negro/azul.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "normal_mixta",
    escudo: "🎓",
    descripcion: "Orgullo de Villa Sarita con percusión alegre y un ambiente de fiesta tradicional posadeña.",
    tentacionTexto: "La Normal 10 te convoca para llevar su estandarte rítmico en la Costanera."
  },

  // ================= 30. COLEGIO =================
  {
    id: "comercio_18",
    nombre: "Comercio 18",
    apodo: "Comercio 18",
    lema: "¡Pasión de barrio y mística de calle!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 58,
    potencialCopa: 1.22,
    hinchadaBase: 87,
    presupuesto: "Medio",
    colores: {
      primary: "#ea580c",
      secondary: "#1e293b",
      accent: "#fb923c",
      glow: "rgba(234, 88, 12, 0.45)",
      collar: "#ea580c",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello naranja fuego y vivos azul noche, campera naranja con azul noche y pantalón azul noche.",
    especialidad: "Scola do Samba",
    categoria: "A",
    tecnico: false,
    rivalHistorico: "comercio_6",
    escudo: "🔥",
    descripcion: "Pura garra y agilidad. Una scola con ritmo caliente que compite sin miedo en los primeros puestos.",
    tentacionTexto: "Comercio 18 te da plena libertad rítmica para liderar su corte de scola do samba."
  },

  // ================= 31. COLEGIO =================
  {
    id: "santa_catalina",
    nombre: "Santa Catalina",
    apodo: "Santa Catalina",
    lema: "¡Color, juventud y entrega!",
    tier: 4,
    tierNombre: "Competitivo",
    exigencia: 53,
    potencialCopa: 1.1,
    hinchadaBase: 81,
    presupuesto: "Medio",
    colores: {
      primary: "#0e7490",
      secondary: "#ffffff",
      accent: "#22d3ee",
      glow: "rgba(14, 116, 144, 0.45)",
      collar: "#0e7490",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con insignia bordada, buzo, campera y pantalón azul petróleo institucional.",
    especialidad: "Cuerpo de Baile",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "del_carmen",
    escudo: "🌸",
    descripcion: "Baile alegre y fresco con gran coordinación de alas y espaldar de lujo.",
    tentacionTexto: "Santa Catalina te invita a encabezar su escuadra de baile."
  },

  // ================= 32. COLEGIO =================
  {
    id: "bop_1",
    nombre: "El BOP 1",
    apodo: "El BOP 1",
    lema: "¡El corazón del barrio en el río!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 45,
    potencialCopa: 0.95,
    hinchadaBase: 78,
    presupuesto: "Bajo",
    colores: {
      primary: "#c026d3",
      secondary: "#ffffff",
      accent: "#e879f9",
      glow: "rgba(192, 38, 211, 0.45)",
      collar: "#c026d3",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Chomba blanca con cuello fucsia y vivos blancos, campera fucsia con vivos blancos y pantalón azul marino.",
    especialidad: "Banda de Música",
    categoria: "B",
    tecnico: false,
    rivalHistorico: "bop_9",
    escudo: "🥁",
    descripcion: "Alegría popular que vence cualquier dificultad y llena de fiesta el asfalto.",
    tentacionTexto: "Te reciben con los brazos abiertos como el ídolo y director del BOP 1."
  },

  // ================= 33. COLEGIO =================
  {
    id: "epet_37",
    nombre: "La 37",
    apodo: "La 37",
    lema: "¡Innovación técnica y ritmo sin fronteras!",
    tier: 5,
    tierNombre: "Emergente",
    exigencia: 48,
    potencialCopa: 1.02,
    hinchadaBase: 79,
    presupuesto: "Medio-Bajo",
    colores: {
      primary: "#1d4ed8",
      secondary: "#60a5fa",
      accent: "#3b82f6",
      glow: "rgba(29, 78, 216, 0.45)",
      collar: "#1d4ed8",
      textContrast: "#ffffff"
    },
    uniformeDesc: "Camisa grafa de taller azul o remera lisa azul reglamentaria, buzo y campera azul marino con pantalón grafa.",
    especialidad: "Carroza Ingeniosa",
    categoria: "B",
    tecnico: true,
    rivalHistorico: "epet_34",
    escudo: "⚙️",
    descripcion: "Taller técnico en ascenso con creatividad mecánica y entusiasmo juvenil desbordante.",
    tentacionTexto: "La 37 te entrega el diseño de su carroza para asombrar a los jurados en la Costanera."
  }
];

/**
 * Jerarquía Oficial para Cuerpo de Baile
 * - Categoría A: Grandes (Roque, San Basilio, Bachi Humanista, Santa María, Madre de la Misericordia)
 * - Categoría B: Competitivos (Comercio 6, Jesús de Nazareth, Inmaculada Concepción, Jesús Niño)
 * - Categoría C y resto: Emergentes (EPET 1 La Indu, Pedro Goyena, Del Carmen, Janssen, San Alberto, EPET 2, Mbororé + resto)
 */
export const JERARQUIA_BAILE = {
  // CATEGORÍA A: Grandes (Élite de Baile)
  roque: {
    categoria: "A",
    categoriaNombre: "Categoría A",
    tier: 3,
    tierNombre: "Grande",
    potencialCopa: 1.38,
    exigencia: 70,
    presupuesto: "Alto",
    especialidad: "Cuerpo de Baile • Cat. A",
    descripcion: "Potencia colosal en Cuerpo de Baile. Faisanes de gala, sincronía implacable y máxima favorita a la Copa en la Costanera.",
    tentacionTexto: "El Roque te entrega el espaldar de faisán de lujo y la primera línea de scola para pelear la gloria en la Categoría A."
  },
  san_basilio: {
    categoria: "A",
    categoriaNombre: "Categoría A",
    tier: 3,
    tierNombre: "Grande",
    potencialCopa: 1.37,
    exigencia: 68,
    presupuesto: "Alto",
    especialidad: "Cuerpo de Baile • Cat. A",
    descripcion: "Puestas en escena teatrales de escala cinematográfica. Vestuarios dorados, diseño imponente y candidatazo al podio de la A.",
    tentacionTexto: "El Sanba te tienta con una posición estelar en su deslumbrante puesta teatral en la Categoría A."
  },
  humanista: {
    categoria: "A",
    categoriaNombre: "Categoría A",
    tier: 3,
    tierNombre: "Grande",
    potencialCopa: 1.36,
    exigencia: 67,
    presupuesto: "Alto",
    especialidad: "Cuerpo de Baile • Cat. A",
    descripcion: "Alta costura, elegancia clásica y conceptos mitológicos que deslumbran al jurado en cada palco del 4to tramo.",
    tentacionTexto: "El Bachi te ofrece destaque protagónico y vestuarios de alta costura artística en la Categoría A."
  },
  santa_maria: {
    categoria: "A",
    categoriaNombre: "Categoría A",
    tier: 3,
    tierNombre: "Grande",
    potencialCopa: 1.37,
    exigencia: 69,
    presupuesto: "Alto",
    especialidad: "Cuerpo de Baile • Cat. A",
    descripcion: "Cuna del brillo, plumas legendarias y coordinación milimétrica. Histórico peleador del oro de la Categoría A.",
    tentacionTexto: "El Santa te garantiza lugar de honor en la coreografía central y respaldo total de vestuario en la Categoría A."
  },
  madre_misericordia: {
    categoria: "A",
    categoriaNombre: "Categoría A",
    tier: 3,
    tierNombre: "Grande",
    potencialCopa: 1.35,
    exigencia: 66,
    presupuesto: "Alto",
    especialidad: "Cuerpo de Baile • Cat. A",
    descripcion: "Gracia radiante, pasistas carismáticas y una scola prolija que siempre entusiasma a las tribunas en la Categoría A.",
    tentacionTexto: "La Madre te convoca para brillar al frente de su escuadra con trajes de gala en la Categoría A."
  },

  // CATEGORÍA B: Competitivos
  comercio_6: {
    categoria: "B",
    categoriaNombre: "Categoría B",
    tier: 4,
    tierNombre: "Competitivo",
    potencialCopa: 1.24,
    exigencia: 58,
    presupuesto: "Medio",
    especialidad: "Cuerpo de Baile • Cat. B",
    descripcion: "El León comercial copando la Categoría B. Scola con mucha energía, ritmo caliente y candidata fuerte al ascenso.",
    tentacionTexto: "Comercio 6 te da el liderazgo de su cuerpo de baile para arrasar en la Categoría B con el aliento del León."
  },
  jesus_nazareth: {
    categoria: "B",
    categoriaNombre: "Categoría B",
    tier: 4,
    tierNombre: "Competitivo",
    potencialCopa: 1.20,
    exigencia: 55,
    presupuesto: "Medio",
    especialidad: "Cuerpo de Baile • Cat. B",
    descripcion: "Orgullo barrial blanco y marrón. Fuerza combativa, coreografías apasionadas y gran crecimiento en la Categoría B.",
    tentacionTexto: "El Naza te propone ser la figura de su cuerpo de baile para emocionar al jurado en la Categoría B."
  },
  inmaculada: {
    categoria: "B",
    categoriaNombre: "Categoría B",
    tier: 4,
    tierNombre: "Competitivo",
    potencialCopa: 1.20,
    exigencia: 56,
    presupuesto: "Medio",
    especialidad: "Cuerpo de Baile • Cat. B",
    descripcion: "Alas celestes y blancas, brillo etéreo y coreografías sincronizadas que dan dura batalla en la Categoría B.",
    tentacionTexto: "La Inmaculada te ofrece traje de destaque con alas iluminadas en la Categoría B."
  },
  jesus_nino: {
    categoria: "B",
    categoriaNombre: "Categoría B",
    tier: 4,
    tierNombre: "Competitivo",
    potencialCopa: 1.18,
    exigencia: 54,
    presupuesto: "Medio",
    especialidad: "Cuerpo de Baile • Cat. B",
    descripcion: "Fuerza y calor de la zona oeste posadeña. Gran alegría y baile muy coordinado para disputar la Categoría B.",
    tentacionTexto: "Jesús Niño te entrega la batuta de su escuadra para buscar el campeonato de la Categoría B."
  },

  // CATEGORÍA C: Emergentes (Clasificación Oficial)
  industrial: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.05,
    exigencia: 50,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "La potencia técnica se reinventa en la danza. Pasistas con garra y actitud decididas a hacer crecer el cuerpo de baile de La Indu.",
    tentacionTexto: "La Indu te propone poner de pie su cuerpo de baile en la Categoría C y romper prejuicios con puro empuje."
  },
  pedro_goyena: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.04,
    exigencia: 49,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "Guerreros albiazules con empeño constante y pasistas comprometidas para dar pelea en la Categoría C.",
    tentacionTexto: "El Goyena te invita a comandar sus filas de baile para buscar el ascenso a la B."
  },
  del_carmen: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.03,
    exigencia: 48,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "Dedicación artesanal, trajes cuidados con esmero y espíritu carmelita buscando el protagonismo en la Categoría C.",
    tentacionTexto: "El Carmen te da el rol de bastonera de honor con traje a medida para crecer en la Categoría C."
  },
  janssen: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.05,
    exigencia: 50,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "El coloso técnico busca consolidar sus alas y pasistas. Pasión azul y oro en un proyecto que busca ganarse un nombre en el baile.",
    tentacionTexto: "El Janssen busca refundar su cuerpo de baile desde la Categoría C y demostrar que el azul y oro también tiene brillo."
  },
  san_alberto: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.02,
    exigencia: 48,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "Entusiasmo albiazul y compañerismo en las noches de ensayo para consolidar su presencia en la Categoría C.",
    tentacionTexto: "San Alberto te ofrece ser la bandera del cuerpo de baile en la Categoría C."
  },
  epet_2: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.02,
    exigencia: 49,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "Fuerza técnica y creativa de la EPET 2 canalizada en sus pasistas para destacarse en la Categoría C.",
    tentacionTexto: "La EPET 2 te convoca para impulsar su cuerpo de baile en la Categoría C con diseño propio."
  },
  mborore: {
    categoria: "C",
    categoriaNombre: "Categoría C",
    tier: 5,
    tierNombre: "Emergente",
    potencialCopa: 1.03,
    exigencia: 48,
    presupuesto: "Medio-Bajo",
    especialidad: "Cuerpo de Baile • Cat. C",
    descripcion: "Ritmos de la selva y calidez guaraní. Pasistas llenas de entusiasmo participando en la Categoría C.",
    tentacionTexto: "El Mbororé te abre sus filas para bailar con identidad misionera en la Categoría C."
  }
};

/**
 * Obtiene un colegio por ID, adaptado a su jerarquía y características según el rubro.
 * @param {string} id 
 * @param {string} rubroId "banda" o "baile"
 * @returns {Object}
 */
export function getColegioById(id, rubroId = "banda") {
  const base = COLEGIOS.find(c => c.id === id) || COLEGIOS[0];
  if (rubroId === "baile") {
    const override = JERARQUIA_BAILE[base.id];
    if (override) {
      return { ...base, ...override };
    }
    // Resto de los colegios en Baile: Categoría C (Emergentes)
    return {
      ...base,
      categoria: "C",
      categoriaNombre: "Categoría C",
      tier: 5,
      tierNombre: "Emergente",
      potencialCopa: 1.00,
      exigencia: 46,
      presupuesto: base.presupuesto === "Alto" ? "Medio" : (base.presupuesto || "Bajo"),
      especialidad: "Cuerpo de Baile • Cat. C",
      descripcion: `Cuerpo de baile emergente de ${base.apodo} en la Categoría C, buscando dar el batacazo con dedicación y ritmo en el asfalto.`,
      tentacionTexto: `Te ofrecen un lugar destacado en el cuerpo de baile de ${base.apodo} para crecer en la Categoría C.`
    };
  }
  return { ...base };
}

/**
 * Retorna todos los 33 colegios adaptados al rubro especificado.
 * @param {string} rubroId "banda" o "baile"
 * @returns {Array<Object>}
 */
export function getColegiosPorRubro(rubroId = "banda") {
  return COLEGIOS.map(c => getColegioById(c.id, rubroId));
}
