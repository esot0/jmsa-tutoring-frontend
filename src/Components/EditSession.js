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
import { formatDateMillisTimeString } from '../utility'

const EditSessionForm = (props) => {
  if (props.location.state && props.location.state.session) {
    localStorage.setItem('editedSession', JSON.stringify(props.location.state.session));
  }

  const localStorageSession = JSON.parse(localStorage.getItem("editedSession"))
  const history = useHistory();
  const [endTime, setEndTime] = useState('');
  const [time, setTime] = useState('');
  const [session, setSession] = useState(localStorageSession);
  const [errors, setErrors] = useState(undefined);

  const greaterTime = (time1, time2) => {
    const time1Hours = Number(time1.substring(0, 2))
    const time2Hours = Number(time2.substring(0, 2))

    const time1Minutes = Number(time1.substring(3, 5))
    const time2Minutes = Number(time2.substring(3, 5))

    if (time1Hours > time2Hours) {
      return time1;
    }
    else if (time1Hours == time2Hours) {
      return time1Minutes >= time2Minutes ? time1 : time2;
    }
    else {
      return time2;
    }
  }
  const handleErrors = () => {
    const errorList = []
    if (!time || !endTime || greaterTime(time, endTime) == time) {
      errorList.push('Invalid time');
    }
    setErrors(errorList)
    return errors;
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    handleErrors();
    if (!errors) {
      const endDateTime = formatDateMillisTimeString(session.date.$date, endTime);
      const startDateTime = formatDateMillisTimeString(session.date.$date, time)

      console.log("FormattedEndDateTime: ", endDateTime)
      console.log("FormattedStartDateTime: ", startDateTime)
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

  const onDropdownSelect = (eventKey) => {
    setSession({ ...session, subject: eventKey });
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
              disabledDays={{ before: new Date() }}
              format="M/D/YYYY"
              name="date"
              id="date"
              onDayClick={handleDayClick}
              selectedDays={new Date(session.date.$date)}
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