import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import BadgerNewsScreen from "../screens/BadgerNewsScreen.jsx";
import BadgerPreferencesScreen from "../screens/BadgerPreferencesScreen.jsx";
import BadgerNewsStack from '../BadgerNewsStack.jsx';



function BadgerTabs(props) {

    const tab = createBottomTabNavigator();

    return (
            <tab.Navigator>
                <tab.Screen 
                    name="News" 
                    component={BadgerNewsStack} 
                    options={{
                        tabBarIcon: () => (
                            <MaterialIcons name="article"/>
                        ),
                    }}
                />
                <tab.Screen 
                    name="Preferences" 
                    component={BadgerPreferencesScreen} 
                    options={{
                        tabBarIcon: () => (
                            <MaterialIcons name="settings"/>
                        ),
                    }}
                />
            </tab.Navigator>
    );
}

export default BadgerTabs;