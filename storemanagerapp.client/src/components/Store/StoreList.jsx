import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchStores,
    setShowModal,
    setModalType,
    setSelectedStore,
    setShowDeleteModal
} from '../../redux/storeSlice';
import StoreModal from './StoreModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button, Table } from 'react-bootstrap';

const StoreList = () => {
    const dispatch = useDispatch();
    const { stores = [], showModal, showDeleteModal } = useSelector(state => state.stores || {});

    useEffect(() => {
        dispatch(fetchStores());
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setModalType('create'));
        dispatch(setSelectedStore(null));
        dispatch(setShowModal(true));
    };

    const handleEdit = (store) => {
        dispatch(setModalType('edit'));
        dispatch(setSelectedStore(store));
        dispatch(setShowModal(true));
    };

    const handleDelete = (store) => {
        dispatch(setSelectedStore(store));
        dispatch(setShowDeleteModal(true));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Store List</h4>
                <Button variant="primary" onClick={handleAdd}>New Store</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th className="text-center" colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.length > 0 ? (
                        stores.map((store) => (
                            <tr key={store.id}>
                                <td>{store.name}</td>
                                <td>{store.address}</td>
                                <td className="text-center">
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(store)}>
                                        ✏️ EDIT
                                    </Button>
                                </td>
                                <td className="text-center">
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(store)}>
                                        🗑️ DELETE
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No stores found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {showModal && <StoreModal />}
            {showDeleteModal && <DeleteConfirmationModal />}
        </div>
    );
};

export default StoreList;
