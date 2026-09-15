import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/foro.db");

console.log("Limpiando debates basura generados por tests...");
db.prepare("DELETE FROM hilos WHERE titulo LIKE '%Debate XSS%' OR titulo LIKE '%test de umbral%'").run();
db.prepare("DELETE FROM comentarios WHERE contenido LIKE '%integración automática%' OR contenido LIKE '%test%'").run();
db.prepare("UPDATE hilos SET colegio_id = 'janssen' WHERE colegio_id = 'posadas'").run();

// Verificar hilos existentes
const existingHilos = db.prepare("SELECT id, titulo, colegio_id FROM hilos").all();
console.log("Hilos conservados:", existingHilos);

const sampleThreads = [
  {
    canal: "banda",
    colegio: "roque",
    titulo: "¡Los cortes de batería del Roque González este año prometen podio!",
    contenido: "Tremenda la potencia en la última prueba piloto. Los cortes cruzados de chancha y los redobles secos del Roque están sonando impecables en el palco 2.",
    autorGoogleId: "seed-roque-1",
    autorNombre: "Bautista Roque",
    avatar: "assets/avatar-default.webp",
    votos: 42,
    respuestasCount: 2,
    fijado: 1,
    dateOffsetHours: 4,
    comentarios: [
      { autor: "Camila Pasista", googleId: "seed-roque-2", colegio: "roque", contenido: "¡Totalmente! Además la sincronización con los pasos del cuerpo de baile quedó de 10.", votos: 8 },
      { autor: "Lucas Percusión", googleId: "seed-janssen-1", colegio: "janssen", contenido: "Se nota el laburo en los parches, lindo cruce vamos a tener en la Costanera.", votos: 5 }
    ]
  },
  {
    canal: "baile",
    colegio: "roque",
    titulo: "Puesta en escena del Cuerpo de Baile del Roque: temática y espaldares",
    contenido: "¿Vieron el diseño de los espaldares dorados y rojos? Se nota el esfuerzo de las familias y la comisión para llegar impecables a la primera noche.",
    autorGoogleId: "seed-roque-2",
    autorNombre: "Camila Pasista",
    avatar: "assets/avatar-default.webp",
    votos: 35,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 7,
    comentarios: [
      { autor: "Valentina Pasista", googleId: "seed-santa-1", colegio: "santa_maria", contenido: "Hermosa la combinación de colores, felicitaciones a las escuadras.", votos: 6 }
    ]
  },
  {
    canal: "baile",
    colegio: "santa_maria",
    titulo: "¿Cómo influye el peso de los espaldares en las pasadas largas de la Costanera?",
    contenido: "Bailar 800 metros seguidos con plumas y tocados de pedrería demanda un físico tremendo. ¿Qué técnicas de respiración usan sus escuadras para no agotarse antes de los palcos?",
    autorGoogleId: "seed-santa-1",
    autorNombre: "Valentina Pasista",
    avatar: "assets/avatar-default.webp",
    votos: 38,
    respuestasCount: 2,
    fijado: 1,
    dateOffsetHours: 5,
    comentarios: [
      { autor: "Sofi Santa", googleId: "seed-santa-2", colegio: "santa_maria", contenido: "Los ejercicios aeróbicos antes de salir a la pista ayudan muchísimo a aguantar el ritmo sin perder la sonrisa.", votos: 9 },
      { autor: "Lucía Pasista", googleId: "seed-madre-1", colegio: "madre_misericordia", contenido: "Nosotras rotamos la primera fila en los tramos intermedios para guardar energía para el jurado.", votos: 7 }
    ]
  },
  {
    canal: "hinchadas",
    colegio: "santa_maria",
    titulo: "La tribuna y el aliento del Santa copando el cuarto tramo",
    contenido: "Ya tenemos listos los telones gigantes y el humo blanco y azul. Este año la tribuna del Santa va a alentar sin parar desde el primer palco hasta el monumento.",
    autorGoogleId: "seed-santa-2",
    autorNombre: "Sofi Santa",
    avatar: "assets/avatar-default.webp",
    votos: 29,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 12,
    comentarios: [
      { autor: "Valentina Pasista", googleId: "seed-santa-1", colegio: "santa_maria", contenido: "¡Se siente muchísimo el aguante desde la calle cuando la tribuna canta!", votos: 4 }
    ]
  },
  {
    canal: "banda",
    colegio: "san_basilio",
    titulo: "Los nuevos redobles acelerados del San Basilio en la prueba piloto",
    contenido: "Tremendo cambio de ritmo metieron este año los chicos del Sanba. Pasaron de un compás tradicional a un ritmo mucho más dinámico que contagia a todo el público.",
    autorGoogleId: "seed-sanba-1",
    autorNombre: "Mateo Sanba",
    avatar: "assets/avatar-default.webp",
    votos: 40,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 6,
    comentarios: [
      { autor: "Lucas Percusión", googleId: "seed-janssen-1", colegio: "janssen", contenido: "Muy prolijo el corte en seco antes de entrar a la zona de palcos.", votos: 6 }
    ]
  },
  {
    canal: "baile",
    colegio: "madre_misericordia",
    titulo: "La coreografía y sincronización de la Madre Misericordia 2026",
    contenido: "Los ensayos en el parque están dando sus frutos. Las escuadras de la Madre vienen con una coordinación impecable en las figuras complejas.",
    autorGoogleId: "seed-madre-1",
    autorNombre: "Lucía Pasista",
    avatar: "assets/avatar-default.webp",
    votos: 31,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 8,
    comentarios: [
      { autor: "Tomás Percu", googleId: "seed-madre-2", colegio: "madre_misericordia", contenido: "La banda acompaña cada cambio de paso con cortes bien marcados.", votos: 5 }
    ]
  },
  {
    canal: "simulador",
    colegio: "industrial",
    titulo: "Propuesta: Que se puedan personalizar los cortes de redoble en el juego",
    contenido: "Estaría genial que en las noches de calle del simulador puedas elegir ritmos acelerados o hacer solos de batería antes de entrar al palco.",
    autorGoogleId: "seed-indu-1",
    autorNombre: "Agustín Gamer",
    avatar: "assets/avatar-default.webp",
    votos: 52,
    respuestasCount: 2,
    fijado: 1,
    dateOffsetHours: 9,
    comentarios: [
      { autor: "Franco Indu", googleId: "seed-indu-2", colegio: "industrial", contenido: "¡Apoyo total! Poder meter redobles propios sumaría muchísima adrenalina.", votos: 11 },
      { autor: "Lucas Percusión", googleId: "seed-janssen-1", colegio: "janssen", contenido: "Y que te sume bonificación de RITM en el score final.", votos: 8 }
    ]
  },
  {
    canal: "banda",
    colegio: "industrial",
    titulo: "Potencia de los tambores de la Industrial: el sonido inconfundible",
    contenido: "Cuando suena la chancha de la Indu tiembla el asfalto de la Costanera. Este año la afinación de los parches metálicos está más brillante que nunca.",
    autorGoogleId: "seed-indu-2",
    autorNombre: "Franco Indu",
    avatar: "assets/avatar-default.webp",
    votos: 45,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 11,
    comentarios: [
      { autor: "Agustín Gamer", googleId: "seed-indu-1", colegio: "industrial", contenido: "La acústica que se logra bajando hacia el río es una locura.", votos: 7 }
    ]
  },
  {
    canal: "banda",
    colegio: "janssen",
    titulo: "¡Ritmos y sincronización de las chanchas pesadas en la Costanera!",
    contenido: "¿Qué opinan de los cortes que prepararon los colegios técnicos este año? En las pruebas piloto se notó una potencia tremenda en los palcos.",
    autorGoogleId: "seed-janssen-1",
    autorNombre: "Lucas Percusión",
    avatar: "assets/avatar-default.webp",
    votos: 48,
    respuestasCount: 2,
    fijado: 1,
    dateOffsetHours: 3,
    comentarios: [
      { autor: "Facu Janssen", googleId: "seed-janssen-2", colegio: "janssen", contenido: "Los cortes rápidos entre repiques y redoblantes salieron perfectos.", votos: 10 }
    ]
  },
  {
    canal: "hinchadas",
    colegio: "epet_34",
    titulo: "La hinchada de la 34 se hace sentir en el tercer tramo de la Costanera",
    contenido: "Copando el tramo con toda la pasión posadeña. Este año la 34 viene con banderas renovadas y todo el apoyo a la banda y al cuerpo de baile.",
    autorGoogleId: "111871790166334934946",
    autorNombre: "Santy Ruiz Diaz",
    avatar: "assets/avatar-default.webp",
    votos: 36,
    respuestasCount: 2,
    fijado: 0,
    dateOffsetHours: 5,
    comentarios: [
      { autor: "Nico Batería", googleId: "seed-34-2", colegio: "epet_34", contenido: "¡El aliento de la tribuna empuja muchísimo cuando van 40 minutos de desfile!", votos: 8 }
    ]
  },
  {
    canal: "banda",
    colegio: "pedro_goyena",
    titulo: "Ensayos nocturnos del Goyena con cuerpo de baile completo",
    contenido: "Muy buen nivel en los ensayos generales en la plazoleta. El Goyena viene consolidando un ritmo armónico y las pasistas sincronizan cada cambio sin titubear.",
    autorGoogleId: "seed-goyena-1",
    autorNombre: "Julieta Goyena",
    avatar: "assets/avatar-default.webp",
    votos: 28,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 14,
    comentarios: [
      { autor: "Bautista Roque", googleId: "seed-roque-1", colegio: "roque", contenido: "Gran trabajo de los profes y los directores este año.", votos: 4 }
    ]
  },
  {
    canal: "banda",
    colegio: "nacional",
    titulo: "El ritmo tradicional del Colegio Nacional Martín de Moussy",
    contenido: "Manteniendo la esencia clásica de la Estudiantina con los toques característicos del Nacional. ¿Cuál es su tema favorito de este año?",
    autorGoogleId: "seed-nacional-1",
    autorNombre: "Rodrigo Nacional",
    avatar: "assets/avatar-default.webp",
    votos: 34,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 15,
    comentarios: [
      { autor: "Nahuel Normal", googleId: "seed-normal-1", colegio: "normal_mixta", contenido: "El enganche de ritmos latinos con marcha quedó excelente.", votos: 6 }
    ]
  },
  {
    canal: "banda",
    colegio: "normal_mixta",
    titulo: "Sincronización de cajas y platillos en la Normal Mixta",
    contenido: "La Escuela Normal viene con un bloque de percusión femenina super afinado. Muy prolijas las entradas y salidas de cada corte.",
    autorGoogleId: "seed-normal-1",
    autorNombre: "Nahuel Normal",
    avatar: "assets/avatar-default.webp",
    votos: 26,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 18,
    comentarios: [
      { autor: "Rodrigo Nacional", googleId: "seed-nacional-1", colegio: "nacional", contenido: "Gran progreso en la coordinación de los platilleros.", votos: 5 }
    ]
  },
  {
    canal: "banda",
    colegio: "comercio_6",
    titulo: "Los arreglos de redoblantes de Comercio 6 para la 1° noche de calle",
    contenido: "Preparando los últimos detalles para el desfile inaugural. Comercio 6 tiene un ritmo veloz y contundente que levanta a la tribuna.",
    autorGoogleId: "seed-c6-1",
    autorNombre: "Joaquín C6",
    avatar: "assets/avatar-default.webp",
    votos: 30,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 20,
    comentarios: [
      { autor: "Belén C18", googleId: "seed-c18-1", colegio: "comercio_18", contenido: "¡Muchos éxitos vecinos de Comercio!", votos: 7 }
    ]
  },
  {
    canal: "baile",
    colegio: "comercio_18",
    titulo: "Cuerpo de baile de Comercio 18: vestuario y accesorios en preparación",
    contenido: "Las chicas de Comercio 18 están ultimando el brillo y los detalles de los tocados para el estreno en la Costanera.",
    autorGoogleId: "seed-c18-1",
    autorNombre: "Belén C18",
    avatar: "assets/avatar-default.webp",
    votos: 24,
    respuestasCount: 0,
    fijado: 0,
    dateOffsetHours: 22,
    comentarios: []
  },
  {
    canal: "general",
    colegio: "humanista",
    titulo: "Diseño de los tocados y estandarte alegórico del Bachillerato Humanista",
    contenido: "El Bachi siempre se destaca por la fineza conceptual de sus temáticas. Este año la alegoría promete sorprender a los jurados.",
    autorGoogleId: "seed-bachi-1",
    autorNombre: "Clara Bachi",
    avatar: "assets/avatar-default.webp",
    votos: 31,
    respuestasCount: 1,
    fijado: 0,
    dateOffsetHours: 24,
    comentarios: [
      { autor: "Camila Pasista", googleId: "seed-roque-1", colegio: "roque", contenido: "Muy delicado el trabajo artesanal en las telas.", votos: 5 }
    ]
  }
];

