import {Modal,Button,Form} from 'react-bootstrap'
import {useState,useEffect} from 'react'
import axios from '../services/axios.js'
import PropTypes from 'prop-types'
const LifeTaskModal = (({show,handleClose,task})=>{
  const [formData, setFormData] = useState({
    id: '' ,
    name:  '' ,
    startDate: '' ,
    endDate: '' ,
    description: '' ,
  });

  useEffect(() => {
    if (task) {
      console.log(task)
      setFormData({
        id: task.id || '',
        name: task.name || '',
        startDate: task.startDate ? formatDateForInput(new Date(task.startDate)) : '',
        endDate: task.endDate ? formatDateForInput(new Date(task.endDate)) : '',
        description: task.description || '',
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
    console.log("SAVE :",task)
    setLoading(true);
    setError(null);
    const _startDate = new Date(formData.startDate);
    const _endDate = new Date(formData.endDate);
    if(_startDate.toLocaleDateString() != _endDate.toLocaleDateString()) {
      setError('Start date and end date must be the same.');
      setLoading(false);
      return; // Ngừng thực hiện nếu điều kiện không đúng
    }
    if(_startDate.getTime() >= _endDate.getTime()){
      console.log(_startDate.getTime() + " "+_endDate.getTime())
      setError('Start date must be earlier than end date.');
      setLoading(false);
      return; // Ngừng thực hiện nếu điều kiện không đúng
    }
    try {
      if(task && task.id)
      {

        const response = await axios.put('life/task', formData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Update successful:', response.data);

      }else{

        const response = await axios.post('life/task', {
          name : formData.name,
          description : formData.description,
          startDate : formData.startDate,
          endDate : formData.endDate,
          userId : 2
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Create successful:', response.data);

      }
      // Có thể thực hiện thêm hành động khác như thông báo thành công
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
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Edit Task' : 'New Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

        
          <Form.Group controlId="formTaskStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formTaskEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
);

LifeTaskModal.propsTypes ={
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  task : PropTypes.shape(
    {
      id: PropTypes.number.isRequired,
      name:  PropTypes.string.isRequired ,
      startDate: PropTypes.string.isRequired ,
      endDate: PropTypes.string.isRequired ,
      description: PropTypes.string,
    }
  )
};
export default LifeTaskModal;