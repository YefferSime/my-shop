import React, { useState } from 'react';
import Headers from '../components/Headers';
import Footer from '../components/Footer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { place_order } from '../store/reducers/orderReducer';

const Shipping = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { state: { products, price, shipping_fee, items } } = useLocation();
    const [res, setRes] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [state, setState] = useState({
        name: '',
        address: '',
        phone: '',
        post: '',
        province: '',
        city: '',
        area: ''
    });

    const provinceFees = {
        Abancay: 10,
        Andahuaylas: 15,
        Antabamba: 10,
        Aymaraes: 10,
        Cotabambas: 10,
        Grau: 5,
        Chincheros: 15
    };

    const inputHandle = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });

        // Actualizar tarifa de envío si la provincia cambia
        if (name === 'province') {
            const fee = provinceFees[value] || 0;
            setShippingFee(fee);
        }
    };

    const save = (e) => {
        e.preventDefault();
        const { name, address, phone, post, province, city, area } = state;
        if (name && address && phone && post && province && city && area) {
            setRes(true);
        }
    };

    const placeOrder = () => {
        dispatch(place_order({
            price,
            products,
            shipping_fee: shippingFee,
            shippingInfo: state,
            userId: userInfo.id,
            navigate,
            items
        }));
    };

    return (
        <div>
            <Headers />
            <section className='bg-[url("http://localhost:3000/images/banner/order.jpg")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-3xl font-bold'>Shop.my</h2>
                            <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                                <Link to='/'>Home</Link>
                                <span className='pt-2'><MdOutlineKeyboardArrowRight /></span>
                                <span>Place Order</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16'>
                    <div className='w-full flex flex-wrap'>
                        <div className='w-[67%] md-lg:w-full'>
                            <div className="flex flex-col gap-3">
                                <div className="bg-white p-6 shadow-sm rounded-md">
                                    {!res && (
                                        <>
                                            <h2 className='text-slate-600 font-bold pb-3'>Informacion de Envio</h2>
                                            <form onSubmit={save}>
                                                <div className='flex md:flex-col md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="name">Nombre</label>
                                                        <input onChange={inputHandle} value={state.name} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='name' placeholder='Nombre' id='name' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="address">Dirección</label>
                                                        <input onChange={inputHandle} value={state.address} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='address' placeholder='Casa Numero / Calle' id='address' />
                                                    </div>
                                                </div>
                                                <div className='flex md:flex-col md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="phone">Teléfono</label>
                                                        <input onChange={inputHandle} value={state.phone} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='phone' placeholder='Número' id='phone' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="post">Correo</label>
                                                        <input onChange={inputHandle} value={state.post} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='post' placeholder='Correo' id='post' />
                                                    </div>
                                                </div>
                                                <div className='flex md:flex-col md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="province">Provincia</label>
                                                        <select onChange={inputHandle} value={state.province} className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='province' id='province'>
                                                            <option value="">Selecciona una provincia</option>
                                                            {Object.keys(provinceFees).map((province) => (
                                                                <option key={province} value={province}>{province}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="city">Comunidad</label>
                                                        <input onChange={inputHandle} value={state.city} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='city' placeholder='Comunidad' id='city' />
                                                    </div>
                                                </div>
                                                <div className='flex md:flex-col md:gap-2 w-full gap-5 text-slate-600'>
                                                    <div className='flex flex-col gap-1 mb-2 w-full'>
                                                        <label htmlFor="area">Distrito</label>
                                                        <input onChange={inputHandle} value={state.area} type="text" className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md' name='area' placeholder='Distrito' id='area' />
                                                    </div>
                                                    <div className='flex flex-col gap-1 mt-3 w-full'>
                                                        <button className='px-3 py-[6px] rounded-sm hover:shadow-indigo-500/20 hover:shadow-lg bg-indigo-500 text-white'>Guardar</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                    {res && (
                                        <div className='flex flex-col gap-1'>
                                            <h2 className='text-slate-600 font-semibold pb-2'>Deliver to {state.name}</h2>
                                            <p>
                                                <span className='bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded'>Home</span>
                                                <span className='text-slate-600 text-sm'>{state.address} {state.province} {state.city} {state.area}</span>
                                                <span onClick={() => setRes(false)} className='text-indigo-500 cursor-pointer'> change</span>
                                            </p>
                                            <p className='text-slate-600 text-sm'>Email to sheikhfarid@gmail.com</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='w-[33%] md-lg:w-full'>
                            <div className="pl-3 md-lg:pl-0">
                                <div className='bg-white font-medium p-5 text-slate-600 flex flex-col gap-3'>
                                    <h2 className='text-xl font-semibold'>Resumen del pedido</h2>
                                    <div className='flex justify-between items-center'>
                                        <span>Total de Productos({price})</span>
                                        <span>S/{price}</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span>Tarifa de entrega</span>
                                        <span>S/{shippingFee}</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span>Total a pagar</span>
                                        <span>S/{price + shippingFee}</span>
                                    </div>
                                    <button onClick={placeOrder} disabled={res ? false : true} className={`px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg ${res ? 'bg-orange-500' : 'bg-orange-300'} text-sm text-white uppercase`}>Place Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Shipping;
