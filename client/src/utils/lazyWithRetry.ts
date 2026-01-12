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
  // #region agent log
  const componentName = componentImport.toString().match(/['"]([^'"]+)['"]/)?.[1] || 'unknown';
  fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:7',message:'lazyWithRetry called',data:{componentName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return lazy(async () => {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:18',message:'Attempting to load module',data:{componentName,attempt:i+1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const module = await componentImport();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:21',message:'Module loaded',data:{componentName,hasDefault:!!module.default,defaultType:typeof module.default,defaultIsUndefined:module.default===undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (!module) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:28',message:'Module is null or undefined',data:{componentName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          throw new Error(`Module ${componentName} is null or undefined`);
        }
        if (!module.default) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:32',message:'Module missing default export',data:{componentName,moduleKeys:Object.keys(module||{})},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          throw new Error(`Module ${componentName} does not have a default export. Available exports: ${Object.keys(module).join(', ')}`);
        }
        if (typeof module.default !== 'function' && typeof module.default !== 'object') {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:36',message:'Module default is not a valid component',data:{componentName,defaultType:typeof module.default},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          throw new Error(`Module ${componentName} default export is not a valid component (type: ${typeof module.default})`);
        }
        return module;
      } catch (error) {
        lastError = error as Error;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:30',message:'Module load failed',data:{componentName,attempt:i+1,error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        console.warn(`❌ Falha ao carregar módulo (tentativa ${i + 1}/${retries}):`, error);
        
        // Aguardar antes de tentar novamente (exponencial backoff)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    // Se todas as tentativas falharam, lançar erro
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6193fe1a-e637-43ea-9bad-a5f0d02278f6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lazyWithRetry.ts:40',message:'All retries failed',data:{componentName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('❌ Todas as tentativas de carregar o módulo falharam');
    throw lastError || new Error('Falha ao carregar módulo após múltiplas tentativas');
  });
}
