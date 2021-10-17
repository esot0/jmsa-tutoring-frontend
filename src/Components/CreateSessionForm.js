import React, { useCallback, useEffect, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import DayPickerInput from "react-day-picker/DayPickerInput";
import TimePicker from 'react-time-picker'
import { useHistory } from 'react-router-dom'
import { axios_instance } from '..';
import Select from 'react-select';
import Subjects from './Subjects';
import { verifyJWT, optionsParticles } from '../utility';
import { formatDateMillisTimeString } from '../utility';
import "../../node_modules/react-time-picker/dist/TimePicker.css";
import "../../node_modules/react-clock/dist/Clock.css";

const CreateSessionForm = () => {

  const history = useHistory();
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [subject, setSubject] = useState('')
  const [user_list, set_user_list] = useState([])
  const [other_user, setOtherUser] = useState(undefined)
  const [errors, setErrors] = useState([])

  const jwt = verifyJWT();
  useEffect(() => {
    console.log(jwt.rls)
    if (jwt.rls.includes('tutor')) {
      axios_instance.get('/user/students')
        .then(function (response) {
          return response.data.filter(user => user.username != jwt.username)
        })
        .then(function (response) {
          set_user_list([...user_list, ...response])
        })
        .catch(function (error) {
        });
    }

    if (jwt.rls.includes('student')) {
      axios_instance.get('/user/tutors')
        .then(function (response) {
          return response.data.filter(user => user.username != jwt.username)
        })
        .then(function (response) {
          set_user_list([...user_list, ...response])
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [])

  const greaterTime = (time1, time2) => {
    const time1Hours = Number(time1.substring(0, 2))
    const time2Hours = Number(time2.substring(0, 2))

    const time1Minutes = Number(time1.substring(3, 5))
    const time2Minutes = Number(time2.substring(3, 5))

    const time1AMPM = time1.substring(time1.length-2)
    const time2AMPM = time2.substring(time2.length-2)
    const bothAMPM = time1AMPM == time2AMPM
    if (time1Hours > time2Hours && bothAMPM) {
      return time1;
    }
    else if (time1Hours == time2Hours && bothAMPM) {
      return time1Minutes >= time2Minutes ? time1 : time2;
    }
    else {
      if(time1AMPM=="AM" && time2=="PM"){
        return time2;
      }
      else {
        return time1;
      }
    }
  }

  const handleErrors = () => {
    const errorList = []
    if (!time || !endTime || greaterTime(time, endTime) == time) {
      errorList.push('Invalid time');
    }
    if (!other_user) {
      errorList.push("Must choose a user");
    }
    setErrors(errorList)
    return errorList
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorList = handleErrors();
    if (errorList.length === 0) {
      const session = {
        subject: subject,
        date: formatDateMillisTimeString(date, time),
        end_date: formatDateMillisTimeString(date, endTime),
        other_user: other_user
      }
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      axios_instance.post('/user/sessions/new', session, config)
        .then((res) => {
          console.log("SESSION", res)
          history.push(`/user/${jwt.username}`)
        }).catch((err) => {
          console.log(err)
        })
    }
  }

  const handleDayClick = (day, { selected }) => {
    const selectedDay = selected ? undefined : day;
    setDate(selectedDay)
  }

  const handleSelect = (selected) => {
    setOtherUser(selected)
  }

  const onTimeChange = (time) => {
    setTime(time)
  }

  const onEndTimeChange = (time) => {
    setEndTime(time)
  }

  const showErrors = useCallback(() => {
    if (errors.length > 0) {
      return (<Alert variant="danger">
        <Alert.Heading>You have some errors!</Alert.Heading>
        <p>
          {errors.map((err) => (<li>{err}</li>))}
        </p>
      </Alert>)
    }
    else {
      return (<div></div>)
    }
  }
  , [errors])


return (
  <div className="form-comp">
    <h1>Set up a Session</h1>

    {
      showErrors()
    }

    <Form onSubmit={handleSubmit}>
      <Subjects subject={subject} onSelect={setSubject} />
      <Form.Group controlId="session_attendee">
        <Form.Label>{jwt.rls.includes('tutor') ? 'Student' : 'Tutor'}</Form.Label>
        <Select
          className="select center"
          onChange={handleSelect}
          options={user_list}
          getOptionLabel={(option) => option.username}
          getOptionValue={(option) => option._id}
          required={true}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label className="block-label">Date</Form.Label>
        <div>
          <DayPickerInput
            className="calendar"
            disabledDays={{ before: new Date() }}
            format="M/D/YYYY"
            name="date"
            id="date"
            inputProps={
              { required: true }
            }
            onDayChange={handleDayClick}
            selectedDays={date}
          />
        </div>
      </Form.Group>

      <div>
        <Form.Label className="block-label">Start Time: </Form.Label>
        <TimePicker
          name="time"
          id="time"
          required={true}
          disableClock={true}
          onChange={onTimeChange}
          value={time}
        />

        <Form.Label className="block-label">End Time: </Form.Label>
        <TimePicker
          name="end_time"
          id="end_time"
          required={true}
          disableClock={true}
          onChange={onEndTimeChange}
          value={endTime}
        />
      </div>
      <Button variant="primary" type="submit">Submit</Button>
    </Form>
  </div>);
}

export default CreateSessionForm;