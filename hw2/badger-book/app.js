let students;

fetch("https://cs571api.cs.wisc.edu/rest/s25/hw2/students",{
	headers:{
		"X-CS571-ID": CS571.getBadgerId()
	}
})
.then((d) => {
	console.log(d.status, d.statusText)
	return d.json();
})
.then(data =>{
	students = data;
	document.getElementById("num-results").textContent = students.length;
	buildStudents(data)
}
)

function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
    

    studs.forEach(student => {
        //make div for each student
        const studentCard = document.createElement('div');
		studentCard.className = "col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3";
        studentCard.style.margin = '10px';
        studentCard.style.padding = '10px';

        //name
        const name = document.createElement('h2');
        name.textContent = student.name.first + " " + student.name.last;
        studentCard.appendChild(name);
        
        //major
        const major = document.createElement('p');
        major.textContent =  "Major: " + student.major;
        studentCard.appendChild(major);
        
        //credits
        const credits = document.createElement('p');
        credits.textContent = "Credits: " + student.numCredits;
        studentCard.appendChild(credits);
        
        //from wisconsin?
        const fromWI = document.createElement('p');
		const wis = student.fromWisconsin ? "Yes" : "No";
        fromWI.textContent =  "From Wisconsin: " + wis;
        studentCard.appendChild(fromWI);
        
        //interests
        const interestsLabel = document.createElement('p');
        interestsLabel.textContent = "Interests:";
        studentCard.appendChild(interestsLabel);
        
        const interestsList = document.createElement('ul');
        student.interests.forEach(interest => {
            const interestItem = document.createElement('li');
            interestItem.textContent = interest;
            interestsList.appendChild(interestItem);
			interestItem.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;
				document.getElementById("search-interest").value = selectedText;
				document.getElementById("search-name").value = "";
				document.getElementById("search-major").value = "";
				console.log(document.getElementById("search-interest").value);
				const searchRes = students.filter(s => {
					let intMatch = s.interests.some(int => {
						let select = selectedText.toLowerCase();
						int = int.toLowerCase();
						return int.includes(select);
					})
					console.log("int match: " + intMatch);
					return intMatch;
				})
				document.getElementById('students').innerHTML = '';
				document.getElementById("num-results").textContent = searchRes.length;
				buildStudents(searchRes);
		
			})
        });
        studentCard.appendChild(interestsList);
        
        //add card
		document.getElementById("students").appendChild(studentCard);
    });
}



function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	console.log("fn call");
	const name = document.getElementById("search-name").value.toLowerCase().trim();
	console.log(name);
	const major = document.getElementById("search-major").value.toLowerCase().trim();
	console.log(major);
	const interest = document.getElementById("search-interest").value.toLowerCase().trim();
	
	const searchRes = students.filter(s => {
		let nameMatch = false;
		let majorMatch = false;
		let intMatch = false;
		if(!name && !major && !interest) return true;
		if(name)
			{
				if(name.indexOf(" ") > 0)
					{
						
							nameMatch = s.name.first.toLowerCase().includes(name.substring(0, name.indexOf(" ") ))&&
							s.name.last.toLowerCase().includes(name.substring(name.indexOf(" ") + 1));
						
					}
				else
				{
					
							nameMatch = s.name.first.toLowerCase().includes(name)||
							s.name.last.toLowerCase().includes(name);
				}
			}
		if(major)
			{
				
						majorMatch = s.major.toLowerCase().includes(major);
			}
		if(interest)
			{
				intMatch = s.interests.some(int => 
					int.toLowerCase().includes(interest)
				)
			}
		if(!major && !interest)
			{
				return nameMatch;
			}
		else if(name && major && !interest)
			{
				return nameMatch && majorMatch;
			}
		else if(name && interest && !major)
			{
				return nameMatch && intMatch;
			}
		else if(!name && !interest)
			{
				return majorMatch;
			}
		else if(!name && major && interest)
			{
				return majorMatch && intMatch;
			}
		else if (!name && !major)
			{
				return intMatch;
			}
		return nameMatch && majorMatch && intMatch;
	})
	
	document.getElementById('students').innerHTML = '';
	document.getElementById("num-results").textContent = searchRes.length;
	buildStudents(searchRes);

	
}

document.getElementById("search-btn").addEventListener("click", handleSearch);