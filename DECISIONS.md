# 📝 DECISIONS.md — Decisiones Técnicas

## Enfoque general de la solución

La solución sigue un enfoque clásico de **cliente-servidor desacoplado**: un backend NestJS que actúa como "colador" de datos (lee el mock JSON, aplica reglas de negocio y transforma las fechas) y un frontend React que consume el endpoint y renderiza los videos con énfasis visual diferenciado según el nivel de hype.

El principio rector fue **mantener la simplicidad sin sacrificar la calidad de la experiencia de usuario**. Cada capa cumple una responsabilidad única: el backend transforma, el frontend presenta.

---

## Decisiones técnicas principales

### Backend

1. **Módulo dedicado `videos/`**: Se creó un módulo NestJS independiente (`VideosModule`) con su controller, service e interface. Esto separa responsabilidades y permite escalar el backend sin contaminar el `AppModule`.

2. **Lectura síncrona del JSON**: Al ser un mock estático y no una fuente dinámica, se usó `fs.readFileSync` para simplificar. En un escenario real se usaría un `HttpService` con `axios` para consultar la API de YouTube de forma asíncrona.

3. **Interfaz tipada (`video.interface.ts`)**: Se definieron dos interfaces — `YoutubeVideoRaw` para la forma cruda del JSON y `VideoClean` para la salida limpia del endpoint. Esto da seguridad de tipos en toda la cadena de transformación y hace explícito el contrato entre backend y frontend.

4. **Transformación de fechas con JS nativo**: Tal como lo requiere la restricción, la conversión de fecha ISO a texto relativo ("Hace 2 meses", "Hace 5 días") se implementó con cálculos manuales de diferencias en milisegundos. Se manejan rangos desde segundos hasta años, con pluralización en español y manejo de fechas futuras presentes en el mock.

5. **CORS configurado con whitelist**: Se habilitó CORS solo para los orígenes necesarios (`localhost:5173` y `localhost:3000`), restringido al método `GET`. Esto evita peticiones no deseadas desde otros orígenes.

6. **Puerto 3001 para el backend**: Se eligió el puerto 3001 en lugar del 3000 por defecto de NestJS para evitar conflictos con otros procesos locales y dejar el 3000 libre para otras herramientas de desarrollo.

### Frontend

1. **React puro sin dependencias extras**: No se instalaron librerías de UI, routing ni state management. Se usó solo React con Vite. Todo el manejo de estado se resuelve con `useState` y `useEffect` en un custom hook (`useVideos`).

2. **Custom hook `useVideos`**: Encapsula la lógica de fetch, loading y error en un solo lugar. El componente `App` solo consume el hook y renderiza según el estado — separación clara entre lógica y presentación.

3. **Sistema de Llamas 🔥 con escala relativa**: En lugar de mostrar el número crudo de hype (poco intuitivo para el usuario), se implementó un sistema visual de llamas donde la escala es relativa al video con mayor hype del set de datos. Esto garantiza que siempre haya un video con hype máximo y el resto se distribuya proporcionalmente.

4. **Componente `SmartImage`**: Sistema de fallback para manejar miniaturas rotas, problema recurrente en datos mock de YouTube. Si la URL original falla, carga una imagen aleatoria de Unsplash; si esa también falla, muestra un placeholder SVG inline que funciona sin red.

5. **`SkeletonGrid`**: Loading state con esqueletos animados que replican la estructura real del grid, brindando una experiencia percibida mucho más rápida que un simple spinner.

6. **Toast de error**: Componente ligero que informa al usuario de fallos en la conexión sin romper el layout.

---

## Organización del proyecto

