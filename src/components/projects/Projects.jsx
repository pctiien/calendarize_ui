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
    const [tasksProject, setTasksProject] = useState([])
    const [showEditTaskModal, setShowEditTaskModal] = useState(false)
    const [currentTask, setCurrentTask] = useState(null)
    const [showAddTaskModal, setShowAddTaskModal] = useState(false)
    const [showProjectModal, setShowProjectModal] = useState(false)
    const [showMemberModal,setShowMemberModal] = useState(false)
    const [projectMembers,setProjectMembers] = useState([])
  const [formAddTaskData, setFormAddTaskData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    projectId: '',
  })

  const formatDateDisplay = (date) => {
    const localDate = new Date(date)
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')
    const hours = String(localDate.getHours()).padStart(2, '0')
    const minutes = String(localDate.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  const handleShowMemberModal = ()=> setShowMemberModal(true)
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
      setTasksProject(selectedProject.projectTasks)
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

    try {
      const response = await projectApiInstance.put(`/tasks/${currentTask.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response && response.data) {
        console.log(response.data)
        setProjectMembers(response.data.members)
      }
    } catch (e) {
      setError(e.message)
    }
    handleCloseEditTaskModal()
  }

  const handleAddMember = async () => {
    try {
      const response = await projectApiInstance.post(
        `/${selectedProject.id}/user/1`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      handleCloseProjectModal()
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
                    projectId: project?.id
                }
            })
            if(response && response.data){
                console.log('tasks',response.data)
                setProjectMembers(response.data.members)
                console.log('members',projectMembers)
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
  }, [])
  useEffect(() => {
        if (selectedProject) {
            fetchProjectTasks(selectedProject);
        }
    }, [selectedProject]);
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
                    <button  className="bg-violet-100 text-white w-6 h-6 rounded-l p-1 flex items-center justify-center">
                        <img src={leftArrow} alt="Previous" className="w-2 h-2 " />
                    </button>
                    <button  className="bg-violet-100 h-6 px-3 text-violet-500 flex items-center">
                        <h6 className="">
                            from  - to
                        </h6>
                    </button>
                                
                    <button  className="bg-violet-100 w-6 h-6  text-violet-600 rounded-r p-1 flex items-center justify-center">
                        <img src={rightArrow} alt="Next" className="w-2 h-2" />
                    </button>
                </div>

                <button
                    onClick={handleShowAddTaskModal}
                    className="bg-violet-100 text-violet-600 rounded w-40 h-6"
                    >
                    Add New Task
                </button>
                <button
                    onClick={handleShowMemberModal}
                    className="bg-violet-100 text-violet-600 rounded w-40 h-6"
                >
                    Add New Member
                </button>
            </div>
    </div>

    <div className="flex-col">
        

        <div className="flex flex-col w-full">
            <div className='flex '>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                    >Search</div>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                    >Mon</div>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                    >Tue</div>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                    >Wed</div><div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                style={{width: '12.5%'}}
                >Thu</div>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                    >Fri</div>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                    >Sat</div>
                <div className='p-4 border-violet-100 border text-center text-sm font-semibold text-violet-500'
                    style={{width: '12.5%'}}
                >Sun</div>
            </div>
        <div className='flex '>
            <div className="border border-violet-100 flex-col w-full "
            >
                {projectMembers?.map((member, memberIndex) => (
                    
                    <div key={memberIndex} className=" border border-violet-100 flex items-center justify-start"
                        style={{height:'75px'}}>
                        <div className='flex gap-2  items-center h-full border  '
                            style={{width:'12.5%'}}>
                            <img
                                className="rounded-full border w-10 h-10"
                                src={defaultAvt}
                                alt="Avatar"
                            />
                            <p className="text-sm font-normal">{member.name}</p>
                        </div>
                        
                        {member?.projectTasks
                            ?.map((task, taskIndex) => (
                                <div
                                    key={taskIndex}
                                    onClick={() => handleShowEditTaskModal(task)}
                                    className='flex cursor-pointer border border-violet-100'
                                    style={{ height: '75px' }}
                                >
                                    <div className='bg-violet-600 m-2 p-3 rounded-lg'>
                                        <div className="flex gap-2">
                                            <div className='flex-col items-start'>
                                                <p className="text-xs font-semibold">
                                                    {`${formatDateDisplay(task.startDate)} - ${formatDateDisplay(task.endDate)}`}
                                                </p>
                                                <p className="text-xs font-thin">{task.name}</p>
                                            </div>
                                            <div className="flex justify-end items-center gap-1">
                                                <img
                                                    className="w-6 h-6 rounded-full border"
                                                    src={defaultAvt}
                                                    alt="Avatar"
                                                />
                                                <img
                                                    className="w-6 h-6 rounded-full border"
                                                    src={defaultAvt}
                                                    alt="Avatar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        
                        
                        
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
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCloseEditTaskModal}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleMarkTaskAsDone}
              >
                Mark as Done
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
