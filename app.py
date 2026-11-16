import json, re, smtplib, time
from collections import defaultdict, deque
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path

from flask import Flask, jsonify, render_template, request

from config import BASE, CATEGORIES, PROCESS, SERVICES, SITE, SPECIALTIES, Config

app = Flask(__name__)
app.config.from_object(Config)

PROJECTS = json.loads((BASE / "data" / "projects.json").read_text("utf-8"))
SERVICE_OPTIONS = [s[0] for s in SERVICES] + ["Outro assunto"]
INBOX = Path(app.instance_path) / "mensagens.jsonl"
hits = defaultdict(deque)  # limite simples de envios por IP


@app.get("/")
def index():
    return render_template("index.html", s=SITE, projects=PROJECTS, cats=CATEGORIES, specialties=SPECIALTIES,
                           services=SERVICES, process=PROCESS, options=SERVICE_OPTIONS, year=datetime.now().year)


@app.post("/contato")
def contato():
    d = request.get_json(silent=True) or {}
    ip = (request.headers.get("X-Forwarded-For") or request.remote_addr or "").split(",")[0].strip()
    now, q = time.time(), hits[ip]
    while q and now - q[0] > 3600:
        q.popleft()
    if len(q) >= 5:
        return jsonify(ok=False, error="Muitas tentativas. Tente de novo mais tarde."), 429
    if d.get("site") or float(d.get("t") or 0) < 3000:  # campo-isca preenchido ou envio rápido demais = robô
        return jsonify(ok=False, error="Não foi possível enviar. Tente novamente."), 400

    nome, email = str(d.get("nome", "")).strip(), str(d.get("email", "")).strip()
    servico, msg = str(d.get("servico", "")).strip(), str(d.get("mensagem", "")).strip()
    if not (2 <= len(nome) <= 80 and re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email) and len(email) <= 120
            and servico in SERVICE_OPTIONS and 10 <= len(msg) <= 2000):
        return jsonify(ok=False, error="Revise os campos e tente novamente."), 422

    q.append(now)
    registro = dict(quando=datetime.now().isoformat(timespec="seconds"), nome=nome, email=email, servico=servico, mensagem=msg)
    INBOX.parent.mkdir(parents=True, exist_ok=True)
    with INBOX.open("a", encoding="utf-8") as f:
        f.write(json.dumps(registro, ensure_ascii=False) + "\n")

    if app.config["SMTP_HOST"]:
        try:
            m = EmailMessage()
            m["Subject"], m["From"], m["To"], m["Reply-To"] = f"Novo contato: {servico}", app.config["SMTP_USER"], app.config["MAIL_TO"], email
            m.set_content(f"Nome: {nome}\nE-mail: {email}\nServiço: {servico}\n\n{msg}")
            with smtplib.SMTP(app.config["SMTP_HOST"], app.config["SMTP_PORT"], timeout=10) as s:
                s.starttls()
                s.login(app.config["SMTP_USER"], app.config["SMTP_PASS"])
                s.send_message(m)
        except Exception:
            app.logger.exception("Falha ao enviar e-mail (mensagem foi salva em %s)", INBOX)
    return jsonify(ok=True)


@app.after_request
def seguranca(r):
    r.headers["Content-Security-Policy"] = ("default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; "
                                            "font-src https://fonts.gstatic.com; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'")
    r.headers["X-Content-Type-Options"] = "nosniff"
    r.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if request.is_secure or request.headers.get("X-Forwarded-Proto") == "https":
        r.headers["Strict-Transport-Security"] = "max-age=31536000"
    if request.path.startswith("/static/"):
        r.headers["Cache-Control"] = "public, max-age=2592000"
    return r


if __name__ == "__main__":
    app.run(debug=True)
