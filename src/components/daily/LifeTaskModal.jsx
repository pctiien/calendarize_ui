import { useState, useEffect } from 'react';
import { lifeTasksApiInstance } from '../../services/axios.js';
import PropTypes from 'prop-types';

const LifeTaskModal = ({ show, handleClose, task }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    userId: '',
    status: ''
  });

  useEffect(() => {
    if (task) {
      const startDateTime = new Date(task.startDate);
      const endDateTime = new Date(task.endDate);

      setFormData({
        id: task.id || '',
        name: task.name || '',
        date: formatDateForInput(startDateTime),
        startTime: formatTimeForInput(startDateTime),
        endTime: formatTimeForInput(endDateTime),
        description: task.description || '',
        status: task.status || 'PENDING',
        userId: task.userId
      });
    }
  }, [task]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const _startDate = `${formData.date}T${formData.startTime}:00`;
    const _endDate = `${formData.date}T${formData.endTime}:00`;
    console.log("kaka")
    if (formData.startTime >= formData.endTime) {
      setError('Start date must be earlier than end date.');
      setLoading(false);
      return;
    }
    console.log("kaka")

    try {
      if (task && task.id) {
        const data = {
          id: task.id,
          name: formData.name,
          startDate: _startDate,
          endDate: _endDate,
          description: formData.description,
          userId: formData.userId,
          status: formData.status || task.status
        }
        console.log(data)
        const response = await lifeTasksApiInstance.put('tasks', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Update successful:', response.data);
      }else if(task==null || task.id==null)
      {
        const response = await lifeTasksApiInstance.post('tasks', {
          name : formData.name,
          startDate: _startDate,
          endDate: _endDate,
          description: formData.description,
          userId: 1
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Update successful:', response.data);
      } 
    } catch (error) {
      console.error('There was a problem with the save operation:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const formatDateForInput = (date) => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (date) => {
    const localDate = new Date(date);
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatToISO = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto z-40"
        onClick={(e) => e.stopPropagation()} // Prevent click events on the modal from closing it
      >
        <div className="flex justify-between items-center border-b px-5 py-3">
          <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter task name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"  
              value={formData.startTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end border-t px-5 py-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifeTaskModal;
