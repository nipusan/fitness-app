# Instrucciones para GitHub Copilot

Este documento proporciona directrices para que GitHub Copilot genere código de alta calidad y consistente en este proyecto.

## Principios Generales

### Calidad del Código
- **Escribir código limpio, legible y eficiente**: Prioriza la claridad y el mantenimiento sobre soluciones excesivamente complejas.
- **Seguir principios SOLID**: Aplica los principios de diseño orientado a objetos para crear código modular y extensible.
- **Aplicar buenas prácticas de desarrollo**: Utiliza patrones de diseño reconocidos y convenciones estándar de la industria.

### Estilo y Formato
- **Usar comentarios en español**: Todos los comentarios de código deben estar escritos en español para mantener la consistencia del equipo.
- **Respetar las configuraciones del proyecto**: Sigue las reglas definidas en `.editorconfig`, `.vscode/settings.json` y otros archivos de configuración.
- **Mantener la consistencia**: Adapta el estilo al código existente en el proyecto.

### Comunicación
- **Proporcionar explicaciones breves**: Incluye comentarios concisos que expliquen la lógica del código sugerido cuando sea necesario.
- **Documentar decisiones importantes**: Agrega comentarios para decisiones de diseño no obvias o soluciones a problemas complejos.

## Directrices Específicas por Lenguaje

### Python
- Seguir PEP 8 para el estilo de código
- Usar type hints cuando sea apropiado
- Preferir comprensiones de lista sobre bucles cuando mejoren la legibilidad
- Documentar funciones y clases con docstrings en español

### JavaScript/TypeScript
- Usar ES6+ features (arrow functions, destructuring, etc.)
- Preferir `const` y `let` sobre `var`
- Utilizar async/await para operaciones asíncronas
- Agregar tipos en TypeScript para mejorar la seguridad del código

### General
- **Nombrado**: Usar nombres descriptivos y significativos para variables, funciones y clases
- **Funciones**: Mantener las funciones pequeñas y enfocadas en una sola responsabilidad
- **Manejo de errores**: Implementar manejo de errores apropiado y evitar fallos silenciosos
- **Pruebas**: Sugerir código que sea fácilmente testeable

## Seguridad

- No incluir credenciales, tokens o información sensible en el código
- Validar y sanitizar entradas de usuario
- Usar bibliotecas actualizadas y seguras
- Seguir las mejores prácticas de seguridad para cada lenguaje

## Rendimiento

- Escribir código eficiente pero manteniendo la legibilidad
- Evitar optimizaciones prematuras
- Considerar la complejidad algorítmica en operaciones con grandes volúmenes de datos

## Colaboración

- Generar código que sea fácil de revisar en pull requests
- Mantener cambios atómicos y enfocados
- Facilitar la comprensión del código para otros desarrolladores del equipo
