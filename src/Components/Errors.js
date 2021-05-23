import { Link } from 'react-router-dom';
import React from 'react';

const Errors = (props) => {
console.log(props.error)
    const determineRendered = () => {
        switch (props.error) {
            case 401:
                return (
                <div>
                    <h1>401</h1>
                    <h2>You do not have access to this page</h2>
                    <Link to="/">Home</Link>
                </div>);
            case 404: 
                return (
                <div>
                    <h1>404</h1>
                    <h2>The page was not found.</h2>
                    <Link to="/">Home</Link>
                </div>)
        }
    }
    return (
        <div>
            {determineRendered()}
        </div>
    )
}


export default Errors;