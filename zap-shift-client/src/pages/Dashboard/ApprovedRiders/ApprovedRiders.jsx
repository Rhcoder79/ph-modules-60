import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaEye, FaUserCheck } from 'react-icons/fa';
import { IoPersonRemoveSharp } from "react-icons/io5";
import { FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
const ApprovedRiders = () => {
    const axiosSecure=useAxiosSecure();
    const {refetch,data:riders=[]}=useQuery({
        queryKey:['riders','pending'],
        queryFn:async()=>{
            const res=await axiosSecure.get('/riders');
            return res.data;
        }
    })
const updateRiderStatus=(rider,status)=>{
const updatedInfo={status: status,email:rider.email}
axiosSecure.patch(`/riders/${rider._id}`, updatedInfo)
.then(res=>{
    if(res.data.modifiedCount){
        refetch();
         Swal.fire({
             position: "top-end",
             icon: "success",
             title: `riders has been to ${status}`,
             showConfirmButton: false,
             timer: 2000
           });
    }
})
}

    const handleApproval=rider=>{
   updateRiderStatus(rider,'approved');
    }
    const handleRejection=rider=>{
   updateRiderStatus(rider,'rejected');
    }
    const handleDelete = rider => {
    Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete ${rider.name}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            axiosSecure.delete(`/riders/${rider._id}`)
                .then(res => {
                    if (res.data.deletedCount > 0) {
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Rider has been deleted.",
                            icon: "success"
                        });
                    }
                })
                .catch(error => {
                    console.error("Delete error:", error);
                    Swal.fire("Error!", "Failed to delete rider.", "error");
                });
        }
    });
};
    return (
        <div>
            <h2>riders pending approvel: {riders.length} </h2>
            <div className="overflow-x-auto">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th>No</th>
        <th>Name</th>
        <th>Email</th>
        <th>District</th>
        <th>Application Status</th>
        <th>work Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
   {
    riders.map((rider,index)=><tr key={rider._id}>
        <th>{index+1}</th>
        <td>{rider.name}</td>
         <td>{rider.email}</td>
        <td>{rider.district}</td>
        <td>
          <p className={`${rider.status==='approved'? 'text-yellow-600 bg-amber-400':'text-red-500'}`}>{rider.status}</p>  
        </td>
          <td>{rider.workStatus}</td>
        <td>
            <button  className='btn'><FaEye></FaEye></button>
            <button onClick={()=>handleApproval(rider)} className='btn'><FaUserCheck></FaUserCheck></button>
               <button onClick={() => handleRejection(rider)} className='btn'> <IoPersonRemoveSharp />  </button>
               <button onClick={() => handleDelete(rider)} className='btn'> <FaTrashCan />  </button>
            </td>
      </tr>)
   }
      
   
    </tbody>
  </table>
</div>
        </div>
    );
};

export default ApprovedRiders;