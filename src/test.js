import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import {isLoggedIn} from './Auth'

import './Navbar.css';

export class Test extends React.Component {
    render() {
      return(<h1>Hello, asda!</h1>);
};
}




// const MyNavbar = ({ children }) => {
//     return(
//         <Navbar bg="light" expand="lg">
//         <Navbar.Brand href="#home">Pagrindinis</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="Pagrindinis">
//           <Nav className="mr-auto">
//             <Nav.Link href="#home">Auto</Nav.Link>
//             <Nav.Link href="#link">Mano Profilis</Nav.Link>
//             <NavDropdown title="Mano Paskyra" id="basic-nav-dropdown">
//               <NavDropdown.Item href="#action/3.1">Keisti informacija</NavDropdown.Item>
//               <NavDropdown.Item href="#action/3.2">Keisti nustatymus</NavDropdown.Item>
//               <NavDropdown.Item href="#action/3.3">Your Profile</NavDropdown.Item>
//             </NavDropdown>
//           </Nav>
//           <Form inline>
//             <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//           </Form>
//         </Navbar.Collapse>
//       </Navbar>
//       );
// };

// const App = () => (
//     <Container className="p-3">
//       <Jumbotron>
//         <h1 className="header">Welcome To React-Bootstrap</h1>
//         <MyNavbar>
//           We now have Toasts
//           <span role="img" aria-label="tada">
//             🎉
//           </span>
//         </MyNavbar>
//       </Jumbotron>
//     </Container>
//   );

// export default App;

