import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

const HotelReg = () => {
    const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
    const [name, setName]       = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity]       = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/hotels/', { name, contact, address, city }, { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) { toast.success(data.message); setIsOwner(true); setShowHotelReg(false); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
        finally { setLoading(false); }
    };

    const inputCls = 'border border-gray-200 rounded-xl w-full px-3 py-2.5 mt-1 text-sm outline-none focus:border-[#85A4E1] focus:ring-2 focus:ring-[#85A4E1]/20 transition-all font-light';

    return (
        <div onClick={() => setShowHotelReg(false)}
            className='fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
            <form onSubmit={onSubmitHandler} onClick={e => e.stopPropagation()}
                className='flex bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-md:mx-4 shadow-2xl'>
                <img src={assets.regImage} alt="register" className='w-1/2 rounded-xl hidden md:block object-cover' />

                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <button type='button' onClick={() => setShowHotelReg(false)}
                        className='absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer'>
                        <img src={assets.closeIcon} alt="close" className='h-4 w-4' />
                    </button>

                    <p className='text-2xl font-bold text-gray-800 mt-6'>Register Your Hotel</p>
                    <p className='text-sm text-gray-500 mt-1 text-center'>Fill in your property details to get started</p>

                    {[
                        { id: 'name',    label: 'Hotel Name', value: name,    set: setName,    type: 'text' },
                        { id: 'contact', label: 'Phone',      value: contact, set: setContact, type: 'text' },
                        { id: 'address', label: 'Address',    value: address, set: setAddress, type: 'text' },
                    ].map(f => (
                        <div key={f.id} className='w-full mt-4'>
                            <label htmlFor={f.id} className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>{f.label}</label>
                            <input id={f.id} type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder='Type here' className={inputCls} required />
                        </div>
                    ))}

                    <div className='w-full mt-4'>
                        <label htmlFor="city" className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>City</label>
                        <select id="city" value={city} onChange={e => setCity(e.target.value)} className={inputCls} required>
                            <option value="">Select City</option>
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <button type='submit' disabled={loading}
                        className='w-full mt-7 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5b7fe8] to-[#85A4E1] hover:from-[#4a6edb] hover:to-[#6b8fd4] text-white text-sm font-bold py-3 rounded-xl shadow-md shadow-[#85A4E1]/30 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0'>
                        {loading
                            ? <><svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'/></svg> Registering…</>
                            : 'Register Hotel →'
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelReg;
