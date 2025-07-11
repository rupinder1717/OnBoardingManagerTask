import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales } from '../redux/saleSlice';
import { fetchCustomers } from '../redux/customerSlice';
import { fetchProducts } from '../redux/productSlice';
import { fetchStores } from '../redux/storeSlice';
import SaleModal from '../components/sale/SaleModal';
import DeleteSaleModal from '../components/sale/DeleteSaleModal';

const SalePage = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.sales);
    const [showModal, setShowModal] = useState(false);
    const [editSale, setEditSale] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    useEffect(() => {
        dispatch(fetchSales());
        dispatch(fetchCustomers());
        dispatch(fetchProducts());
        dispatch(fetchStores());
    }, [dispatch]);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditSale(null);
    };

    const handleCloseDelete = () => {
        setDeleteModal(false);
        setSelectedSale(null);
    };

    return (
        <div className="container mt-4">
            <h2>Sales</h2>
            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                 Add Sale
            </button>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Store</th>
                        <th>Date Sold</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((s) => (
                        <tr key={s.id}>
                            <td>{s.customerName || 'N/A'}</td>
                            <td>{s.productName || 'N/A'}</td>
                            <td>{s.storeName || 'N/A'}</td>
                            <td>{s.dateSold ? s.dateSold.split('T')[0] : ''}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => {
                                        setEditSale({
                                            id: s.id,
                                            customerId: s.customerId,
                                            productId: s.productId,
                                            storeId: s.storeId,
                                            dateSold: s.dateSold?.split('T')[0] || '',
                                        });
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
                                        setSelectedSale(s);
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

            <SaleModal
                show={showModal}
                onClose={handleCloseModal}
                editSale={editSale}
                onSaved={() => dispatch(fetchSales())}
            />

            <DeleteSaleModal
                show={deleteModal}
                onClose={handleCloseDelete}
                sale={selectedSale}
                onDeleted={() => dispatch(fetchSales())}
            />
        </div>
    );
};

export default SalePage;
