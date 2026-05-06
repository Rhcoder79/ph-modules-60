import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure'
const PaymentSuccss = () => {
    const [searchParams]=useSearchParams();
    const [paymentInfo,setPaymentInfo]=useState({});

    const sessionId=searchParams.get('session_id');
    const axiosSecure=useAxiosSecure();
    console.log(sessionId);
    useEffect(()=>{
     if(sessionId){
    axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
    .then(res=>{
        console.log(res.data);
        setPaymentInfo({
            transactionId:res.data.transactionId,
            trackingId:res.data.trackingId
        })
    })
     }
    },[sessionId,axiosSecure])
    return (
        <div>
            <h2>payment succuessfull</h2>
            <p>your transactionId: {paymentInfo.transactionId} </p>
            <p>your parcel trackingId {paymentInfo.trackingId} </p>
        </div>
    );
};

export default PaymentSuccss;