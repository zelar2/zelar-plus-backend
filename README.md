# ZELAR+ — Projeto completo para Android Studio

Aplicativo de saúde domiciliar (home care) com **Capacitor 8 + Vite + Node.js/Express + SQLite**.
Este pacote já está **pronto para abrir no Android Studio**: o projeto Android nativo (`android/`)
está gerado e as telas reais do app já estão compiladas dentro dele.

---

## O que estava faltando e foi colocado no lugar

| Item | Antes | Agora |
|---|---|---|
| Build do app | O APK continha o **demo do Vite** (contador), não as telas do ZELAR+ | `vite.config.js` multi-página compila as **25 telas reais** para `dist/` |
| Assets no Android | `android/app/src/main/assets/public` tinha o build errado | Assets sincronizados com as telas reais (`npx cap sync`) |
| `@capacitor/cli` e `@capacitor/core` | Ausentes do `package.json` | Adicionados (sem eles o `cap sync` não funciona) |
| Scripts JS das telas | Não eram empacotados no build | Empacotados corretamente (`type="module"`) |
| Ícones e splash | Padrão genérico do Capacitor | Marca ZELAR+ em todas as densidades + variantes noturnas |
| Permissões de câmera/microfone | Ausentes (teleconsulta não abriria a câmera) | `CAMERA`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS` no manifest |

**Nada foi redesenhado:** todas as telas, fluxos e estilos foram mantidos como estão.

---

## Como rodar no Android Studio

### Pré-requisitos
- **Node.js 22 LTS** ou superior (o Capacitor 8 exige Node ≥ 22)
- **Android Studio** atualizado (com Android SDK 36 instalado)
- JDK 17+ (o Android Studio já traz um embutido)

### Passo a passo

```bash
# 1. Na pasta do projeto, instale as dependências
npm install

# 2. Compile o app web e sincronize com o projeto Android
npm run sync
```

3. Abra o **Android Studio** → **Open** → selecione a pasta **`android/`** do projeto.
4. Aguarde o primeiro *Gradle Sync* (ele baixa o Gradle 8.14.3 e as dependências — pode levar alguns minutos).
5. Conecte um aparelho (ou crie um emulador) e clique em **Run ▶**.

> Dica: `npm run android` faz os passos 1–2 e já abre o Android Studio (no Windows/Mac).

> O arquivo `android/local.properties` (caminho do SDK) é criado automaticamente
> pelo Android Studio na sua máquina — ele não acompanha o pacote de propósito.

### Atalhos de build (sem Android Studio)
```bash
cd android
./gradlew assembleDebug        # gera app-debug.apk em app/build/outputs/apk/debug/
```

---

## Backend (opcional — login/cadastro reais)

O app funciona sozinho (cai em modo demonstração se a API estiver fora).
Para ter autenticação e banco de dados reais:

```bash
cd backend
npm install
npm start        # API em http://localhost:3000/api
```

Principais endpoints: `POST /api/login` · `POST /api/cadastro` · `POST /api/recuperar-senha` ·
`GET/POST /api/usuarios` · `GET/POST /api/profissionais` · `GET/POST /api/atendimentos` ·
`GET/POST /api/solicitacoes` · `POST /api/documentos/upload` · `GET /api/admin/painel`

> No APK, o app chama `http://localhost:3000/api`. Para apontar para um servidor real,
> ajuste a constante `API_URL` em `frontend/cliente/app/1-login/js/login.js`,
> `frontend/cliente/app/1-login/script.js` e `frontend/cliente/src/api.js`, e rode `npm run sync`.

---

## Estrutura

```
zelar2/
├── android/                  # Projeto Android nativo (abrir no Android Studio)
│   └── app/src/main/assets/public/   # telas do app já compiladas
├── dist/                     # build web (webDir do Capacitor)
├── frontend/cliente/app/     # código-fonte das 25 telas
│   ├── 1-login/              # login, cadastro, recuperar senha
│   ├── 2-explicacao/         # como funciona
│   ├── 3-selecionar-atendimento/     # 10 categorias + fluxos (presencial e vídeo)
│   ├── 4-cadastro-profissional/      # categorias, dados, documentos, foto, repasse, termo, enviado
│   ├── mapa/                 # profissionais próximos (mapa)
│   └── assets/css/global.css # design system ZELAR+
├── backend/                  # API Express + SQLite (schema em src/database/schema.sql)
├── resources/                # ícones e splash-fonte da marca
├── icons/                    # ícones webp (PWA)
├── capacitor.config.json     # appId com.zelar.app · appName ZELAR+ · webDir dist
└── vite.config.js            # build multi-página das telas reais
```

## Detalhes do projeto Android
- **applicationId:** `com.zelar.app` · **MainActivity:** `com.zelar.app.MainActivity`
- **Gradle:** 8.14.3 (wrapper incluso) · **compileSdk/targetSdk:** 36 · **minSdk:** 24
- Ícones adaptativos + splash (claro e noturno) com a marca ZELAR+ já nas pastas `res/`