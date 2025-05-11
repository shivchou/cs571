import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BadgerNewsScreen from './screens/BadgerNewsScreen';
import BadgerNewsArticleScreen from './screens/BadgerNewsArticleScreen';

function BadgerNewsStack() {

    const Stack = createNativeStackNavigator();
    
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Badger News" 
                component={BadgerNewsScreen} 
            />
            <Stack.Screen 
                name="Article" 
                component={BadgerNewsArticleScreen} 
            />
        </Stack.Navigator>
    );
}

export default BadgerNewsStack;