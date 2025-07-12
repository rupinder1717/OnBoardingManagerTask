import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createStore,
    updateStore,
    fetchStores,
    setShowModal
} from '../../redux/storeSlice';

const StoreModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedStore } = useSelector(state => state.stores);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (modalType === 'edit' && selectedStore) {
            setName(selectedStore.name || '');
            setAddress(selectedStore.address || '');
        } else {
            setName('');
            setAddress('');
        }
        setErrors({});
    }, [modalType, selectedStore]);

    const handleClose = () => {
        dispatch(setShowModal(false));
        setErrors({});
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();
        const newErrors = {};

        if (!trimmedName) newErrors.name = "Store name is required.";
        if (!trimmedAddress) newErrors.address = "Address is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const store = { name: trimmedName, address: trimmedAddress };

        if (modalType === 'edit' && selectedStore?.id) {
            await dispatch(updateStore({ ...store, id: selectedStore.id }));
        } else {
            await dispatch(createStore(store));
        }

        await dispatch(fetchStores());
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Store' : 'New Store'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="storeName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter store name"
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="storeAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                            isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="success" onClick={handleSubmit}>
                    {modalType === 'edit' ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StoreModal;
