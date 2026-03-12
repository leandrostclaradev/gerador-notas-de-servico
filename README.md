# Nota de Servico

Aplicacao frontend-only para preenchimento de nota de servico e geracao de PDF no proprio navegador.

## Estrutura

```text
gerador-notas-servico/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── pdf/
│       │   └── NotaServicoPdf.jsx
│       └── services/
│           └── notaServicoApi.js
├── pom.xml
└── src/
```

O backend Java antigo foi mantido no repositorio, mas o fluxo atual de uso e deploy fica concentrado em `frontend/`.

## Rodando localmente

Pre-requisitos:
- Node.js 20+
- npm

Comandos:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Build de producao

```bash
cd frontend
npm run build
```

Os arquivos finais ficam em `frontend/dist`.

## Deploy na Vercel

### Opcao 1: pela interface web

1. Envie este repositorio para GitHub, GitLab ou Bitbucket.
2. Entre na Vercel.
3. Clique em `Add New Project`.
4. Importe o repositorio.
5. Na configuracao do projeto, use:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

6. Clique em `Deploy`.

### Opcao 2: pelo CLI da Vercel

```bash
npm install -g vercel
cd frontend
vercel
```

Na primeira execucao, responda:

```text
Set up and deploy: Y
Which scope: sua conta
Link to existing project: N
Project name: nota-servico
Directory: .
```

Para publicar em producao depois:

```bash
vercel --prod
```

## Como funciona hoje

- O formulario roda 100% no frontend.
- O PDF e gerado no navegador com `@react-pdf/renderer`.
- Nao existe mais dependencia de API para baixar o PDF.
- O arquivo e baixado diretamente no dispositivo da usuaria.

## Observacoes

- O primeiro clique para gerar PDF pode demorar um pouco mais, porque a engine de PDF e carregada sob demanda.
- O projeto ainda contem o backend antigo, mas ele nao e mais necessario para deploy na Vercel.
