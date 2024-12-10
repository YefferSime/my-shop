import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get_order } from '../../store/reducers/orderReducer';

const Order = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { myOrder } = useSelector(state => state.order);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(get_order(orderId));
    }, [orderId, dispatch]);

    // Mapeo de estados en inglés a español
    const statusMap = {
        pending: 'Pendiente',
        placed: 'Listo para envío',
        delivered: 'Entregado',
        cancelled: 'Entregado',
        warehouse: 'En almacén',
        processing: 'En proceso',
        paid: 'Pagado',
        unpaid: 'No pagado',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Título de la orden */}
            <h2 className="text-lg font-semibold text-slate-600">
                Pedido #{myOrder._id}
                <span className="text-sm font-normal text-gray-500 ml-2">{myOrder.date}</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Información de envío */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-md text-slate-600 mb-2">Información de Envío</h3>
                    <p className="text-sm text-slate-600">
                        <span className="font-medium">Nombre:</span> {myOrder.shippingInfo?.name}
                    </p>
                    <p className="text-sm text-slate-600">
                        <span className="font-medium">Dirección:</span> {myOrder.shippingInfo?.address}, {myOrder.shippingInfo?.province}, {myOrder.shippingInfo?.city}, {myOrder.shippingInfo?.area}
                    </p>
                    <p className="text-sm text-slate-600">
                        <span className="font-medium">Correo:</span> {userInfo.email}
                    </p>
                </div>

                {/* Información de pago y estado */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-md text-slate-600 mb-4">Estado del Pedido</h3>
                    <p className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Precio Total:</span> ${myOrder.price} (incluye tarifa de envío)
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                        <span className="font-medium">Estado del Pago:</span>{' '}
                        <span
                            className={`px-2 py-1 rounded ${myOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {statusMap[myOrder.payment_status] || 'Estado desconocido'}
                        </span>
                    </p>
                    <p className="text-sm text-slate-600">
                        <span className="font-medium">Estado del Pedido:</span>{' '}
                        <span
                            className={`px-2 py-1 rounded ${myOrder.delivery_status === 'cancelled' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {statusMap[myOrder.delivery_status] || 'Estado desconocido'}
                        </span>
                    </p>
                </div>

            </div>

            {/* Productos */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-600 mb-4">Productos</h3>
                <div className="space-y-4">
                    {myOrder.products?.map((product, index) => (
                        <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-md">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                                <h4 className="text-md font-medium text-slate-600">{product.name}</h4>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Presentación:</span> {product.brand}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Cantidad:</span> {product.quantity}
                                </p>
                                <p className="text-sm text-orange-500">
                                    <span className="font-medium">Precio:</span> $
                                    {product.price - Math.floor((product.price * product.discount) / 100)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Order;
