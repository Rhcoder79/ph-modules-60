import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const ReviewCard = ({review}) => {
    const {userName,review:testimonial,user_photoURL}=review
    return (
       <div className="card w-80 bg-secondary shadow-xl border border-primary/20 hover:scale-105 transition-transform duration-300">
            {/* কার্ড ইমেজ অংশ */}
            <figure className="px-6 pt-6">
                <img 
                    src={user_photoURL}
                    alt="Brand" 
                    className="rounded-xl h-40 w-full object-cover bg-white" 
                />
            </figure>

            {/* কার্ড বডি অংশ */}
            <div className="card-body items-center text-center">
                <h2 className="card-title text-primary text-2xl font-bold">{userName}</h2>
                <p className="text-gray-300 text-sm">
                   {testimonial}
                </p>

                <div className="card-actions mt-4">
                    {/* আপনার কাস্টম প্রাইমারি কালার সমৃদ্ধ বাটন */}
                    <button className="btn bg-primary hover:bg-primary/80 text-secondary border-none font-bold flex items-center gap-2 px-8">
                        View Details
                        <FaArrowRight /> 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;