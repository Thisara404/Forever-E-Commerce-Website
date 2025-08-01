import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { login, register, loading } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      if (currentState === 'Login') {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name) {
          toast.error('Name is required');
          return;
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      
      {currentState === 'Sign Up' && (
        <input 
          name='name'
          value={formData.name}
          onChange={onChangeHandler}
          type="text" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Name' 
          required
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
      />
      
      <input 
        name='password'
        value={formData.password}
        onChange={onChangeHandler}
        type="password" 
        className='w-full px-3 py-2 border border-gray-800' 
        placeholder='Password' 
        required
      />
      
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
          ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      
      <button 
        type='submit'
        disabled={loading}
        className={`bg-black text-white font-light px-8 py-2 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : (currentState === 'Login' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  );
};

export default Login;
