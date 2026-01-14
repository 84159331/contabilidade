import { useState, useCallback } from 'react';
import { ValidationError } from '../utils/errors';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required
    if (rule.required && (value === null || value === undefined || value === '')) {
      return 'Este campo Ã© obrigatÃ³rio';
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) return null;

    // Min length
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `MÃ­nimo de ${rule.minLength} caracteres`;
    }

    // Max length
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `MÃ¡ximo de ${rule.maxLength} caracteres`;
    }

    // Pattern
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'Formato invÃ¡lido';
    }

    // Email
    if (rule.email && typeof value === 'string') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Email invÃ¡lido';
      }
    }

    // Number
    if (rule.number && isNaN(Number(value))) {
      return 'Deve ser um nÃºmero';
    }

    // Min (for numbers)
    if (rule.min !== undefined && Number(value) < rule.min) {
      return `Valor mÃ­nimo: ${rule.min}`;
    }

    // Max (for numbers)
    if (rule.max !== undefined && Number(value) > rule.max) {
      return `Valor mÃ¡ximo: ${rule.max}`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, rules, validateField]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [values, validateField]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(rules).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      if (validate()) {
        try {
          await onSubmit(values);
        } catch (error: unknown) {
          if (error instanceof ValidationError) {
            const validationError = error as ValidationError;
            const field = validationError.context?.field;
            if (field) {
              setErrors(prev => ({
                ...prev,
                [field as string]: validationError.message
              }));
            }
          }
          throw error;
        }
      }
    };
  }, [values, validate, rules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setValue = useCallback((name: string, value: any) => {
    handleChange(name, value);
  }, [handleChange]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setValue,
    setValues,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
};

