import React, { useState, useEffect } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap'
import { axios_instance } from '../index'

const CreateSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [errors, setErrors] = useState([]);

    const createSubject = (e) => {
        e.preventDefault()
        const config = {
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }
        axios_instance.post("http://127.0.0.1:5000/subjects/new", { 'subject': e.target.subject.value }, config)
            .then((res) => {
                e.target.subject.value = ""
                setErrors('')
                setSubjects([...subjects, res.data])
            })
            .catch((err) => {
                setErrors("An error occurred processing your request.")
            })
    }

    const deleteSubject = (id) => {
        axios_instance.post(`http://127.0.0.1:5000/subjects/delete/${id}`)
        .then(()=>{
            const newSubjects = subjects.filter((subject)=>subject._id.$oid !== id);
            setSubjects(newSubjects);
        })
        .catch((err)=>{
            console.log(err)
            setErrors('Error occurred while deleting')
        })
    }
    useEffect(() => {
        axios_instance.get("http://127.0.0.1:5000/subjects")
            .then((res) => {
                setSubjects(res.data);
            })
    }, [])

    return (
        <div>
            <h1>Subjects</h1>
            <h3>Create Subject</h3>
            {errors}
            <Form className="form-comp" onSubmit={createSubject}>
                <Form.Label>New Subject</Form.Label>
                <FormControl type="text" name="subject" />
                <Button variant="primary" type="submit">Submit</Button>
            </Form>

            <h3>Current Subjects</h3>
            <div className="subjects">
                {subjects.map((element) => {

                    return (<div className="subject" key={element._id.$oid}>
                        <p>{element.subject}</p>
                        <a className="delete-link" onClick={()=>deleteSubject(element._id.$oid)}>Delete</a>
                    </div>)
                }
                )}
            </div>
        </div>
    )
}

export default CreateSubject;