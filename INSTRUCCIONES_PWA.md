# La Épica — Instrucciones de instalación PWA

## Opción A: Archivo único (recomendada)
Usá `LaEpica_V8.html` solo. El manifest y el service worker se generan automáticamente por JavaScript.  
**No necesitás los otros archivos para esta opción.**

---

## Opción B: Con servidor local (máxima compatibilidad)
Copiá los 3 archivos en la misma carpeta:
```
LaEpica_V8.html
manifest.json
service-worker.js
```
Y modificá en el HTML:
- `<link rel="manifest" id="pwa-manifest-link">` → `<link rel="manifest" href="manifest.json">`
- Eliminá el bloque `pwaInit()` del script

---

## Instalar en Android (Chrome)

1. Abrí Chrome en tu Android
2. Navegá al archivo o URL donde está `LaEpica_V8.html`
3. Tocá el menú ⋮ (tres puntos arriba a la derecha)
4. Tocá **"Agregar a pantalla de inicio"** o **"Instalar app"**
5. Confirmá el nombre → **Instalar**
6. Ya aparece como app en tu pantalla de inicio ✅

> Si no aparece la opción, buscá el banner **"📲 Instalar"** en el header de la app y tocalo.

---

## Instalar en PC (Chrome / Edge)

1. Abrí Chrome o Edge
2. Abrí el archivo `LaEpica_V8.html`
3. En la barra de direcciones aparece un ícono de instalación (📲)  
   O bien: Menú ⋮ → **"Instalar La Épica"**
4. Confirmá → **Instalar**
5. Se abre como ventana independiente sin barra del navegador ✅

---

## Funcionamiento offline

Una vez instalada, la app funciona **100% sin internet**:
- Los datos se guardan en **IndexedDB** (sin límite práctico)
- El autobackup rotativo guarda cada 10 minutos
- El backup manual exporta un `.json` con todos los datos
- Para restaurar: usá el botón **"📤 Cargar"**

---

## Qué almacena dónde

| Dato | Dónde |
|------|-------|
| Ventas diarias | IndexedDB `LaEpicaData` |
| Gastos del dueño | IndexedDB `LaEpicaData` |
| Cuentas corrientes clientes | IndexedDB `LaEpicaCC` |
| PIN y configuración | localStorage |
| Metas y límites fiscales | localStorage |
| Borrador del día | localStorage |
| CC Dueño | localStorage |

