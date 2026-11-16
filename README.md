# Portfólio de Emanuel Silas (Flask)

Site one-page em HTML, CSS e JavaScript, com Flask cuidando do que precisa de servidor (formulário de contato, cabeçalhos de segurança, limite de envios).
Todas as imagens dos projetos foram recortadas do seu PDF original, sem alteração de arte.

## Estrutura

```
app.py              rotas Flask (página e /contato)
config.py           TEXTOS, CONTATOS, SERVIÇOS e PROCESSO (edite aqui)
data/projects.json  lista da galeria (arquivo, categoria, título, largura, altura)
templates/index.html
static/css/style.css · static/js/main.js
static/images/      profile/ projects/ branding/ icons/ og.jpg
.env.example        modelo das variáveis secretas
Procfile            comando de execução em produção
```

## Rodar localmente

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                   # abre em http://127.0.0.1:5000
```

## O que testar

Menu no celular, filtros da galeria, clique nas imagens (setas do teclado e botões navegam), botões "Solicitar orçamento" (preenchem o serviço no formulário), validação do formulário e envio.
Para ver o site no celular durante o desenvolvimento: `flask run --host 0.0.0.0` e abra `http://IP-DO-SEU-PC:5000` no celular, na mesma rede Wi-Fi.

## Dados que faltam ou precisam de conferência (em `config.py`)

| Campo | Situação |
|---|---|
| `email`, `instagram` | Lidos do PDF (letra estilizada). **Confira se estão corretos.** |
| `whatsapp` | Não consta no PDF. Preencha com DDI+DDD+número (ex. `5588999999999`). Vazio = botão oculto. |
| `trajetoria`, `visao` | Opcionais. Preenchendo, as seções aparecem sozinhas. |
| `url` | Endereço final do site (para o compartilhamento no Instagram/WhatsApp). |

Os textos do PDF foram corrigidos ("desiger" → "designer", "vizuais" → "visuais", "empresasa" → "empresários").

## Formulário de contato

Cada mensagem é validada no navegador e no servidor (campo-isca invisível, tempo mínimo de preenchimento, limite de 5 envios por hora por IP).
Ela é salva em `instance/mensagens.jsonl` e, se você configurar as variáveis `SMTP_*`, também chega por e-mail.
No Gmail, use uma **senha de app** (Conta Google → Segurança → Verificação em duas etapas → Senhas de app).
Importante: em hospedagem gratuita os arquivos locais podem ser apagados a cada reinício. Configure o SMTP para não perder mensagens.

## Publicar (recomendação: Render, plano gratuito)

1. Crie um repositório no GitHub e envie a pasta (o `.gitignore` já protege o `.env`).
2. Em render.com: **New → Web Service**, conecte o repositório.
3. Build Command: `pip install -r requirements.txt` · Start Command: `gunicorn app:app`
4. Em **Environment**, cadastre `SECRET_KEY` e as variáveis `SMTP_*` / `MAIL_TO`.
5. Ao concluir, o Render fornece um endereço `.onrender.com` com HTTPS automático.

Atenção: no plano gratuito do Render o serviço "dorme" após cerca de 15 minutos sem acesso e o primeiro visitante espera de 30 a 60 segundos. Para um link na bio do Instagram isso pesa; se o site for o seu principal canal, considere um plano pago de entrada ou um serviço de monitoramento que acesse o site periodicamente.
Alternativa: PythonAnywhere (plano Beginner) não dorme, mas o gratuito não aceita domínio próprio. Confira limites e preços atuais nos sites das plataformas, pois mudam.

## HTTPS e domínio próprio

HTTPS vem ativo no Render (certificado automático). Para domínio próprio: compre o domínio (ex. registro.br), em Render → Settings → Custom Domains adicione-o e crie no painel do domínio os registros DNS que o Render indicar (CNAME para `www`, A/ALIAS para a raiz). O certificado é emitido sozinho após a propagação (minutos a horas). Depois preencha `url` em `config.py`.

## Atualizar conteúdo

- **Textos, serviços, contatos:** edite `config.py` e envie ao GitHub; o Render republica sozinho.
- **Nova peça na galeria:** salve a imagem otimizada (JPG, até ~1500 px) em `static/images/projects/` e adicione em `data/projects.json`:
  `{"file":"projects/minha-arte.jpg","cat":"social","title":"Nome da peça","w":1080,"h":1350}` (`cat`: `social`, `poster` ou `branding`). Imagens com proporção maior que 1,5:1 ocupam a largura toda.
- **Trocar a foto:** substitua `static/images/profile/emanuel.jpg`.

## Fontes

O site carrega Anton, Syne e DM Sans do Google Fonts. Para hospedar as fontes você mesmo (mais rápido e sem dependência externa), baixe os arquivos .woff2 para `static/fonts/`, declare com `@font-face` no CSS e remova o `<link>` do Google no `index.html` e a permissão correspondente na CSP em `app.py`.
