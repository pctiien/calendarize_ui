import {Modal,Button} from 'react-bootstrap'
import PropTypes from 'prop-types'

const ConfirmationModal = ({ show, handleClose, handleConfirm }) => {
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to perform this action?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
export default ConfirmationModal;