```
hype-board/
├── hype-backend/              # Monolito NestJS
│   └── src/
│       ├── videos/
│       │   ├── video.interface.ts    # Tipos (Raw → Clean)
│       │   ├── videos.controller.ts  # GET /api/videos
│       │   ├── videos.module.ts      # Registro del módulo
│       │   └── videos.service.ts     # Lógica de negocio
│       ├── mock-youtube-api.json     # Datos simulados
│       ├── app.module.ts             # Módulo raíz
│       └── main.ts                   # Bootstrap + CORS
├── hype-frontend/             # SPA React
│   └── src/
│       ├── components/
│       │   ├── VideoCard.jsx         # Card individual + FlameRating
│       │   ├── VideoGrid.jsx         # Grid con Joya de la Corona + resto
│       │   ├── SmartImage.jsx        # Imagen con fallback inteligente
│       │   ├── SkeletonGrid.jsx      # Loading skeleton
│       │   └── Toast.jsx             # Notificación de error
│       ├── hooks/
│       │   └── useVideos.js          # Custom hook (fetch + loading + error)
│       ├── App.jsx                   # Layout principal
│       └── App.css                   # Estilos globales
├── .gitignore                 # Excluye node_modules, dist
├── README.md                  # Instrucciones de instalación y ejecución
└── DECISIONS.md               # Este archivo
```

Se optó por un **monorepo simple** sin herramientas tipo Turborepo o Nx dado que son solo dos proyectos. La raíz contiene los archivos compartidos y cada subcarpeta es un proyecto independiente con su propio `package.json`.

---

## Problemas encontrados y cómo los resolví

### 1. 📦 El JSON no se copiaba a `dist/` al compilar

**Problema**: NestJS compila TypeScript a `dist/`, pero por defecto no copia archivos que no sean `.ts`. Al arrancar el servidor, el servicio intentaba leer `dist/mock-youtube-api.json` y lanzaba un error `ENOENT: no such file or directory`.

**Solución**: Se configuró el campo `assets` en `nest-cli.json` para indicarle al compilador que copie todos los `.json` de `src/` a `dist/` durante el build:

```json
{
  "compilerOptions": {
    "assets": [
      {
        "include": "**/*.json",
        "exclude": "tsconfig*.json",
        "watchAssets": true
      }
    ]
  }
}
```

### 2. 🔤 Normalización de mayúsculas en "Tutorial"

**Problema**: El JSON mock contiene la palabra "tutorial" con diferentes formatos de capitalización arbitrarios (`TuToRiaL`, `tUtOriAl`, `TUTORIAL`). El modificador de hype debe detectarlos todos, pero visualmente el título se ve inconsistente y poco profesional.

**Solución**: Dos medidas en el service del backend:
- La **detección** del modificador usa regex case-insensitive: `/tutorial/i.test(title)`
- La **normalización visual** del título usa: `title.replace(/tutorial/gi, 'Tutorial')`

Así el cálculo de hype funciona sin importar el casing, y el frontend siempre muestra "Tutorial" de forma consistente.

### 3. 📊 Nivel de Hype con valores decimales poco intuitivos

**Problema**: La fórmula `(likes + comentarios) / vistas` genera valores decimales muy pequeños (0.0523, 0.1046). Mostrar estos números al usuario no comunica nada útil — no hay forma intuitiva de saber si 0.05 es "bueno" o "malo".

**Solución**: Se implementó un sistema visual de **llamas 🔥** con escala relativa, donde el video con mayor hype recibe la puntuación máxima y el resto se distribuye proporcionalmente. El número crudo se mantiene en el JSON para ordenamiento, pero la UI muestra un indicador visual significativo para el usuario.

### 4. 🖼️ Imágenes rotas en las miniaturas

**Problema**: Las URLs de thumbnails del mock apuntan a `via.placeholder.com`, un servicio externo que frecuentemente devuelve errores o está caído, causando imágenes rotas en toda la grilla y una experiencia visual degradada.

**Solución**: Se creó el componente `SmartImage` con fallback por niveles usando el evento `onError` del elemento `<img>`:
- Intenta cargar la URL original del mock
- Si falla → carga una imagen de Unsplash del pool de imágenes tech
- Si esa también falla → muestra un placeholder SVG inline (funciona sin red)

Esto garantiza que la UI siempre se vea completa sin importar el estado de las URLs externas.

