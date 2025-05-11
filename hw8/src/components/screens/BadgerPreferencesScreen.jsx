import { Text, View, Switch, StyleSheet, ScrollView } from "react-native";
import { useContext } from "react";
import { BadgerNewsContext } from "../BadgerNewsContext";

function BadgerPreferencesScreen(props) {
    const { prefs, setPrefs, tags } = useContext(BadgerNewsContext);

    //change prefs based on toggle, should apply everywhere bc *context*
    const onToggle = (tag) => {
        setPrefs(prevPrefs => ({
            ...prevPrefs,
            [tag]: !prevPrefs[tag]
        }));
    };

    //display list of tags and toggle switches
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>News Preferences</Text>
            <Text style={styles.subtitle}>Select your preferred news tags:</Text>
            {tags.map(tag => (
                <View key={tag} style={styles.switchContainer}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <Switch
                        value={prefs[tag]}
                        onValueChange={() => onToggle(tag)}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#c5050c'
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555'
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    tagText: {
        fontSize: 18,
    }
});

export default BadgerPreferencesScreen;