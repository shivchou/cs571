import { useState } from 'react';
import { Card, Button, Table } from 'react-bootstrap';


export default function FeaturedItem(props) {
    const [showNutrition, setShowNutrition] = useState(false);
    return <Card className="text-center" style={{ maxWidth: "30rem", margin: "auto", padding: "1rem" }}>
        <img 
            src={props.img} 
            alt={props.name}
            style={{maxWidth: "200px", margin: "auto" }}
        />
        <h3>{props.name}</h3>
        <p>${props.price.toFixed(2)}</p>
        <p>{props.description}</p>
        <Button 
                    variant="secondary" 
                    onClick={() => setShowNutrition(!showNutrition)}
                    className="w-100"
                    style={{ backgroundColor: "green" }}
                >
                    {showNutrition ? "Hide Nutrition Facts" : "Show Nutrition Facts"}
                </Button>
        {showNutrition && (
            <Table style={{ margin: "auto" }}>
                <thead>
                    <tr>
                        <th>Calories</th>
                        <th>Fat</th>
                        <th>Carbohydrates</th>
                        <th>Protein</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.nutrition.calories}</td>
                        <td>{props.nutrition.fat || "0g"}</td>
                        <td>{props.nutrition.carbohydrates || "0g"}</td>
                        <td>{props.nutrition.protein || "0g"}</td>
                    </tr>
                </tbody>
            </Table> 
        )}
    </Card>
}