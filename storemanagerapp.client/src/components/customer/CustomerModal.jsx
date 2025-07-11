import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer, updateCustomer } from '../../redux/customerSlice';
import { FaCheck } from 'react-icons/fa';

const CustomerModal = ({ show, onClose, editCustomer }) => {
    const dispatch = useDispatch();
    const [customer, setCustomer] = useState({ name: '', address: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (editCustomer) {
            setCustomer(editCustomer);
        } else {
            setCustomer({ name: '', address: '' });
        }
        setError('');
    }, [editCustomer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = customer.name.trim();
        const address = customer.address.trim();

        if (!name || !address) {
            setError("Both name and address are required.");
            return;
        }

        try {
            if (editCustomer) {
                await dispatch(updateCustomer({ ...customer, name, address })).unwrap();
            } else {
                await dispatch(addCustomer({ name, address })).unwrap();
            }
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
            {/* Blurred background */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 1
                }}
            ></div>

            {/* Modal box */}
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
                        <h5 className="fw-bold mb-0">{editCustomer ? 'Edit' : 'Create'} Customer</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <label className="form-label text-uppercase fw-semibold small">Name</label>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Customer name"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />

                    <label className="form-label text-uppercase fw-semibold small">Address</label>
                    <input
                        type="text"
                        className="form-control mb-4"
                        placeholder="Address"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    />

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn px-4"
                            style={{
                                backgroundColor: '#333',
                                color: '#fff'
                            }}
                            onClick={onClose}
                        >
                            cancel
                        </button>
                        <button
                            type="submit"
                            className="btn px-4"
                            style={{
                                backgroundColor: '#a4e8a1',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {editCustomer ? 'Update' : 'Create'} <FaCheck />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
