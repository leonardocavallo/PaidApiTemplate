import { useEffect, useState } from "react";
import config from './config.js'
import { Spinner, Button, Row, Col } from "react-bootstrap";
import CardCounter from "./Components/CardCounter.jsx";
import { useNavigate } from "react-router-dom";
import AddFundsModal from "./Components/AddFundsModal.jsx";

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [addFundsAmount, setAddFundsAmount] = useState(0);
    const [addFundsAlert, setAddFundsAlert] = useState("");
    const [addFundsLoading, setAddFundsLoading] = useState(false);

    async function handleAddFunds(amount) {
        setAddFundsLoading(true);
        setAddFundsAlert("");
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${config.API_BASE}/balance/recharge`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "amount" : amount })
        });
        if (response.ok) {
            const data = await response.json();
            // Redirect to the payment URL
            console.log(data.data.payment_url);
            window.location.href = data.data.payment_url;
        } else {
            const data = await response.json();
            setAddFundsLoading(false);
            setAddFundsAlert(data.error || "An unknown error occurred");
        }
    }

    function handleLogout() {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }

    const navigate = useNavigate();

    function handleManageApiKeys() {
        navigate("/api-keys");
    }

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login"; // Redirect to login if no token
        }
        async function fetchProfile() {
            const response = await fetch(`${config.API_BASE}/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } else {
                localStorage.removeItem("access_token"); // Remove invalid token
                window.location.href = "/login"; // Redirect to login if token invalid
            }
        }
        fetchProfile();
    }, [])
    return (
        <div>
            {loading && <Spinner animation="border" />}
            {userData && (
                <div className="mt-4">
                    <h1>Welcome Back {userData.username}! 👋</h1>
                    <p className="mb-0"><strong>User ID:</strong> {userData.discord_id}</p>
                    <Button variant="danger" onClick={handleLogout} size="sm" className="mb-4 mt-2">LogOut</Button><br />
                    <Row>
                        <Col md={4}>
                            <CardCounter
                                content={`$ ${userData.balance.toFixed(2)}`}
                                handleClick={() => setShowAddFundsModal(true)}
                                buttonText="Add Funds"
                                cardText="Total Balance"
                            />
                        </Col>
                        <Col md={4}>
                            <CardCounter
                                content={userData.api_keys.length}
                                handleClick={handleManageApiKeys}
                                buttonText="Manage"
                                cardText="Active Api Keys"
                            />
                        </Col>
                    </Row>
                </div>
            )}
            <AddFundsModal
                setShow={setShowAddFundsModal}
                show={showAddFundsModal}
                handleAddFunds={(amount) => handleAddFunds(amount)}
                amount={addFundsAmount}
                setAmount={setAddFundsAmount}
                alert={addFundsAlert}
                loading={addFundsLoading}
                setLoading={setAddFundsLoading}
            />
        </div>
    );
}
export default Dashboard;