import { Text, View, Image, StyleSheet, Button } from "react-native";

export default function BadgerSaleItem(props) {

    //define attributes with props passed down from BadgerMart
    const { name, price, description, upperLimit, imgSrc, onAdd, onRemove, quantity } = props;

    return <View style={styles.container}>
    <Text style={styles.name}>{props.name}</Text>
    <Image 
        source={{ uri: imgSrc }} 
        style={styles.image}
        resizeMode="contain"
    />
    <Text style={styles.price}>Price: ${price}</Text>
    <Text style={styles.description}>{description}</Text>
    <Text style={styles.limit}>You may order up to {upperLimit} of this item.</Text>


    <View style={styles.quantityContainer}>
            <Button 
                title="-" 
                onPress={onRemove}
                disabled={quantity <= 0}
            />
            <Text style={styles.quantityText}>{quantity}</Text>
            <Button 
                title="+" 
                onPress={onAdd}
                disabled={quantity >= upperLimit}
            />
        </View>



</View>
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a9d8f',
        marginBottom: 8,
    },
    description: {
        textAlign: 'center',
        marginBottom: 8,
    },
    limit: {
        fontStyle: 'italic',
        color: '#555',
    }
});
