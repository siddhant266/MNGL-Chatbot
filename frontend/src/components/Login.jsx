import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().optional(),
  bpNumber: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.email || data.bpNumber, {
  message: "Please provide either email or BP Number",
  path: ["email"],
});

function Login() {
  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error) {
      setFormError('root', { message: error });
      clearError();
    }
  }, [error, setFormError, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    // Clean up empty strings
    const loginData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );
    
    await login(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to MNGL Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {errors.root && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{errors.root.message}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="input-field mt-1"
                placeholder="Enter your email"
              />
              <p className="mt-1 text-sm text-gray-500">OR</p>
            </div>

            <div>
              <label htmlFor="bpNumber" className="block text-sm font-medium text-gray-700">
                BP Number
              </label>
              <input
                id="bpNumber"
                type="text"
                {...register('bpNumber')}
                className="input-field mt-1"
                placeholder="Enter your BP Number (MNGL-YYYY-XXXXX)"
              />
              {errors.bpNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.bpNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="input-field mt-1"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex justify-center py-2.5 px-4"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;