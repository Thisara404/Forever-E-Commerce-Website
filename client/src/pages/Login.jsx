import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, registerUser, clearAuthError, setInitialized } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useReduxSelectors';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [initTimeout, setInitTimeout] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user, initialized } = useAuth();

  // Set a timeout for initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialized) {
        console.warn('⚠️ Auth initialization timeout in Login component');
        dispatch(setInitialized());
        setInitTimeout(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [initialized, dispatch]);

  // Clear auth errors when state changes
  useEffect(() => {
    if (error) {
      dispatch(clearAuthError());
    }
  }, [currentState, dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if ((initialized || initTimeout) && isAuthenticated && user) {
      console.log('🔀 User authenticated, redirecting...', { role: user.role });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [initialized, initTimeout, isAuthenticated, user, navigate]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    dispatch(clearAuthError());
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (currentState === 'Sign Up' && !formData.name) {
      toast.error('Name is required for registration');
      return;
    }

    try {
      let result;
      
      if (currentState === 'Login') {
        result = await dispatch(loginUser({
          email: formData.email.trim(),
          password: formData.password
        })).unwrap();
        
        toast.success('Login successful!');
      } else {
        result = await dispatch(registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        })).unwrap();
        
        toast.success('Registration successful!');
      }
      
      // Navigation will be handled by useEffect
      setFormData({ name: '', email: '', password: '' });
      
    } catch (error) {
      console.error('❌ Auth error:', error);
      toast.error(error || 'Authentication failed. Please try again.');
    }
  };

  // Show loading only if not initialized and not timed out
  if (!initialized && !initTimeout) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      
      {/* Show error message if any */}
      {error && (
        <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {currentState === 'Sign Up' && (
        <input 
          name='name'
          value={formData.name}
          onChange={onChangeHandler}
          type="text" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Name' 
          required
          disabled={loading}
        />
      )}
      
      <input 
        name='email'
        value={formData.email}
        onChange={onChangeHandler}
        type="email" 
        className='w-full px-3 py-2 border border-gray-800' 
        placeholder='Email' 
        required
        disabled={loading}
      />
      
      <input 
        name='password'
        value={formData.password}
        onChange={onChangeHandler}
        type="password" 
        className='w-full px-3 py-2 border border-gray-800' 
        placeholder='Password' 
        required
        disabled={loading}
      />
      
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
          ? <p onClick={() => !loading && setCurrentState('Sign Up')} className={`cursor-pointer ${loading ? 'opacity-50' : ''}`}>Create account</p>
          : <p onClick={() => !loading && setCurrentState('Login')} className={`cursor-pointer ${loading ? 'opacity-50' : ''}`}>Login Here</p>
        }
      </div>
      
      <button 
        type='submit'
        disabled={loading}
        className={`bg-black text-white font-light px-8 py-2 mt-4 transition-opacity ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          currentState === 'Login' ? 'Sign In' : 'Sign Up'
        )}
      </button>
    </form>
  );
};

export default Login;
