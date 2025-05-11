'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // Form validation
  const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }
    if (!isEmailValid) {
      setError('Please enter a valid email.');
      return;
    }
    if (!isPasswordValid) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message || 'Login failed, please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>

        {/* Error message */}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
          required
        />
        <div className="relative mb-6">
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!isPasswordVisible)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
          >
            {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isEmailValid || !isPasswordValid}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Login
        </Button>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
