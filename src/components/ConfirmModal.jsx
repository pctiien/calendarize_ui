import PropTypes from 'prop-types';

const ConfirmationModal = ({ show, handleClose, handleConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-sm mx-auto z-40"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Confirm Action</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <p>Are you sure you want to perform this action?</p>
        </div>
        <div className="flex justify-end border-t px-4 py-3">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
