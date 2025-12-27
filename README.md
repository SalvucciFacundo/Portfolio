# 💻 Portfolio: Dev Environment Edition

¡Bienvenido a mi Portfolio Personal! Este proyecto no es solo una hoja de vida, es una experiencia inmersiva que simula un entorno de desarrollo profesional (**Visual Studio Code**) integrado con un navegador **Chrome** para previsualizar las secciones.

---

## 🚀 Concepto y Experiencia

El sitio web está diseñado como una **IDE funcional**. Los usuarios pueden explorar mi código, navegar por diferentes archivos y ver los resultados en tiempo real a través de un marco de previsualización dinámico.

### ✨ Características Principales

- **Interfaz VS Code-like**: Barra de actividad, explorador de archivos, área de edición de código y barra de estado.
- **Navegador Live Preview**: Una sección de vista previa integrada que simula un navegador Chrome para visualizar las secciones de Home, About, Skills, Projects y Contact.
- **Terminal Interactivo**: Registra eventos en tiempo real (navegación, envío de correos, autenticación) proporcionando feedback constante.
- **Navegación Fluida**: Cambio de secciones mediante scroll (rueda del mouse), clics en archivos del explorador o accesos laterales.
- **Gestión de Temas**: Soporte total para Modo Oscuro y Modo Claro con transiciones suaves.
- **Panel Administrativo**: Sistema de edición en vivo para el propietario del portfolio (protegido por Firebase Auth).
- **Formulario de Contacto Real**: Integración directa con EmailJS para recibir mensajes instantáneos.

---

## 🛠️ Stack Tecnológico

Este proyecto utiliza las últimas tecnologías de la web para asegurar rendimiento y escalabilidad:

- **Framework**: [Angular 21](https://angular.dev/)
  - Arquitectura basada en **Signals** para una reactividad eficiente.
  - Componentes **Standalone** y flujo de control nativo (`@if`, `@for`).
  - Carga diferida (**Lazy Loading**) por rutas de features.
- **Base de Datos y Auth**: [Firebase](https://firebase.google.com/)
  - Firestore para almacenar información de proyectos y perfil.
  - Firebase Authentication para el panel administrativo.
  - Firebase Storage para activos de imagen.
- **Estilos**: **SCSS** con variables dinámicas para el sistema de temas y efectos de Glassmorphism.
- **Email Service**: [EmailJS](https://www.emailjs.com/) para el manejo de formularios de contacto sin necesidad de un backend propio.
- **Testing**: [Vitest](https://vitest.dev/) para pruebas unitarias rápidas.

---

## 📦 Instalación y Uso Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/SalvucciFacundo/Portfolio.git
   cd Portfolio
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea tus archivos de entorno en `src/environments/` y añade tus credenciales de Firebase y EmailJS.

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run start
   ```
   Accede a `http://localhost:4200` en tu navegador.

---

## 🚀 Despliegue

El proyecto está configurado para desplegarse fácilmente en **Firebase Hosting**:

1. **Construir el proyecto**:
   ```bash
   npm run build
   ```
2. **Desplegar**:
   ```bash
   firebase deploy
   ```

---

## 📁 Estructura del Proyecto

```text
src/app/
├── core/           # Servicios globales, guards, interceptores y lógica de estado.
├── features/       # Módulos de la aplicación (Home, About, Skills, Projects, etc.).
├── layout/         # Componentes estructurales (Sidebar, Navbar, Terminal).
├── shared/         # Componentes, pipes y directivas reutilizables.
└── app.ts          # Componente raíz con lógica de navegación por scroll.
```

---

## 🛠️ Contribuir

Si tienes ideas para mejorar la simulación de la IDE o quieres añadir nuevas funcionalidades, ¡los Pull Requests son bienvenidos!

1. Haz un Fork del proyecto.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/CoolFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some CoolFeature'`).
4. Haz Push a la rama (`git push origin feature/CoolFeature`).
5. Abre un Pull Request.

---

## 📬 Contacto

Facundo Salvucci - [@SalvucciFacundo](https://github.com/SalvucciFacundo)

---

_Hecho con ❤️ y mucho código._
