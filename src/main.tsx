import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove lovable-badge em produção
if (import.meta.env.PROD) {
  const removeLovableBadge = () => {
    // Remove o badge principal
    const badge = document.getElementById('lovable-badge');
    if (badge) {
      badge.remove();
    }
    
    // Remove o botão de fechar também
    const closeButton = document.getElementById('lovable-badge-close');
    if (closeButton) {
      closeButton.remove();
    }
    
    // Remove qualquer elemento com classe ou atributo relacionado
    const allBadges = document.querySelectorAll('[id*="lovable"], [class*="lovable"]');
    allBadges.forEach(el => el.remove());
  };
  
  // Remove imediatamente se já existir
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeLovableBadge);
  } else {
    removeLovableBadge();
  }
  
  // Observa mudanças no DOM para remover se aparecer depois
  const observer = new MutationObserver(() => {
    removeLovableBadge();
  });
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    attributeFilter: ['id', 'class']
  });
  
  // Limpa o observer após um tempo
  setTimeout(() => observer.disconnect(), 30000);
}

createRoot(document.getElementById("root")!).render(<App />);
