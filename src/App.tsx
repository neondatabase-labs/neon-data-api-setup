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
          <Navbar.Brand href="#home">Neon Data API bug bashing</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#home">Home</Nav.Link> */}
            </Nav>
            <Nav className="ms-auto">
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
        <SignedOut>
          <div>
            <h3>Welcome to the Neon Data API bug bashing</h3>
            <p>The new data api is powered by rest-broker (sometimes also called subzero). It's a multitenant rust implementation of PostgREST (rest api for postgres) deployed in each region and works as a proxy (the implementation is alos in the proxy folder of neon repo)</p>
          </div>
          <div>We would like to test the following functionality (after you have signed up and signed in):</div>
          <ul>
            <li>Create new project in staging (separate tab)</li>
            <li>Follow the steps in the wizard on this page to setup the api</li>
            <li>After setup, make a few http calls either using the sdk in the browser console or curl (there will be examples in the wizard)</li>
          </ul>
          <i>Know issues: After you've created your database schema and made rest calls, subsequent changes to the schema (new tables/columns) will not work because there is a cache. You can either setup a new project or wait for the cache to expire (10 minutes)</i>
          <div>
          <SignInButton />
          </div>
        </SignedOut>
      </Container>
    </div>
  );
}

export default App;
