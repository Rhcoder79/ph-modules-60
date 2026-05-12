import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

const Rider = () => {
    const {register,handleSubmit,control,
          //  formState:{errors}
        }=useForm();
 const {user}=useAuth();
const axiosSecure=useAxiosSecure();
  const serviceCenters=useLoaderData();
    const regionsDuplicate=serviceCenters.map(c=>c.region);
    const regions=[...new Set(regionsDuplicate)];
    //explore usememo usecallback

    const districtsByRegion=(region)=>{
        const regionDistricts=serviceCenters.filter(c=>c.region===region);
        const districts=regionDistricts.map(d=>d.district);
        return districts;
    }

    const riderRegion=useWatch({ control,name:'region'});

    const handleRiderApplication=data=>{
  console.log(data);
  axiosSecure.post('/riders',data)
  .then(res=>{
    if(res.data.insertedId){
    Swal.fire({
     position: "top-end",
     icon: "success",
     title: "your application has been submitted we will reach to you in 45 days",
     showConfirmButton: false,
     timer: 2000
   });
    }
  })
    }
    return (
        <div>
            <h2>be a rider</h2>
            <form onSubmit={handleSubmit(handleRiderApplication)} className='mt-12 p-4 bg-amber-500 text-black my-8'>
               
                {/* two column */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    
                        <fieldset className="fieldset">
                                  <h4 className='text-2xl font-semibold'>Rider details</h4>
                            {/* sender name */}
          <label className="label">Rider Name</label>
          <input type="text" className="input w-full" {...register('name')} defaultValue={user?.displayName} placeholder="Rider Name" />
                {/* sender email */}
          <label className="label">Rider Email</label>
          <input type="text" className="input w-full" {...register('email')} defaultValue={user?.email} placeholder="Rider Email" />

          {/* sender region */}
          <fieldset className="fieldset">
  <legend className="fieldset-legend">Regions</legend>
  <select {...register('region')} defaultValue="Pick a region" className="select">
    <option disabled={true}>Pick a region</option>
    {
      regions.map((r,i)=><option key={i} value={r}>{r}</option>)  
    }
  </select>
</fieldset>
 {/* sender district */}
          <fieldset className="fieldset">
  <legend className="fieldset-legend">Districts</legend>
  <select {...register('district')} defaultValue="Pick a Districts" className="select">
    <option disabled={true}>Pick a Districts</option>
    {
    districtsByRegion(riderRegion).map((r,i)=><option key={i} value={r}>{r}</option>)  
    }
 
   
  </select>
</fieldset>
           
          
    
          
          
          {/* sender address */}
           <label className="label mt-4">Your Address</label>
          <input type="text" className="input w-full" {...register('address')} placeholder="Sender Address" />
        
        </fieldset>
                    {/* receiver details */}
                        <fieldset className="fieldset">
                                  <h4 className='text-2xl font-semibold'>More details</h4>
                            {/* sender name */}
          <label className="label">Driving License</label>
          <input type="text" className="input w-full" {...register('license')} placeholder="Driving License" />
          {/* Receiver email */}
           <label className="label">NID</label>
          <input type="text" className="input w-full" {...register('nid')} placeholder="NID" />
       
   
          {/* bike */}
           <label className="label mt-4">Bike</label>
          <input type="text" className="input w-full" {...register('bike')} placeholder="Bike" />
           
        </fieldset>

                </div>
                <input type="submit" className='btn btn-primary text-black' value='Apply as a rider' />
            </form>   
        </div>
    );
};

export default Rider;