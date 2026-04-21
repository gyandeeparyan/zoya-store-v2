/**
 * Custom hook for user validation
 * Encapsulates validation logic and state management
 */
'use client';

import { useState, useCallback } from 'react';
import { validateUserAction, type UserValidationDetails } from '@/actions/validation';
import { useToast } from '@/hooks/use-toast';

interface UseValidationReturn {
  isValidating: boolean;
  isValidated: boolean;
  userDetails: UserValidationDetails | null;
  error: string | null;
  validateUser: (userId: string, serverId: string) => Promise<boolean>;
  reset: () => void;
}

export function useValidation(): UseValidationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [userDetails, setUserDetails] = useState<UserValidationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateUser = useCallback(
    async (userId: string, serverId: string): Promise<boolean> => {
      setIsValidating(true);
      setError(null);

      try {
        // Call server action - API URL is hidden on server
        const result = await validateUserAction(userId, serverId);

        if (result.success && result.userDetails) {
          setIsValidated(true);
          setUserDetails(result.userDetails);
          toast({
            title: 'Success',
            description: result.message,
            variant: 'default',
          });
          return true;
        } else {
          setError(result.message);
          toast({
            title: 'Validation Failed',
            description: result.message,
            variant: 'destructive',
          });
          return false;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Validation failed';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: 'Failed to validate user',
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [toast]
  );

  const reset = useCallback(() => {
    setIsValidating(false);
    setIsValidated(false);
    setUserDetails(null);
    setError(null);
  }, []);

  return {
    isValidating,
    isValidated,
    userDetails,
    error,
    validateUser,
    reset,
  };
}
