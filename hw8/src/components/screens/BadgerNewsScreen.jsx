import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect, useContext } from "react";
import CS571 from '@cs571/mobile-client';
import BadgerNewsItemCard from "../BadgerNewsItemCard";
import { BadgerNewsContext } from '../BadgerNewsContext'; 

function BadgerNewsScreen(props) {

    //state var changed from articles to filtered articles to reflect articles filtered by prefs
    const [filteredArticles, setFilteredArticles] = useState([]);

    //lists of prefs and articles from context
    const { prefs, articles } = useContext(BadgerNewsContext);

    //done in BadgerNews; use context
    //step 2
    // useEffect(() => {
    //     fetch('https://cs571api.cs.wisc.edu/rest/s25/hw8/articles', {
    //         headers: {
    //             'X-CS571-ID': CS571.getBadgerId()
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => setArticles(data))
    // }, []);

    //re-render IFF prefs changed
    useEffect(() => {
        const filtered = articles.filter(article => 
            article.tags.every(tag => prefs[tag] !== false)
        );
        setFilteredArticles(filtered);
    }, [prefs]);


    //check if there are any tags selected, and display warning message if no tags selected
    const hasPrefs = Object.values(prefs).some(value => value === true);

    if (!hasPrefs) {
        return (
                <Text style={styles.loadingText}>
                    No Preferences Selected! To read news articles, please select tags in the 'Preferences' tab.
                </Text>
        );
    }

    //display article cards if tags are selected
    return (
        <ScrollView style={styles.container}>
                <View style={styles.articlesList}>
                    {filteredArticles.map(article => (
                        <BadgerNewsItemCard
                            key={article.id}
                            article={article}
                        />
                    ))}
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#c5050c',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
    },
    articlesList: {
        padding: 16,
    }
});

export default BadgerNewsScreen;