import React, { useRef, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    //uncontrolled --> useRef
    const usernameRef = useRef();
    const pinRef = useRef();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    //validate 7 digits
    const isValidPin = (pin) => {
        return /^\d{7}$/.test(pin);
    };

    //form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const username = usernameRef.current.value;
        const pin = pinRef.current.value;

        // Confirm both username and pin are entered
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        // Check if valid pin
        if (!isValidPin(pin)) {
            alert("Your pin is a 7-digit number!");
            return;
        }
        loginUser(username, pin);
    };

    //make POST call for login
    const loginUser = (username, pin) => {
        setIsSubmitting(true);

        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': CS571.getBadgerId()
            },
            credentials: 'include', 
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        })
        .then(res => res.json())
        .then(data => {
            setIsSubmitting(false);
            
            if (data.msg === "Successfully authenticated.") {
                //success
                alert("Login successful!");
                //update login status
                setLoginStatus({ username: username });
                usernameRef.current.value = '';
                pinRef.current.value = '';
                navigate('/');
            } else {
                //in case of failure
                alert("Incorrect username or pin!");
            }
        })
        .catch(err => {
            setIsSubmitting(false);
            alert("There was an error with the login. Please try again.");
            console.error(err);
        });
    };

    return (
        <Container>
            <h1 className="mb-4">Login</h1>
            {loginStatus ? (
                <div>
                    <p>You are already logged in as {loginStatus.username}!</p>
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/')}
                    >
                        Return Home
                    </Button>
                </div>
            ) : (
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    ref={usernameRef}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPin">
                                <Form.Label>Pin</Form.Label>
                                <Form.Control
                                    id="pin"
                                    type="password" //masked password
                                    placeholder="Enter your 7-digit pin"
                                    ref={pinRef}
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-100"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            )}
        </Container>
    );
}