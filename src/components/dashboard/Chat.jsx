import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai';
import { GrEmoji } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { FaList } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { add_friend, send_message, updateMessage, messageClear } from '../../store/reducers/chatReducer';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000');

const Chat = () => {
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const { sellerId } = useParams();
    const [text, setText] = useState('');
    const [receverMessage, setReceverMessage] = useState('');
    const [activeSeller, setActiveSeller] = useState([]);
    const { userInfo } = useSelector((state) => state.auth);
    const { fd_messages, currentFd, my_friends, successMessage } = useSelector((state) => state.chat);

    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo);
    }, [userInfo]);

    useEffect(() => {
        dispatch(
            add_friend({
                sellerId: sellerId || '',
                userId: userInfo.id,
            })
        );
    }, [sellerId, dispatch, userInfo.id]);

    const send = () => {
        if (text) {
            dispatch(
                send_message({
                    userId: userInfo.id,
                    text,
                    sellerId,
                    name: userInfo.name,
                })
            );
            setText('');
        }
    };

    useEffect(() => {
        socket.on('seller_message', (msg) => {
            setReceverMessage(msg);
        });
        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers);
        });
    }, []);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fd_messages[fd_messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch, fd_messages]);

    useEffect(() => {
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage));
            } else {
                toast.success(`${receverMessage.senderName} envió un mensaje`);
                dispatch(messageClear());
            }
        }
    }, [receverMessage, sellerId, userInfo.id, dispatch]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [fd_messages]);

    const [show, setShow] = useState(false);

    const defaultImage = 'https://res.cloudinary.com/dpj4vsqbo/image/upload/v1733721452/categorys/lyihaamrmu79acd9ei1c.png';

    return (
        <div className="bg-white p-3 rounded-md">
            <div className="w-full flex relative">
                <div className={`w-[230px] md-lg:absolute bg-white transition-all md-lg:h-full ${show ? 'left-0' : '-left-[350px]'}`}>
                    <div className="flex justify-center gap-3 items-center text-slate-600 text-xl h-[50px]">
                        <span>
                            <AiOutlineMessage />
                        </span>
                        <span>Mensajes</span>
                    </div>
                    <div className="w-full flex flex-col text-slate-600 py-4 h-[400px] pr-3">
                        {my_friends.map((f, i) => (
                            <Link
                                to={`/dashboard/chat/${f.fdId}`}
                                key={i}
                                className={`flex gap-2 justify-start items-center pl-2 py-[5px]`}
                            >
                                <div className="w-[30px] h-[30px] rounded-full relative">
                                    {activeSeller.some((c) => c.sellerId === f.fdId) && (
                                        <div className="w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0"></div>
                                    )}
                                    <img
                                        className="w-full h-full rounded-full"
                                        src={f.image || defaultImage}
                                        alt={f.name}
                                    />
                                </div>
                                <span>{f.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="w-[calc(100%-230px)] md-lg:w-full">
                    {currentFd ? (
                        <div className="w-full h-full">
                            <div className="flex justify-between items-center text-slate-600 text-xl h-[50px]">
                                <div className="flex gap-2">
                                    <div className="w-[30px] h-[30px] rounded-full relative">
                                        {activeSeller.some((c) => c.sellerId === currentFd.fdId) && (
                                            <div className="w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0"></div>
                                        )}
                                        <img
                                            className="w-full h-full rounded-full"
                                            src={currentFd.image || defaultImage}
                                            alt={currentFd.name}
                                        />
                                    </div>
                                    <span>{currentFd.name}</span>
                                </div>
                                <div
                                    onClick={() => setShow(!show)}
                                    className="w-[35px] hidden md-lg:flex cursor-pointer h-[35px] rounded-sm justify-center items-center bg-sky-600 text-white"
                                >
                                    <FaList />
                                </div>
                            </div>
                            <div className="h-[400px] w-full bg-slate-100 p-3 rounded-md">
                                <div className="w-full h-full overflow-y-auto flex flex-col gap-3">
                                    {fd_messages.map((m, i) => {
                                        const isSellerMessage = currentFd?.fdId !== m.receverId;
                                        return (
                                            <div
                                                key={i}
                                                ref={scrollRef}
                                                className={`w-full flex gap-2 ${isSellerMessage ? 'justify-start' : 'justify-end'} items-center text-[14px]`}
                                            >
                                                <img
                                                    className="w-[30px] h-[30px] rounded-full"
                                                    src={isSellerMessage ? currentFd.image || defaultImage : defaultImage}
                                                    alt={m.senderName}
                                                />
                                                <div className={`p-2 ${isSellerMessage ? 'bg-purple-500' : 'bg-cyan-500'} text-white rounded-md`}>
                                                    <span>{m.message}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex p-2 justify-between items-center w-full">
                                <div className="w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full">
                                    <label className="cursor-pointer" htmlFor="">
                                       
                                    </label>
                                    <input className="hidden" type="file" />
                                </div>
                                <div className="border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        type="text"
                                        placeholder="escribe un mensaje"
                                        className="w-full rounded-full h-full outline-none p-3"
                                    />
                                    <div className="text-2xl right-2 top-2 absolute cursor-auto">
                                        <span>
                                            <GrEmoji />
                                        </span>
                                    </div>
                                </div>
                                <div className="w-[40px] p-2 justify-center items-center rounded-full">
                                    <div onClick={send} className="text-2xl cursor-pointer">
                                        <IoSend />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setShow(true)}
                            className="w-full flex justify-center items-center text-lg font-bold text-slate-600 h-[400px]"
                        >
                            <span>Selecciona un vendedor...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
