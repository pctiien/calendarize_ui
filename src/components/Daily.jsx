import {useState,useEffect} from 'react';
import { format } from "date-fns";

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

                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Monday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        {
                        dailyTasks[0].length > 0 ? (

                            dailyTasks[0].map(task => {

                                const startDate = new Date(task.startDate);
                                const formatStartDate = format(startDate,'HH:mm');

                                const endDate = new Date(task.endDate);
                                const formatEndDate = format(endDate,'HH:mm');

                                return (
                                    <div key={task.id} className="d-flex flex-column flex-fill border border-2 col-2 rounded-3 bg-danger" style={{height:'50px'}}>
                                        <div  className="d-flex flex-column align-items-start mx-3">
                                            <p className="m-0 h-auto w-auto" style={{ fontSize: '15px' }}>{task.name}</p>
                                            <p className="fw-light m-0" style={{ fontSize: '12px' }}>{formatStartDate} - {formatEndDate}</p>
                                        </div>
                                    </div>

                                )
                            }
                               
                            ))
                             : (
                                <p>No tasks available</p>
                            )}
                            
                        <div className="d-flex flex-column flex-fill border border-2 col-2 rounded-3 bg-dark-subtle" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                                <p className=" fw-light m-0 h-auto w-auto" style={{fontSize:'12px'}}>7:00 - 7:30</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 col-2 rounded-3 bg-success " style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                            <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                            <p className=" fw-light m-0" style={{fontSize:'12px'}}>8:00 - 10:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 col-2 rounded-3 bg-danger-subtle" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                            <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                            <p className=" fw-light m-0" style={{fontSize:'12px'}}>10:00 - 12:00</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Tuesday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                            <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                            <p className=" fw-light m-0" style={{fontSize:'12px'}}>5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                            <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                            <p className=" fw-light m-0" style={{fontSize:'12px'}}>5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                            <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                            <p className=" fw-light m-0" style={{fontSize:'12px'}}>5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                            <p className=" m-0 h-auto w-auto" style={{fontSize:'15px'}}>Learning</p>
                            <p className=" fw-light m-0" style={{fontSize:'12px'}}>5:00 - 6:00</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Wednesday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Thursday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Friday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Saturday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col border border-1 " style={{maxWidth: '25%'}}>
                    Sunday
                    </div>
                    <div className="col border border-1 d-flex gap-5 align-items-center py-2">
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-fill border border-2 w-25 rounded-3" style={{height:'50px'}}>
                            <div className="d-flex flex-column align-items-start mx-3">
                                <p className=" m-0">Learning</p>
                                <p className=" m-0">5:00 - 6:00</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
})
export default Daily;