import React, { use } from 'react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewsPromise }) => {
    const reviews = use(reviewsPromise);
 console.log('ds',reviews);
    return (
        <div className='my-24'>
            <div className='text-center mb-10'>
                <h3 className="text-3xl font-bold">Reviews</h3>
                <p className="max-w-2xl mx-auto mt-4 text-gray-600">
                    Discover what our users are saying about our services. 
                    Real feedback from real people.
                </p>
            </div>

            {/* ডাটা থাকলেই কেবল Swiper রেন্ডার হবে */}
            {reviews && reviews.length > 0 ? (
                <Swiper
                    key={reviews.length}
                    loop={reviews.length > 3}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    centeredSlides={true}
                    grabCursor={true}
                    effect={'coverflow'}
                    coverflowEffect={{
                        rotate: 30,
                        stretch: 50,
                        depth: 200,
                        modifier: 1,
                        scale: 0.75,
                        slideShadows: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    className="mySwiper"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review._id || review.id}>
                            <ReviewCard review={review} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="text-center py-10">
                    <p>No reviews available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Reviews;