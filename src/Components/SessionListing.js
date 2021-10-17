import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap';
import { formatDate, formatTime, verifyJWT } from '../utility'
import {axios_instance} from '../index'
const SessionListing = (props) => {
  //wrong time
  const mode = props.mode;
  const jwt = verifyJWT();
  const [confirmed, setConfirmed] = useState({
	  tutor_confirmed: props.session.tutor_confirmed,
	  student_confirmed: props.session.student_confirmed
  });

  if(jwt.username==props.session.tutor.username && !confirmed.tutor_confirmed){
    console.log("T")
  }
  else if ((jwt.username==props.session.student.username && !confirmed.student_confirmed)){
    console.log("S")
  }

  const confirmSession = () => {
    let confirmation = {};
    if(jwt.username==props.session.tutor.username){
      confirmation.tutor_confirmed = true;
    }
    else if(jwt.username==props.session.student.username){
      confirmation.student_confirmed = true;
    }
    axios_instance.post(`/user/sessions/${props.session._id.$oid}/edit`, confirmation)
    .then((res)=>{
     setConfirmed({tutor_confirmed: res.data.tutor_confirmed, student_confirmed: res.data.student_confirmed});
    })
    .catch((err)=>{
      console.log(err)
    })
  }


  //add captcha
  return (
    props.mode === "card" ?
      (<div className="center">
        <Card className="card session">
          <Card.Body>
            <Card.Title className="card-title">{props.session.subject} Session with Student @{props.session.student.username}</Card.Title>
            <Card.Text>
              <span id="tutor">Tutor: @{props.session.tutor.username}</span>
              <p id="date">{
                formatDate(props.session.date.$date)
              } to <span id="end_time">{formatTime(props.session.end_time.$date)}</span></p>
              <p>Confirmation Status: {(confirmed.tutor_confirmed && confirmed.student_confirmed) ? "Confirmed" : "Not Confirmed"} </p>

              {
                ((jwt.username==props.session.tutor.username && !confirmed.tutor_confirmed) || (jwt.username==props.session.student.username && !confirmed.student_confirmed)) && <a className="delete-link" onClick={confirmSession}>Confirm</a>
              }
            </Card.Text>
            <Link to={{
              pathname: `/user/sessions/${props.session._id.$oid}/edit`,
              state: {

                session: props.session
              }
            }}>Edit
        </Link>
          </Card.Body>
        </Card>
      </div>) : (
        <tr>
          <td>{props.session.student.username}</td>
          <td>{props.session.tutor.username}</td>
          <td>{props.session.subject}</td>
          <td>{formatDate(props.session.date.$date)}</td>
          <td>{formatTime(props.session.end_time.$date)}</td>
        </tr>)
  )

}

export default SessionListing;