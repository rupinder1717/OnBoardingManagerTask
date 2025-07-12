import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteStore,
    setShowDeleteModal,
    setSelectedStore
} from '../../redux/storeSlice';

const DeleteConfirmationModal = () => {
    const dispatch = useDispatch();

    // ✅ Use correct slice name: 'stores'
    const showDeleteModal = useSelector(state => state.stores.showDeleteModal);
    const selectedStore = useSelector(state => state.stores.selectedStore);

    const handleClose = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedStore(null));
    };

    const handleDelete = () => {
        if (selectedStore?.id) {
            dispatch(deleteStore(selectedStore.id));
            handleClose();
        }
    };

    // ✅ Optional safety check
    if (!selectedStore) return null;

    return (
        <Modal show={showDeleteModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete <strong>{selectedStore.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>❌ Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>🗑️ Delete</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;
