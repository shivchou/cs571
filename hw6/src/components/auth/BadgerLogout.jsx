import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogout() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loginStatus) {
            navigate('/');
            return;
        }

        //logout with POST call, remove user from sessionStorage
        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        })
        .then(res => res.json())
        .then(json => {
            setLoginStatus(undefined);

            sessionStorage.removeItem('badgerchat_user');
            
            setTimeout(() => {
                navigate('/');
            }, 2000);
        });
    }, [loginStatus, setLoginStatus, navigate]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}