import { useState } from 'react';
import { Button, Modal, Alert} from 'react-bootstrap';

function DeleteKeyModal({setShow, show, handleDeleteApiKey}) {

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Do you really want to delete this API key?</p>
                <Alert variant="danger" className='mt-2'>This action cannot be undone! Your apps that use this API key will stop working.</Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={() => { handleDeleteApiKey(); handleClose(); }}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
        </>
  );
}

export default DeleteKeyModal;