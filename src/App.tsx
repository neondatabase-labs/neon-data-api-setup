import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Wizard from './Wizard';

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3" fixed="top">
        <Container fluid>
          <Navbar.Brand href="#home">Neon Data API</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#home">Home</Nav.Link> */}
            </Nav>
            <Nav className="ms-auto">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton showName />
              </SignedIn>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container className="mt-5">
        <SignedIn>
          <Wizard />
        </SignedIn>
      </Container>
    </div>
  );
}

export default App;
