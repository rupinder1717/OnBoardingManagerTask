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

    useEffect(() => {
        if (modalType === 'edit' && selectedCustomer) {
            setName(selectedCustomer.name || '');
            setAddress(selectedCustomer.address || '');
        } else {
            setName('');
            setAddress('');
        }
    }, [modalType, selectedCustomer]);

    const handleClose = () => dispatch(setShowModal(false));

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();

        if (!trimmedName) {
            alert("Customer name is required.");
            return;
        }


        if (!trimmedAddress) {
            alert("Address is required.");
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
                            required
                            minLength={2}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCustomerAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            minLength={5}
                        />
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
