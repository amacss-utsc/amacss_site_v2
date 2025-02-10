"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/utilities/cn';
import { InputStyle } from '@/utilities/tailwindShared';
import Logo from '@/components/svg/Logo';
import { colors } from '@/utilities/colors';

type ResetFormData = {
  password: string;
  passwordConfirm: string;
};

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormData>();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('Missing or invalid reset token.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/club-member/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error resetting password');
      }

      setSuccess('Password has been reset! You can now log in.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const password = watch('password');

  return (
    <main className="uppercase bg-gray-90 min-h-screen lg:h-full lg:w-screen overflow-y-scroll lg:pb-28 flex flex-col lg:items-center lg:justify-center">
      {/* Header with Logo */}
      <header className="py-28 lg:pb-14 lg:pt-0">
        <Link href="/">
          <Logo fill={colors.gray['02']} className="mx-auto lg:scale-150" />
        </Link>
      </header>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white font-bold px-8 lg:bg-gray-80 lg:px-14 lg:py-12 lg:w-[670px] lg:mx-auto lg:rounded-[32px]"
      >
        <h1 className="text-2xl lg:text-3xl font-black mb-6">Reset Password</h1>

        {/* Error / Success Messages */}
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-center mb-4">
            {success}
          </p>
        )}

        <fieldset className="mb-8">
          <label>New Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className={cn(InputStyle)}
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password.message}</p>
          )}
        </fieldset>

        <fieldset className="mb-8">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register('passwordConfirm', {
              required: 'Please confirm password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            className={cn(InputStyle)}
          />
          {errors.passwordConfirm && (
            <p className="text-red-500 mt-1">{errors.passwordConfirm.message}</p>
          )}
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mb-2 uppercase font-black text-2xl bg-blue-30 w-full py-[18px] rounded-2xl"
        >
          {isSubmitting ? 'Processing...' : 'Reset Password'}
        </button>

        {success && (
          <p className="w-full flex items-center justify-center mt-4">
            <Link href="/login" className="text-blue-10 normal-case">
              Back to Login
            </Link>
          </p>
        )}
      </form>
    </main>
  );
}
