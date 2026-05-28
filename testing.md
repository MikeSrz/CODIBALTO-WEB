# Guía para Usar __tests__ en el Proyecto Codibalto

## Introducción

La carpeta `__tests__` en `src/__tests__` contiene las pruebas unitarias del proyecto. Este proyecto utiliza **Vitest** como framework de testing, junto con **@vue/test-utils** para probar componentes de Vue.js. Las pruebas están escritas en TypeScript y siguen la convención de archivos `.spec.ts`.

## Estructura de las Pruebas

- Los archivos de prueba se colocan en `src/__tests__/`.
- Los nombres de los archivos siguen el patrón `*.spec.ts`.
- Cada archivo prueba una funcionalidad específica, como componentes o servicios.

## Cómo Escribir Pruebas

### Pruebas de Componentes Vue

Para probar componentes de Vue, utiliza `@vue/test-utils` con `mount` o `shallowMount`.

Ejemplo de `App.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('You did it!')
  })
})
```

- `describe`: Agrupa pruebas relacionadas.
- `it`: Define una prueba individual.
- `expect`: Afirma el resultado esperado.

### Pruebas de Funciones/Servicios

Para probar funciones puras o servicios, importa la función y prueba su comportamiento.

Ejemplo de `crypto.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { generateSalt } from '../services/crypto'

describe('generateSalt', () => {
  it('should generate a salt of the correct length', () => {
    const salt = generateSalt()
    console.log(salt)
    expect(salt).toBeInstanceOf(Uint8Array)
    expect(salt.length).toBe(16)
  })
})
```

## Ejecutar las Pruebas

Para ejecutar todas las pruebas unitarias, usa el comando:

```bash
npm run test:unit
```

Esto ejecutará Vitest y mostrará los resultados en la consola.

### Opciones de Vitest

- Ejecutar en modo watch: `vitest` (sin npm run, si Vitest está instalado globalmente).
- Ejecutar una prueba específica: `vitest run --reporter=verbose App.spec.ts`.
- Ver cobertura: `vitest run --coverage`.

## Configuración

La configuración de Vitest se encuentra en `vitest.config.ts`:

```typescript
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',  // Para pruebas en navegador simulado
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
```

- `environment: 'jsdom'`: Simula un entorno de navegador para pruebas de componentes.
- Excluye carpetas como `e2e/**`.

## Mejores Prácticas

1. **Nombra las pruebas descriptivamente**: Usa nombres que expliquen qué se está probando.
2. **Prueba un comportamiento a la vez**: Cada `it` debe enfocarse en una funcionalidad específica.
3. **Usa mocks cuando sea necesario**: Para dependencias externas, usa `vi.mock()` de Vitest.
4. **Mantén las pruebas independientes**: Las pruebas no deben depender unas de otras.
5. **Ejecuta pruebas frecuentemente**: Integra las pruebas en tu flujo de desarrollo.

## Recursos Adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [Documentación de Vue Test Utils](https://test-utils.vuejs.org/)
- [Guía de Testing en Vue.js](https://vuejs.org/guide/scaling-up/testing.html)