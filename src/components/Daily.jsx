import {useState,useEffect} from 'react';
import { format } from "date-fns";
import greentick from "../assets/green-tick.png"
import stopwatch from "../assets/stop-watch.png"

const Daily = (()=>{
    const [dailyTasks, setDailyTasks] = useState([[]]);
    const [error, setError] = useState(null); // Thêm trạng thái lỗi

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
    }, []);
    return (

        <div>
            <div className="container ">
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
                                <div key={task.id} className='shadow-sm d-flex flex-column align-items-start justify-content-center border rounded-2 w-auto h-auto  '>
                                    <div className='d-flex '>
                                        <div className="d-flex flex-column mx-4 my-3   ">
                                            <p className=" m-0 h-auto w-auto" style={{ fontSize: '15px' }}>{task.name}</p>
                                            <p className="fw-light m-0" style={{ fontSize: '12px' }}>{formatStartDate} - {formatEndDate}</p>
                                        </div>
                                        <div>
                                            <img className='m-1' src={statusIcon} alt="" style={{width:'20px'}} />
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
        </div>

    )
})
export default Daily;