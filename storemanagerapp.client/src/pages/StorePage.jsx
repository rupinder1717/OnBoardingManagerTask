import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStores } from '../redux/storeSlice';
import StoreModal from '../components/store/StoreModal';
import DeleteStoreModal from '../components/store/DeleteStoreModal';

const StorePage = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.stores);
    const [showModal, setShowModal] = useState(false);
    const [editStore, setEditStore] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        dispatch(fetchStores());
    }, [dispatch]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditStore(null);
    };

    const handleCloseDelete = () => {
        setDeleteModal(false);
        setSelectedStore(null);
    };

    const handleSaved = () => {
        dispatch(fetchStores());   // ✅ Refetch the store list
        handleCloseModal();        // ✅ Close modal
    };

    return (
        <div className="container mt-4">
            <h2>Stores</h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setEditStore(null);
                    setShowModal(true);
                }}
            >
                 Add Store
            </button>

            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((s) => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.address}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => {
                                        setEditStore(s);
                                        setShowModal(true);
                                    }}
                                >
                                    Edit
                                </button>
                                </td>
                                <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        setSelectedStore(s);
                                        setDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <StoreModal
                show={showModal}
                onClose={handleCloseModal}
                editStore={editStore}
                onSaved={handleSaved} // ✅ Pass down to trigger refresh
            />

            <DeleteStoreModal
                show={deleteModal}
                onClose={handleCloseDelete}
                store={selectedStore}
            />
        </div>
    );
};

export default StorePage;
