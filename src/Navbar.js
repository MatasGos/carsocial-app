import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import {UserRole} from './Auth'
import { ReactComponent as HomeIcon } from './icon.svg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import './Navbar.css';

export class MyNavbar extends React.Component {
    render() {
        let role = UserRole();
        if (role === 2){
        return (
        <Navbar bg="dark " variant="dark" className="mr-auto" expand="lg" >
          <Nav.Link as={Link} to="/"><HomeIcon height={20}/></Nav.Link>
        <Navbar.Brand as={Link} to="/">Pagrindinis</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="Pagrindinis">
          <Nav className="mr-auto">
             <Nav.Link as={Link} to="/auto">Auto</Nav.Link>
          </Nav>
          <Nav>
          <NavDropdown title="Mano Paskyra" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/user">Peržiūreti informaciją</NavDropdown.Item>
              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/logout">Atsijungti</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/logout">Atsijungti</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Navbar>
      )
     }else if (role === 1){
        return (
            <Navbar bg="dark " variant="dark" expand="lg" >
              <Nav.Link as={Link} to="/"><HomeIcon height={20}/></Nav.Link>
        <Navbar.Brand as={Link} to="/">Pagrindinis</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="Pagrindinis">
          <Nav className="mr-auto">
          <Nav.Link as={Link} to="/auto">Auto</Nav.Link>
            
          </Nav>
          <Nav>
          <NavDropdown title="Mano Paskyra" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/user">Peržiūreti informaciją</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">Atsijungti</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/logout">Atsijungti</Nav.Link>
            </Nav>
        </Navbar.Collapse>
      </Navbar>
          )
        }else{
        return (
            <Navbar bg="dark " variant="dark" expand="lg" >
              <Nav.Link as={Link} to="/"><HomeIcon height={20}/></Nav.Link>
            <Navbar.Brand as={Link} to="/">Pagrindinis</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="Pagrindinis">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/auto">Auto</Nav.Link>
                
              </Nav>
              <Nav>
              <Nav.Link as={Link} to="/login">Prisijungti</Nav.Link>
              <Nav.Link as={Link} to="/signup">Registruotis</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          )
      };
};
}
const App = () => (
    <Container className="p-3">
      <Jumbotron> 
        <MyNavbar>
          We now have Toasts
          <span role="img" aria-label="tada">
            🎉
          </span>
        </MyNavbar>
      </Jumbotron>
    </Container>)

export default App;




