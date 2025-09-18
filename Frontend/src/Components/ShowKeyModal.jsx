import { useState } from 'react';
import { Button, Modal, Form, Alert} from 'react-bootstrap';

function ShowKeyModal({setShow, show, apiKey}) {

    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true);

    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>API Key Created</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Your API key has been created successfully. Please copy and store it securely, as it will not be shown again.

                <Alert variant="info" className='mt-2'>Your API key is: <br /><strong style={{ wordBreak: 'break-all' }}>{apiKey}</strong></Alert>

                <Alert variant="warning" className='mt-2'>Make sure to copy your API key now. You won't be able to see it again!</Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
  );
}

export default ShowKeyModal;