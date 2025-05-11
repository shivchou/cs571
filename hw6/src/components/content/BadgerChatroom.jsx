import React, { useEffect, useState, useContext } from "react"
import { Container, Row, Col, Pagination, Form, Button, Card } from "react-bootstrap"
import BadgerMessage from "/src/components/content/BadgerMessage.jsx"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {
    const [loginStatus] = useContext(BadgerLoginStatusContext);
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState('');

    const loadMessages = (page) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    //get current user information when logged in
    useEffect(() => {
        if (loginStatus) {
            fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/whoami', {
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                },
                credentials: 'include'
            }).then(res => res.json())
              .then(data => {
                  if (data.user && data.user.username) {
                      setCurrentUser(data.user.username);
                  }
              })
              .catch(err => console.error(err));
        } else {
            setCurrentUser('');
        }
    }, [loginStatus]);

    //Why can't we just say []?
    //The BadgerChatroom doesn't unload/reload when switching
    //chatrooms, only its props change! Try it yourself.
    useEffect(() => {
        loadMessages(page);
    }, [props.name, page]);

    //handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    //handle post submission
    const handleSubmit = (e) => {
        e.preventDefault();

        //validate inputs
        if (!title || !content) {
            alert("You must provide both a title and content!");
            return;
        }

        setIsSubmitting(true);

        //create post through POST call
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': CS571.getBadgerId()
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                content: content
            })
        })
        .then(res => res.json())
        .then(data => {
            setIsSubmitting(false);
            if (data.msg === "Successfully posted message!") {
                alert("Successfully posted!");
                setTitle('');
                setContent('');
                loadMessages(page);
            } else {
                alert(data.msg || "Failed to post message!");
            }
        })
        .catch(err => {
            setIsSubmitting(false);
            alert("There was an error posting your message. Please try again.");
            console.error(err);
        });
    };

    // Handle post deletion
    const handleDelete = (messageId) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?id=${messageId}&chatroom=${props.name}`, {
            method: 'DELETE',
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.msg === "Successfully deleted message!") {
                alert("Successfully deleted the post!");
                //reload messages to reflect deletion
                loadMessages(page);
            } else {
                alert(data.msg || "Failed to delete message!");
            }
        })
        .catch(err => {
            alert("There was an error deleting your message. Please try again.");
            console.error(err);
        });
    };

    return <>
        <h1>{props.name} Chatroom</h1>
        
        {/*create post*/}
        <Card className="mb-3">
            <Card.Body>
                {loginStatus ? (
                    <>
                        <Card.Title>Create a New Post</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="postTitle">
                                <Form.Label>Post Title</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="postContent">
                                <Form.Label>Post Content</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    placeholder="Enter content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Post...' : 'Create Post'}
                            </Button>
                        </Form>
                    </>
                ) : (
                    <Card.Text>You must be logged in to post!</Card.Text>
                )}
            </Card.Body>
        </Card>
        
        <hr/>
        
        {
            messages.length > 0 ?
            <>
            { 
                <Container fluid>
                <Row>
                    {messages.map(message => (
                        <Col key={message.id} xs={12} md={6} lg={4} xl={3}>
                            <BadgerMessage
                                id={message.id}
                                title={message.title}
                                poster={message.poster}
                                content={message.content}
                                created={message.created}
                                isOwner={loginStatus && message.poster === currentUser}
                                onDelete={handleDelete}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
            }
        </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
       
       <div className="d-flex justify-content-center mt-4">
            <Pagination>
                <Pagination.Item 
                    key={1} 
                    active={page === 1}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Pagination.Item>
                <Pagination.Item 
                    key={2} 
                    active={page === 2}
                    onClick={() => handlePageChange(2)}
                >
                    2
                </Pagination.Item>
                <Pagination.Item 
                    key={3} 
                    active={page === 3}
                    onClick={() => handlePageChange(3)}
                >
                    3
                </Pagination.Item>
                <Pagination.Item 
                    key={4} 
                    active={page === 4}
                    onClick={() => handlePageChange(4)}
                >
                    4
                </Pagination.Item>
            </Pagination>
        </div>
        
    </>
}