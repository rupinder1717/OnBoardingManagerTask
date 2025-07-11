import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStore, updateStore } from '../../redux/storeSlice';
import { FaCheck } from 'react-icons/fa';

const StoreModal = ({ show, onClose, editStore, onSaved }) => {
    const dispatch = useDispatch();
    const [store, setStore] = useState({ name: '', address: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (editStore) {
            setStore(editStore);
        } else {
            setStore({ name: '', address: '' });
        }
        setError('');
    }, [editStore]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = store.name.trim();
        const address = store.address.trim();

        if (!name || !address) {
            setError("Both name and address are required.");
            return;
        }

        const formattedStore = { ...store, name, address };

        try {
            if (editStore) {
                await dispatch(updateStore(formattedStore)).unwrap();
            } else {
                await dispatch(addStore(formattedStore)).unwrap();
            }

            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    if (!show) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                zIndex: 1055
            }}
        >
            {/* Blur background */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 1
                }}
            ></div>

            {/* Modal Card */}
            <div
                className="rounded shadow position-relative"
                style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '500px',
                    zIndex: 2
                }}
            >
                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">{editStore ? 'Edit' : 'Create'} Store</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <label className="form-label fw-semibold small text-uppercase">Name</label>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Name"
                        value={store.name}
                        onChange={(e) => setStore({ ...store, name: e.target.value })}
                        required
                    />

                    <label className="form-label fw-semibold small text-uppercase">Address</label>
                    <input
                        type="text"
                        className="form-control mb-4"
                        placeholder="Address"
                        value={store.address}
                        onChange={(e) => setStore({ ...store, address: e.target.value })}
                        required
                    />

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-dark px-4"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success d-flex align-items-center gap-2 px-4"
                        >
                            {editStore ? 'Update' : 'Create'} <FaCheck />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreModal;
