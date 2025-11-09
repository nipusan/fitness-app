# project-template-copilot

---

## 🚴 Aplicación Fitness (React + Vite + Tailwind)

Esta plantilla ahora incluye una app base de fitness construida con React 18, Vite y Tailwind CSS. El componente principal está en `src/App.jsx` y puedes ejecutarla localmente con los pasos siguientes.

### Requisitos

- Node.js 18+ (recomendado 20+)

### Ejecutar en local

```pwsh
# Instalar dependencias
npm install

# Iniciar modo desarrollo (hot reload)
npm run dev

# Compilar para producción
npm run build

# Previsualizar el build localmente
npm run preview
```

Si es la primera vez que clonas el repo, abre el proyecto en VS Code y asegúrate de tener instaladas las extensiones recomendadas (Tailwind CSS IntelliSense, EditorConfig, Prettier, GitHub Copilot).

### Estructura relevante

```text
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
   ├── App.jsx          # Componente principal (rutina fitness)
   ├── main.jsx         # Punto de entrada React
   └── index.css        # Estilos globales con Tailwind
```

---

![GitHub](https://img.shields.io/github/license/nipusan/project-template-copilot)
![GitHub issues](https://img.shields.io/github/issues/nipusan/project-template-copilot)

## 📋 Descripción

Repositorio plantilla diseñado para servir como base para nuevos proyectos en GitHub, optimizado para trabajar eficientemente con **GitHub Copilot** en Visual Studio Code. Incluye configuraciones esenciales, buenas prácticas de desarrollo y directrices para la colaboración en equipo.

## 🎯 Propósito

Este template proporciona una estructura inicial completa que incluye:

- ✅ Configuración optimizada para GitHub Copilot
- ✅ Entorno de desarrollo preconfigurado para VS Code
- ✅ Reglas de estilo de código unificadas
- ✅ Workflow básico de CI/CD
- ✅ Guías de contribución y código de conducta
- ✅ Licencia MIT

## 🚀 Cómo Usar Este Template

### Opción 1: Usar como Template en GitHub

1. Haz clic en el botón **"Use this template"** en la parte superior de este repositorio
2. Crea un nuevo repositorio basado en este template
3. Clona tu nuevo repositorio localmente
4. ¡Comienza a desarrollar!

### Opción 2: Clonar Manualmente

```bash
git clone https://github.com/nipusan/project-template-copilot.git mi-nuevo-proyecto
cd mi-nuevo-proyecto
rm -rf .git
git init
git add .
git commit -m "Inicializar proyecto desde template"
```

## 📁 Estructura del Proyecto

```
.
├── .github/
│   ├── workflows/
│   │   └── lint-check.yml        # CI básico para verificación de estilo
│   └── copilot-instructions.md   # Directrices para GitHub Copilot
├── .vscode/
│   ├── settings.json             # Configuración del workspace
│   ├── extensions.json           # Extensiones recomendadas
│   └── launch.json               # Configuración de depuración
├── .editorconfig                 # Reglas de estilo de código
├── .gitignore                    # Archivos y carpetas ignorados por Git
├── CODE_OF_CONDUCT.md            # Código de conducta del equipo
├── CONTRIBUTING.md               # Guía de contribución
├── LICENSE                       # Licencia MIT
└── README.md                     # Este archivo
```

## 🛠️ Configuración del Entorno

### Requisitos Previos

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [GitHub Copilot](https://github.com/features/copilot) (suscripción requerida)
- Node.js 18+ o Python 3.8+ (según tu proyecto)

### Configuración Inicial

1. **Abre el proyecto en VS Code**:
   ```bash
   code .
   ```

2. **Instala las extensiones recomendadas**:
   - VS Code te solicitará instalar las extensiones recomendadas
   - O usa: `Ctrl/Cmd + Shift + P` → "Extensions: Show Recommended Extensions"

3. **Extensiones incluidas**:
   - GitHub Copilot
   - GitHub Copilot Chat
   - EditorConfig
   - Prettier
   - Python
   - TypeScript

4. **Verifica la configuración de Copilot**:
   - Lee `.github/copilot-instructions.md` para entender las directrices del proyecto
   - Asegúrate de que Copilot esté habilitado en VS Code

## 📝 Directrices de Copilot

Este proyecto incluye instrucciones específicas para GitHub Copilot en `.github/copilot-instructions.md`, que incluyen:

- Escribir código limpio, legible y eficiente
- Usar comentarios en español
- Seguir principios SOLID y buenas prácticas
- Adaptarse al estilo del proyecto (Python, JavaScript, etc.)
- Proporcionar explicaciones breves del código sugerido

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer el proceso de contribución y las directrices de código.

### Pasos Rápidos

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Código de Conducta

Este proyecto adhiere a un Código de Conducta. Al participar, se espera que respetes este código. Lee [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🔧 Características Principales

### Formateo Automático

El proyecto está configurado para formatear código automáticamente al guardar:
- Tamaño de tabulación: 4 espacios
- Eliminación de espacios en blanco al final de línea
- Inserción de nueva línea al final del archivo
- Final de línea: LF (Unix)

### Exclusiones Configuradas

Carpetas excluidas de búsqueda y visualización:
- `node_modules/`
- `dist/`, `build/`
- `venv/`, `env/`, `.venv/`
- `__pycache__/`
- Archivos de cobertura y caché

### CI/CD Básico

Incluye un workflow de GitHub Actions (`lint-check.yml`) que:
- Se ejecuta en cada push y pull request
- Verifica el estilo del código con ESLint
- Usa Node.js 20

## 💡 Consejos

- Mantén las configuraciones de `.editorconfig` para consistencia entre editores
- Revisa regularmente las actualizaciones de las extensiones recomendadas
- Personaliza `.vscode/launch.json` según las necesidades de tu proyecto
- Actualiza `.gitignore` con exclusiones específicas de tu stack tecnológico

## 📞 Soporte

Si tienes preguntas o encuentras problemas:
- Abre un [Issue](../../issues)
- Revisa la [documentación de GitHub Copilot](https://docs.github.com/en/copilot)
- Consulta las [guías de VS Code](https://code.visualstudio.com/docs)

---

**¡Feliz desarrollo con GitHub Copilot! 🚀**
