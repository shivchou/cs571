import { StyleSheet, Text, View, Button, FlatList, Modal, TextInput, Alert, TouchableOpacity, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import BadgerChatMessage from '../helper/BadgerChatMessage';
import CS571 from '@cs571/mobile-client'

function BadgerChatroomScreen(props) {

    //vars for messages, chatrooms, modals (if visible, disable rest of screen), post and content, user, and refresh for pull-down refresh
    const [messages, setMessages] = useState([]);
    const {chatroomName } = props;

    const [refreshing, setRefreshing] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    //get JWT
    function getToken() {
        return SecureStore.getItemAsync('jwt').catch(error => {
            console.error('Error storing the JWT:', error);
        });
    }

    //api call to fetch messages
    const fetchMessages = useCallback(() => {
        getToken().then(token => {
            fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw9/messages?chatroom=${chatroomName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CS571-ID': CS571.getBadgerId(),
                }
            }).then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } 
                else {
                    setMessages([]);
                }
                setRefreshing(false);
            })
        });
    }, [chatroomName]);

    //handle pull-down refresh by sending api req again
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMessages();
    }, [fetchMessages]);

    const handleCreatePost = () => {
        getToken()
        .then(token => {
            fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw9/messages?chatroom=${chatroomName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CS571-ID': CS571.getBadgerId(),
                },
                body: JSON.stringify({ title: postTitle, content: postContent }),
            })
            .then(response => response.json())
            .then(() => {
                Alert.alert("Success", "Your post was successfully created!");
                setPostTitle('');
                setPostContent('');
                setIsModalVisible(false);
                fetchMessages();
            });
        });
    };

    const handleDeletePost = (postId) => {
        Alert.alert("Delete Post","Are you sure you want to delete this post?", [{text: "Cancel",style: "cancel"}, { text: "OK",
            onPress: () => {
                getToken().then(token => {
                    fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw9/messages?id=${postId}`, {
                        method: 'DELETE',
                        headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-CS571-ID': CS571.getBadgerId(),
                        }
                    })
                    .then(response => response.json())
                    .then(() => {
                        Alert.alert("Success", "Successfully deleted the post!");
                        fetchMessages();
                    })
                }
            );
        }}]);
    };

    const fetchCurrentUser = () => {
        getToken().then(token => {
            fetch('https://cs571api.cs.wisc.edu/rest/s25/hw9/whoami', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CS571-ID': CS571.getBadgerId(),
                }
            })
            .then(response => response.json())
            .then(data => {
                setCurrentUser(data.user.username);
            });
        });
    };

    useEffect(() => {
        fetchMessages();
    }, [chatroomName, fetchMessages]);

    useEffect(() => {
        if (!props.isGuest) {
            fetchCurrentUser();
        }
    }, [props.isGuest]);

    //render item function for FlatList
    const renderItem = ({ item }) => (
        <BadgerChatMessage
            key={item.id}
            {...item}
            isOwnedByUser={item.poster === currentUser}
            onDelete={handleDeletePost}
        />
    );

    const EmptyListComponent = () => (
        <Text style={styles.emptyMessage}>There's nothing here!</Text>
    );

    return <View style={styles.container}>
        <FlatList
            style={styles.messagesContainer}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={EmptyListComponent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["red"]}
                />
            }
        />
        {!props.isGuest && (
            <TouchableOpacity style={[styles.addPostButton]} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>
        )}
        <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Create A Post</Text>
                    <TextInput
                        placeholder="Title"
                        style={styles.modalInput}
                        value={postTitle}
                        onChangeText={setPostTitle}
                    />
                    <TextInput
                        placeholder="Body"
                        multiline
                        style={[styles.modalInput, styles.modalBodyInput]}
                        value={postContent}
                        onChangeText={setPostContent}
                    />
                    <View style={styles.modalButtonContainer}>
                        <Button
                            title="Cancel"
                            onPress={() => setIsModalVisible(false)}
                        />
                        <Button
                            title="Create Post"
                            onPress={handleCreatePost}
                            disabled={!postTitle.trim() || !postContent.trim()}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesContainer: {
        width: '100%',
        flex: 1,
    },
    pageIndicator: {
        textAlign: 'center',
        margin: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'stretch',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalBodyInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    },
    addPostButton: {
        alignItems: "center",
        backgroundColor: "#f44336",
        padding: 12,
        width: '100%',
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    previousButton: {
        alignItems: "center",
        backgroundColor: "#04AA6D",
        padding: 12,
        width: '45%',
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    nextButton: {
        alignItems: "center",
        backgroundColor: "#008CBA",
        padding: 12,
        width: '45%',
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    }
});

export default BadgerChatroomScreen;