import defaultAvt from '../assets/default_avatar.png'
import axios from '../services/axios.js'
import {Dropdown,Button,Modal,Form} from 'react-bootstrap'
import {useState,useEffect} from 'react'
import PropTypes from 'prop-types'


const Projects = (()=>{
    const [error,setError] = useState(null)
    const [projects,setProjects] = useState([])
    const [selectedProject,setSelectedProject] = useState(null)
    const [tasksProject,setTasksProject] = useState([])
    const formatDateDisplay = (date) => {
        const localDate = new Date(date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const hours = String(localDate.getHours()).padStart(2, '0');
        const minutes = String(localDate.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes} ${month}-${day}-${year}`;
      };
    // Modal setting
    const [showModal,setShowModal] = useState(false)
    const [memberEmail,setMemberEmail] = useState(null)


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Modal update setting
    const [showEditTaskModal, setShowEditTaskModal] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    
    // Modal add task setting
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const handleShowAddTaskModal = () => setShowAddTaskModal(true);
    const handleCloseAddTaskModal = () => setShowAddTaskModal(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormAddTaskData((prev) => ({ ...prev, [name]: value }));
      };
    const [formAddTaskData, setFormAddTaskData] = useState({
        name:  '' ,
        startDate: '' ,
        endDate: '' ,
        description: '' ,
        projectId: '',
      });
    const handleSaveNewTask = async () => {
        // Lấy dữ liệu từ các trường trong form
        if(formAddTaskData == null) return;
        formAddTaskData.projectId = selectedProject ? selectedProject.id : '';

        const _startDate = new Date(formAddTaskData.startDate);
        const _endDate = new Date(formAddTaskData.endDate);

        if(_startDate > _endDate){
            console.log(_startDate.getTime() + " "+_endDate.getTime())
            setError('Start date must be earlier than end date.');
            return; // Ngừng thực hiện nếu điều kiện không đúng
        }
        try {
            const response = await axios.post(`project/task`, formAddTaskData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response && response.data)
            {
                console.log('Task added:', response.data);
            }
            fetchTasksForProject(selectedProject); // Cập nhật danh sách task sau khi thêm
            handleCloseAddTaskModal();
        } catch (e) {
            setError(e.message);
            console.error('There was a problem with the add task operation:', e);
        }
        setFormAddTaskData({
            name:  '' ,
            startDate: '' ,
            endDate: '' ,
            description: '' ,
            projectId: '',
          });
    };
    

    const handleShowEditTaskModal = (task) => {
        setCurrentTask(task)
        setShowEditTaskModal(true)
    }

    const handleCloseEditTaskModal = () => setShowEditTaskModal(false)
    const handleSaveTask = async () => {
        // Add your save task logic here
        console.log('Task saved:', currentTask)
        handleCloseEditTaskModal()
    }
    const handleMarkTaskAsDone = async () => {
        if(currentTask == null) return
    
        try{
            const response = await axios.put(`project/task/${currentTask.id}`,{
                headers :{
                    'Content-Type':"application/json"
                }
            })
            if(response && response.data)
            {
                console.log(response.data)
                
            }
        }catch(e)
        {
            setError(e.message)
            console.error('There was a problem with the done task operation:', e);
        }
        console.log('Task marked as done:', currentTask)

        handleCloseEditTaskModal()
    }
    //
    const handleAddMember = async () => {
        try {
            const response = await axios.post(`projects/${selectedProject.id}/members?email=${memberEmail}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Member added:', response.data);
            handleCloseModal();
        } catch (e) {
            setError(e.message);
            console.error('There was a problem with the add member operation:', e);
        }
    };

    const handleClickProject = (project)=>{
        setSelectedProject(project);
        fetchTasksForProject(project);
        console.log(project)
    }
    const fetchTasksForProject = async(project)=>{
        if(project== null) return;
        try{
            const response = await axios.get(`project/task/${project.id}`,{
                headers:{
                    'Content-Type' : 'application/json'
                }
            });
            if(response!=null && response.data!=null)
            {
                console.log(response.data);
                setTasksProject(response.data);
            }
            
        }catch(e){
            setError(e.message)
            console.log(e.message)
        }
    }

    useEffect(()=>{
        const fetchProjects = async() =>{

            try{
                const response = await axios.get('projects/2',{
                    headers:{
                        'Content-Type': 'application/json'                 
                    }
                });
                console.log(response.data)
                setProjects(response.data)
                if(response.data!=null && response.data[0]!=null)
                {
                    setSelectedProject(response.data[0])
                    fetchTasksForProject(response.data[0])
                }
    
            }catch(e){
                setError(e.message)
                console.error('There was a problem with the fetch operation:', e);
            }
        }
        fetchProjects();
        
    },[])

    return (

        
        <div className=" d-flex flex-column container p-0">
            
            <div className='d-flex gap-3 p-2'>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {selectedProject ? selectedProject.name : ''}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            projects!=null && projects.length >0 
                            && projects.filter(project => project.id != selectedProject?.id)
                            && projects.map((project,index)=>(
                                <Dropdown.Item key={index} onClick ={()=>{handleClickProject(project)}}>{project.name}</Dropdown.Item>
                            ))
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <Button onClick={handleShowAddTaskModal}  variant="primary">Add new task</Button>


            </div>
            

            <div className=' d-flex flex-column '>
                <div className=' d-flex gap-2 justify-content-between'>
                    <div className=' d-flex flex-column align-items-center justify-content-center'>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>9</p>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>Sunday</p>
                    </div>
                    <div className=' d-flex flex-column align-items-center justify-content-center'>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>10</p>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>Monday</p>
                    </div>
                    <div className=' d-flex flex-column align-items-center justify-content-center'>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>11</p>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>Tuesday</p>
                    </div>
                    <div className=' d-flex flex-column align-items-center justify-content-center'>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>12</p>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>Wednesday</p>
                    </div>
                    <div className=' d-flex flex-column align-items-center justify-content-center'>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>13</p>
                        <p className=' m-0 fw-medium' style={{ fontSize : '12px'}}>Thursday</p>
                    </div>
                </div>
            </div>

            <div className=' d-flex  align-items-center align-items-stretch  '>
                <div className='d-flex flex-column border border-1 p-3 gap-5' style={{boxSizing: 'border-box'}}>
                    <Button onClick={handleShowModal}  variant="outline-primary">Add new member</Button>{' '}

                    {
                        selectedProject && selectedProject.users && selectedProject.users.length >0 
                        && selectedProject.users.map((user,index)=>(
                            <div key={index}   className=' d-flex flex-column justify-content-center align-items-center'>
                            <img className=' border border-1 rounded-5 p-1' src={defaultAvt} alt="" style={{maxHeight:'30px',maxWidth:'30px'}} />
                            <p className=' fw-medium' style={{ fontSize : '10px'}}>{user.name}</p>
                            </div>
                        ))
                    }
                 
                    

                </div>

                <div className=' d-flex flex-column align-items-start justify-content-start gap-5 px-3 py-3'>
                {
                    tasksProject!=null && tasksProject.length > 0 && tasksProject.map((task,index)=>(
                        <div onClick={()=>handleShowEditTaskModal(task)} key={index} className='m-0 d-flex gap-5'>
                        
                            <div className={`col d-flex justify-content-center align-items-center gap-3 p-2 rounded-5 ${
                                                task.status === 'Done' ? 'bg-success' : 'bg-danger'
                                            }`}>

                                <div className='d-flex flex-column rounded-5 px-3 py-1 bg-white'>
                                    <p className='m-0 fw-medium' style={{fontSize : '10px'}}>{task.name}</p>
                                    <p className='m-0 fw-medium'  style={{fontSize : '10px'}}>from {formatDateDisplay(task.startDate)} to {formatDateDisplay(task.endDate)}</p>
                                </div>

                                <div className='d-flex rounded-5 p-1 bg-white gap-1'>
                                    <img className=' border border-1 rounded-5 p-1' src={defaultAvt} alt="" style={{maxHeight:'25px',maxWidth:'25px'}} />
                                    <img className=' border border-1 rounded-5 p-1' src={defaultAvt} alt="" style={{maxHeight:'25px',maxWidth:'25px'}} />

                                </div>

                            </div>
                            
                         </div>           
                    ))
                }
                    
                    
                  

                </div>
            </div>
            
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddMember}>
                        Add Member
                    </Button>
                </Modal.Footer>
            </Modal>
            
            
            <Modal show={showEditTaskModal} onHide={handleCloseEditTaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTaskName">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentTask ? currentTask.name : ''}
                                onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>From</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={currentTask ? currentTask.startDate : ''}
                                onChange={(e) => setCurrentTask({ ...currentTask, startDate: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>To</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={currentTask ? currentTask.endDate : ''}
                                onChange={(e) => setCurrentTask({ ...currentTask, endDate: e.target.value })}
                            />
                        </Form.Group>
                        {/* Add more form fields if needed */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditTaskModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveTask}>
                        Save
                    </Button>
                    <Button variant="success" onClick={handleMarkTaskAsDone}>
                        Done Task
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddTaskModal} onHide={handleCloseAddTaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group controlId="formTaskName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Enter task name"
                        name="name"
                        value={formAddTaskData.name}
                        onChange={handleChange}
                        />
                    </Form.Group>

                    
                    <Form.Group controlId="formTaskStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                        type="datetime-local"
                        name="startDate"
                        value={formAddTaskData.startDate}
                        onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formTaskEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                        type="datetime-local"
                        name="endDate"
                        value={formAddTaskData.endDate}
                        onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formTaskDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formAddTaskData.description}
                        onChange={handleChange}
                        />
                    </Form.Group>

                    {error && <p className="text-danger">{error}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddTaskModal}>
                    Close
                    </Button>
                    <Button variant="success" onClick={handleSaveNewTask} >
                    Save
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )

})
Projects.propTypes = {
    task : PropTypes.shape(
        {
            id: PropTypes.number,

        }

    )
}
export default Projects;