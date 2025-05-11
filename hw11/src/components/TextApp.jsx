import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

import TextAppMessageList from './TextAppMessageList';
import Constants from '../constants/Constants';

function TextApp(props) {

    // Set to true to block the user from sending another message
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef();

    //state var for messages persisted to local storage
    const [messages, setMessages] = useState(() => {
        const stored = localStorage.getItem("messages");
        return stored ? JSON.parse(stored) : [];
    });

    //state var for persona persisted to local storage
    const [storedPersona, setStoredPersona] = useState(() => {
        const stored = localStorage.getItem("persona");
        return stored ? JSON.parse(stored) : props.persona;
    });

    //update local storage when messages change
    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    //update local storage when persona changes
    useEffect(() => {
        localStorage.setItem("persona", JSON.stringify(storedPersona));
    }, [storedPersona]);


    /**
     * Called when the TextApp initially mounts.
     */
    async function handleWelcome() {
        setMessages([]);
        // if (messages.length === 0) {
            addMessage(Constants.Roles.Developer, props.persona.prompt);
            addMessage(Constants.Roles.Assistant, props.persona.initialMessage);    
            console.log(props.persona)        
       // }
    }

    /**
     * Called whenever the "Send" button is pressed.
     * @param {Event} e default form event; used to prevent from reloading the page.
     */
    async function handleSend(e) {
        e?.preventDefault();
        const input = inputRef.current.value?.trim();
        setIsLoading(true);
        if(input) {
            addMessage(Constants.Roles.User, input);
            inputRef.current.value = "";
            const resp = await fetch("https://cs571api.cs.wisc.edu/rest/s25/hw11/completions-stream", {
                method: "POST",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([...messages, {
                    role: Constants.Roles.User,
                    content: input
                }])
            });
    
            const reader = resp.body.getReader();
            const decoder = new TextDecoder("utf-8");
    
            let unparsedLine = "";
            let constructedString = "";

            //add a new assistant message
            setMessages(oldMessages => [...oldMessages, {
                role: Constants.Roles.Assistant,
                content: ""
            }]);

            //update as response streams back
            //also, from ICE voicedev 2 - https://github.com/CS571-S25/ice-voicedev2 
            let done = false;
            while (!done) {
                 const respObj = await reader.read();
                const value = respObj.value;
                done = respObj.done;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split("\n").filter(line => line.trim() !== "");
                    for (const line of lines) {
                        try {
                            let deltaObj = JSON.parse(unparsedLine + line);
                            unparsedLine = "";
                            constructedString += deltaObj.delta;
                            setMessages(prevMessages => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = {
                                  ...updatedMessages[updatedMessages.length - 1],
                                 content: constructedString
                            };
                            console.log(updatedMessages);
                            return updatedMessages;
                        });
                        } catch (e) {
                             unparsedLine += line;
                        }
                    }
                }
            }

        }
        setIsLoading(false);
    }

    /**
     * Adds a message to the ongoing TextAppMessageList
     * 
     * @param {string} role The role of the message; either "user", "assistant", or "developer"
     * @param {*} content The content of the message
     */
    function addMessage(role, content) {
        setMessages(o => [...o, {
            role: role,
            content: content
        }]);
    }

    useEffect(() => {
        // console.log("messages ", messages.length);
        // console.log("after setmessages ", messages.length);
        setStoredPersona(props.persona);
        handleWelcome();
    }, [props.persona]);

    return (
        <div className="app">
            <TextAppMessageList messages={messages}/>
            {isLoading ? <BeatLoader color="#36d7b7"/> : <></>}
            <div className="input-area">
                <Form className="inline-form" onSubmit={handleSend}>
                    <Form.Control
                        ref={inputRef}
                        style={{ marginRight: "0.5rem", display: "flex" }}
                        placeholder="Type a message..."
                        aria-label='Type and submit to send a message.'
                    />
                    <Button type='submit' disabled={isLoading}>Send</Button>
                </Form>
            </div>
        </div>
    );
}

export default TextApp;
