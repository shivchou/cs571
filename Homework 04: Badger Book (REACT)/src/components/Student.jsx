const Student = (props) => {
    const name = props.name.first+props.name.last;
    const major = props.major;
    
    const fromWisconsin = props.fromWisconsin;
    const numCredits = props.numCredits;
    //console.log("Credits: " + credits);
    const interests = props.interests;
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <p><strong>Major:</strong> {major}</p>
            <p><strong>Credits:</strong> {numCredits}</p>
            
            <p><strong>From Wisconsin:</strong> {fromWisconsin ? "Yes" : "No"}</p>
            <strong>Interests:</strong>
            
                <ul>
                    {interests.map(interest => (
                        <li key={interest}>{interest}</li> // Unique key per interest
                    ))}
                </ul>
        
    </div>
}

export default Student;