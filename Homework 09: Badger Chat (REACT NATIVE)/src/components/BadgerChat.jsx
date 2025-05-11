import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import { Alert } from 'react-native';
import CS571 from '@cs571/mobile-client'

const ChatDrawer = createDrawerNavigator();

export default function App() {

  //state vars to track login status, chatrooms, and registration
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

   function getToken() {
    return SecureStore.getItemAsync('jwt').catch(error => {
      console.error('Error storing the JWT:', error);
    });
  }
  
  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    // setChatrooms(["Hello", "World"]) // for example purposes only!

    //get posts without auth
    if (isGuest && !isLoggedIn) {
      fetch('https://cs571api.cs.wisc.edu/rest/s25/hw9/chatrooms', {
        method: 'GET',
        headers: {
          'X-CS571-ID': CS571.getBadgerId(),
        },
      })
      .then(response => response.json()).then(data => {
        if (Array.isArray(data)) {
          setChatrooms(data);
        } 
      });
    } 
    //if logged in, send api req with token
    else if (isLoggedIn) {
      getToken().then(token => {
        if (token) {
          fetch('https://cs571api.cs.wisc.edu/rest/s25/hw9/chatrooms', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-CS571-ID': CS571.getBadgerId(),
            },
          })
          .then(response => response.json()).then(data => {
            if (Array.isArray(data)) {
              setChatrooms(data);
            }
          })
        }
      });
    }
  }, [isLoggedIn, isGuest]);

  //send api req with login details, get JWT
  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    // setIsLoggedIn(true); // I should really do a fetch to login first!
    fetch('https://cs571api.cs.wisc.edu/rest/s25/hw9/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        username: username,
        pin: password
       })
    })
    .then(response => {
      //check api response for login, check status and message if not
      if (!response.ok) {
        return response.json()
        .then(data => {
          console.log(data);
          console.log(response.status);
          Alert.alert("Login error", data.msg);
        return;
        });
      }
      return response.json();
    })
    .then(data => {
      SecureStore.setItemAsync('jwt', data.token)
      setIsLoggedIn(true);
    });
  }

  //send api req with registration info, get JWT
  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    // setIsLoggedIn(true); // I should really do a fetch to register first!
    //api call to register with username and pin
    fetch('https://cs571api.cs.wisc.edu/rest/s25/hw9/register', {
      method: 'POST',

      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        username: username,
        pin: password
       })
    })
    .then(response => {
      return response.json().then(data => {
        return { status: response.status, body: data };
      });
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        console.log(body);
        console.log(status);
        Alert.alert("Registration Error", body.msg);
        return;
      }
      SecureStore.setItemAsync('jwt', body.token)
      setIsLoggedIn(true);
    });
  }
  
  //handle logout: set state vars accordingly
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    console.log(isGuest, isLoggedIn, isRegistering);
  };

  //handle guest: set state vars accordingly
  const handleGuestAccess = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
    console.log(isGuest);
  };

//if logged in, show logout option in drawer
  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map(chatroomName => (
            <ChatDrawer.Screen key={chatroomName} name={chatroomName}>
              {(props) => <BadgerChatroomScreen {...props} chatroomName={chatroomName} isGuest={false} />}
            </ChatDrawer.Screen>
          ))}
          <ChatDrawer.Screen name="Logout">
            {() => <BadgerLogoutScreen onLogout={handleLogout} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } 
  else if (isRegistering) {
    return (
      <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} handleLogin={handleLogin} />
    );
  } 
  //if guest, show sign up option in drawer
  else if (isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
        <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map(chatroomName => (
              <ChatDrawer.Screen key={chatroomName} name={chatroomName}>
                {(props) => <BadgerChatroomScreen {...props} chatroomName={chatroomName} isGuest={true} />}
              </ChatDrawer.Screen>
            ))}
          <ChatDrawer.Screen name="Signup">
            {() => <BadgerConversionScreen setIsRegistering={setIsRegistering} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } 
  else{
    return (
    <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuestAccess={handleGuestAccess} />
  );
}
  
}