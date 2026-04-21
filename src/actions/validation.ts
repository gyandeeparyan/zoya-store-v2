/**
 * Client-side validation service actions
 * Bridges client components with server-side operations
 */
'use server';

import { validateUserServer } from '../server/validationService';

export type UserValidationDetails = {
  username: string;
  game?: string;
  id?: number;
  server?: number;
  country?: string;
};

export type ValidationActionResult = {
  success: boolean;
  userDetails?: UserValidationDetails;
  message: string;
};

/**
 * Server action for user validation
 * Called from client components - keeps API URL hidden
 */
export async function validateUserAction(
  userId: string,
  serverId: string
): Promise<ValidationActionResult> {
  // Validate input on server
  if (!userId?.trim() || !serverId?.trim()) {
    return {
      success: false,
      message: 'User ID and Server ID are required'
    };
  }

  // Remove any dangerous characters
  const sanitizedUserId = userId.trim().slice(0, 50);
  const sanitizedServerId = serverId.trim().slice(0, 50);

  const result = await validateUserServer(sanitizedUserId, sanitizedServerId);

  if (result.success && 'name' in result) {
    const username = result.name || sanitizedUserId;
    const userDetails: UserValidationDetails = {
      username,
      game: result.game,
      id: result.id,
      server: result.server,
      country: result.country,
    };

    return {
      success: true,
      userDetails,
      message: `User validated successfully as: ${username}`
    };
  }

  return {
    success: false,
    message: 'message' in result ? result.message : 'Validation failed'
  };
}
