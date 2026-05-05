import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
    return (
        <div>
            <h2>payment is cancelled. please try again</h2>
            <Link to='/dashboard/my-parcels'>
            <button className='btn btn-primary'>try again</button>
            </Link>

        </div>
    );
};

export default PaymentCancelled;