import { Text, View, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import BadgerSaleItem from "./BadgerSaleItem";

import CS571 from '@cs571/mobile-client'

export default function BadgerMart(props) {


    //state variables for list of items, current item, basket
    const [item, setItem] = useState([]);

    const [curr, setCurr] = useState(0);

    const [basket, setBasket] = useState({});

    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw7/items", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            setItem(data)

            //set basket to contain 0 of all items
            const initialBasket = {};
            data.forEach(item => {
                initialBasket[item.name] = 0;
            });
            setBasket(initialBasket);
        })
        .then(data => console.log(data))
    }, []);

    //handle going to previous item (prev button)
    const goToPreviousItem = () => {
        setCurr(prev => prev - 1);
    };

    //handle going to next item (next button)
    const goToNextItem = () => {
        setCurr(prev => prev + 1);
    };

    //increase count of item in basket when added
    const addItem = (itemName) => {
        setBasket(prevBasket => ({
            ...prevBasket,
            [itemName]: prevBasket[itemName] + 1
        }));
    };

    //decrease count of item in basket when (-) clicked
    const removeItem = (itemName) => {
        setBasket(prevBasket => ({
            ...prevBasket,
            [itemName]: prevBasket[itemName] - 1
        }));
    };

    //calculate total cost and total number of items in basket
    const calculateTotal = () => {
        let totalCost = 0;
        let totalItems = 0;
        
        item.forEach(item => {
            const quantity = basket[item.name] || 0;
            totalCost += quantity * item.price;
            totalItems += quantity;
        });
        
        return {
            cost: totalCost.toFixed(2),
            items: totalItems
        };
    }

    const totals = calculateTotal();

    //handle placing order
    const placeOrder = () => {
        Alert.alert(
            "Order Confirmed!",
            `Your order contains ${totals.items} items and costs $${totals.cost}!`
        );
        
        //reset basket to empty
        const resetBasket = {};
        item.forEach(item => {
            resetBasket[item.name] = 0;
        });
        setBasket(resetBasket);
        
        //return to first item
        setCurr(0);
    };

    return <View>
        <Text style={{fontSize: 28, textAlign: 'center'}}>Welcome to Badger Mart!</Text>
       
        <Button 
            title="Previous" 
            onPress={goToPreviousItem} 
            disabled={curr === 0} 
        />
        <Text style={{ textAlign: 'center' }}>
           Item {curr + 1} of {item.length}
        </Text>
         <Button 
            title="Next" 
            onPress={goToNextItem} 
            disabled={curr === item.length - 1} 
        />

        {item.length > 0 ? (
                <View>
                    <BadgerSaleItem 
                        name={item[curr].name}
                        price={item[curr].price.toFixed(2)}
                        description={item[curr].description}
                        upperLimit={item[curr].upperLimit}
                        imgSrc={item[curr].imgSrc}
                        onAdd={() => addItem(item[curr].name)}
                        onRemove={() => removeItem(item[curr].name)}
                        quantity={basket[item[curr].name] || 0}
                    />
                       
                </View>
            ) : (
                <Text style={{textAlign: 'center'}}>No items available</Text>
            )}

            <Text >
                You have {totals.items} items costing ${totals.cost} in your cart!
            </Text>

            <Button 
                title="Place Order" 
                onPress={placeOrder}
                disabled={totals.items === 0}
                color="#2a9d8f"
            />
    </View>
}