# Outfit Lab - Frontend

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado en tu computadora:

- **Node.js** (versión 18 o superior)
  - Descarga desde: https://nodejs.org/
  - Para verificar si ya lo tienes: abre la terminal y ejecuta `node --version`
- **npm** (se instala automáticamente con Node.js)
  - Para verificar: `npm --version`

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd outfit-lab/frontend
```

### 2. Instalar dependencias
```bash
npm install
```
Este comando descarga todas las librerías necesarias para el proyecto.

### 3. Iniciar el proyecto
```bash
npm run dev
```
El proyecto se abrirá automáticamente en tu navegador en `http://localhost:5173`

## 🛠️ Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Revisa el código en busca de errores |

## 📚 Tecnologías y Librerías Utilizadas

### Framework Principal
- **React** (v19.1.1) - Librería para crear interfaces de usuario
- **Vite** (v7.1.7) - Herramienta de construcción rápida

### Librerías de Funcionalidad
- **React Router DOM** (v7.9.3) - Navegación entre páginas
- **Axios** (v1.12.2) - Realizar peticiones HTTP al backend
- **React Hook Form** (v7.63.0) - Manejo de formularios
- **Lucide React** (v0.544.0) - Iconos modernos

### Librerías 3D (Avatar Virtual)
- **Three.js** (v0.180.0) - Motor 3D para JavaScript
- **React Three Fiber** (v9.3.0) - Integración de Three.js con React
- **React Three Drei** (v10.7.6) - Componentes y helpers para Three.js

### Herramientas de Desarrollo
- **ESLint** - Analiza y mejora la calidad del código
- **@types/react** - Solo para autocompletado del IDE (NO es TypeScript)

## 📁 Estructura del Proyecto

```
frontend/
├── public/          # Archivos estáticos
├── src/
│   ├── assets/      # Imágenes, iconos, etc.
│   ├── App.jsx      # Componente principal
│   ├── main.jsx     # Punto de entrada
│   └── index.css    # Estilos globales
├── package.json     # Configuración y dependencias
├── vite.config.js   # Configuración de Vite
└── README.md        # Este archivo
```

## 👥 Guía para Nuevos en React

### ¿Qué es React?
React es una librería de JavaScript que nos ayuda a crear páginas web interactivas de manera más fácil y organizada.

### Conceptos Básicos
- **Componente**: Un pedazo de código reutilizable que representa una parte de la interfaz
- **JSX**: Una forma de escribir HTML dentro de JavaScript
- **Props**: Datos que se pasan entre componentes
- **State**: Datos que pueden cambiar en el tiempo

### Archivos Importantes
- **`.jsx`**: Archivos de componentes React (JavaScript + JSX)
- **`.css`**: Archivos de estilos
- **`package.json`**: Lista todas las dependencias del proyecto

## 🔧 Solución de Problemas Comunes

### Error: "npm no se reconoce como comando"
- **Solución**: Instala Node.js desde https://nodejs.org/

### Error: "Puerto 5173 ya en uso"
- **Solución**: Cierra otras aplicaciones o cambia el puerto en `vite.config.js`

### Error después de `git pull`
- **Solución**: Ejecuta `npm install` para instalar nuevas dependencias

### La página no se actualiza automáticamente
- **Solución**: Guarda el archivo y verifica que el servidor esté corriendo

## 📝 Workflow de Desarrollo

1. **Antes de empezar a trabajar:**
   ```bash
   git pull origin main
   npm install
   ```

2. **Durante el desarrollo:**
   ```bash
   npm run dev
   ```

3. **Antes de hacer commit:**
   ```bash
   npm run lint
   ```

## 🔮 Información Específica del Probador Virtual

### ¿Qué es Three.js?
Three.js es una librería que permite crear gráficos 3D en el navegador. En nuestro proyecto la usamos para:
- Mostrar avatares 3D
- Renderizar prendas de vestir
- Crear la experiencia de probador virtual

### Librerías Adicionales Disponibles
```bash
# Para efectos visuales avanzados
npm install @react-three/postprocessing

# Para animaciones fluidas
npm install @react-spring/three

# Para física y simulación de telas
npm install @react-three/rapier

# Para carga optimizada de assets
npm install @react-three/assets
```
