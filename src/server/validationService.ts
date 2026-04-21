'use server';

/**
 * Server-side service for user validation
 * Keeps external API calls secure and hidden from client
 */

interface ValidationResult {
  success: boolean;
  game?: string;
  id?: number;
  server?: number;
  country?: string;
  name?: string;
  nickname?: string;
  username?: string;
}

interface ValidationError {
  success: false;
  message: string;
}

export async function validateUserServer(
  userId: string,
  serverId: string
): Promise<ValidationResult | ValidationError> {
  try {
    // Keep API URL secure on server-side only
    const apiUrl = `${process.env.NEXT_PUBLIC_VALIDATION_API_URL}?id=${userId}&zone=${serverId}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Zoya-Store-Server/1.0'
      }
    });

    clearTimeout(timeoutId);

    const data: ValidationResult = await response.json();

    if (!data.success) {
      return {
        success: false,
        message: 'Invalid user ID or server ID'
      };
    }

    // Ensure response has a name field for consistency
    // Extract from various possible field names: name, nickname, username
    const extractedName = data.name || data.nickname || data.username || userId;

    return {
      ...data,
      success: true,
      name: extractedName
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`[Validation Service] Error:`, errorMessage);

    return {
      success: false,
      message: 'Failed to validate user'
    };
  }
}
