import test from "node:test";
import assert from "node:assert/strict";

import { COLEGIOS } from "../js/colegios.js";
import { RUBROS } from "../js/roles.js";
import { EVENTOS_POR_FASE, getEventosPorAnioYFases } from "../js/eventos.js";

test("Colegios: Verifica que existan colegios y que tengan estructura válida", () => {
  assert.ok(Array.isArray(COLEGIOS), "COLEGIOS debe ser un array");
  assert.ok(COLEGIOS.length >= 30, `Debe haber al menos 30 colegios (encontrados: ${COLEGIOS.length})`);

  const ids = new Set();
  for (const col of COLEGIOS) {
    assert.ok(col.id, "Cada colegio debe tener un id");
    assert.ok(!ids.has(col.id), `ID duplicado de colegio: ${col.id}`);
    ids.add(col.id);

    assert.ok(col.nombre, `El colegio ${col.id} debe tener un nombre`);
    assert.ok(col.lema, `El colegio ${col.id} debe tener un lema`);
    assert.ok(col.colores, `El colegio ${col.id} debe tener colores`);
    assert.ok(col.colores.primary, `El colegio ${col.id} debe tener color primario`);
    assert.ok(typeof col.tier === "number", `El colegio ${col.id} debe tener un tier numérico`);
  }
});

test("Rubros y Roles: Verifica rubros de Banda y Baile y roles iniciales", () => {
  assert.ok(Array.isArray(RUBROS), "RUBROS debe ser un array");
  assert.equal(RUBROS.length, 2, "Debe haber exactamente 2 rubros principales (Banda y Baile)");

  const rubroBanda = RUBROS.find(r => r.id === "banda");
  const rubroBaile = RUBROS.find(r => r.id === "baile");

  assert.ok(rubroBanda, "Debe existir el rubro banda");
  assert.ok(rubroBaile, "Debe existir el rubro baile");

  assert.ok(Array.isArray(rubroBanda.rolesIniciales), "Banda debe tener roles iniciales");
  assert.ok(rubroBanda.rolesIniciales.length >= 3, "Banda debe tener al menos 3 roles iniciales");

  for (const rol of [...rubroBanda.rolesIniciales, ...rubroBaile.rolesIniciales]) {
    assert.ok(rol.id, "Cada rol debe tener id");
    assert.ok(rol.nombre, "Cada rol debe tener nombre");
    assert.ok(rol.bonus, `El rol ${rol.id} debe tener bonus de atributos`);
    assert.ok(typeof rol.bonus.overall === "number", `El rol ${rol.id} debe tener bonus overall`);
  }
});

test("Eventos de Simulación: Verifica estructura por fases para los años escolares", () => {
  assert.ok(EVENTOS_POR_FASE, "EVENTOS_POR_FASE debe estar definido");

  for (let anio = 1; anio <= 6; anio++) {
    const eventos = getEventosPorAnioYFases(anio);
    assert.ok(Array.isArray(eventos), `getEventosPorAnioYFases(${anio}) debe retornar un array`);
    assert.equal(eventos.length, 4, `El año ${anio} debe tener exactamente 4 fases de eventos`);
    for (const fase of eventos) {
      assert.ok(fase.id, `Cada fase del año ${anio} debe tener un id`);
      assert.ok(fase.titulo, `Cada fase del año ${anio} debe tener un título`);
      assert.ok(fase.descripcion, `Cada fase del año ${anio} debe tener una descripción`);
      assert.ok(Array.isArray(fase.opciones), `Cada fase del año ${anio} debe tener opciones`);
      assert.ok(fase.opciones.length >= 2, `Cada fase debe tener al menos 2 opciones de decisión`);
      for (const opc of fase.opciones) {
        assert.ok(opc.id, "Cada opción debe tener id");
        assert.ok(opc.texto, "Cada opción debe tener texto");
        assert.ok(opc.exito, "Cada opción debe tener efectos de éxito");
      }
    }
  }
});
