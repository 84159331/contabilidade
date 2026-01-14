import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook para prÃ©-carregar componentes baseado na navegaÃ§Ã£o
export function usePreloadComponents() {
  const location = useLocation();

  useEffect(() => {
    // PrÃ©-carrega componentes baseado na rota atual
    const preloadComponent = (importFn: () => Promise<any>) => {
      // Usa requestIdleCallback se disponÃ­vel, senÃ£o usa setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          importFn();
        });
      } else {
        setTimeout(() => {
          importFn();
        }, 100);
      }
    };

    // PrÃ©-carrega componentes relacionados baseado na rota atual
    switch (location.pathname) {
      case '/tesouraria/dashboard':
        // PrÃ©-carrega componentes relacionados ao dashboard
        preloadComponent(() => import('../pages/Transactions'));
        preloadComponent(() => import('../pages/Members'));
        break;
      case '/tesouraria/transactions':
        // PrÃ©-carrega componentes relacionados Ã s transaÃ§Ãµes
        preloadComponent(() => import('../pages/Categories'));
        preloadComponent(() => import('../pages/Members'));
        break;
      case '/tesouraria/members':
        // PrÃ©-carrega componentes relacionados aos membros
        preloadComponent(() => import('../pages/Transactions'));
        preloadComponent(() => import('../pages/CellGroupsAdmin'));
        break;
      case '/tesouraria/categories':
        // PrÃ©-carrega componentes relacionados Ã s categorias
        preloadComponent(() => import('../pages/Transactions'));
        break;
      case '/tesouraria/reports':
        // PrÃ©-carrega componentes relacionados aos relatÃ³rios
        preloadComponent(() => import('../pages/Transactions'));
        preloadComponent(() => import('../pages/Members'));
        break;
      case '/tesouraria/cell-groups':
        // PrÃ©-carrega componentes relacionados aos grupos celulares
        preloadComponent(() => import('../pages/Members'));
        break;
    }
  }, [location.pathname]);
}

export default usePreloadComponents;
