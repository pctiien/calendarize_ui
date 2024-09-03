import { useState, useEffect } from 'react';
import { format } from "date-fns";
import LifeTaskModal from './LifeTaskModal.jsx';
import greentick from "../../assets/green-tick.png";
import stopwatch from "../../assets/stop-watch.png";
import rightArrow from "../../assets/right-arrow.png";
import leftArrow from "../../assets/left-arrow.png";
import ConfirmModal from '../ConfirmModal.jsx';
import { lifeTasksApiInstance } from '../../services/axios.js';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Overdue from '../../assets/overdue.png';

const Daily = () => {
    const [dailyTasks, setDailyTasks] = useState([[]]);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [client, setClient] = useState(null);

    const handleCloseConfirmModal = () => {
        setSelectedTask(null);
        setShowConfirmModal(false);
    };

    const handleShowConfirmModal = (task) => {
        setSelectedTask(task);
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        if (!selectedTask) {
            return;
        }
        try {
            console.log('Task confirmed:', selectedTask);
            const response = await lifeTasksApiInstance.put(`tasks/${selectedTask.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);
        } catch (error) {
            console.error('Error done task:', error);
        } finally {
            handleCloseConfirmModal();
        }
    };

    const handleClose = () => {
        setSelectedTask(null);
        setShow(false);
    };

    const handleShow = (task) => {
        setSelectedTask(task);
        setShow(true);
    };

    useEffect(() => {
        const url = 'tasks?userId=1&from=2024-05-01&to=2024-08-31';
        const fetchTasks = async () => {
            try {
                const response = await lifeTasksApiInstance.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setDailyTasks(response.data || [[]]);
                console.log(response.data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError(error.message);
            }
        };

        fetchTasks();
    }, [selectedTask]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8083/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/user/1/queue/lifetasks', (message) => {
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
                <div className="flex gap-5 items-center mb-5 font-semibold">
                    <div className='flex gap-1 '>
                        <button className="bg-violet-200 text-white w-6 h-6 rounded-l p-1 flex items-center justify-center">
                            <img src={leftArrow} alt="Previous" className="w-3 h-3 " />
                        </button>
                        <button className="bg-violet-200 h-6 px-3 text-violet-500 flex items-center">
                            <h6 className=" text-sm">Mon 28 Sept</h6>
                        </button>
                        <button className="bg-violet-200 w-6 h-6  text-violet-600 rounded-r p-1 flex items-center justify-center">
                            <img src={rightArrow} alt="Next" className="w-2 h-2" />
                        </button>
                    </div>
                    <button className="bg-violet-200 h-6 text-violet-600 rounded-lg px-3 ">
                        <h6 className="text-sm">Add task</h6>
                    </button>
                </div>
                {dailyTasks.length > 0 && dailyTasks.map((tasks, index) => (
                    <div key={index} className="flex mb-4">
                        {tasks.length > 0 && (
                            <>
                                <div className="flex-none border border-gray-300 p-2 text-center w-1/6">
                                    {format(new Date(tasks[0].startDate), 'EEEE')}
                                    <br />
                                    {new Date(tasks[0].startDate).toLocaleDateString()}
                                </div>
                                <div className="flex-grow border border-gray-300 p-2 flex gap-5">
                                    {tasks.map(task => {
                                        const startDate = new Date(task.startDate);
                                        const formatStartDate = format(startDate, 'HH:mm');
                                        const endDate = new Date(task.endDate);
                                        const formatEndDate = format(endDate, 'HH:mm');
                                        let statusIcon = stopwatch;
                                        if (task.status === 'COMPLETED') {
                                            statusIcon = greentick;
                                        }
                                        if (task.status === 'OVERDUE') {
                                            statusIcon = Overdue;
                                        }

                                        return (
                                            <div
                                                onClick={() => handleShow(task)}
                                                key={task.id}
                                                className="bg-white shadow-sm rounded-lg p-3 flex items-center gap-2 cursor-pointer"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm">{task.name}</p>
                                                    <p className="text-xs text-gray-500">{formatStartDate} - {formatEndDate}</p>
                                                </div>
                                                <img
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowConfirmModal(task);
                                                    }}
                                                    className="w-6 h-6"
                                                    src={statusIcon}
                                                    alt=""
                                                />
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
