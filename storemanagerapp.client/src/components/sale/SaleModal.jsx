import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSale, updateSale } from '../../redux/saleSlice';
import { FaCheck } from 'react-icons/fa';

const SaleModal = ({ show, onClose, editSale, onSaved }) => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers.items);
    const products = useSelector(state => state.products.items);
    const stores = useSelector(state => state.stores.items);

    const [sale, setSale] = useState({
        customerId: '',
        productId: '',
        storeId: '',
        dateSold: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editSale) {
            setSale({
                id: editSale.id,
                customerId: editSale.customerId?.toString() || '',
                productId: editSale.productId?.toString() || '',
                storeId: editSale.storeId?.toString() || '',
                dateSold: editSale.dateSold ? editSale.dateSold.split('T')[0] : ''
            });
        } else {
            setSale({ customerId: '', productId: '', storeId: '', dateSold: '' });
        }
        setError(null);
    }, [editSale]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const { customerId, productId, storeId, dateSold } = sale;

        if (!customerId || !productId || !storeId || !dateSold) {
            setError("All fields are required.");
            return;
        }

        const formattedSale = {
            customerId: parseInt(customerId),
            productId: parseInt(productId),
            storeId: parseInt(storeId),
            dateSold: new Date(dateSold).toISOString()
        };

        if (editSale?.id) {
            formattedSale.id = editSale.id;
        }

        try {
            if (editSale) {
                await dispatch(updateSale(formattedSale)).unwrap();
            } else {
                await dispatch(addSale(formattedSale)).unwrap();
            }

            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            console.error("Sale submission failed:", err);
            setError("Failed to save sale. Please try again.");
        }
    };

    if (!show) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1055 }}
        >
            {/* Blurred Background */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 1
                }}
            ></div>

            {/* Modal Content */}
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
                        <h5 className="fw-bold mb-0">{editSale ? 'Edit' : 'Create'} Sale</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <label className="form-label fw-semibold small text-uppercase">Customer</label>
                    <select
                        className="form-select mb-3"
                        value={sale.customerId}
                        onChange={(e) => setSale({ ...sale, customerId: e.target.value })}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <label className="form-label fw-semibold small text-uppercase">Product</label>
                    <select
                        className="form-select mb-3"
                        value={sale.productId}
                        onChange={(e) => setSale({ ...sale, productId: e.target.value })}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <label className="form-label fw-semibold small text-uppercase">Store</label>
                    <select
                        className="form-select mb-3"
                        value={sale.storeId}
                        onChange={(e) => setSale({ ...sale, storeId: e.target.value })}
                        required
                    >
                        <option value="">Select Store</option>
                        {stores.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <label className="form-label fw-semibold small text-uppercase">Date Sold</label>
                    <input
                        type="date"
                        className="form-control mb-4"
                        value={sale.dateSold}
                        onChange={(e) => setSale({ ...sale, dateSold: e.target.value })}
                        required
                    />

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-dark px-4" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success d-flex align-items-center gap-2 px-4">
                            {editSale ? 'Update' : 'Create'} <FaCheck />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SaleModal;
