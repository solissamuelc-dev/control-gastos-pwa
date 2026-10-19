# Mis Finanzas - Control de Gastos Mensuales (PWA)

Aplicación Web Progresiva (PWA) para la gestión y control de gastos personales mensuales. Diseñada bajo una arquitectura **100% privada y offline-first**, donde la información reside exclusivamente en el dispositivo del usuario sin enviar datos a servidores externos.

## 🚀 Demo en Producción
- **URL:** [Tu enlace de Vercel aquí]

## ✨ Características
- **100% Privada y Local:** Persistencia en el navegador mediante **IndexedDB** a través de Dexie.js.
- **Offline-First (PWA):** Totalmente funcional sin conexión a internet, instalable en Android, iOS y escritorio.
- **Resumen Financiero Mensual:** Cálculo dinámico de ingresos, gastos y balance disponible.
- **Distribución de Gastos:** Visualización del porcentaje de desembolso por categoría.
- **Copia de Seguridad:** Exportación e importación de la base de datos completa en formato JSON para respaldar o transferir datos entre dispositivos.

## 🛠️ Stack Tecnológico
- **Frontend:** React 18 + Vite
- **Estilos:** Tailwind CSS v3
- **Iconografía:** Lucide React
- **Base de Datos Local:** Dexie.js (IndexedDB)
- **Motor PWA:** vite-plugin-pwa (Workbox)
- **Despliegue:** Vercel (CI/CD automático desde la rama `main`)

## 💻 Desarrollo Local
```bash
# Clonar repositorio
git clone [https://github.com/solissamuelc-dev/control-gastos-pwa.git](https://github.com/solissamuelc-dev/control-gastos-pwa.git)

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build