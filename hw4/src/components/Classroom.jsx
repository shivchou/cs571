import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import Student from "./Student";

const Classroom = () => {

    //state variables for 
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchMajor, setSearchMajor] = useState("");
    const [searchInterest, setSearchInterest] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 24;

    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Sample student data:", data[0]);
                setStudents(data);
                setFilteredStudents(data);
                // filteredStudents.map(s => {
                //     console.log(s);
                // })
            })
    }, []);

    //filter based on search
    useEffect(() => {
        const filtered = students.filter(student => {
            
            const nameSearch = searchName.trim().toLowerCase();
            const majorSearch = searchMajor.trim().toLowerCase();
            const interestSearch = searchInterest.trim().toLowerCase();

            //name matching
            const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
            
            const nameMatches = nameSearch === "" || fullName.includes(nameSearch);

            //major matching
            const majorMatches = majorSearch === "" || student.major.toLowerCase().includes(majorSearch);

            //interest matching
            const interestMatches = interestSearch === "" || student.interests.some(
                interest => interest.toLowerCase().includes(interestSearch)
            );

            return nameMatches && majorMatches && interestMatches;
        });

        setFilteredStudents(filtered);
        setCurrentPage(1); 
    }, [searchName, searchMajor, searchInterest, students]);

    //reset search
    const handleReset = () => {
        setSearchName("");
        setSearchMajor("");
        setSearchInterest("");
        setCurrentPage(1); 
    };

    //perv/next page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    //get students on current page
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item 
                key={number} 
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    //see if prev/next should be disabled
    const prevDisabled = currentPage === 1 || totalPages === 0;
    const nextDisabled = currentPage === totalPages || totalPages === 0;

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control 
                id="searchName" 
                value={searchName}
                //search without button
                onChange={(e) => setSearchName(e.target.value)}
            />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control 
                id="searchMajor" 
                value={searchMajor}
                //search without button
                onChange={(e) => setSearchMajor(e.target.value)}
            />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control 
                id="searchInterest" 
                value={searchInterest}
                //search without button
                onChange={(e) => setSearchInterest(e.target.value)}
            />
            <br />
            <Button variant="neutral" onClick={handleReset}>Reset Search</Button>
            <p>There are {filteredStudents.length} student(s) matching your search.</p>
        </Form>
        <Container fluid>
            <Row>
                {filteredStudents.map(student => (
                    console.log("numCredits value:", student.numCredits),
                    <Col xs={12} sm={12} md={6} lg={4} xl={3} key={student.id}>
                        <Student
                            key={student.id}
                            name={student.name}
                            major={student.major}
                            numCredits={student.numCredits}
                            fromWisconsin={student.fromWisconsin}
                            interests={student.interests}
                        />
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-center mt-4 mb-4">
                <Pagination>
                    <Pagination.Prev 
                        onClick={prevPage} 
                        disabled={prevDisabled}
                    />
                    {paginationItems}
                    <Pagination.Next 
                        onClick={nextPage} 
                        disabled={nextDisabled}
                    />
                </Pagination>
            </div>
        </Container>
    </div>
}

export default Classroom;