import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store';

function BadgerLogoutScreen(props) {

    //get rid of JWT
    const handleLogout = () => {
        SecureStore.deleteItemAsync('jwt').then(() => {
            props.onLogout();
        })
    };

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Are you sure you're done?</Text>
        <Text>Come back soon!</Text>
        <Text/>
        <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        alignItems: "center",
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
});

export default BadgerLogoutScreen;