import { useEffect, useState } from "react";
import config from './config.js'
import { Spinner, Card, Button } from "react-bootstrap";
import CreateKeyModal from "./Components/CreateKeyModal.jsx";
import ShowKeyModal from "./Components/ShowKeyModal.jsx";
import DeleteKeyModal from "./Components/DeleteKeyModal.jsx";
import { Trash } from 'react-bootstrap-icons';

function ApiKeys() {
    const [apikeysData, setApikeysData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newApiKeyLabel, setNewApiKeyLabel] = useState("");
    const [alert, setAlert] = useState("");

    const [showKeyModal, setShowKeyModal] = useState(false);
    const [apiKey, setApiKey] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteApiKeyId, setDeleteApiKeyId] = useState(null);

    async function handleDeleteApiKey(id) {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${config.API_BASE}/apikey/delete`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "id": id })
        });
        if (response.ok) {
            setApikeysData((prevData) => prevData.filter((key) => key._id !== id)); // Update state to remove deleted key immediately without refresh
        } else {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }
    }

    async function handleCreateApiKey(label) {
        if (label.trim() === "") {
            setAlert("Label cannot be empty");
            return;
        }
        if (label.length > 20) {
            setAlert("Label is too long (max 20 characters)");
            return;
        }

        const token = localStorage.getItem("access_token");
        const response = await fetch(`${config.API_BASE}/apikey/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "label": label })
        });
        if (response.ok) {
            const newKey = await response.json();
            setApiKey(newKey.api_key);
            setShowModal(false);
            setShowKeyModal(true);
            setApikeysData((prevData) => [...prevData, { label: newApiKeyLabel, _id: newKey.id }]); // Append new key to existing list without refresh

            // Reset form state
            setNewApiKeyLabel("");
            setAlert("");
        } else {
            if (response.status === 400) {
                const data = await response.json();
                setAlert(data.error);
                return;
            } else {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
            }
        }
    }



    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login"; // Redirect to login if no token
        }
        async function fetchApiKeys() {
            const response = await fetch(`${config.API_BASE}/apikey/list`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setApikeysData(data.api_keys);
                setLoading(false);
            } else {
                localStorage.removeItem("access_token"); // Remove invalid token
                window.location.href = "/login"; // Redirect to login if token invalid
            }
        }
        fetchApiKeys();
    }, []);

    return (
        <div>
            {loading && <Spinner animation="border" />}
            {apikeysData && (
                <div className="mt-4">
                    <h1>Your API Keys</h1>
                    <Button variant="primary" onClick={() => setShowModal(true)}>+</Button><br />
                    {apikeysData.length === 0 && <p className="mt-4">You have no API keys. Please create one.</p>}
                    {apikeysData.map((key) => (
                        <Card
                            style={{ width: '18rem', marginTop: '1rem', marginRight: '1rem', display: 'inline-block' }}
                            key={key._id}
                        >
                            <Card.Body>
                                <Card.Title>{key.label}</Card.Title>
                                <Card.Text>
                                    <strong>ID:</strong> {key._id}
                                </Card.Text>
                                <Button variant="danger" onClick={() => { setShowDeleteModal(true); setDeleteApiKeyId(key._id); }}>Delete <Trash /></Button>
                            </Card.Body>
                        </Card>
                    ))}
                    <CreateKeyModal
                        setShow={setShowModal}
                        show={showModal}
                        handleCreateApiKey={handleCreateApiKey}
                        label={newApiKeyLabel}
                        setLabel={setNewApiKeyLabel}
                        alert={alert}
                    />
                    <ShowKeyModal
                        show={showKeyModal}
                        setShow={setShowKeyModal}
                        apiKey={apiKey}
                    />
                    <DeleteKeyModal
                        show={showDeleteModal}
                        setShow={setShowDeleteModal}
                        handleDeleteApiKey={() => handleDeleteApiKey(deleteApiKeyId)}
                    />
                </div>
            )}
        </div>
    )
}

export default ApiKeys;