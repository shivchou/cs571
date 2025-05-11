import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerRegister() {
    const [loginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    //validate 7 digits
    const isValidPin = (pin) => {
        return /^\d{7}$/.test(pin);
    };

    //form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        //check if username and pin are entered
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }

        //confirm that pin is valid 7 digit number
        if (!isValidPin(pin) || !isValidPin(confirmPin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        //confirm that pins match
        if (pin !== confirmPin) {
            alert("Your pins do not match!");
            return;
        }
        registerUser();
    };

    //register the user
    //make POST call to API to create a new user
    //check that user does not already exist, and user was successfully created
    const registerUser = () => {
        setIsSubmitting(true);
        console.log("register user: ", username)
        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/register', {
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
            console.log(data)
            if (data.msg === "Successfully authenticated.") {
                alert("Registration successful!");
                setUsername('');
                setPin('');
                setConfirmPin('');
                navigate('/login');
            } else {
                if (data.msg.includes("already exists")) {
                    alert("That username has already been taken!");
                } else {
                    alert(data.msg || "Registration failed!");
                }
            }
        })
        .catch(err => {
            setIsSubmitting(false);
            //console.log(err);
            alert("There was an error with the registration. Please try again.");
            console.error(err);
        });
    };

    return (
        <Container>
            <h1 className="mb-4">Register</h1>
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
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPin">
                                <Form.Label>Pin (7 digits)</Form.Label>
                                <Form.Control
                                    id="pin"
                                    type="password" //for masked input
                                    placeholder="Enter your 7-digit pin"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formConfirmPin">
                                <Form.Label>Confirm Pin</Form.Label>
                                <Form.Control
                                    id="confirm pin"
                                    type="password" //masked input
                                    placeholder="Confirm your 7-digit pin"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value)}
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-100"
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            )}
        </Container>
    );
}