import React, { useEffect, useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { axios_instance } from '..';
import Select from 'react-select'
import "../../node_modules/react-time-picker/dist/TimePicker.css";
import "../../node_modules/react-clock/dist/Clock.css";
import TimePicker from 'react-time-picker'
import Subjects from './Subjects';


const EditSessionForm = (props) => {
  const history = useHistory();
  const [endTime, setEndTime] = useState('');
  const [time, setTime] = useState('');
  const [session, setSession] = useState(props.location.state.session);
  const [errors, setErrors] = useState('');
  const handleErrors = () => {
    if (!time || !endTime || time > endTime) {
      setErrors('Invalid time');
    }
    else {
      setErrors('')
    }
    return errors;
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    handleErrors();
    if (!errors) {
      const endDateTime = formatDateTime(session.date, endTime);
      const startDateTime = formatDateTime(session.date, time)
      const edited_session = {
        ...session,
        end_time: endDateTime,
        date: startDateTime,
      }

      const config = {
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      axios_instance.post(`/user/sessions/${session._id.$oid}/edit`, { ...edited_session, tutor_confirmed: false, student_confirmed: false }, config)
        .then(() => {
          history.push(`/`)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }


  const handleDayClick = (day, { selected }) => {
    const selectedDay = selected ? undefined : day;
    const updated_session = { ...session, date: selectedDay }
    setSession(updated_session);
  }

  const onTimeChange = (time) => {
    setTime(time);
  }

  const onEndTimeChange = (time) => {
    setEndTime(time);
  }
  const formatDateTime = (date, time) => {
    const hour = parseInt(time.substring(0, 1)) == 0 ? parseInt(time.substring(1, 2)) : parseInt(time.substring(0, 2))
    const minutes = time.substring(2)


    const amPM = hour < 12 ? 'AM' : 'PM'
    const formatted_hour = hour > 12 ? hour - 12 : hour < 10 ? "0" + hour : hour;
    time = formatted_hour + minutes + " " + amPM

    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
  }

  const onDropdownSelect = (eventKey) => {
    setSession({ ...session, subject: eventKey });
  }

  const handleChange = (e) => {
    const updated_session = {
      ...session,
      [e.target.id]: e.target.value
    }
    setSession(updated_session)
  }

  return (
    <div className="form-comp-container">
      <div className="form-comp">
        <h1>Edit Session</h1>
        <span className="errors">{errors}</span>
        <Form onSubmit={handleSubmit}>
          <Subjects onSelect={onDropdownSelect} subject={session.subject} />
          <Form.Group controlId="tutor">
            <Form.Label>Tutor</Form.Label>
            <Form.Control type="text" value={session.tutor.username} />
          </Form.Group>

          <Form.Group controlId="student">
            <Form.Label>Student</Form.Label>
            <Form.Control type="text" value={session.student.username} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Date</Form.Label>
            <DayPickerInput
              className="calendar"
              // disabledDays={{ before: new Date() }}
              format="M/D/YYYY"
              name="date"
              id="date"
              onDayClick={handleDayClick}
              selectedDays={new Date(session.date)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="block-label">Start Time</Form.Label>
            <TimePicker
              name="time"
              id="time"
              disableClock={true}
              onChange={onTimeChange}
              value={time}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="block-label">End Time</Form.Label>
            <TimePicker
              name="end_time"
              id="end_time"
              disableClock={true}
              onChange={onEndTimeChange}
              value={endTime}
            />
          </Form.Group>

          <Button variant="primary" type="submit">Submit</Button>
        </Form>
      </div>
    </div>);
}


export default EditSessionForm;