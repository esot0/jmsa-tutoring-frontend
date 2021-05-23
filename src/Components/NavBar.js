import React, {useState} from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import {verifyJWT} from '../utility'
const NavBar = (props) => {
    const jwt = verifyJWT()
    const [username, setUsername] = useState(jwt && jwt.username)
    const history = useHistory();
    const logout = (e) =>{
        e.preventDefault();
        localStorage.clear()
        history.push("/")
        setUsername(undefined)
    }
    
 
    return (
        <Navbar className="navbar" collapseOnSelect expand="lg" variant="dark">
            <LinkContainer to="/">
                <Navbar.Brand>JMSA Tutoring</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                   {username ? (
                       <div >
                    <LinkContainer style={{display:"inline"}} to="/dashboard">
                        <Nav.Link style={{display:"inline"}}> Dashboard</Nav.Link>
                    </LinkContainer>
                        <LinkContainer style={{display:"inline"}} to="/user/create_session">
                            <Nav.Link style={{display:"inline"}}>Create Session</Nav.Link>
                        </LinkContainer>

                        <LinkContainer style={{display:"inline"}} to={`/user/${username}/chat`}>
                            <Nav.Link style={{display:"inline"}}>Chat</Nav.Link>
                        </LinkContainer>

                        <Navbar.Text style={{display:"inline"}}>Signed in as:
                            <LinkContainer style={{display:"inline"}} to={`/user/${username}`}>
                            <Nav.Link style={{display:"inline"}}>{username}</Nav.Link>
                           </LinkContainer>
                        </Navbar.Text>

                        <Link to={'/'} style={{display:"inline"}} onClick={logout}>
                            <Nav.Link style={{display:"inline"}}>Logout</Nav.Link>
                        </Link>
                       </div>) : (
                    <div>
                        <LinkContainer style={{display:"inline"}} to="/sign_in">
                            <Nav.Link>Login</Nav.Link>
                        </LinkContainer>

                        <LinkContainer style={{display:"inline"}} to="/sign_up">
                            <Nav.Link>Sign Up</Nav.Link>
                        </LinkContainer>
                    </div>)}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar;