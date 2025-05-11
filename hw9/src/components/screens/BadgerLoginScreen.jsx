import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from 'react';

function BadgerLoginScreen(props) {

    //state vars for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    //handle login when login button pressed
    const onLogin = () => {
        if (!username || !password) {
            Alert.alert("Error", "Username and password are required.");
            return;
        }
        props.handleLogin(username, password);
    };

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text style={styles.label}>Username</Text>
        <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            keyboardType="number-pad"
            maxLength={7}
            secureTextEntry
            style={styles.input}
        />
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.optionButtonsContainer}>
            <TouchableOpacity style={styles.signupButton} onPress={() => props.setIsRegistering(true)}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={props.handleGuestAccess}>
                <Text style={styles.buttonText}>Continue As Guest</Text>
            </TouchableOpacity>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        marginBottom: 30,
        fontWeight: '600',
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    loginButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginVertical: 20,
        minWidth: 120,
        alignItems: 'center',
    },
    optionButtonsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '70%',
        marginTop: 20,
    },
    signupButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
    },
    guestButton: {
        backgroundColor: 'green',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});
export default BadgerLoginScreen;