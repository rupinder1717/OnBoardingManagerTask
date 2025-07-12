import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createCustomer,
    updateCustomer,
    setShowModal
} from "../../redux/customerSlice";

const CustomerModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedCustomer } = useSelector(state => state.customers);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (modalType === 'edit' && selectedCustomer) {
            setName(selectedCustomer.name || '');
            setAddress(selectedCustomer.address || '');
        } else {
            setName('');
            setAddress('');
        }
        setErrors({});
    }, [modalType, selectedCustomer]);

    const handleClose = () => {
        dispatch(setShowModal(false));
        setErrors({});
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();
        const newErrors = {};

        if (!trimmedName) {
            newErrors.name = "Customer name is required.";
        }

        if (!trimmedAddress) {
            newErrors.address = "Address is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const customer = { name: trimmedName, address: trimmedAddress };

        if (modalType === 'edit' && selectedCustomer?.id) {
            await dispatch(updateCustomer({ ...customer, id: selectedCustomer.id }));
        } else {
            await dispatch(createCustomer(customer));
        }

        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Customer' : 'New Customer'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCustomerName" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter customer name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formCustomerAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    {modalType === 'edit' ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomerModal;
