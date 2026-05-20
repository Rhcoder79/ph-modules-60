import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import Forbidden from '../Components/Forbidden';

const RiderRoute = ({children}) => {
     const {loading,user}=useAuth();
   const {role,roleLoading}=useRole();
  if(loading ||!user ||roleLoading){
        return <div>
            <span className='loading loading-infinity loading-xl'></span>
        </div>
    }
     if(role!=='rider'){
        return <Forbidden></Forbidden>
    }

    return children;
};

export default RiderRoute;