import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from "react-native";
import React, { useState } from 'react';

function BadgerRegisterScreen(props) {

    //state vars for username, password, and confirmation
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //handle signup when button is pressed, check username exists and passwords match
    const onSignup = () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
    
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        props.handleSignup(username, password);
    };

    return <View style={styles.container} >
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
            secureTextEntry
            style={styles.input}
            keyboardType="number-pad"
            maxLength={7}
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            keyboardType="number-pad"
            maxLength={7}
        />
        <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.signupButton]} onPress={onSignup}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nevermindButton]} onPress={() => props.setIsRegistering(false)}>
                <Text style={styles.buttonText}>Nevermind!</Text>
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 15,
    },
    signupButton: {
        backgroundColor: 'green',  
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    nevermindButton: {
        backgroundColor: 'red', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default BadgerRegisterScreen;