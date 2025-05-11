import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Card, Button } from "react-bootstrap";
import BadgerBudsDataContext from "/src/contexts/BadgerBudsDataContext.js";


export default function BadgerBudsBasket(props) {
    const buddies = useContext(BadgerBudsDataContext);
   const [savedCatIds, setSavedCatIds] = useState([]);
   const [adoptedCatIds, setAdoptedCatIds] = useState([]);
   
   
   useEffect(() => {
     //load saved and adopted ids on mount
     const savedIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
     const adoptedIds = JSON.parse(sessionStorage.getItem('adoptedCatIds')) || [];
     setSavedCatIds(savedIds);
     setAdoptedCatIds(adoptedIds);
   }, []);
 
   //filter out cats whose ids have been saved
   const filteredCats = buddies.filter(buddy => savedCatIds.includes(buddy.id) && !adoptedCatIds.includes(buddy.id));

   const handleUnselect = (buddy) => {
    //remove cat id from saved ids
    const updatedSavedIds = savedCatIds.filter(id => id !== buddy.id);
    setSavedCatIds(updatedSavedIds);
    
    //update storage
    sessionStorage.setItem('savedCatIds', JSON.stringify(updatedSavedIds));
    
    alert(`${buddy.name} has been removed from your basket!`);
};

// Handle adopting a buddy
const handleAdopt = (buddy) => {

   //add cat id to adopted list
    const updatedAdoptedIds = [...adoptedCatIds, buddy.id];
    setAdoptedCatIds(updatedAdoptedIds);

    //update storage
    sessionStorage.setItem('adoptedCatIds', JSON.stringify(updatedAdoptedIds));

    //remove cat id from saved ids
    const updatedSavedIds = savedCatIds.filter(id => id !== buddy.id);
    setSavedCatIds(updatedSavedIds);
    
    //update storage
    sessionStorage.setItem('savedCatIds', JSON.stringify(updatedSavedIds));
    
    alert(`Congratulations! You have adopted ${buddy.name}!`);
};
 
    return <div>
        <h1>Badger Buds Basket</h1>
        <p>These cute cats could be all yours!</p>
        <Row>
        {filteredCats.map(buddy => (
            //use new div or BadgerBudSummary?
                    <Col xs={12} sm={12} md={6} lg={4} xl={3} key={buddy.id}>
                        <Card style={{ padding: "15px", textAlign: "center", marginBottom: "20px" }}>
                            <img 
                                src={`https://raw.githubusercontent.com/CS571-S25/hw5-api-static-content/main/cats/${buddy.imgIds[0]}`} 
                                alt={`pic of ${buddy.name}`} 
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                            <h3>{buddy.name}</h3>
                            <div>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => handleUnselect(buddy)} 
                                    style={{ marginRight: "10px" }}
                                >
                                    Unselect
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={() => handleAdopt(buddy)}
                                >
                                    Adopt
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
        </Row>
        {filteredCats.length === 0 && (
            <p>You have no buds in your basket!</p>
            )}
    </div>
  
 }