import { useState } from 'react';
import { Button, Modal, Form, Alert} from 'react-bootstrap';

function CreateKeyModal({setShow, show, handleCreateApiKey, label, setLabel, alert}) {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleApiLabelChange(e) {
        setLabel(e.target.value);
    }

    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create API Key</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => { e.preventDefault(); handleCreateApiKey(label); }}> {/* Prevent default form submission and run handleCreateApiKey */}
                    <Form.Group className="mb-3" controlId="formApiLabel">
                        <Form.Label>Label</Form.Label>
                        <Form.Control type="text" placeholder="Example: MyAPIKey" onChange={handleApiLabelChange} />
                    </Form.Group>
                    {alert && <Alert variant="danger" className='mt-2'>{alert}</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => { handleCreateApiKey(label) }}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
        </>
  );
}

export default CreateKeyModal;