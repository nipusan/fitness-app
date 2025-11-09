# Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! Valoramos todas las contribuciones y queremos que tu experiencia sea lo más fluida posible.

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor:
1. Verifica que no haya sido reportado previamente en los [Issues](../../issues)
2. Crea un nuevo issue con una descripción clara del problema
3. Incluye pasos para reproducir el bug
4. Proporciona información sobre tu entorno (SO, versión de Node.js/Python, etc.)

### Sugerir Mejoras

Las sugerencias de nuevas características son bienvenidas:
1. Abre un issue describiendo la mejora propuesta
2. Explica por qué esta mejora sería útil
3. Proporciona ejemplos de uso si es posible

### Pull Requests

1. **Fork el repositorio** y crea tu rama desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```

2. **Sigue las convenciones del proyecto**:
   - Respeta las configuraciones en `.editorconfig` y `.vscode/settings.json`
   - Escribe código limpio y bien documentado
   - Usa comentarios en español
   - Sigue los principios SOLID y buenas prácticas

3. **Escribe pruebas** (cuando aplique):
   - Asegúrate de que las pruebas existentes pasen
   - Agrega pruebas para nueva funcionalidad

4. **Documenta tus cambios**:
   - Actualiza el README.md si es necesario
   - Agrega comentarios explicativos para código complejo

5. **Realiza commits descriptivos**:
   ```bash
   git commit -m "feat: agregar validación de entrada para formulario"
   git commit -m "fix: corregir error en cálculo de totales"
   git commit -m "docs: actualizar instrucciones de instalación"
   ```

   Prefijos recomendados:
   - `feat:` para nuevas características
   - `fix:` para corrección de bugs
   - `docs:` para cambios en documentación
   - `style:` para cambios de formato (sin afectar lógica)
   - `refactor:` para refactorización de código
   - `test:` para agregar o modificar pruebas
   - `chore:` para tareas de mantenimiento

6. **Envía tu Pull Request**:
   - Proporciona una descripción clara de los cambios
   - Referencia cualquier issue relacionado
   - Asegúrate de que las verificaciones de CI pasen

## Configuración del Entorno de Desarrollo

### Requisitos Previos
- Git
- Node.js (versión 18 o superior) o Python (versión 3.8 o superior), según el proyecto
- Visual Studio Code (recomendado)

### Configuración Inicial

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/[usuario]/project-template-copilot.git
   cd project-template-copilot
   ```

2. **Instala las extensiones recomendadas**:
   - Abre el proyecto en VS Code
   - Cuando se te solicite, instala las extensiones recomendadas
   - O manualmente: abre la paleta de comandos (Ctrl/Cmd+Shift+P) y ejecuta "Extensions: Show Recommended Extensions"

3. **Configura GitHub Copilot**:
   - Asegúrate de tener una suscripción activa de GitHub Copilot
   - Lee `.github/copilot-instructions.md` para entender las directrices del proyecto

4. **Instala dependencias** (según el proyecto):
   ```bash
   # Para proyectos Node.js
   npm install
   
   # Para proyectos Python
   pip install -r requirements.txt
   ```

## Estilo de Código

Este proyecto utiliza configuraciones automáticas para mantener un estilo consistente:

- **EditorConfig**: Reglas básicas de formato aplicadas automáticamente
- **Formateo automático**: Los archivos se formatean al guardar
- **Linting**: Las verificaciones de estilo se ejecutan en CI/CD

### Directrices Específicas

- Usa 4 espacios para indentación (excepto YAML/JSON que usan 2)
- Finaliza archivos con una línea en blanco
- Elimina espacios en blanco al final de las líneas
- Usa LF (\\n) como final de línea
- Codificación UTF-8

## Proceso de Revisión

1. Un mantenedor revisará tu PR lo antes posible
2. Se pueden solicitar cambios antes de la aprobación
3. Una vez aprobado, tu PR será fusionado al proyecto
4. Tu contribución será reconocida en el proyecto

## Código de Conducta

Este proyecto adhiere a un Código de Conducta. Al participar, se espera que respetes este código. Por favor, lee [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) para más detalles.

## Preguntas

Si tienes preguntas, no dudes en:
- Abrir un issue con la etiqueta "question"
- Contactar a los mantenedores del proyecto

¡Gracias por contribuir! 🎉
