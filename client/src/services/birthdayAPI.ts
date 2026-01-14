// API client-side para aniversÃ¡rios
// Nota: A maior parte da lÃ³gica estÃ¡ no hook useBirthdays
// Este arquivo pode ser usado para chamadas HTTP adicionais se necessÃ¡rio

export const birthdayAPI = {
  /**
   * Testa manualmente a verificaÃ§Ã£o de aniversÃ¡rios
   * Chama a funÃ§Ã£o HTTP testBirthdayCheck do Firebase Functions
   */
  testBirthdayCheck: async (): Promise<any> => {
    try {
      // URL da funÃ§Ã£o Firebase (ajustar conforme necessÃ¡rio)
      const functionsUrl = process.env.REACT_APP_FUNCTIONS_URL || '';
      
      if (!functionsUrl) {
        throw new Error('REACT_APP_FUNCTIONS_URL nÃ£o configurado');
      }

      const response = await fetch(`${functionsUrl}/testBirthdayCheck`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao testar verificaÃ§Ã£o: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Erro ao testar verificaÃ§Ã£o de aniversÃ¡rios:', error);
      throw error;
    }
  }
};

