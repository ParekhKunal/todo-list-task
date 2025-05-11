'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation rules
  const validationRules = {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: {
        required: 'Full name is required',
        minLength: 'Full name must be at least 2 characters',
        maxLength: 'Full name cannot exceed 50 characters',
        pattern: 'Full name can only contain letters, spaces, hyphens, and apostrophes'
      }
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      message: {
        required: 'Username is required',
        minLength: 'Username must be at least 3 characters',
        maxLength: 'Username cannot exceed 20 characters',
        pattern: 'Username can only contain letters, numbers, and underscores'
      }
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: {
        required: 'Email is required',
        pattern: 'Please enter a valid email address'
      }
    },
    phoneNumber: {
      required: true,
      pattern: /^\d{10}$/,
      message: {
        required: 'Phone number is required',
        pattern: 'Phone number must be exactly 10 digits'
      }
    },
    password: {
      required: true,
      minLength: 8,
      message: {
        required: 'Password is required',
        minLength: 'Password must be at least 8 characters',
        pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    const fieldErrors = [];

    if (rules.required && !value) {
      fieldErrors.push(rules.message.required);
    }

    if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        fieldErrors.push(rules.message.minLength);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        fieldErrors.push(rules.message.maxLength);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        fieldErrors.push(rules.message.pattern);
      }
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors[0]; // Show only the first error
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(getApiUrl('/signup'), formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        toast.success('Account created successfully!');
        router.push('/login');
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed, please try again.';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Your Account</h2>

        {/* Submit error message */}
        {errors.submit && <p className="text-sm text-red-600 mb-4">{errors.submit}</p>}

        <Input
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          className={`mb-4 ${errors.fullName ? 'border-red-500' : ''}`}
          required
          disabled={isLoading}
        />
        {errors.fullName && <p className="text-sm text-red-600 mb-3">{errors.fullName}</p>}

        <Input
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          className={`mb-4 ${errors.username ? 'border-red-500' : ''}`}
          required
          disabled={isLoading}
        />
        {errors.username && <p className="text-sm text-red-600 mb-3">{errors.username}</p>}

        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`mb-4 ${errors.email ? 'border-red-500' : ''}`}
          required
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-600 mb-3">{errors.email}</p>}

        <Input
          name="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`mb-4 ${errors.phoneNumber ? 'border-red-500' : ''}`}
          required
          disabled={isLoading}
        />
        {errors.phoneNumber && <p className="text-sm text-red-600 mb-3">{errors.phoneNumber}</p>}

        <div className="relative mb-1">
          <Input
            name="password"
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={`mb-4 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!isPasswordVisible)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
            disabled={isLoading}
          >
            {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600 mb-3">{errors.password}</p>}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
