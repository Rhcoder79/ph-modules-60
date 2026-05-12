import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Register = () => {
    const {register,handleSubmit,formState:{errors }}=useForm();
    const {registerUser,updateUserProfile}=useAuth();
   const location=useLocation();
   const navigate=useNavigate();
    const axiosSecure=useAxiosSecure();

   
    const handleRegister=(data)=>{
   
   const profileImg=data.photo[0];
   


   registerUser(data.email,data.password)
   .then(()=>{
  
    const formData=new FormData();
    formData.append('image',profileImg)
    const imageApiUrl=`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`
    axios.post(imageApiUrl,formData)
    .then(res=>{
        const photoUrl=res.data.data.url;
        //create user in the database
        const userInfo={
          email:data.email,
          displayName:data.name,
           photoURL:photoUrl
        }
        axiosSecure.post('/users',userInfo)
        .then(res=>{
          if(res.data.insertedId){
            console.log('user created in the database')
          }
        })
        //update user profile
        const userProfile={
            displayName:data.name,
            photoURL:photoUrl
        }
      updateUserProfile(userProfile)
      .then(()=>{
        console.log('user profile updated done')
        navigate(location.state || '/');
      })
      .catch(error=>console.log(error))
    })
}).catch(error=>{
    console.log(error)

   })
    
}
    return (
      <div className='card bg-yellow-600 w-full max-w-sm shrink-0 shadow-2xl'>
          <div className='card-body'>
            <form onSubmit={handleSubmit(handleRegister)}>
                 <fieldset className="fieldset">
                    {/* name field */}
          <label className="label">Name</label>
          <input type="text" {...register('name',{required:true})} className="input" placeholder="NAME" />
          {errors.name?.type==='required' && <p className='text-yellow-600'>name is required</p>}
          {/* photo image url */}
           <label className="label">photo</label>
          
          <input type="file" {...register('photo',{required:true})} className="file-input" placeholder="your photo" />
          {errors.photo?.type==='required' && <p className='text-yellow-600'>photo is required</p>}
                    {/* email field */}
          <label className="label">Email</label>
          <input type="email" {...register('email',{required:true})} className="input" placeholder="Email" />
          {errors.email?.type==='required' && <p className='text-yellow-600'>email is required</p>}
          <label className="label">Password</label>
          <input type="password" {...register('password',{required:true,minLength:6,
            pattern:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
          })} className="input mb-2" placeholder="Password" />
          {
          errors.password?.type==='required' && <p>password is required</p>  
          }
          {
          errors.password?.type==='minLength' && <p>password must be 6 characters or longer</p>  
          }
          {
          errors.password?.type==='pattern' && <p>
            must have password with at least one uppercase,at least one lowercase,at least one number,and at least one special character
          </p>  
          }
      <br />

          <button className="btn btn-neutral mt-4">Register</button>
       
        </fieldset>
                <p>already have an account <Link
                 state={location.state}
                className='text-blue-400 underline' to='/login'>Login</Link></p>

            </form>
            <SocialLogin></SocialLogin>
        </div>
      </div>
    );
};

export default Register;