### 5. 🗂️ `node_modules` y `dist` trackeados en Git

**Problema**: Al hacer el primer commit, Git detectó más de 10.000 cambios porque `node_modules/` y `dist/` no estaban en el `.gitignore` desde el inicio, y ya habían sido trackeados.

**Solución**: Se creó un `.gitignore` global en la raíz del monorepo que cubre ambos proyectos con `**/node_modules/` y `**/dist/`. Luego se limpió el índice de Git con:

```bash
git rm -r --cached .
git add .
git commit -m "chore: fix gitignore, remove node_modules and dist"
```

---

## Supuestos y simplificaciones

- El mock JSON es estático y no cambia en runtime. Se lee de forma síncrona al inicio de cada request.
- La fórmula de hype se redondea a 4 decimales para evitar imprecisiones de punto flotante.
- La transformación de fechas usa 30 días = 1 mes y 365 días = 1 año como aproximación.
- No se implementó paginación ni filtros dado que el set de datos es reducido (50 videos).
- La URL de la API está como constante en el hook del frontend. En producción se movería a una variable de entorno `.env`.
- Los videos se ordenan en el backend de mayor a menor hype. El primer elemento del array es siempre la "Joya de la Corona".

---

## 🚀 Mejoras futuras

- **Retry automático con backoff exponencial** ante fallos del backend.
- **Vista de detalle**: Modal o drawer al hacer clic en una card con más información del video.
- **Buscador y filtros**: Filtrar por autor, rango de hype o palabra clave.
- **Variables de entorno**: Mover la URL del API a `.env` para facilitar cambios entre entornos.
- **Testing**: Tests unitarios para el service del backend (calcular hype, transformar fechas) y tests de componente en el frontend.
- **Dark/Light mode toggle**: Actualmente solo hay modo claro.

---

## 🤖 Herramientas de IA utilizadas

Se utilizaron herramientas de inteligencia artificial como apoyo durante el proceso de desarrollo:

- **Claude (Anthropic)**: Usado como asistente principal de pair programming.
  Los prompts más relevantes fueron:

  - *"Crea un módulo de NestJS para videos con controller, service e interface.
    El service debe leer un archivo JSON local, aplicar la lógica de cálculo
    de hype (fórmula: (likes + comentarios) / vistas, multiplicador x2 si el
    título contiene 'tutorial' sin importar mayúsculas, 0 si no existe
    commentCount) y retornar un array limpio ordenado por hypeLevel
    descendente."*

  - *"El service de NestJS lanza ENOENT al leer el JSON en runtime. El archivo
    existe en src/ pero no en dist/. ¿Cómo configuro nest-cli.json para que
    copie archivos que no son TypeScript durante la compilación?"*

  - *"Implementa una función en el service de NestJS para normalizar la palabra
    'tutorial' en los títulos de video sin importar el casing (TuToRiaL,
    TUTORIAL, tutorial) para que siempre se muestre como 'Tutorial' usando
    un regex replace case-insensitive."*

  - *"El monorepo tiene más de 10k cambios en Git porque node_modules y dist
    fueron commiteados antes de configurar el .gitignore. ¿Cómo los elimino
    del tracking sin borrar los archivos locales?"*

- **v0 by Vercel**: Usado para generar inspiración visual y una base de diseño para la cartelera de videos. El output fue adaptado para encajar con la lógica de negocio del proyecto.

- **Gemini (Antigravity)**: Usado para resolver la lógica del sistema de llamas con escala relativa y para la guía de deploy en Vercel como monorepo.

El uso de estas herramientas fue complementario — las decisiones de arquitectura, la lógica de negocio y la resolución de bugs fueron razonadas y validadas manualmente en cada paso.

## 🌐 Deploy

El proyecto está configurado para deploy como monorepo en **Vercel**:

- Frontend: build estático con Vite
- Backend: serverless function con `@vercel/node`

> 🔗 **URL de producción:** https://hype-board-sigma.vercel.app/
