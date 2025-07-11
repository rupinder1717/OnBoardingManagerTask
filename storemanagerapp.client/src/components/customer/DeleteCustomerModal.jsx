import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteCustomer } from "../../redux/customerSlice";

const DeleteCustomerModal = ({ show, onClose, customer }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteCustomer(customer.id));
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal-backdrop show d-block">
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Customer</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete "{customer.name}"?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCustomerModal;
