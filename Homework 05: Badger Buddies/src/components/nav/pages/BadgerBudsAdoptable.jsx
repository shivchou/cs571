// pages/BadgerBudsAdoptable.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from "react-bootstrap";
import BadgerBudsDataContext from "/src/contexts/BadgerBudsDataContext.js";
import BadgerBudSummary from "/src/components/BadgerBudSummary.jsx";

export default function BadgerBudsAdoptable() {
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

  const handleSave = (buddy) => {
    //update with new id
    const updatedSavedIds = [...savedCatIds, buddy.id];
    setSavedCatIds(updatedSavedIds);
    
    //save to storage
    sessionStorage.setItem('savedCatIds', JSON.stringify(updatedSavedIds));
    
    alert(`${buddy.name} has been added to your basket!`);
  };

  //filter out cats whose ids have been saved
  const filteredCats = buddies.filter(buddy => !savedCatIds.includes(buddy.id) && !adoptedCatIds.includes(buddy.id));

  return (
    <div>
      <h1>Available Badger Buds</h1>
      <p>The following cats are looking for a loving home! Could you help?</p>
    <Row>
      {filteredCats.map(buddy => (
        <Col xs={12} sm={12} md={6} lg={4} xl={3} key={buddy.id}>
        <BadgerBudSummary
          buddy={buddy}
          //onShowMore={handleShowMore}
          onSave={handleSave}
        />
        </Col>
      ))}
       </Row>
       {filteredCats.length === 0 && (
        <p>No buds are available for adoption!</p>
      )}
    </div>
  );
 
}