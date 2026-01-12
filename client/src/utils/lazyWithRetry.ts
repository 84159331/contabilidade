import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Lazy loading com retry automático em caso de falha
 * Isso previne páginas brancas quando o carregamento do módulo falha
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        const module = await componentImport();
        return module;
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Falha ao carregar módulo (tentativa ${i + 1}/${retries}):`, error);
        
        // Aguardar antes de tentar novamente (exponencial backoff)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    // Se todas as tentativas falharam, lançar erro
    console.error('❌ Todas as tentativas de carregar o módulo falharam');
    throw lastError || new Error('Falha ao carregar módulo após múltiplas tentativas');
  });
}
