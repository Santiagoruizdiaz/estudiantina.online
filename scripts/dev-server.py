#!/usr/bin/env python3
"""
Servidor Local de Desarrollo para Estudiantina Posadas (estudiantina.online)
Soporta archivos estáticos, fallback SPA, y simulación de API (/api/comunidad, /api/ranking, /api/foro).
"""

import http.server
import socketserver
import os
import json
import sqlite3
import mimetypes
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get("PORT", 3000))
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "foro.db")
COMUNIDAD_JSON = os.path.join(DATA_DIR, "comunidad.json")
RANKING_JSON = os.path.join(DATA_DIR, "ranking.json")

# Asegurar mimetypes correctos
mimetypes.init()
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("application/manifest+json", ".webmanifest")

def send_json(handler, data, status=200):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    handler.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
    handler.end_headers()
    handler.wfile.write(body)

class EstudiantinaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        clean_path = parsed.path
        qs = parse_qs(parsed.query)

        # 1. Seguridad: bloquear acceso directo a /data/ y archivos ocultos
        normalized = os.path.normpath(clean_path).lstrip("/")
        if normalized.startswith("data") or normalized.startswith(".") or "/." in normalized:
            self.send_error(403, "Acceso denegado a datos del sistema")
            return

        # 2. Rutas API
        if clean_path in ("/api/comunidad", "/api/comunidad.php"):
            self.handle_api_comunidad()
            return
        if clean_path in ("/api/ranking", "/api/ranking.php"):
            self.handle_api_ranking()
            return
        if clean_path in ("/api/foro", "/api/foro.php"):
            self.handle_api_foro(qs)
            return

        # 3. Servir archivos estáticos
        target_file = os.path.join(BASE_DIR, normalized)
        if os.path.isdir(target_file):
            index_candidate = os.path.join(target_file, "index.html")
            if os.path.isfile(index_candidate):
                target_file = index_candidate

        if os.path.isfile(target_file):
            super().do_GET()
            return

        # 4. Fallback a index.html (SPA) si la ruta no tiene extensión
        _, ext = os.path.splitext(clean_path)
        if not ext and os.path.isfile(os.path.join(BASE_DIR, "index.html")):
            self.path = "/index.html"
            super().do_GET()
            return

        super().do_GET()

    def handle_api_comunidad(self):
        data = {"noticias": [], "cronograma": [], "guia": [], "faq": [], "ajustes": []}
        if os.path.isfile(COMUNIDAD_JSON):
            try:
                with open(COMUNIDAD_JSON, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception as e:
                pass
        send_json(self, data)

    def handle_api_ranking(self):
        data = []
        if os.path.isfile(RANKING_JSON):
            try:
                with open(RANKING_JSON, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception:
                pass
        send_json(self, data)

    def handle_api_foro(self, qs):
        action = qs.get("action", [""])[0]
        if not os.path.isfile(DB_PATH):
            send_json(self, {"status": "ok", "action": action, "data": []})
            return

        try:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            if action == "canales":
                cursor.execute("SELECT * FROM canales")
                rows = [dict(r) for r in cursor.fetchall()]
                conn.close()
                send_json(self, {"canales": rows})
                return

            elif action == "hilos":
                canal = qs.get("canal", [""])[0]
                if canal:
                    cursor.execute("SELECT * FROM hilos WHERE canal_id = ? AND oculto = 0 ORDER BY fijado DESC, id DESC LIMIT 50", (canal,))
                else:
                    cursor.execute("SELECT * FROM hilos WHERE oculto = 0 ORDER BY fijado DESC, id DESC LIMIT 50")
                rows = [dict(r) for r in cursor.fetchall()]
                conn.close()
                send_json(self, {"hilos": rows, "total": len(rows)})
                return

            elif action == "hilo":
                hilo_id = qs.get("id", ["0"])[0]
                cursor.execute("SELECT * FROM hilos WHERE id = ?", (hilo_id,))
                hilo = cursor.fetchone()
                if not hilo:
                    conn.close()
                    send_json(self, {"status": "error", "message": "Hilo no encontrado"}, 404)
                    return
                cursor.execute("SELECT * FROM comentarios WHERE hilo_id = ? AND oculto = 0 ORDER BY id ASC", (hilo_id,))
                comentarios = [dict(r) for r in cursor.fetchall()]
                conn.close()
                send_json(self, {"status": "ok", "hilo": dict(hilo), "comentarios": comentarios})
                return

            conn.close()
            send_json(self, {"status": "ok", "action": action})
        except Exception as e:
            send_json(self, {"status": "error", "message": str(e)}, 500)

    def end_headers(self):
        # Asegurar headers anti-caching para desarrollo si es html/js/css
        if self.path.endswith(".html"):
            self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

def run():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), EstudiantinaHandler) as httpd:
        print(f"🥁 Servidor Estudiantina Online activo en http://localhost:{PORT}")
        print(f"👉 Hub Principal:      http://localhost:{PORT}/")
        print(f"🎮 Simulador de Juego: http://localhost:{PORT}/simulador.html")
        print(f"📰 Comunidad:          http://localhost:{PORT}/comunidad.html")
        print(f"💬 Foro:               http://localhost:{PORT}/foro.html")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")

if __name__ == "__main__":
    run()
