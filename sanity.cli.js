import { defineCliConfig } from 'sanity/cli';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🛡️ NIVEL SENIOR: Configuración de CLI Multitenant
 * Este archivo comunica tu código local con los servidores de Sanity.
 */
export default defineCliConfig({
  api: {
    // Usamos un fallback (respaldo) por si la variable de entorno falla en la terminal
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'tu_project_id_real_aqui',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  
  deployment: {
    // El appId vincula este código con tu proyecto en la nube de Sanity
    appId: process.env.SANITY_STUDIO_APP_ID, 
    
    /**
     * 🚀 ESTRATEGIA DE DESPLIEGUE:
     * Con autoUpdates en true, Sanity mantendrá las dependencias de seguridad
     * al día automáticamente en la nube.
     */
    autoUpdates: true,
  },

  /**
   * 🏗️ AJUSTE DE RUTA (Opcional pero recomendado):
   * Si alguna vez mueves el estudio a un subdirectorio, aquí se controla.
   */
  server: {
    hostname: 'localhost',
    port: 3333
  }
});