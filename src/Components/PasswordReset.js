
import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

const PasswordReset = () => {
    const history = useHistory();
    const location = useLocation();
    const token = location.search.substr(7);
    const [passwordEmailSent, setPasswordEmailSent] = useState(false)
    const resetPassword = (e) => {
        e.preventDefault();
        const config = {
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }

        axios.post('https://jmsa-tutoring-backend.herokuapp.com/reset_password', { password: e.target.new_pass.value, confirmNewPassword: e.target.confirm_new_pass.value }, config)
            .then((res) => {
                history.push(`/`)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const sendResetEmail = (e) => {
        const config = {
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }
        e.preventDefault();
        const data = {
            email: e.target.email.value
        }
        axios.post('https://jmsa-tutoring-backend.herokuapp.com/send_password_email', data, config)
            .then((res) => {
                setPasswordEmailSent(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div>
            <h1>Reset Your Password</h1>
            { token ?
                (

                    <Form onSubmit={resetPassword}>
                        <Form.Group controlId="new_pass">
                            <Form.Label>New password</Form.Label>
                            <Form.Control />
                        </Form.Group>

                        <Form.Group controlId="confirm_new_pass">
                            <Form.Label>Confirm new password</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                )
                :
                (
                    <Form onSubmit={sendResetEmail}>
                        {passwordEmailSent && <span className="flavor_text">Password Reset Email Sent</span>}
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Button type="submit">Send</Button>
                    </Form>)
            }
        </div>
    )
}

export default PasswordReset;