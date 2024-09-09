import { useState, useEffect } from 'react';
import { format } from "date-fns";
import LifeTaskModal from './LifeTaskModal.jsx';
import COMPLETED from "../../assets/green-tick.png";
import PENDING from "../../assets/stop-watch.png";
import rightArrow from "../../assets/right-arrow.png";
import leftArrow from "../../assets/left-arrow.png";
import ConfirmModal from './ConfirmModal.jsx';
import { lifeTasksApiInstance } from '../../services/axios.js';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import OVERDUE from '../../assets/overdue.png';
import {useAuth} from '../../components/context/AuthContext.jsx'
const Daily = () => {
    const Auth = useAuth()
    const [showForm, setShowForm] = useState(false);
    const [dailyTasks, setDailyTasks] = useState([[]]);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [getClick,setGetClick] = useState(false);
    const [from, setFrom] = useState(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
      });
    
    const [to, setTo] = useState(() => {
        const today = new Date();
        return today;
    });

    const handleNextClick = ()=>{
        const nextDay = new Date(to)
        nextDay.setDate(nextDay.getDate()+1)
        setTo(nextDay)
        setGetClick(!getClick)
    }
    const handleBackClick = () =>{
        const backDate = new Date(from)
        backDate.setDate(backDate.getDate()-1)
        setFrom(backDate)
        setGetClick(!getClick)
    }

    const handleFromToButtonClick = () => {
        setShowForm(!showForm);
      };
    
    const handleFromChange = (e) => {
        setFrom(e.target.value);
    };
    
    const handleToChange = (e) => {
        setTo(e.target.value);
    };

    
    
    
    const handleCloseConfirmModal = () => {
        setSelectedTask(null);
        setShowConfirmModal(false);
    };

    const handleShowConfirmModal = (task) => {
        setSelectedTask(task);
        setShowConfirmModal(true);
    };
    const handleClose = () => {
        setSelectedTask(null);
        setShow(false);
        console.log(selectedTask)
    };

    const handleShow = (task) => {
        setSelectedTask(task);
        setShow(true);
    };
     
    const handleGetClick = ()=>{
        setGetClick(!getClick)
        setShowForm(false);
    }
    const formatDate = (date) => {
        // Đảm bảo date là đối tượng Date
        const validDate = new Date(date);
        if (isNaN(validDate.getTime())) {
          return ''; // Trả về chuỗi trống nếu date không hợp lệ
        }
        const year = validDate.getFullYear();
        const month = String(validDate.getMonth() + 1).padStart(2, '0');
        const day = String(validDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const formatDateStr = (date) => {
        const validDate = new Date(date);
        if (isNaN(validDate.getTime())) {
          return ''; // Trả về chuỗi trống nếu date không hợp lệ
        }
        const year = validDate.getFullYear();
        const month = String(validDate.getMonth() + 1).padStart(2, '0');
        const day = String(validDate.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const handleConfirm = async () => {
        if (!selectedTask) {
            return;
        }
        try {
            const response = await lifeTasksApiInstance.put(`/tasks/${selectedTask.id}`,{}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getUser().token.accessToken}`
                  }
            });
            if(response && response.data)
            {
                console.log('success',response.data);
            }
        } catch (error) {
            console.error('Error done task:', error);
        } finally {
            handleCloseConfirmModal();
        }
    };

    
    useEffect(() => {
        const url = `/tasks?userId=${parseInt(Auth.getUser()?.data.sub)}&from=${formatDate(from)}&to=${formatDate(to)}`;
        const fetchTasks = async () => {
            try {
                const response = await lifeTasksApiInstance.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Auth.getUser()?.token.accessToken}`
              
                      }
                });
                setDailyTasks(response.data || [[]]);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError(error.message);
            }
        };

        fetchTasks();
    }, [selectedTask,getClick]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8083/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe(`/user/${Auth.getUser()?.data.sub}/queue/lifetasks`, (message) => {
                    console.log('Notification received:', message.body);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected');
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        stompClient.activate();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    return (
        <div className="p-4">
            <div className="mx-20">
                <div className="text-2xl font-bold mb-5">
                    Daily Tasks
                </div>
                <div className="flex gap-5 mb-5 font-semibold align-items-start">
                    <div className='flex gap-1  '>
                        <button onClick={handleBackClick} className="bg-violet-100 text-white w-6 h-6 rounded-l p-1 flex items-center justify-center">
                            <img src={leftArrow} alt="Previous" className="w-2 h-2 " />
                        </button>
                        <button onClick={handleFromToButtonClick} className="bg-violet-100 h-6 px-3 text-violet-500 flex items-center">
                            <h6 className="text-sm">
                            {
                                `${formatDateStr(from)} - ${formatDateStr(to)}` 
                            }
                            </h6>
                        </button>
                        

                        <button onClick={handleNextClick} className="bg-violet-100 w-6 h-6  text-violet-600 rounded-r p-1 flex items-center justify-center">
                            <img src={rightArrow} alt="Next" className="w-2 h-2" />
                        </button>
                        {showForm && (
                            <div className=" p-1 border border-1 border-violet-100 rounded bg-white shadow-md">
                                <label className="block font-light text-sm">
                                    From:
                                    <input
                                    type="date"
                                    value={from}
                                    onChange={handleFromChange}
                                    className="block w-full border rounded"
                                    />
                                </label>
                                <label className="block font-light text-sm">
                                    To:
                                    <input
                                    type="date"
                                    value={to}
                                    onChange={handleToChange}
                                    className="block w-full border rounded"
                                    />
                                </label>
                                <button onClick={handleGetClick} className='bg-violet-100 text-violet-600 rounded-md text-sm p-1 mt-1 text-center ' style={{width:'100%'}}>
                                    Get
                                </button>
                            </div>
                        )}
                    </div>
                    <button onClick={(e) => {
                                e.stopPropagation();
                                handleShow(null)}} 
                            className="bg-violet-100 h-6  text-violet-600 rounded-lg px-3 ">
                        <h6 className="text-sm">Add task</h6>
                    </button>
                </div>
                {dailyTasks.length > 0 && dailyTasks.map((tasks, index) => (
                    <div key={index} className="flex h-28">
                        {tasks.length > 0 && (
                            <>
                                <div className="flex flex-col items-center justify-center border-t border-b border-gray-200 p-2 w-1/6">
                                    <p className='text-violet-600 font-medium'>{format(new Date(tasks[0].startDate), 'EEEE')}</p>
                                    <p className=' font-thin text-sm'>{new Date(tasks[0].startDate).toLocaleDateString()}</p>
                                </div>

                                <div className="flex-grow border border-gray-200 bg-gray-50 flex "
                                >
                                    {tasks.map(task => {
                                        const startDate = new Date(task.startDate);
                                        const formatStartDate = format(startDate, 'HH:mm');
                                        const endDate = new Date(task.endDate);
                                        const formatEndDate = format(endDate, 'HH:mm');
                                        const map = new Map();
                                        map.set('COMPLETED',COMPLETED)
                                        map.set('OVERDUE',OVERDUE)
                                        map.set('PENDING',PENDING)
                                       
                                        return (
                                            <div
                                                onClick={() => handleShow(task)}
                                                key={task.id}
                                                className=" border border-gray-100 flex items-start px-2 cursor-pointer"
                                                style={{height: '100%'}}
                                            >
                                                <div
                                                    className='bg-white rounded-lg px-5 py-2 mt-2 shadow-md'
                                                >
                                                    <div className=" flex gap-5">
                                                        <div>
                                                            <p className="text-sm font-medium">{task.name}</p>
                                                            <p className="text-xs text-gray-500">{formatStartDate} - {formatEndDate}</p>
                                                        </div>
                                                        <img
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowConfirmModal(task);
                                                            }}
                                                            className="w-4 h-4"
                                                            src={map.get(task.status)}
                                                            alt=""
                                                    />
                                                    </div>
                                    
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <ConfirmModal show={showConfirmModal} handleClose={handleCloseConfirmModal} handleConfirm={handleConfirm} />
            <LifeTaskModal show={show} task={selectedTask} handleClose={handleClose} />
        </div>
    );
};

export default Daily;
