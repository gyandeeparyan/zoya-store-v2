/**
 * Customer information form component
 * Collects customer details for payment
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface CustomerFormData {
  customerName: string;
  whatsapp: string;
  email: string;
}

interface CustomerInfoFormProps {
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
  formId?: string;
}

export function CustomerInfoForm({
  onSubmit,
  isLoading = false,
  disabled = false,
  formId,
}: CustomerInfoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>();

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Full Name</label>
        <Input
          {...register('customerName', { required: 'Name is required' })}
          placeholder="Enter your full name"
          disabled={isLoading || disabled}
          className="bg-white/5 border-white/10"
        />
        {errors.customerName && <p className="text-xs text-red-400">{errors.customerName.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">WhatsApp Number</label>
        <Input
          {...register('whatsapp', { required: 'WhatsApp number is required' })}
          placeholder="Enter your WhatsApp number"
          disabled={isLoading || disabled}
          className="bg-white/5 border-white/10"
        />
        {errors.whatsapp && <p className="text-xs text-red-400">{errors.whatsapp.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Email</label>
        <Input
          {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
          type="email"
          placeholder="Enter your email"
          disabled={isLoading || disabled}
          className="bg-white/5 border-white/10"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading || disabled}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Proceed to Payment'
        )}
      </Button>
    </form>
  );
}
