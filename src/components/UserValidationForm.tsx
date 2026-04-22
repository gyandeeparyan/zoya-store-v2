/**
 * User validation form component
 * Handles user validation separately for better modularity
 */
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion } from '@/components/ui/accordion';
import { useForm } from 'react-hook-form';
import { Loader2, Gamepad2, Globe, Info, ShoppingCart, User } from 'lucide-react';
import { useValidation } from '@/hooks/useValidation';
import { useCart } from '@/context/cartContext';
import type { UserValidationDetails } from '@/actions/validation';

interface UserValidationFormProps {
  onValidationSuccess: (userDetails: UserValidationDetails, userId: string, serverId: string) => void;
  onCustomerInfoSubmit: (customerData: { customerName: string; whatsapp: string; email: string }) => void;
  disabled?: boolean;
}

interface ValidationFormData {
  userId: string;
  serverId: string;
}

interface CustomerFormData {
  customerName: string;
  whatsapp: string;
  email: string;
}

export function UserValidationForm({
  onValidationSuccess,
  onCustomerInfoSubmit,
  disabled = false,
}: UserValidationFormProps) {
  const { isValidating, isValidated, userDetails, validateUser } = useValidation();
  const { items: cartItems, getCartTotal } = useCart();
  const { register, handleSubmit, formState: { errors } } = useForm<ValidationFormData>();
  const { register: registerCustomer, handleSubmit: handleCustomerSubmit, formState: { errors: customerErrors }, watch } = useForm<CustomerFormData>();

  // Store submitted ids in refs to avoid stale closure when useEffect fires
  const submittedUserIdRef = useRef<string>('');
  const submittedServerIdRef = useRef<string>('');

  // Watch customer form fields
  const customerName = watch('customerName');
  const whatsapp = watch('whatsapp');
  const email = watch('email');

  // Check if all customer fields are filled and valid
  const isCustomerInfoComplete =
    customerName &&
    whatsapp &&
    email &&
    !customerErrors.customerName &&
    !customerErrors.whatsapp &&
    !customerErrors.email;

  // Fix stale closure: call onValidationSuccess via effect once hook state is ready
  useEffect(() => {
    if (isValidated && userDetails && submittedUserIdRef.current) {
      onValidationSuccess(userDetails, submittedUserIdRef.current, submittedServerIdRef.current ?? '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidated, userDetails]);

  const onSubmit = async (data: ValidationFormData) => {
    submittedUserIdRef.current = data.userId;
    submittedServerIdRef.current = data.serverId;
    await validateUser(data.userId, data.serverId);
  };

  const onCustomerSubmit = (data: CustomerFormData) => {
    onCustomerInfoSubmit(data);
  };

  if (isValidated && userDetails) {
    const cartTotal = getCartTotal();

    return (
      <div className="space-y-4">
        {/* Verification Success Header */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <p className="text-emerald-400 font-semibold flex items-center gap-2">
            <span className="text-lg">✓</span> Account Verified Successfully
          </p>
        </div>

        {/* User Details Card */}
        <div className="bg-gradient-to-br from-violet-600/5 to-purple-600/5 border border-violet-500/30 rounded-lg p-6 space-y-4">
          {/* Player Name - Always Visible */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Player Name</p>
            <p className="text-2xl font-bold text-emerald-300">{userDetails.username}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10"></div>

          {/* More Details Accordion */}
          <Accordion
            title={
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">More Details</span>
              </div>
            }
          >
            {/* Game Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Game */}
              {userDetails.game && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="w-4 h-4 text-blue-400" />
                    <p className="text-xs text-gray-400 uppercase">Game</p>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{userDetails.game}</p>
                </div>
              )}

              {/* Country */}
              {userDetails.country && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <p className="text-xs text-gray-400 uppercase">Country</p>
                  </div>
                  <p className="text-sm font-medium text-white">{userDetails.country}</p>
                </div>
              )}

              {/* Player ID */}
              {userDetails.id && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Player ID</p>
                  <p className="text-sm font-mono text-emerald-300">{userDetails.id}</p>
                </div>
              )}

              {/* Server */}
              {userDetails.server && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">Server</p>
                  <p className="text-sm font-mono text-blue-300">{userDetails.server}</p>
                </div>
              )}
            </div>
          </Accordion>

          {/* Cart Summary Accordion */}
          {cartItems.length > 0 && (
            <>
              <div className="h-px bg-white/10"></div>
              <Accordion
                title={
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">Cart Summary</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-300 mr-4">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                }
              >
                {/* Cart Items List */}
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-300">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Amount */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Total Amount:</span>
                  <span className="text-lg font-bold mr-2 text-emerald-300">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
              </Accordion>
            </>
          )}

          {/* Customer Info Accordion */}
          <>
            <div className="h-px bg-white/10"></div>
            <Accordion
              title={
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Customer Information</span>
                </div>
              }
            >
              <form onSubmit={handleCustomerSubmit(onCustomerSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <Input
                    {...registerCustomer('customerName', { required: 'Name is required' })}
                    placeholder="Enter your full name"
                    disabled={disabled}
                    type='text'
                    className="bg-white/5 border-white/10"
                  />
                  {customerErrors.customerName && <p className="text-xs text-red-400">{customerErrors.customerName.message}</p>}
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">WhatsApp Number</label>
                  <Input
                    {...registerCustomer('whatsapp', { required: 'WhatsApp number is required' })}
                    placeholder="Enter your WhatsApp number"
                    type='number'
                    disabled={disabled}
                    className="bg-white/5 border-white/10"
                  />
                  {customerErrors.whatsapp && <p className="text-xs text-red-400">{customerErrors.whatsapp.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input
                    {...registerCustomer('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email'
                      }
                    })}
                    type="email"
                    placeholder="Enter your email"
                    disabled={disabled}
                    className="bg-white/5 border-white/10"
                  />
                  {customerErrors.email && <p className="text-xs text-red-400">{customerErrors.email.message}</p>}
                </div>
              </form>
            </Accordion>
          </>

          {/* Status Footer */}
          <div className={`text-center flex flex-col text-xs pt-4 border-t border-white/10 ${isCustomerInfoComplete ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {isCustomerInfoComplete
              ? "User validation successful. You can proceed to Pay"
              : "Please fill in Customer Information to proceed to Pay"}
            <Button
              className="mt-4"
              type="button"
              disabled={!isCustomerInfoComplete}
              onClick={handleCustomerSubmit(onCustomerSubmit)}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">User ID</label>
        <Input
          {...register('userId', { required: 'User ID is required' })}
          placeholder="Enter your user ID"
          disabled={isValidating || disabled}
          defaultValue={"1114917746"}
          className="bg-white/5 border-white/10"
        />
        {errors.userId && <p className="text-xs text-red-400">{errors.userId.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Server ID</label>
        <Input
          {...register('serverId', { required: 'Server ID is required' })}
          placeholder="Enter your server ID"
          disabled={isValidating || disabled}
          defaultValue={"13486"}
          className="bg-white/5 border-white/10"
        />
        {errors.serverId && <p className="text-xs text-red-400">{errors.serverId.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isValidating || disabled}
        className="w-full"
      >
        {isValidating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Validating...
          </>
        ) : (
          'Validate User'
        )}
      </Button>
    </form>
  );
}
