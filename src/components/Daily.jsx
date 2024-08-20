import {useState,useEffect} from 'react';
import { format } from "date-fns";
import LifeTaskModal from './LifeTaskModal'; // Đảm bảo đường dẫn đúng
import greentick from "../assets/green-tick.png"
import stopwatch from "../assets/stop-watch.png"
import {Button} from 'react-bootstrap'
import ConfirmModal from './ConfirmModal';
import {lifeTasksApiInstance} from '../services/axios.js'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Overdue from '../assets/overdue.png'
const Daily = (()=>{
    const [dailyTasks, setDailyTasks] = useState([[]]);
    const [error, setError] = useState(null); // Thêm trạng thái lỗi
    const [show,setShow] = useState(false);
    const [selectedTask,setSelectedTask] = useState(null);
    const [showConfirmModal,setShowConfirmModal] = useState(false);
    const [client, setClient] = useState(null);

    const handleCloseConfirmModal = ()=>{
        setSelectedTask(null);
        setShowConfirmModal(false);
    }
    const handleShowConfirmModal = (task)=>{
        setSelectedTask(task);
        setShowConfirmModal(true);
    }
    const handleConfirm = async () => {
        // Done task
        if(!selectedTask){
            return;
        }
        try {
          console.log('Task confirmed:', selectedTask);
          const response = await lifeTasksApiInstance.put(`tasks/${selectedTask.id}`,
            {
                headers: {
              'Content-Type': 'application/json',
                }
            }
          );
          console.log(response)
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
    const handleShow  = (task) => {
        setSelectedTask(task);
        setShow(true);
    };
    useEffect(() => {
        const url = 'tasks?userId=1&from=2024-05-01&to=2024-08-31';
        const fetchTasks = async () => {

            try {
                const response = await lifeTasksApiInstance.get(url,{
                    headers: {
                        'Content-Type': 'application/json',
                      } 
                });

                
                setDailyTasks(response.data || [[]]); // Sử dụng response.data
                console.log(response.data);

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError(error.message); // Cập nhật trạng thái lỗi
            }
        };

        fetchTasks();
    }, [selectedTask]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/notifications/2', (message) => {
                    console.log('Notification received:', message.body);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected');
            },
        });

        stompClient.activate(); 
        setClient(stompClient);

        // Dọn dẹp khi component unmount
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    
    return (

        <div>
            <div className="container " style={{backgroundColor :'#F2F3F5'}}>

                <div className='d-flex gap-5 p-3 '>
                    <h1 className=' fw-bold fs-2'>Daily Tasks</h1>
                    <Button onClick={()=>handleShow({})}  variant="primary">Add task</Button>{' '}

                </div>
                {dailyTasks.length > 0 && dailyTasks.map((tasks, index) => (
                    <div key={index} className="row ">
                
                    {tasks.length > 0 && (
                        <>
                        <div className="col border border-1 p-2 d-flex justify-content-center align-items-center" style={{ maxWidth: '15%' }}>
                            {format(new Date(tasks[0].startDate), 'EEEE')} 
                            <br/>
                            {new Date(tasks[0].startDate).toLocaleDateString()}
                        </div>
                        <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                            {tasks.map(task => {
                                
                            const startDate = new Date(task.startDate);
                            const formatStartDate = format(startDate, 'HH:mm');

                            const endDate = new Date(task.endDate);
                            const formatEndDate = format(endDate, 'HH:mm');
                            
                            let statusIcon = stopwatch 
                            if(task.status == 'COMPLETED')
                            {
                                statusIcon = greentick
                            }
                            if(task.status == 'OVERDUE')
                            {
                                statusIcon = Overdue
                            }

                            return (
                                <div onClick={()=>handleShow(task)} key={task.id} className=' bg-white shadow-sm d-flex flex-column align-items-start justify-content-center rounded-3 w-auto h-auto  '>
                                    <div className='d-flex justify-content-center py-2 px-2  gap-2'>
                                        <div className="d-flex flex-column justify-content-center align-content-center  ">
                                            <p className=" m-0 h-auto w-auto" style={{ fontSize: '15px' }}>{task.name}</p>
                                            <p className="fw-light m-0" style={{ fontSize: '12px' }}>{formatStartDate} - {formatEndDate}</p>
                                        </div>
                                        <div>
                                            <img onClick={(e)=>{
                                                e.stopPropagation();
                                                handleShowConfirmModal(task);
                                            }} className='m-1' src={statusIcon} alt="" style={{width:'25px'}} />
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
            <ConfirmModal show={showConfirmModal}
                            handleClose={handleCloseConfirmModal}
                            handleConfirm={handleConfirm}> 
            </ConfirmModal>
            <LifeTaskModal show={show} task={selectedTask} handleClose={handleClose} ></LifeTaskModal>
        </div>

    )
})
export default Daily;