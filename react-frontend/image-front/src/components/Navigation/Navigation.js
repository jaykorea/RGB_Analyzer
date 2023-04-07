import React, { createFactory, useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Navigation.css';

const Navigation = () => {
    return (
            <Navbar bg="dark" variant="dark" className="mb-3">
                <Navbar.Brand href="/home">RGB Analyzer</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                    <Nav.Link href="/list">Analysis History</Nav.Link>
                </Nav>
                <div className="license">
                    <p>&copy; 2023 jaycho@korea.ac.kr. All rights reserved.</p>
                </div>
            </Navbar>
    );
}

export default Navigation;
