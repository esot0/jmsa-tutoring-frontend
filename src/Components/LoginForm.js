import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { axios_instance } from '../index'
import { useHistory } from "react-router-dom";
import jwt from 'jsonwebtoken'
const LoginForm = (props) => {
  let history = useHistory();
  let [errors, setErrors] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const username = e.target.username.value;
    const password = e.target.password.value;

    const user = {
      username,
      password
    }

    const config = {
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    axios_instance.post('/user/sign_in', user, config)
      .then(function (response) {
        if (response.data.access_token) {
          jwt.verify(response.data.access_token, '/NJIBYUGHBYUHIKNBJBYBTGYIUJNBGFB/', () => {
            localStorage.clear()
            localStorage.setItem("token", response.data.access_token);
            history.push("/")
            window.location.reload(true)
          })
        }
      })
      .catch(function (error) {
        setErrors('Invalid credentials')
        console.log('err, ', error);
      });
  }

  return (
    <div className="form-comp">
      <h1>Log in </h1>
      <Form onSubmit={handleSubmit}>
        {errors || ''}
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <span>Forgot password? Click<a href="/reset_password"> Here</a></span>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </div>);
}



export default LoginForm;