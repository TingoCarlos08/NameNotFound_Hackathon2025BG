# TrustBridge Design System

Este sistema de diseño proporciona componentes y estilos consistentes para la plataforma TrustBridge, inspirados en la identidad visual de Banco Guayaquil.

## Estructura

- **theme/**: Definiciones base del sistema de diseño
  - **colors.ts**: Paleta de colores
  - **typography.ts**: Tipografía y estilos de texto
  - **spacing.ts**: Sistema de espaciado
  - **index.ts**: Exportación principal del tema

## Paleta de Colores

La paleta de colores se basa en el magenta característico de Banco Guayaquil como color primario, complementado con un azul oscuro como color secundario.

### Colores Primarios
- **Magenta**: #E6007E (Principal)
- **Magenta Claro**: #FF4DA6
- **Magenta Oscuro**: #B30062

### Colores Secundarios
- **Azul Oscuro**: #160f41 (Principal)
- **Azul Oscuro Claro**: #2d2566
- **Azul Oscuro Intenso**: #0c0826

## Tipografía

El sistema utiliza dos familias tipográficas principales:

- **Montserrat**: Para títulos y elementos destacados
- **Open Sans**: Para cuerpo de texto y elementos de interfaz
- **Roboto Mono**: Para código y datos técnicos

## Componentes UI

Los componentes de interfaz de usuario se encuentran en `src/components/ui/` e incluyen:

- **Button**: Botones con diferentes variantes y tamaños
- **Input**: Campos de entrada con diferentes estilos
- **Card**: Tarjetas para mostrar contenido agrupado
- **Logo**: Logotipo de TrustBridge

## Uso

Para utilizar el sistema de diseño, importa los componentes y el tema según sea necesario:

```tsx
import { Button, Input, Card } from '../components/ui';
import theme from '../styles/theme';

// Uso de componentes
<Button variant="primary" size="medium">Botón Principal</Button>

// Acceso a valores del tema
<div style={{ color: theme.colors.primary.main }}>
  Texto en color primario
</div>
```

## Responsividad

El sistema de diseño incluye breakpoints para diseño responsive:

- **xs**: 0px
- **sm**: 600px
- **md**: 960px
- **lg**: 1280px
- **xl**: 1920px 