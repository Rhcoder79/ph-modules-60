import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {
    const {register,handleSubmit,formState:{errors}}=useForm();
    const {signInUser}=useAuth();
    const location=useLocation();
    const navigate=useNavigate();

    const handleLogin=(data)=>{
      console.log('ddd',data)
      signInUser(data.email,data.password).then(result=>{
        console.log(result.user)
        navigate(location?.state || '/')
      })
      .catch(error=>{
        console.log(error)
      })
    }
    return (
         <div className="card bg-yellow-600 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className='text-3xl text-center'>welcome back</h3>
            <p className='text-center'>please login</p>
      <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
        <fieldset className="fieldset">
            {/* email field */}
          <label className="label">Email</label>
          <input type="email" {...register('email')}   className="input" placeholder="Email" />
          {
            errors.email?.type==='required' && <p className='text-red-500'>email is required</p>
          }
          {/* password field */}
          <label className="label">Password</label>
          <input type="password" {...register('password',{required:true,minLength:6})} className="input" placeholder="Password" />
          {errors.password?.type==='minLength' && <p className='text-red-600'>password must be 6 character or longer</p>}
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        <p>new to zap shift <Link state={location.state} className='text-blue-400 underline' to='/register'>Register</Link></p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
    );
};

export default Login;