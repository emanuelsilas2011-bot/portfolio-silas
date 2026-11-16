"""Tudo que você pode querer editar no site fica aqui (textos, contatos, serviços).
Segredos (senha de e-mail etc.) NUNCA ficam neste arquivo: use variáveis de ambiente (.env)."""
import os
from pathlib import Path

BASE = Path(__file__).parent

SITE = dict(
    name="Emanuel Silas", first="Emanuel", last="Silas",
    role="Designer Gráfico e Social Media",
    headline="Materiais visuais para quem quer se comunicar melhor e se destacar.",
    seo="Portfólio de Emanuel Silas, designer gráfico, social media e brand designer. Posts, stories, posters, flyers e identidade visual.",
    about=("Olá, me chamo Emanuel Silas, designer gráfico, social media e brand designer. "
           "Crio materiais visuais para empresários e pequenos negócios que buscam se comunicar melhor e se destacar."),
    skills=["Ilustração vetorial", "Designer gráfico", "Social media", "Brand designer"],
    software=[("Affinity", "images/icons/affinity.png"), ("Canva", "images/icons/canva.png")],
    trajetoria="",  # opcional: escreva sua trajetória e a seção aparece sozinha
    visao="",       # opcional: escreva sua visão criativa e a seção aparece sozinha
    # Contatos: e-mail e Instagram vêm do seu PDF (confira!). WhatsApp: só números com DDI, ex. 5588999999999
    email="emanuelsilas.2011@gmail.com",
    instagram="silas.dsgn",
    whatsapp="5588992287898",
    url="",         # endereço final do site, ex. https://seudominio.com.br (usado no compartilhamento)
)

SPECIALTIES = [
    ("Design gráfico", "Peças visuais com composição, tipografia e cor pensadas para o objetivo de cada cliente."),
    ("Identidade visual", "Logotipo, paleta e aplicações que dão à marca um jeito próprio de aparecer."),
    ("Social media", "Artes para redes sociais com padrão visual consistente."),
    ("Posts e Stories", "Peças avulsas ou em série, prontas para publicar."),
    ("Flyers e posters", "Cartazes e artes de divulgação com impacto visual."),
    ("Materiais publicitários", "Artes de promoção, eventos e lançamentos."),
]

SERVICES = [
    ("Criação de identidade visual", "Logotipo, paleta de cores e aplicações para a sua marca.", "Uma marca reconhecível em qualquer lugar."),
    ("Design para Instagram", "Posts, capas e Stories com padrão visual consistente.", "Um perfil organizado que passa confiança."),
    ("Materiais publicitários", "Peças para divulgar produtos, promoções e eventos.", "Sua oferta comunicada com clareza."),
    ("Posts e Stories", "Artes avulsas ou em série para o seu calendário de conteúdo.", "Conteúdo pronto para publicar, sem improviso."),
    ("Peças gráficas", "Flyers, posters, camisas e artes de eventos.", "Material digital e impresso no mesmo padrão."),
    ("Social Media", "Criação visual de conteúdo para as suas redes.", "Presença constante e alinhada com a marca."),
]

PROCESS = [
    ("Briefing", "Entendo as necessidades do cliente."),
    ("Planejamento", "Defino a direção criativa e a estratégia."),
    ("Criação", "Desenvolvo as peças e soluções visuais."),
    ("Entrega", "Apresento os materiais finalizados."),
]

CATEGORIES = [("todos", "Tudo"), ("social", "Redes sociais"), ("poster", "Posters e flyers"), ("branding", "Identidade visual")]


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or os.urandom(24).hex()
    MAX_CONTENT_LENGTH = 32 * 1024
    JSON_AS_ASCII = False
    # E-mail (opcional). Sem isso, as mensagens ficam salvas em instance/mensagens.jsonl
    SMTP_HOST = os.environ.get("SMTP_HOST", "")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
    SMTP_USER = os.environ.get("SMTP_USER", "")
    SMTP_PASS = os.environ.get("SMTP_PASS", "")
    MAIL_TO = os.environ.get("MAIL_TO", SITE["email"])
