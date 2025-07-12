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

    useEffect(() => {
        if (modalType === 'edit' && selectedStore) {
            setName(selectedStore.name || '');
            setAddress(selectedStore.address || '');
        } else {
            setName('');
            setAddress('');
        }
    }, [modalType, selectedStore]);

    const handleClose = () => dispatch(setShowModal(false));

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedAddress = address.trim();

        if (!trimmedName) {
            alert("Store name is required.");
            return;
        }


        if (!trimmedAddress) {
            alert("Address is required.");
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
                            required
                            minLength={2}
                        />
                    </Form.Group>

                    <Form.Group controlId="storeAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                            required
                            minLength={5}
                        />
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
