import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';
import ProductModal from '../components/product/ProductModal';
import DeleteProductModal from '../components/product/DeleteProductModal';

const ProductPage = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.products);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="container mt-4">
            <h2>Products</h2>
            <button className="btn btn-primary mb-3" onClick={() => { setEditProduct(null); setShowModal(true); }}>
                 Add Product
            </button>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr><th>Name</th><th>Price ($)</th><th>Actions</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {items.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.price.toFixed(2)}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditProduct(p); setShowModal(true); }}>Edit</button>
                                </td>
                                <td>
                                <button className="btn btn-sm btn-danger" onClick={() => { setSelectedProduct(p); setDeleteModal(true); }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ProductModal show={showModal} onClose={() => setShowModal(false)} editProduct={editProduct} />
            <DeleteProductModal show={deleteModal} onClose={() => setDeleteModal(false)} product={selectedProduct} />
        </div>
    );
};

export default ProductPage;
