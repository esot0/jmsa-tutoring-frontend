import { Dropdown, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react"
import { subjectList } from "../utility";
import { axios_instance } from '../index'
//change to get thessse from db later

const Subjects = (props) => {
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    axios_instance.get("http://127.0.0.1:5000/subjects")
      .then((res) => {
        setSubjects(res.data);
      })
  }, [])

  const onDropdownSelect = (eventKey) => {
    if (eventKey == props.subject) {
      props.onSelect('')
    }
    else {
      props.onSelect(eventKey)
    }
  }



  return (
    <div className="center">
      { props.checkboxes ? (
        <div className="checkboxes subjects">
         { subjects.map((element) =>  <Form.Check type="checkbox" key={element.subject}value={element.subject} label={element.subject} name="setSubjectsFilter" onChange={props.onCheck} />)} 
        </div>
      ) : (<Dropdown onSelect={onDropdownSelect}>
        <Dropdown.Toggle variant="success" className="subject">
          <span id="dropdown-subject"> {props.subject ? props.subject : "Subject"}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {subjects.map(element => (<Dropdown.Item eventKey={element.subject}><span>{element.subject}</span></Dropdown.Item>),)}
        </Dropdown.Menu>
      </Dropdown>)
      }
    </div>
  )
}

export default Subjects;