import { useEffect } from 'react'
import { Card, Button, Spinner} from 'react-bootstrap';
import { Discord } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();
    const [LOGIN_URL, setLoginUrl] = useState("");
    const [config, setConfig] = useState(null);

    useEffect(() => { // Every time config changes, update LOGIN_URL
        if (config) {
            const LOGIN_URL = `https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URL}&response_type=code&scope=${config.OAUTH_SCOPE}`;
            setLoginUrl(LOGIN_URL);
        }
    }, [config]);

    const handleLogin = () => {
        // Redirect to Discord login
        window.location.href = LOGIN_URL
    }

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/dashboard"); // Redirect to dashboard if already logged in
        } else {
            async function fetchConfig() {
                try {
                    const response = await fetch('/api/config');
                    const data = await response.json();
                    setConfig(data);
                    console.log('Config fetched:', data);
                } catch (error) {
                    console.error('Error fetching config:', error);
                }
            }
            fetchConfig();
        }
    }, [])

    return(
        <>
            <Card className='mt-5'>
                <Card.Body>
                    <Card.Title>Welcome to the Paid API Dashboard</Card.Title>
                    <Card.Text>
                        Please log in with your Discord account to access your dashboard and manage your API keys.
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    {config ? (
                        <Button
                            style={{ backgroundColor: '#5865F2', borderColor: '#5865F2' }}
                            onClick={handleLogin}
                        >
                            Login with Discord
                            <Discord className='mb-1 ms-2' />
                        </Button>
                    ) : (
                        <Spinner animation="border" role="status"></Spinner>
                    )}
                </Card.Footer>
            </Card>
        </>
    )
}
export default Login