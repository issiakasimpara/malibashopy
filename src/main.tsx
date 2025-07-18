
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'

// 🔐 Validation de sécurité au démarrage
import { logSecurityReport } from './utils/securityValidator'
// ⚡ Monitoring de performance
import { performanceManager } from './utils/performanceManager'

// 🔍 Exécuter la validation de sécurité en développement
if (import.meta.env.DEV) {
  logSecurityReport();

  // ⚡ Démarrer le monitoring de performance
  const stopPerformanceReporting = performanceManager.startPeriodicReporting(60000); // Rapport toutes les minutes

  // Nettoyer au démontage (si nécessaire)
  window.addEventListener('beforeunload', () => {
    stopPerformanceReporting();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
