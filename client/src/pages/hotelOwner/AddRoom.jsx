import React, { useState } from 'react'
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddRoom = () => {
    const { axios, getToken } = useAppContext();
    const [images, setImages]   = useState({ 1: null, 2: null, 3: null, 4: null });
    const [inputs, setInputs]   = useState({
        roomType: '',
        pricePerNight: 0,
        amenities: { 'Free Wifi': false, 'Free Breakfast': false, 'Room Service': false, 'Mountain View': false, 'Pool Access': false }
    });
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!inputs.roomType || !inputs.pricePerNight || !Object.values(images).some(i => i)) {
            toast.error("Please fill in all the details"); return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('roomType', inputs.roomType);
            formData.append('pricePerNight', inputs.pricePerNight);
            const amenities = Object.keys(inputs.amenities).filter(k => inputs.amenities[k]);
            formData.append('amenities', JSON.stringify(amenities));
            Object.keys(images).forEach(k => images[k] && formData.append('images', images[k]));
            const { data } = await axios.post('/api/rooms/', formData, { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) {
                toast.success(data.message);
                setInputs({ roomType: '', pricePerNight: 0, amenities: { 'Free Wifi': false, 'Free Breakfast': false, 'Room Service': false, 'Mountain View': false, 'Pool Access': false } });
                setImages({ 1: null, 2: null, 3: null, 4: null });
            } else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={onSubmitHandler} className='pb-10'>
            <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurately to enhance the user booking experience.' />

            <p className='text-gray-700 font-medium mt-10 mb-2'>Room Images</p>
            <div className='flex flex-wrap gap-4'>
                {Object.keys(images).map(key => (
                    <label key={key} htmlFor={`roomImage${key}`}
                        className={`relative h-24 w-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 ${images[key] ? 'border-[#85A4E1]' : 'border-gray-300 hover:border-[#85A4E1] hover:bg-[#85A4E1]/5'}`}>
                        {images[key]
                            ? <img src={URL.createObjectURL(images[key])} className='w-full h-full object-cover' alt="" />
                            : <img src={assets.uploadArea} className='h-10 opacity-40' alt="upload" />
                        }
                        <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                    </label>
                ))}
            </div>

            <div className='w-full flex max-sm:flex-col sm:gap-6 mt-6'>
                <div className='flex-1 max-w-48'>
                    <p className='text-gray-700 font-medium mb-1'>Room Type</p>
                    <select value={inputs.roomType} onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
                        className='border border-gray-200 rounded-xl p-2.5 w-full text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all'>
                        <option value="">Select Room Type</option>
                        {['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <p className='text-gray-700 font-medium mb-1'>Price <span className='text-xs text-gray-500'>/night</span></p>
                    <input type="number" placeholder='0'
                        className='border border-gray-200 rounded-xl p-2.5 w-28 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all'
                        value={inputs.pricePerNight} onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })} />
                </div>
            </div>

            <p className='text-gray-700 font-medium mt-6 mb-2'>Amenities</p>
            <div className='flex flex-col gap-2'>
                {Object.keys(inputs.amenities).map((amenity, i) => (
                    <label key={i} className='flex items-center gap-2.5 cursor-pointer text-sm text-gray-600 select-none'>
                        <input type="checkbox" className='w-4 h-4 accent-[#85A4E1] rounded' checked={inputs.amenities[amenity]}
                            onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })} />
                        {amenity}
                    </label>
                ))}
            </div>

            <button type='submit' disabled={loading}
                className='mt-10 inline-flex items-center justify-center gap-2 bg-[#5b7fe8] hover:bg-[#4a6edb] text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0'>
                {loading
                    ? <><svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/></svg> Adding…</>
                    : '+ Add Room'
                }
            </button>
        </form>
    );
};

export default AddRoom;
