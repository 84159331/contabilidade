import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook para pré-carregar componentes baseado na navegação
export function usePreloadComponents() {
  const location = useLocation();

  useEffect(() => {
    // Pré-carrega componentes baseado na rota atual
    const preloadComponent = (importFn: () => Promise<any>) => {
      // Usa requestIdleCallback se disponível, senão usa setTimeout
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

    // Pré-carrega componentes relacionados baseado na rota atual
    switch (location.pathname) {
      case '/tesouraria/dashboard':
        // Pré-carrega componentes relacionados ao dashboard
        preloadComponent(() => import('../pages/Transactions'));
        preloadComponent(() => import('../pages/Members'));
        break;
      case '/tesouraria/transactions':
        // Pré-carrega componentes relacionados às transações
        preloadComponent(() => import('../pages/Categories'));
        preloadComponent(() => import('../pages/Members'));
        break;
      case '/tesouraria/members':
        // Pré-carrega componentes relacionados aos membros
        preloadComponent(() => import('../pages/Transactions'));
        preloadComponent(() => import('../pages/CellGroupsAdmin'));
        break;
      case '/tesouraria/categories':
        // Pré-carrega componentes relacionados às categorias
        preloadComponent(() => import('../pages/Transactions'));
        break;
      case '/tesouraria/reports':
        // Pré-carrega componentes relacionados aos relatórios
        preloadComponent(() => import('../pages/Transactions'));
        preloadComponent(() => import('../pages/Members'));
        break;
      case '/tesouraria/cell-groups':
        // Pré-carrega componentes relacionados aos grupos celulares
        preloadComponent(() => import('../pages/Members'));
        break;
    }
  }, [location.pathname]);
}

export default usePreloadComponents;