const insH = db.prepare(`
  INSERT INTO hilos (canal_id, titulo, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, respuestas_count, fijado, creado_en)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insC = db.prepare(`
  INSERT INTO comentarios (hilo_id, contenido, autor_google_id, autor_nombre, autor_avatar, colegio_id, votos, creado_en)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const t of sampleThreads) {
  const dateStr = new Date(Date.now() - t.dateOffsetHours * 3600000).toISOString().replace("T", " ").substring(0, 19);
  const info = insH.run(
    t.canal,
    t.titulo,
    t.contenido,
    t.autorGoogleId,
    t.autorNombre,
    t.avatar,
    t.colegio,
    t.votos,
    t.comentarios.length,
    t.fijado,
    dateStr
  );
  const hiloId = info.lastInsertRowid;

  for (const c of t.comentarios) {
    const cDate = new Date(Date.now() - (t.dateOffsetHours - 1) * 3600000).toISOString().replace("T", " ").substring(0, 19);
    insC.run(
      hiloId,
      c.contenido,
      c.googleId,
      c.autor,
      t.avatar,
      c.colegio,
      c.votos,
      cDate
    );
  }
}

console.log("¡Debates sembrados con éxito!");
console.log("Resumen por colegio:");
console.log(db.prepare("SELECT colegio_id, count(*) as count FROM hilos GROUP BY colegio_id ORDER BY count DESC").all());
