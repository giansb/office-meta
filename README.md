# Vortigo Meta — Reserva de Assentos 3D

Aplicação web interativa para reserva de assentos em dias presenciais, com escritório 3D renderizado em tempo real diretamente no browser. O ambiente visual muda automaticamente de acordo com a hora do sistema do usuário.

---

## Funcionalidades

### Reserva de assentos
- Clique em qualquer cadeira **disponível** (azul) para selecioná-la.
- Um painel lateral exibe a confirmação; clique em **Confirmar** para reservar ou **Cancelar** para desistir.
- Cadeiras reservadas ficam vermelhas e não podem mais ser selecionadas.
- Feedback visual por outline colorido diretamente na malha 3D:
  - 🔵 **Azul** — disponível
  - 🟡 **Amarelo** — selecionada
  - 🔴 **Vermelho** — reservada

### Visualização Plano / 3D
- Botão toggle no canto superior direito alterna entre **vista superior (plano)** e **câmera 3D** com rotação livre.
- A transição de câmera é animada suavemente via GSAP.

---

## Stack e bibliotecas

| Lib | Versão | Papel |
|---|---|---|
| **React** | 19 | UI e gerenciamento de ciclo de vida |
| **TypeScript** | 6 | Tipagem estática |
| **Vite** | 8 | Bundler e dev server |
| **Three.js** | 0.184 | Motor de renderização 3D (WebGL) |
| **@react-three/fiber** | 9 | Renderer React para Three.js |
| **@react-three/drei** | 10 | Utilitários 3D: `Sky`, `Environment`, `OrbitControls`, `useGLTF` |
| **@react-three/postprocessing** | 3 | Efeitos de pós-processamento |
| **GSAP** | 3 | Animações de câmera com easing |
| **Zustand** | 5 | Estado global das reservas |
| **gh-pages** | 6 | Deploy automático no GitHub Pages |

---

## Estrutura do projeto

```
src/
├── App.tsx          # Layout, câmera, toggle 2D/3D e modal de reserva
├── store.ts         # Estado global (Zustand): cadeiras reservadas e selecionada
└── components/
    ├── Scene.tsx    # Iluminação e céu dinâmicos baseados na hora do sistema
    └── Office.tsx   # Modelo GLTF do escritório + lógica de seleção de cadeiras
public/
└── models/
    └── chrome_6.glb # Modelo 3D do escritório
```

---

## Rodando localmente

```bash
npm install
npm run dev
```

## Build e deploy

```bash
# Build de produção
npm run build

# Deploy no GitHub Pages
npm run deploy
```

O deploy publica o conteúdo de `dist/` na branch `gh-pages`. A base da URL está configurada como `/office-meta/` no `vite.config.ts`.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
