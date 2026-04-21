import { z } from 'zod';

/**
 * Validation schemas for forms
 */

// Phone number validation - allows Indian numbers and international format
const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Full name validation - at least 2 characters, no numbers
const nameRegex = /^[a-zA-Z\s]{2,}$/;

export const CustomerFormSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(nameRegex, 'Full name can only contain letters and spaces')
    .transform(val => val.trim()),

  whatsapp: z
    .string()
    .min(1, 'WhatsApp number is required')
    .regex(phoneRegex, 'Invalid WhatsApp number. Use valid Indian or international format (e.g., +919876543210 or 9876543210)')
    .transform(val => val.trim()),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(emailRegex, 'Email format is invalid')
    .transform(val => val.toLowerCase().trim()),
});

export type CustomerFormData = z.infer<typeof CustomerFormSchema>;

export const ValidationFormSchema = z.object({
  userId: z
    .string()
    .min(1, 'User ID is required')
    .min(2, 'User ID must be at least 2 characters')
    .max(50, 'User ID must not exceed 50 characters'),

  serverId: z
    .string()
    .min(1, 'Server ID is required')
    .min(1, 'Server ID must be at least 1 character')
    .max(50, 'Server ID must not exceed 50 characters'),
});

export type ValidationFormData = z.infer<typeof ValidationFormSchema>;
