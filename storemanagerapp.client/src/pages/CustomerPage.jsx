import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../redux/customerSlice';
import CustomerModal from '../components/customer/CustomerModal';
import DeleteCustomerModal from '../components/customer/DeleteCustomerModal';

const CustomerPage = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.customers.items) || [];
    const [showModal, setShowModal] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    return (
        <div className="container mt-4">
        <h2>Customers</h2>
            <h2 className="text-white">Customers</h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setEditCustomer(null);
                    setShowModal(true);
                }}
            >
                 Add Customer
            </button>

            <table className="table table-light table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.address}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => {
                                        setEditCustomer(c);
                                        setShowModal(true);
                                    }}
                                >
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        setSelectedCustomer(c);
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

            <CustomerModal
                show={showModal}
                onClose={() => setShowModal(false)}
                editCustomer={editCustomer}
            />

            <DeleteCustomerModal
                show={deleteModal}
                onClose={() => setDeleteModal(false)}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default CustomerPage;
