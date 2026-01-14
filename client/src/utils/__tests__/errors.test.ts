import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  ErrorHandler,
} from '../errors';

describe('AppError', () => {
  it('deve criar erro com mensagem e cÃ³digo', () => {
    const error = new AppError('Test error', 'TEST_ERROR');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.isOperational).toBe(true);
  });

  it('deve criar erro com statusCode', () => {
    const error = new AppError('Test error', 'TEST_ERROR', 400);
    expect(error.statusCode).toBe(400);
  });

  it('deve criar erro com context', () => {
    const context = { field: 'email', value: 'test@example.com' };
    const error = new AppError('Test error', 'TEST_ERROR', 400, true, context);
    expect(error.context).toEqual(context);
  });
});

describe('ValidationError', () => {
  it('deve criar erro de validaÃ§Ã£o', () => {
    const error = new ValidationError('Campo invÃ¡lido', 'email');
    expect(error.message).toBe('Campo invÃ¡lido');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.context?.field).toBe('email');
  });
});

describe('AuthenticationError', () => {
  it('deve criar erro de autenticaÃ§Ã£o', () => {
    const error = new AuthenticationError();
    expect(error.message).toBe('NÃ£o autenticado');
    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.statusCode).toBe(401);
  });
});

describe('AuthorizationError', () => {
  it('deve criar erro de autorizaÃ§Ã£o', () => {
    const error = new AuthorizationError();
    expect(error.message).toBe('NÃ£o autorizado');
    expect(error.code).toBe('AUTHORIZATION_ERROR');
    expect(error.statusCode).toBe(403);
  });
});

describe('NotFoundError', () => {
  it('deve criar erro de nÃ£o encontrado', () => {
    const error = new NotFoundError('UsuÃ¡rio');
    expect(error.message).toBe('UsuÃ¡rio nÃ£o encontrado');
    expect(error.code).toBe('NOT_FOUND_ERROR');
    expect(error.statusCode).toBe(404);
  });
});

describe('NetworkError', () => {
  it('deve criar erro de rede', () => {
    const error = new NetworkError();
    expect(error.message).toBe('Erro de conexÃ£o com o servidor');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.isOperational).toBe(false);
  });
});

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('deve tratar AppError corretamente', () => {
      const error = new ValidationError('Campo invÃ¡lido');
      const message = ErrorHandler.handle(error, false);
      expect(message).toBe('Campo invÃ¡lido');
    });

    it('deve tratar Error padrÃ£o corretamente', () => {
      const error = new Error('Erro padrÃ£o');
      const message = ErrorHandler.handle(error, false);
      expect(message).toBe('Erro padrÃ£o');
    });

    it('deve tratar erro de API 401', () => {
      const error = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };
      const message = ErrorHandler.handle(error, false);
      expect(message).toBe('Sua sessÃ£o expirou. Por favor, faÃ§a login novamente.');
    });

    it('deve tratar erro de API 404', () => {
      const error = {
        response: {
          status: 404,
          data: { error: 'Not Found' },
        },
      };
      const message = ErrorHandler.handle(error, false);
      expect(message).toBe('Recurso nÃ£o encontrado.');
    });

    it('deve tratar erro desconhecido', () => {
      const error = 'String error';
      const message = ErrorHandler.handle(error, false);
      expect(message).toBe('Ocorreu um erro inesperado. Tente novamente.');
    });
  });

  describe('isOperational', () => {
    it('deve retornar true para erro operacional', () => {
      const error = new ValidationError('Test');
      expect(ErrorHandler.isOperational(error)).toBe(true);
    });

    it('deve retornar false para erro nÃ£o operacional', () => {
      const error = new NetworkError();
      expect(ErrorHandler.isOperational(error)).toBe(false);
    });

    it('deve retornar false para erro padrÃ£o', () => {
      const error = new Error('Test');
      expect(ErrorHandler.isOperational(error)).toBe(false);
    });
  });

  describe('getErrorCode', () => {
    it('deve retornar cÃ³digo de AppError', () => {
      const error = new ValidationError('Test');
      expect(ErrorHandler.getErrorCode(error)).toBe('VALIDATION_ERROR');
    });

    it('deve retornar STANDARD_ERROR para Error padrÃ£o', () => {
      const error = new Error('Test');
      expect(ErrorHandler.getErrorCode(error)).toBe('STANDARD_ERROR');
    });

    it('deve retornar UNKNOWN_ERROR para erro desconhecido', () => {
      expect(ErrorHandler.getErrorCode('string')).toBe('UNKNOWN_ERROR');
    });
  });
});



