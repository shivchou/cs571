import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from '../../assets/uw-crest.svg'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {
    //check sessionStorage to see if user exists/is logged in
    const [loginStatus, setLoginStatus] = useState(() => {
        const savedUser = sessionStorage.getItem('badgerchat_user');
        return savedUser ? JSON.parse(savedUser) : undefined;
    });

    //update sessionStorage
    useEffect(() => {
        if (loginStatus) {
            sessionStorage.setItem('badgerchat_user', JSON.stringify(loginStatus));
        } else {
            sessionStorage.removeItem('badgerchat_user');
        }
    }, [loginStatus]);

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus ? (
                            <Nav.Link onClick={() => setLoginStatus(undefined)}>Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        )}
                        <NavDropdown title="Chatrooms">
                            {
                                props.chatrooms.map(chatroom =>
                                    {
                                        return <NavDropdown.Item key={chatroom} as={Link} to={`chatrooms/${chatroom}`}>{chatroom}</NavDropdown.Item>
                                    }
                                )
                            }
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;