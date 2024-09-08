import defaultAvt from '../../assets/default_avatar.png'
import { projectApiInstance } from '../../services/axios.js'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import rightArrow from "../../assets/right-arrow.png";
import leftArrow from "../../assets/left-arrow.png";
const Projects = () => {
    const [error, setError] = useState(null)
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [showEditTaskModal, setShowEditTaskModal] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const [showProjectModal, setShowProjectModal] = useState(false)
    const [projectMembers,setProjectMembers] = useState([])
    const [getClick,setGetClick] = useState(false);
    const [addMemberForm,setAddMemberForm] = useState(false);
    const [addMemberFormData,setAddMemberFormData] = useState({
      email : ''
    });
    const [from, setFrom] = useState(() => {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      sevenDaysAgo.setHours(0,0,0,0)
      return sevenDaysAgo;
    });
  
    const [to, setTo] = useState(() => {
        const today = new Date();
        today.setHours(0,0,0,0)
        return today;
    });
  

    // Tạo mảng các ngày
    const getDateArray = (from,to)=>{
      const startDate = new Date(from);
      const endDate = new Date(to);
      const dateArray = [];
      let currentDate = startDate;
      while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Tăng thêm 1 ngày
      }
      return dateArray;
    }
    

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
    const handleGetClick = ()=>{
      setGetClick(!getClick)
      setShowForm(false);
    }
  const [formAddTaskData, setFormAddTaskData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    projectId: '',
  })
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
  const formatDateDisplay = (date) => {
    const localDate = new Date(date)
    const hours = String(localDate.getHours()).padStart(2, '0')
    const minutes = String(localDate.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  const handleShowProjectModal = () => setShowProjectModal(!showProjectModal)
  const handleCloseProjectModal = () => setShowProjectModal(false)
  const handleShowAddTaskModal = () => setShowAddTaskModal(true)
  const handleCloseAddTaskModal = () => setShowAddTaskModal(false)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormAddTaskData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveNewTask = async () => {
    if (!formAddTaskData) return

    formAddTaskData.projectId = selectedProject ? selectedProject.id : ''

    const _startDate = new Date(formAddTaskData.startDate)
    const _endDate = new Date(formAddTaskData.endDate)

    if (_startDate > _endDate) {
      setError('Start date must be earlier than end date.')
      return
    }

    try {
      const response = await projectApiInstance.post('tasks', formAddTaskData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response && response.data) {
        console.log('Task added:', response.data)
      }
      handleCloseAddTaskModal()
    } catch (e) {
      setError(e.message)
    }

    setFormAddTaskData({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      projectId: '',
    })
  }

  const handleShowEditTaskModal = (task) => {
    setCurrentTask(task)
    setShowEditTaskModal(true)
  }

  const handleCloseEditTaskModal = () => setShowEditTaskModal(false)



  const handleMarkTaskAsDone = async () => {
    if (!currentTask) return
    currentTask.status = "COMPLETED"
    try {
      const response = await projectApiInstance.put(`/tasks/${currentTask.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response && response.data) {
        setProjectMembers(response.data.members)
      }
    } catch (e) {
      setError(e.message)
    }
    handleCloseEditTaskModal()
  }
  const handleDeleteTask = async()=>{
    try {
      const response = await projectApiInstance.delete(`tasks/${currentTask.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if(response.status === 200)
      {
        console.log('success')
      }
      handleCloseProjectModal()
    } catch (e) {
      setError(e.message)
    }
  }
  const handleSaveTask = async()=>{
    try {
      const response = await projectApiInstance.put('tasks',currentTask,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if(response && response.status === 200)
      {
        console.log('success')
        fetchProjectTasks(selectedProject);
      }
      handleCloseEditTaskModal()
    } catch (e) {
      setError(e.message)
    }
  }
  const handleAddMember = async (task) => {
    try {
      console.log(addMemberFormData.email)
      console.log('task',task)
      const response = await projectApiInstance.put(`tasks/${task.id}/user`,null,
        {
          params :{
            email: addMemberFormData.email
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if(response && response.data)
      {
        console.log(response)
        if(response.status == 200)
        {
          console.log('success')
        }
      }
      setAddMemberForm(!addMemberForm)
    } catch (e) {
      setError(e.message)
    }
  }

  const fetchProjectTasks = async(project) =>{
    try{
        if(project && project.id)
        {
            const response = await projectApiInstance.get('',{
                params:{
                    projectId: project?.id,
                    from: formatDate(from),
                    to: formatDate(to) 
                }
            })
            if(response && response.data){
                console.log(response.data)
                setProjectMembers(response.data.members)
            }
        }
    }catch(e)
    {
        console.log(e.message)
    }
  }
  const handleClickProject = async(project) => {
    setSelectedProject(project)
    fetchProjectTasks(selectedProject)
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApiInstance.get('', {
            params :{
                userId : 1
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response && response.data &&  response.data[0]) {
            setProjects(response.data)
            if(response.data[0])
            {
                setSelectedProject(response.data[0])
            }
        
        }
      } catch (e) {
        setError(e.message)
      }
    }
    fetchProjects()
  }, [currentTask])

  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks(selectedProject);
    }
  }, [selectedProject,from,to,currentTask]);


    
    
  return (
    <div className=" mx-10 ml-20 ">
        <div className="mb-5">
            <div className="flex relative mb-5">
                <div
                    className= "text-black font-bold text-2xl cursor-pointer"
                    onClick={handleShowProjectModal}
                >
                    {selectedProject ? selectedProject.name : 'Select Project'}
                    </div>
                {showProjectModal && (
                    <ul className="absolute mt-10 bg-white shadow-lg rounded-md w-44">
                    {projects
                        ?.filter((project) => project.id !== selectedProject?.id)
                        .map((project, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleClickProject(project)}
                        >
                            {project.name}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='flex gap-5 font-semibold items-start text-sm h-6 text-center'>
                <div className='flex gap-1'>
                    <button onClick={handleBackClick}  className="bg-violet-100 text-white w-6 h-6 rounded-l p-1 flex items-center justify-center">
                        <img src={leftArrow} alt="Previous" className="w-2 h-2 " />
                    </button>
                    <button  className="bg-violet-100 h-6 px-3 text-violet-500 flex items-center">
                        <h6 className="">
                            {
                                `${formatDateStr(from)} - ${formatDateStr(to)}` 
                            }
                        </h6>
                    </button>
                                
                    <button onClick={handleNextClick}  className="bg-violet-100 w-6 h-6  text-violet-600 rounded-r p-1 flex items-center justify-center">
                        <img src={rightArrow} alt="Next" className="w-2 h-2" />
                    </button>
                </div>

                <button
                    onClick={handleShowAddTaskModal}
                    className="bg-violet-100 text-violet-600 rounded w-40 h-6"
                    >
                    Add New Task
                </button>
               
            </div>
    </div>

    <div className="flex-col bg-gray-100">
        

        <div className="flex flex-col w-full">
            <div className='flex bg-white '>
              
                <div className='  text-center text-sm font-semibold '
                style={{width: '5%'}}
                    >{from.getFullYear()}</div>
                {
                  getDateArray(from,to).map((date,index)=>{

                    const dateCount = parseInt((to - from) / (1000 * 60 * 60 * 24))+1; // 95 /dateCount 
                    const widthPercent = 95/dateCount;
                    return (
                      <div key={index} className='text-center text-sm font-semibold'
                        style={{width: `${widthPercent}%`}}
                      >
                        {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                      </div>
                    )
                  })
                }
            </div>
        <div className='flex '>
            <div className=" flex-col w-full "
            >
                {projectMembers?.map((member, memberIndex) => (
                    
                    <div key={memberIndex} className=" flex items-center"
                    style={{height: '60px'}}
                        >
                        <div className='flex flex-col items-center h-full justify-center text-center bg-white'
                            style={{width:'5%'}}>
                            <img
                                className="rounded-full border w-6 h-6"
                                src={defaultAvt}
                                alt="Avatar"
                            />
                            <p className="text-xs font-normal">{member.name}</p>
                        </div>
                        
                        {member?.projectTasks?.reduce((acc, task, taskIndex) => {
                          const taskStartDate = new Date(task.startDate);
                          const taskEndDate = new Date(task.endDate);
                          taskStartDate.setHours(0,0,0,0)
                          taskEndDate.setHours(0,0,0,0)
                          const dayOffset = Math.round((taskStartDate - from) )/ (1000 * 60 * 60 * 24) ;
                          const taskDuration = Math.round((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24)) + 1;
                          const remainDuration = Math.round((to - taskStartDate) / (1000 * 60 * 60 * 24)) + 1
                          const dateCount = Math.round((to - from) / (1000 * 60 * 60 * 24)) +1;
                          const widthPercent = 95 / dateCount;

                          const adjustedDayOffset = Math.max(0, dayOffset);
                          const adjustedTaskDuration = Math.max(1, Math.min(taskDuration,remainDuration));
                          

                          let marginLeft = 0;
                          if (taskIndex === 0) {
                            marginLeft = widthPercent * adjustedDayOffset;
                          } else {

                            const prevTask = acc[taskIndex - 1]?.taskInfo;
                            if (prevTask) {
                              const prevTaskEndDate = new Date(prevTask.endDate);
                              prevTaskEndDate.setHours(0,0,0,0)
                              const prevDayOffset = Math.round((prevTaskEndDate - from) / (1000 * 60 * 60 * 24)) ;
                              const gapBetweenTasks = dayOffset - prevDayOffset - 1;
                              marginLeft = widthPercent * Math.max(0, gapBetweenTasks);
                            }
                          }

                          let statusMap = new Map()
                          statusMap.set("PENDING","bg-yellow-200")
                          statusMap.set("COMPLETED","bg-green-200")
                          statusMap.set("OVERDUE","bg-red-200")
                          acc.push({
                            taskInfo: task, // Lưu trữ thông tin task hiện tại
                            jsx: (
                              <div
                                key={taskIndex}
                                onClick={() => handleShowEditTaskModal(task)}
                                className="cursor-pointer"
                                style={{
                                  width: `${widthPercent * adjustedTaskDuration}%`,
                                  marginLeft: `${marginLeft}%`
                                }}
                              >
                                <div className={`${statusMap.get(task.status)} m-1 p-2`}>
                                  <div className="flex gap-2">
                                    <div className="flex-col items-start">
                                      <p className="text-xs font-semibold">
                                        {`${formatDateDisplay(task.startDate)} - ${formatDateDisplay(task.endDate)}`}
                                      </p>
                                      <p className="text-xs font-thin">{task.name}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          });

                          return acc;
                        }, []).map(item => item.jsx)} 



                        
                        
                        
                    </div>
                    
                ))}
            </div>
            
            </div>
        </div>
        
      </div>

      {showEditTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
            <input
              type="text"
              value={currentTask.name}
              onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className='flex'>
              <input
                type="datetime-local"
                value={currentTask.startDate}
                onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <input
                type="datetime-local"
                value={currentTask.endDate}
                onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                className="w-full px-4 py-2 border rounded mb-4"
              />
              
            </div>
            <input
                type="text"
                value={currentTask.description}
                onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                className="w-full px-4 py-2 border rounded mb-4"
              />
            <div className='flex gap-2 mb-2 items-center' >
              <img
                className="rounded-full border w-8 h-8"
                src={defaultAvt}
                alt="Avatar"
              />
              <img
                className="rounded-full border w-8 h-8"
                src={defaultAvt}
                alt="Avatar"
              />
              <button onClick={()=>setAddMemberForm(!addMemberForm)} className=' text-white rounded-full bg-gray-300 w-8 h-8 text-center flex justify-center items-center'>
                <p>+</p>
              </button> 
              {
                addMemberForm && (
                    <div className='flex items-center gap-2'>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter member's email address"
                        className="px-4 py-1 border rounded"
                        onChange={(e) => setAddMemberFormData({ ...addMemberFormData, email: e.target.value })}
                        value = {addMemberFormData.email}
                      />
                      <button onClick={()=>handleAddMember(currentTask)} className='flex items-center justify-center text-sm font-normal bg-green-200 rounded-lg p-1 px-5'>
                        <p>Add</p> 
                      </button>
                    </div>

                  
                  
                )
              }
            </div>
            <div className="flex justify-end gap-2">
              <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleSaveTask}
                  >
                    Save
                </button>
              <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleMarkTaskAsDone}
                >
                  Mark as Done
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteTask}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCloseEditTaskModal}
              >
                Close
              </button>
              
            </div>
          </div>
        </div>
      )}

      {showAddTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>
            <input
              type="text"
              name="name"
              placeholder="Enter task name"
              value={formAddTaskData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="datetime-local"
                name="startDate"
                value={formAddTaskData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="datetime-local"
                name="endDate"
                value={formAddTaskData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formAddTaskData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCloseAddTaskModal}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveNewTask}
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

Projects.propTypes = {
  memberEmail: PropTypes.string,
  setMemberEmail: PropTypes.func,
}

export default Projects
