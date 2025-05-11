function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!
   
    const jobs = document.getElementsByName('job');
    
    // Find the selected job
    let selectedJob = null;
    for (let i = 0; i < jobs.length; i++) 
    {
        if (jobs[i].checked) {
            selectedJob = jobs[i].value;
            break;
        }
    }
    alert("Thank you for applying to be a " + selectedJob + "!");

}