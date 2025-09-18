import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom'
import Login from './Login.jsx'
import Callback from './Callback.jsx'
import Dashboard from './Dashboard.jsx'
import { Container, Navbar } from "react-bootstrap";
import ApiKeys from './ApiKeys.jsx'
import { Key } from 'react-bootstrap-icons';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/dashboard">Paid Api Template</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="ms-auto d-flex">
                <Link to="/dashboard" className="btn btn-outline-primary me-2">Dashboard</Link>
                <Link to="/api-keys" className="btn btn-primary">API Keys <Key /></Link>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />}/>  {/* Redirect root to dashboard */}
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  )
}

export default App
