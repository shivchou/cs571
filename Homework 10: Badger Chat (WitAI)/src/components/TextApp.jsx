import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

import TextAppMessageList from './TextAppMessageList';
import Constants from '../constants/Constants';

const CS571_WITAI_ACCESS_TOKEN = "45YLUKFBO54UG7XIU2JC2DUTVCBHFJMX"; // Put your CLIENT access token here.

function TextApp() {

    // Set to true to block the user from sending another message
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([]);
    const inputRef = useRef();

    const [resType, setResType] = useState(false);

    /**
     * Called when the TextApp initially mounts.
     */
    async function handleWelcome() {
        addMessage(Constants.Roles.Assistant, "Welcome to BadgerChat! How can I help you?");
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
            const resp = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(input), {
                headers: {
                    "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
                }
            })
            const data = await resp.json();
            console.log(data);

            const matchedName = data.intents[0]?.name;
            if (!matchedName) {
                addMessage(Constants.Roles.Assistant, "I'm sorry, I don't understand! Try to get a list of chatrooms or the latest posts! Just ask me!")
            }
            else if(matchedName === "get_chatrooms")
                {
                    console.log("chats");
                    const r = await fetch("https://cs571api.cs.wisc.edu/rest/s25/hw10/chatrooms", {
                        headers: {
                            "X-CS571-ID": CS571.getBadgerId()
                        }
                    });
                    const chats = await r.json();
                    console.log(chats);
                    if(resType)
                        {
                            addMessage(Constants.Roles.Assistant, "You can visit " + chats);
                            setResType(!resType);
                        }
                    else
                    {
                        addMessage(Constants.Roles.Assistant, "Try visiting " + chats);
                        setResType(!resType);
                    }
                } 
            else if(matchedName === "get_messages")
                {
                    console.log("msg");
                    await getMsg(data);
                }
            else
                {
                    if(resType)
                        {
                            addMessage(Constants.Roles.Assistant, "Ask me to get a list of chatrooms or the latest messages!")
                            setResType(!resType);
                        }
                    else
                    {
                        addMessage(Constants.Roles.Assistant, "Try to get a list of chatrooms or the latest posts! Just ask me!");
                        setResType(!resType);
                    }
                }
        }
        setIsLoading(false);
    }

    async function getMsg(chatData)
    {
        const hasRoom = chatData.entities["chatroom:chatroom"] ? true : false;
        const hasSpecifiedNumber = chatData.entities["wit$number:number"] ? true : false;

        const chatroom = hasRoom ? chatData.entities["chatroom:chatroom"][0].value : "";
        const numPosts = hasSpecifiedNumber ? chatData.entities["wit$number:number"][0].value : 1;

        const r = await fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw10/messages?chatroom=${chatroom}&num=${numPosts}`,{
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });

        const posts = await r.json();

        console.log(posts);

        if(resType)
            {
                posts.messages.forEach(message => {
                    console.log(message);
                    addMessage(Constants.Roles.Assistant, `${message.poster} created a post titled ${message.title} in ${message.chatroom} saying '${message.content}'`);
                });
                setResType(!resType);
            }
        else
        {
            posts.messages.forEach(message => {
                console.log(message);
                addMessage(Constants.Roles.Assistant, `'${message.content}' was posted in ${message.chatroom} by ${message.poster}.`);
            });
            setResType(!resType);
        }

        
    }

    /**
     * Adds a message to the ongoing TextAppMessageList
     * 
     * @param {string} role The role of the message; either "user" or "assistant"
     * @param {*} content The content of the message
     */
    function addMessage(role, content) {
        setMessages(o => [...o, {
            role: role,
            content: content
        }]);
    }

    useEffect(() => {
        handleWelcome();
    }, []);

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
