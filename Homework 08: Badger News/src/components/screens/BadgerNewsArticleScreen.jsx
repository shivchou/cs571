import { Text, View, StyleSheet, ScrollView, Animated, Image, Linking, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
import CS571 from '@cs571/mobile-client';

function BadgerNewsArticleScreen(props) {

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fullArticleId } = props.route.params;
    
    //animation
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    //set animation values and fetch article based on full article id
    useEffect(() => {

        scaleAnim.setValue(0.9);
        setLoading(true);

        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw8/article?id=${fullArticleId}`, {
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
        .then(response => response.json())
        .then(data => {
            setArticle(data);
            setLoading(false);
            
            //start animation
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                })
            ]).start();
        })
    }, [fullArticleId]);
    

    //open link in browser upon press
    const handlePress = () => 
    {
        Linking.openURL(article?.url);
    };


    //1) show loading screen while article is being fetched
    //2) display article image, title, byline, date, and content
    //3) have Pressable text for link to full article
    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>The content is loading!</Text>
                </View>
            ) : (
                <Animated.View 
                    style={{ 
                        transform: [{ scale: scaleAnim }] 
                    }}
                >
                    {article && (
                        
                        <View style={styles.articleContainer}>
                            <Pressable onPress={handlePress}>
                    <Text style={styles.linkText}>Read full article here.</Text>
                </Pressable>
                             <Image source={{ uri: `https://raw.githubusercontent.com/CS571-S25/hw8-api-static-content/main/${article.img}` }} style={styles.image}/>
                            <Text style={styles.title}>{article.title}</Text>
                            <View style={styles.metaContainer}>
                                <Text style={styles.author}>By: {article.author}</Text>
                                <Text style={styles.date}>
                                    {article.posted}
                                </Text>
                            </View>
                            
                            {article?.body?.map((paragraph, index) => (
                                <Text key={index} style={styles.paragraph}>
                                    {paragraph}
                                </Text>
                            ))}
                        </View>
                    )}
                </Animated.View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '500',
    },
    articleContainer: {
        marginBottom: 20,
        padding: 10,
    },
    image: {
        width: 350,
        height: 200
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#c5050c', // Badger red
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10,
    },
    author: {
        fontStyle: 'italic',
        fontSize: 16,
    },
    date: {
        color: '#666',
        fontSize: 16,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 15,
        color: '#333',
    }
});

export default BadgerNewsArticleScreen;