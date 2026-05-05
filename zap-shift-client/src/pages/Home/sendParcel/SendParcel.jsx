import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const SendParcel = () => {
    const {register,handleSubmit,control,
      //  formState:{errors}
    }=useForm();
    const {user}=useAuth();

   const axiosSecure=useAxiosSecure();
    const serviceCenters=useLoaderData();
    const regionsDuplicate=serviceCenters.map(c=>c.region);
    const regions=[...new Set(regionsDuplicate)];
    //explore usememo usecallback
    const senderRegion=useWatch({ control,name:'senderRegion'});
    const receiverRegion=useWatch({control ,name:'receiverRegion'}) ;
    const districtsByRegion=(region)=>{
        const regionDistricts=serviceCenters.filter(c=>c.region===region);
        const districts=regionDistricts.map(d=>d.district);
        return districts;
    }
    const handleSendParcel=data=>{
   console.log(data);
   const isDocument=data.parcelType==='document';
   const isSameDistrict=data.senderDistrict===data.receiverDistrict;
   const parcelWeight=parseFloat(data.parcelWeight);
 let cost=0;
 if(isDocument){
    cost =isSameDistrict?60:80;

 }
   else{
    if(parcelWeight<3){
   cost=isSameDistrict?110:150;
    }
    else{
  const minCharge=isSameDistrict?110:150;
  const extraWeight=parcelWeight-3;
  const extraCharge=isSameDistrict?extraWeight*40:extraWeight* 40 +40;
  cost =minCharge+extraCharge;

    }
   }

Swal.fire({
        title: "Are you sure?",
        text: `Total Cost: ${cost} TK. Do you want to send this parcel?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Send it!"
    }).then((result) => {
        // Jodi user 'Yes' click kore
        if (result.isConfirmed) {
            //save the parcel info to the database
            axiosSecure.post('/parcels',data)
            .then(res=>{
                console.log( 'after save parcel',res.data);
            })
            // Eikhane tumi tomar API call korte paro (e.g., axios.post)
            
            // Swal.fire({
            //     title: "Success!",
            //     text: "Your parcel has been sent successfully.",
            //     icon: "success"
            // });
        }
    });

    }

    return (
        <div>
            <h2 className="text-5xl font-bold">Send A Parcel</h2>
            <form onSubmit={handleSubmit(handleSendParcel)} className='mt-12 p-4 bg-amber-500 text-black my-8'>
                {/* parcel type */}
                <div className='flex gap-2'>
                    <label className="label">
                        <input type="radio" {...register('parcelType')} value="document" className="radio" defaultChecked />
                        Document</label>
                        <label className="label">
                        <input type="radio" {...register('parcelType')} value="non-document" className="radio" />
                        Non-Document</label>
                </div>

                {/* parcel info: name, weight */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 '>
                  <fieldset className="fieldset">
          <label className="label">Parcel Name</label>
          <input type="text" className="input w-full" {...register('parcelName')} placeholder="Parcel Name" />
        </fieldset>

         <fieldset className="fieldset">
          <label className="label">Parcel weight(kg)</label>
          <input type="number" className="input w-full" {...register('parcelWeight')} placeholder="Parcel Weight" />

        </fieldset>
                </div>

                {/* two column */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    {/* sender details */}
           
                        <fieldset className="fieldset">
                                  <h4 className='text-2xl font-semibold'>sender details</h4>
                            {/* sender name */}
          <label className="label">Sender Name</label>
          <input type="text" className="input w-full" {...register('SenderName')} defaultValue={user?.displayName} placeholder="Sender Name" />
                {/* sender email */}
          <label className="label">Sender Email</label>
          <input type="text" className="input w-full" {...register('SenderEmail')} defaultValue={user?.email} placeholder="Sender Email" />

          {/* sender region */}
          <fieldset className="fieldset">
  <legend className="fieldset-legend">Sender Regions</legend>
  <select {...register('senderRegion')} defaultValue="Pick a region" className="select">
    <option disabled={true}>Pick a region</option>
    {
      regions.map((r,i)=><option key={i} value={r}>{r}</option>)  
    }
  </select>
</fieldset>
 {/* sender district */}
          <fieldset className="fieldset">
  <legend className="fieldset-legend">Sender Districts</legend>
  <select {...register('senderDistrict')} defaultValue="Pick a Districts" className="select">
    <option disabled={true}>Pick a Districts</option>
    {
    districtsByRegion(senderRegion).map((r,i)=><option key={i} value={r}>{r}</option>)  
    }
 
   
  </select>
</fieldset>
           
          
    
          
          
          {/* sender address */}
           <label className="label mt-4">Sender Address</label>
          <input type="text" className="input w-full" {...register('SenderAddress')} placeholder="Sender Address" />
        
        </fieldset>
                    {/* receiver details */}
                        <fieldset className="fieldset">
                                  <h4 className='text-2xl font-semibold'>Receiver details</h4>
                            {/* sender name */}
          <label className="label">Receiver Name</label>
          <input type="text" className="input w-full" {...register('receiverName')} placeholder="Receiver Name" />
          {/* Receiver email */}
           <label className="label">Receiver Email</label>
          <input type="text" className="input w-full" {...register('receiverEmail')} placeholder="Receiver Email" />
            {/* receiver region */}
          <fieldset className="fieldset">
  <legend className="fieldset-legend">receiver Regions</legend>
  <select {...register('receiverRegion')} defaultValue="Pick a region" className="select">
    <option disabled={true}>Pick a region</option>
    {
      regions.map((r,i)=><option key={i} value={r}>{r}</option>)  
    }
  </select>
</fieldset>
    {/* receiver district */}
          <fieldset className="fieldset">
  <legend className="fieldset-legend">receiver district</legend>
  <select {...register('receiverDistrict')} defaultValue="Pick a district" className="select">
    <option disabled={true}>Pick a district</option>
    {
      districtsByRegion(receiverRegion).map((d,i)=><option key={i} value={d}>{d}</option>)  
    }
  </select>
</fieldset>
          {/* Receiver address */}
           <label className="label mt-4">Receiver Address</label>
          <input type="text" className="input w-full" {...register('receiverAddress')} placeholder="Receiver Address" />
        
        </fieldset>

                </div>
                <input type="submit" className='btn btn-primary text-black' value='send parcel' />
            </form>
        </div>
    );
};

export default SendParcel;