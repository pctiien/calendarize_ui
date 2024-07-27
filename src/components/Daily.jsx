import {useState,useEffect} from 'react';
import { format } from "date-fns";
import LifeTaskModal from './LifeTaskModal'; // Đảm bảo đường dẫn đúng
import greentick from "../assets/green-tick.png"
import stopwatch from "../assets/stop-watch.png"
const Daily = (()=>{
    const [dailyTasks, setDailyTasks] = useState([[]]);
    const [error, setError] = useState(null); // Thêm trạng thái lỗi
    const [show,setShow] = useState(false);
    const [selectedTask,setSelectedTask] = useState(null);
    const handleClose = () => {
        setSelectedTask(null);
        setShow(false);
    };
    const handleShow  = (task) => {
        setSelectedTask(task);
        setShow(true);
    };
    useEffect(() => {
        const url = "http://localhost:8080/api/life/task?userId=2&start=2024-07-01&end=2024-08-01";
        const fetchTasks = async (url) => {

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        accept: "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                setDailyTasks(data || [[]]); // Kiểm tra xem `results` có tồn tại không
                console.log(data)

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError(error.message); // Cập nhật trạng thái lỗi
            }
        };

        fetchTasks(url);
    }, [selectedTask]);
    return (

        <div>
            <div className="container " style={{backgroundColor :'#F2F3F5'}}>
            
                <div>
                    <h1 className=' fw-bold fs-2'>Daily Tasks</h1>
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
                            if(task.status == 'Done')
                            {
                                statusIcon = greentick
                            }

                            return (
                                <div onClick={()=>handleShow(task)} key={task.id} className=' bg-white shadow-sm d-flex flex-column align-items-start justify-content-center rounded-3 w-auto h-auto  '>
                                    <div className='d-flex justify-content-center py-2 px-2  gap-2'>
                                        <div className="d-flex flex-column justify-content-center align-content-center  ">
                                            <p className=" m-0 h-auto w-auto" style={{ fontSize: '15px' }}>{task.name}</p>
                                            <p className="fw-light m-0" style={{ fontSize: '12px' }}>{formatStartDate} - {formatEndDate}</p>
                                        </div>
                                        <div>
                                            <img className='m-1' src={statusIcon} alt="" style={{width:'25px'}} />
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
            <LifeTaskModal show={show} task={selectedTask} handleClose={handleClose} ></LifeTaskModal>
        </div>

    )
})
export default Daily;