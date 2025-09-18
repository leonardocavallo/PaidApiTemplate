import { useState } from 'react';
import { Button, Modal, Form, Alert, Spinner} from 'react-bootstrap';

function AddFundsModal({setShow, show, handleAddFunds, amount, setAmount, alert, loading, setLoading}) {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleAmountChange(e) {
        let value = e.target.value;

        // Remove leading zeros and limit to two decimals
        value = value.replace(/^0+/, '').replace(/(\.\d{2})\d+$/, '$1');

        // Prevent negative values
        if (parseFloat(value) < 0) {
            setAmount('');
            return;
        }

        // Only allow numbers and at most one decimal point
        if (!/^\d*\.?\d{0,2}$/.test(value) && value !== '') {
            return;
        }

        setAmount(parseFloat(value));
    }

    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => { e.preventDefault(); handleAddFunds(amount); }}> {/* Prevent default form submission and run handleAddFunds */}
                    <Form.Group className="mb-3" controlId="formApiLabel">
                        <Form.Label>Amount</Form.Label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>$</span>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                onChange={handleAmountChange}
                                value={amount}
                            />
                        </div>
                    </Form.Group>
                    {alert && <Alert variant="danger" className='mt-2'>{alert}</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => { handleAddFunds(amount) }} disabled={loading || !amount || amount <= 0}>
                    Pay {loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default AddFundsModal;