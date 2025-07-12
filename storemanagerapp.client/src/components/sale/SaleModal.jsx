import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
    createSale,
    updateSale,
    fetchSale,
    setShowModal
} from '../../redux/saleSlice';

import { fetchCustomers } from '../../redux/customerSlice';
import { fetchProducts } from '../../redux/productSlice';
import { fetchStores } from '../../redux/storeSlice';

const SaleModal = () => {
    const dispatch = useDispatch();

    // Get sale modal state
    const { showModal, modalType, selectedSale } = useSelector(state => state.sale);

    const customers = useSelector(state => state.customers.customers);
    const products = useSelector(state => state.products.products);
    const stores = useSelector(state => state.stores.stores);


    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [dateSold, setDateSold] = useState('');

    // Load dropdown data when modal opens
    useEffect(() => {
        if (showModal) {
            dispatch(fetchCustomers());
            dispatch(fetchProducts());
            dispatch(fetchStores());
        }
    }, [dispatch, showModal]);

    // Populate form for edit
    useEffect(() => {
        if (modalType === 'edit' && selectedSale) {
            setCustomerId(selectedSale.customerId);
            setProductId(selectedSale.productId);
            setStoreId(selectedSale.storeId);
            setDateSold(selectedSale.dateSold.slice(0, 10)); // format: yyyy-mm-dd
        } else {
            setCustomerId('');
            setProductId('');
            setStoreId('');
            setDateSold('');
        }
    }, [modalType, selectedSale]);

    const handleClose = () => dispatch(setShowModal(false));

    const handleSubmit = async () => {
        if (!customerId || !productId || !storeId || !dateSold) {
            alert("Please fill out all fields.It is mandatory");
            return;
        }

        const sale = { customerId, productId, storeId, dateSold };

        if (modalType === 'edit') {
            await dispatch(updateSale({ ...selectedSale, ...sale }));
        } else {
            await dispatch(createSale(sale));
        }

        await dispatch(fetchSale());
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Sale' : 'New Sale'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Customer</Form.Label>
                        <Form.Select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            required
                        >
                            <option value="">Select Customer</option>
                            {Array.isArray(customers) && customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Product</Form.Label>
                        <Form.Select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            required
                        >
                            <option value="">Select Product</option>
                            {Array.isArray(products) && products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Store</Form.Label>
                        <Form.Select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            required
                        >
                            <option value="">Select Store</option>
                            {Array.isArray(stores) && stores.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Date Sold</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateSold}
                            onChange={(e) => setDateSold(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="success" onClick={handleSubmit}>
                    {modalType === 'edit' ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaleModal;
