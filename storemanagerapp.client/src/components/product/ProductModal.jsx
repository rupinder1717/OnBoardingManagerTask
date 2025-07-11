import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../../redux/productSlice';
import { FaCheck } from 'react-icons/fa';

const ProductModal = ({ show, onClose, editProduct }) => {
    const dispatch = useDispatch();
    const [product, setProduct] = useState({ name: '', price: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (editProduct) {
            setProduct(editProduct);
        } else {
            setProduct({ name: '', price: '' });
        }
        setError('');
    }, [editProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const name = product.name.trim();
        const price = parseFloat(product.price);

        if (!name || isNaN(price) || price <= 0) {
            setError("Please enter a valid product name and a positive price.");
            return;
        }

        const formattedProduct = {
            ...product,
            name,
            price
        };

        try {
            if (editProduct) {
                await dispatch(updateProduct(formattedProduct)).unwrap();
            } else {
                await dispatch(addProduct(formattedProduct)).unwrap();
            }
            onClose();
        } catch (err) {
            console.error(err);
            setError("Something went wrong while saving the product.");
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
            {/* Blurred background overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 1
                }}
            ></div>

            {/* Modal content */}
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
                        <h5 className="fw-bold mb-0">
                            {editProduct ? 'Edit Product' : 'Create Product'}
                        </h5>
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
                        placeholder="Product name"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />

                    <label className="form-label text-uppercase fw-semibold small">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="form-control mb-4"
                        placeholder="Price"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
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
                            {editProduct ? 'Update' : 'Create'} <FaCheck />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
