import React, { useState } from 'react';
import style from './Auth.module.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const {register, handleSubmit, formState: { errors }} = useForm();
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [isError, setIsError] = useState(false);

  const onSubmitLogin = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', data);

      if (response.status === 200) {
        setIsError(false)
        setLoginSuccess(`Login successful!`);
        setTimeout(() => {
          setLoginSuccess(null)
          const user = response.data;
          console.log(user);
          
          localStorage.setItem('user', JSON.stringify(user.userDetails));
          localStorage.setItem('token', user.token); 
          if (user.userDetails.role === "owner")
            navigate('/owner_dashboard');
          else if (user.userDetails.role === 'supplier') 
            navigate(`/supplier_dashboard`);
        }, 3000);
      }
    } catch (error) {
      setIsError(true)
      console.error('Login error:', error);
      if (error.response) {
        setLoginSuccess(`Login error: ${error.response.data?.message}` );
        setTimeout(() => setLoginSuccess(null), 3000);
      }
      else {
        setLoginSuccess("An unexpected error occurred. Please try again.");
        setTimeout(() => setLoginSuccess(null), 3000);
      }
    }
  };


  return (
    <div className={`d-flex flex-column justify-content-center align-items-center min-vh-100 ${style.authBg}`}>
      <form onSubmit={handleSubmit(onSubmitLogin)} className={`bg-white shadow p-4 rounded w-100 ${style.authForm}`} style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Login to your account</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email', {required: 'Email is required',  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address',},})}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input id="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters',},})}/>
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <button type="submit" className={`btn btn-primary w-100 ${style.submitButton}`}>Login</button>
        
        {loginSuccess && (
        <div className={`${isError ? 'alert-danger' : 'alert-info' } alert alert-info text-center mt-3`}>{loginSuccess}</div>
        )}

        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
