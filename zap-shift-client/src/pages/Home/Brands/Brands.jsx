import React from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import amazon from '../../../assets/brands/amazon.png';
import amazon_vector from '../../../assets/brands/amazon_vector.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import star from '../../../assets/brands/star.png';
import star_people from '../../../assets/brands/start_people.png';
import { Autoplay } from 'swiper/modules';

const brandLogos = [amazon, amazon_vector, casio, moonstar, randstad, star, star_people];

const Brands = () => {
    return (
        <Swiper
            // ১. লুপ কন্ডিশন: স্লাইড সংখ্যা slidesPerView এর দ্বিগুণ হওয়া নিরাপদ
            loop={brandLogos.length > 3} 
            
            // ২. সেন্টার মোডে ৩টি স্লাইড দেখালে দেখতে ব্যালেন্সড লাগে
            slidesPerView={1}
            breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            
            centeredSlides={true}
            spaceBetween={30}
            grabCursor={true}
            modules={[Autoplay]}
            autoplay={{
                delay: 1500,
                disableOnInteraction: false,
            }}
            // যদি আপনার স্লাইড সংখ্যা অনেক বেশি না হয়, তবে এই নিচের লাইনটি সাহায্য করে
            loopPreventsSliding={false}
        >
            {brandLogos.map((logo, index) => (
                <SwiperSlide key={index} className="flex justify-center items-center">
                    <img src={logo} alt={`brand-${index}`} className="h-16 object-contain" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Brands;