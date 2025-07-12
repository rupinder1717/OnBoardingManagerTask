import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProduct,
    updateProduct,
    fetchProducts,
    setShowModal
} from '../../redux/productSlice';

const ProductModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedProduct } = useSelector(state => state.products);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (modalType === 'edit' && selectedProduct) {
            setName(selectedProduct.name || '');
            setPrice(selectedProduct.price?.toString() || '');
        } else {
            setName('');
            setPrice('');
        }
        setErrors({});
    }, [modalType, selectedProduct]);

    const handleClose = () => {
        dispatch(setShowModal(false));
        setErrors({});
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const numericPrice = parseFloat(price);
        const newErrors = {};

        if (!trimmedName) {
            newErrors.name = "Product name is required.";
        }

        if (price === '' || isNaN(numericPrice)) {
            newErrors.price = "Price is required and must be a valid number.";
        } else if (numericPrice <= 0) {
            newErrors.price = "Price must be greater than 0.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const product = {
            name: trimmedName,
            price: numericPrice
        };

        if (modalType === 'edit') {
            await dispatch(updateProduct({ ...selectedProduct, ...product }));
        } else {
            await dispatch(createProduct(product));
        }

        await dispatch(fetchProducts());
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Product' : 'New Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
                        </Form.Control.Feedback>
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

export default ProductModal;
