# 📺 HypeBoard — Cartelera de Conocimiento

Full-stack app que transforma el payload crudo de la API de YouTube en un scoreboard de Hype limpio y visual. El backend en **NestJS** filtra, calcula y normaliza los datos; el frontend en **React** los presenta en una cartelera donde la **Joya de la Corona** 💎 (el video con mayor hype) se destaca visualmente del resto.

> 🔗 **Repositorio:** https://github.com/Ferain93/hype-board

---

## 🏗️ Arquitectura del proyecto

```
hype-board/
├── hype-backend/          # API REST — NestJS + TypeScript
│   └── src/
│       ├── videos/        # Módulo principal (controller, service, interface)
│       │   ├── video.interface.ts    # Tipos: YoutubeVideoRaw → VideoClean
│       │   ├── videos.controller.ts  # GET /api/videos
│       │   ├── videos.module.ts      # Registro del módulo
│       │   └── videos.service.ts     # Lógica de negocio (hype, fechas, transformación)
│       ├── mock-youtube-api.json     # Datos simulados de YouTube
│       ├── app.module.ts             # Módulo raíz
│       └── main.ts                   # Bootstrap + CORS
├── hype-frontend/         # SPA — React + Vite
│   └── src/
│       ├── components/    # VideoCard, VideoGrid, SmartImage, SkeletonGrid, Toast
│       ├── hooks/         # useVideos (fetch + estados)
│       └── App.jsx        # Layout principal
├── .gitignore             # Excluye node_modules, dist
├── README.md              # Este archivo
└── DECISIONS.md           # Decisiones técnicas y proceso de trabajo
```

---

## 🧰 Tech Stack

| Capa      | Tecnología        | Versión |
|-----------|-------------------|---------|
| Backend   | NestJS            | 11.x    |
| Lenguaje  | TypeScript        | 5.x     |
| Frontend  | React             | 19.x    |
| Bundler   | Vite              | 8.x     |
| Node.js   | Node              | ≥ 18    |

---

## 🚀 Instalación y ejecución local

### Prerrequisitos

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ferain93/hype-board.git
cd hype-board
```

### 2. Instalar dependencias

```bash
# Backend
cd hype-backend
npm install

# Frontend (abrir otra terminal desde la raíz)
cd hype-frontend
npm install
```

### 3. Levantar el proyecto

Abre **dos terminales** desde la raíz del proyecto:

**Terminal 1 — Backend** (puerto 3001):
```bash
cd hype-backend
npm run start:dev
```

**Terminal 2 — Frontend** (puerto 5173):
```bash
cd hype-frontend
npm run dev
```

### 4. Verificar que todo funcione

| Servicio   | URL                                 |
|------------|-------------------------------------|
| Frontend   | http://localhost:5173               |
| Backend    | http://localhost:3001               |
| API Videos | http://localhost:3001/api/videos    |

---

## 📡 Endpoint del backend

### `GET /api/videos`

Devuelve un array de videos procesados, ordenados de mayor a menor Hype.

**Response de ejemplo:**
```json
[
  {
    "id": "vid_003",
    "title": "TailwindCSS errores comunes - Tutorial",
    "author": "JuniorDev99",
    "thumbnail": "https://via.placeholder.com/300x200/...",
    "publishedAt": "Hace 2 años",
    "hypeLevel": 0.308
  }
]
```

**Campos devueltos:**

| Campo         | Tipo     | Descripción                                                        |
|---------------|----------|--------------------------------------------------------------------|
| `id`          | `string` | ID del video de YouTube                                            |
| `title`       | `string` | Título normalizado (la palabra "Tutorial" siempre en Title Case)   |
| `author`      | `string` | Nombre del canal                                                   |
| `thumbnail`   | `string` | URL de la miniatura en alta calidad                                |
| `publishedAt` | `string` | Fecha relativa en español (ej. "Hace 5 días")                      |
| `hypeLevel`   | `number` | Nivel de hype calculado con la fórmula y modificadores de negocio  |

---

## 🔥 Fórmula del Nivel de Hype

```
hypeLevel = (likes + comentarios) / vistas
```

**Modificadores:**
- Si el título contiene la palabra **"Tutorial"** (case-insensitive) → hype × 2
- Si los comentarios están **desactivados** (no existe `commentCount` en statistics) → hype = 0
- Si las vistas son **0** → hype = 0 (evita división por cero)

---

## 🎨 Features del Frontend

- **Joya de la Corona** 💎 — El video con mayor hype se muestra con diseño destacado, badge especial y borde brillante.
- **Sistema de Llamas** 🔥 — Indicador visual de hype con escala relativa al video con mayor hype del set.
- **SmartImage** — Fallback inteligente para miniaturas rotas: imagen de Unsplash → placeholder SVG inline.
- **Skeleton Loading** — Animación esqueleto mientras se cargan los datos.
- **Toast de Error** — Notificación visual cuando falla la conexión con el backend.
- **Diseño Responsivo** — Grid adaptable a diferentes tamaños de pantalla.
