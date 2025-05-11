import { Pressable, View, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

function BadgerNewsItemCard({ article }) {

    const navigation = useNavigation();
    
    //use full id to navigate on press
    const handlePress = () => {
        navigation.navigate('Article', { 
            fullArticleId: article.fullArticleId,
            title: article.title
        });
    };

    //article card
    return (
        <Pressable onPress={handlePress}>
            <View style={styles.card}>
                <Image 
                    source={{ 
                        uri: `https://raw.githubusercontent.com/CS571-S25/hw8-api-static-content/main/${article.img}`
                    }} 
                    style={styles.image}
                />
                <Text style={styles.title}>{article.title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        elevation: 4,
        borderRadius: 10,
        backgroundColor: '#c5050c', // Badger red
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginBottom: 16
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginBottom: 8
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    }
});

export default BadgerNewsItemCard;