import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import DayPickerInput from "react-day-picker/DayPickerInput";
import TimePicker from 'react-time-picker'
import { useHistory } from 'react-router-dom'
import { axios_instance } from '..';
import Select from 'react-select';
import Subjects from './Subjects';
import { verifyJWT } from '../utility';
import "../../node_modules/react-time-picker/dist/TimePicker.css";
import "../../node_modules/react-clock/dist/Clock.css";

const CreateSessionForm = () => {

  const history = useHistory();
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [subject, setSubject] = useState('')
  const [user_list, set_user_list] = useState([])
  const [other_user, setOtherUser] = useState({})
  const [errors, setErrors] = useState('')

  const jwt = verifyJWT();
  useEffect(() => {
    if (jwt.rls.includes('tutor')) {
      axios_instance.get('/user/students')
        .then(function (response) {
          return response.data.filter(user => user.username != jwt.username)
        })
        .then(function (response) {
          console.log(response)
          set_user_list([...user_list, ...response])
        })
        .catch(function (error) {
          console.log(error);
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const session = {
      subject: subject,
      date: formatDateTime(date, time),
      end_date: formatDateTime(date, endTime),
      other_user: other_user
    }
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    axios_instance.post('/user/sessions/new', session, config)
      .then((res) => {
        history.push(`/user/${jwt.username}`)
      }).catch((err) => {
        console.log(err)
      })


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
  const formatDateTime = (date, time) => {
    const hour = parseInt(time.substring(0, 1)) == 0 ? parseInt(time.substring(1, 2)) : parseInt(time.substring(0, 2))
    const minutes = time.substring(2)
    const amPM = hour < 12 ? 'AM' : 'PM'
    const formatted_hour = hour > 12 ? hour - 12 : hour;
    time = formatted_hour + minutes + " " + amPM
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
  }



  return (
    <div className="form-comp">
      <h1>Set up a Session</h1>
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