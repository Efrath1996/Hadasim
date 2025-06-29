import React, { useState } from 'react';
import style from './Auth.module.css';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const {register,handleSubmit,control,formState: { errors }} = useForm({defaultValues: {products: [{ name: '', price: '', minQuantity: '' }],},});
  const { fields, append, remove } = useFieldArray({control,name: 'products'});
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isError, setIsError] = useState(false);

  const onSubmitRegister = async (data) => {
    try {
      console.log('Registr ',data);

      const response = await axios.post('http://localhost:3001/api/auth/register', data);

      if (response.status === 201) {
        console.log(response.data)
        setIsError(false)
        setRegisterSuccess(`Register supplier${data?.companyName ? ' ' + response.data.name : ''} successful!`);
        setTimeout(() => {
          setRegisterSuccess(null)
          navigate('/login');
       }, 3000);
      }
    } 
    catch (error) {
      setIsError(true)
      if (error.response) {
        setRegisterSuccess(`Registration error: ${error.response.data?.message}` );
        setTimeout(() => setRegisterSuccess(null), 3000);
      }
      else {
        setRegisterSuccess("An unexpected error occurred. Please try again.");
        setTimeout(() => setRegisterSuccess(null), 3000);
      }
    }
  };

  return (
    <div className={`d-flex justify-content-center align-items-center min-vh-100 ${style.authBg}`}>
      <form onSubmit={handleSubmit(onSubmitRegister)} className={`bg-white shadow p-4 rounded w-100 ${style.authForm}`}>
        <h2 className="text-center mb-4">Create an account</h2>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
            {...register("companyName", { required: "Company name is required" })}
          />
          {errors.companyName && <div className="invalid-feedback">{errors.companyName.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Name</label>
          <input className={`form-control ${errors.contactName ? 'is-invalid' : ''}`}
            {...register("contactName", { required: "Contact name is required" })}
          />
          {errors.contactName && <div className="invalid-feedback">{errors.contactName.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
            {...register("mobile", {
              required: "Mobile is required",
              pattern: { value: /^\d{10}$/, message: "Must be 10 digits" }
            })}
          />
          {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email"}})}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label">Products</label>
          {fields.map((item, index) => (
            <div className="row mb-2" key={item.id}>
              <div className="col">
                <input className="form-control" placeholder="Product Name"
                  {...register(`products.${index}.name`, { required: true })}
                />
              </div>
              <div className="col">
                <input className="form-control" type="number" step="0.1" placeholder="Price per Unit"
                  {...register(`products.${index}.price`, { required: true })}
                />
              </div>
              <div className="col">
                <input className="form-control" type="number" placeholder="Min Quantity"
                  {...register(`products.${index}.minQuantity`, { required: true })}
                />
              </div>
               {fields.length > 1 && (
                <div className="col-auto">
                  <button type="button" className="btn btn-outline-danger" onClick={() => remove(index)}>X</button>
                </div>
               )}
            </div>
          ))}
          <div>
            <button type="button" className="btn btn-link text-primary" onClick={() => append({ name: '', price: '', minQuantity: '' })}>
              + Create New Product
            </button>
          </div>
        </div>

        <button type="submit" className={`btn btn-primary w-100 ${style.submitButton}`}>Register</button>

        {registerSuccess && (
        <div className={`${isError ? 'alert-danger' : 'alert-info' } alert alert-info text-center mt-3`}>{registerSuccess}</div>
        )}

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;