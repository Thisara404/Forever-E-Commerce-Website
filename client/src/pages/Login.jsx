import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, registerUser, clearAuthError, setInitialized } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useReduxSelectors';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

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
      toast.error('Please enter your name');
      return;
    }

    try {
      if (currentState === 'Login') {
        await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
      } else {
        await dispatch(registerUser(formData)).unwrap();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  // Show loading only if not initialized and not timed out
  if (!initialized && !initTimeout) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl prata-regular">
            {currentState}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {currentState === 'Sign Up' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onChangeHandler}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChangeHandler}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChangeHandler}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : currentState}
            </Button>

            <div className="text-center">
              {currentState === 'Login' ? (
                <p className="text-sm">
                  Create account?{' '}
                  <span 
                    onClick={() => setCurrentState('Sign Up')} 
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Click here
                  </span>
                </p>
              ) : (
                <p className="text-sm">
                  Already have an account?{' '}
                  <span 
                    onClick={() => setCurrentState('Login')} 
                    className="text-primary cursor-pointer hover:underline"
                  >
                    Login here
                  </span>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
