import React, { useState } from "react";
import { Button, Card, Carousel } from "react-bootstrap";

export default function BadgerBudSummary({ buddy, onSave }) {
  const [showMore, setShow] = useState(false);
  const pic = "https://raw.githubusercontent.com/CS571-S25/hw5-api-static-content/main/cats/";

  function handleShowMore() {
    setShow(!showMore);
  }

  return (
    <Card style={{ padding: "15px", textAlign: "center" }}>
      {showMore ? (
        //show carousel IFF show more is true
        <Carousel>
          {buddy.imgIds.map((imgId, index) => (
            <Carousel.Item key={index}>
              <img
                src={`${pic}${imgId}`}
                alt={`A picture of ${buddy.name} (${index + 1}/${buddy.imgIds.length})`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        //show only first pic otherwise
        <img
          src={`${pic}${buddy.imgIds[0]}`}
          alt={`A picture of ${buddy.name}`}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      
      <h3>{buddy.name}</h3>
      
      {showMore && (
        <div className="buddy-details">
          <p><strong>Gender:</strong> {buddy.gender}</p>
          <p><strong>Breed:</strong> {buddy.breed}</p>
          <p><strong>Age:</strong> {buddy.age}</p>
          {buddy.description && (
            <p><strong>Description:</strong> {buddy.description}</p>
          )}
        </div>
      )}
      
      <div>
        <Button 
          variant="secondary" 
          onClick={handleShowMore} 
          style={{ marginRight: "10px" }}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
        {onSave && (
          <Button onClick={() => onSave(buddy)}>Save</Button>
        )}
      </div>
    </Card>
  );
}