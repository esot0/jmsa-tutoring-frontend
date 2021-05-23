import { useState, useEffect } from 'react';
import { Form, FormControl, Dropdown, Col, Row, Pagination } from 'react-bootstrap'
import TimePicker from 'react-time-picker';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Subjects from './Subjects'

const SessionFilters = (props) => {
    const setTutorFilter = (e) => {
        props.setFilters({ ...props.filters, tutorFilter: e.target.value });
    }

    const setStudentFilter = (e) => {
        props.setFilters({ ...props.filters, studentFilter: e.target.value });
    }

    const handleDayClick = (day, { selected }) => {
        const selectedDay = selected ? undefined : day;
        props.setFilters({ ...props.filters, startDateFilter: selectedDay });
    }

    const setStartTimeFilter = (time) => {
        props.setFilters({ ...props.filters, startTimeFilter: time });
    }

    const setEndTimeFilter = (time) => {
        props.setFilters({ ...props.filters, endTimeFilter: time });
    }

    const setSubjectFilter = (eventKey) => {
        props.setFilters({ ...props.filters, sessionSubjectFilter: eventKey })
    }

    return (
        <Form className="form-comp">
            <Form.Group>
                <Form.Label>Tutor Filter</Form.Label>
                <FormControl className="search-input short" type="text" name="setTutorFilter" onChange={setTutorFilter} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Student Filter</Form.Label>
                <FormControl className="search-input short" type="text" name="setDateFilter" onChange={setStudentFilter} />
            </Form.Group>
            <div className="flex-form">
                <Form.Group>
                    <Form.Label>Date Filter</Form.Label>
                    <DayPickerInput
                        className="calendar"
                        format="M/D/YYYY"
                        name="setStartDateFilter"
                        id="date"
                        onDayChange={handleDayClick}
                        value={props.filters.startDateFilter}
                    />
                </Form.Group>

                {props.filters.startDateFilter &&
                    (
                        <div >
                            <Form.Group>
                                <Form.Label>Start Time Filter</Form.Label>
                                <TimePicker
                                    name="setTimePicker"
                                    id="end_time"
                                    onChange={setStartTimeFilter}
                                    value={props.filters.startTimeFilter}
                                    disableClock={true}
                                />
                                <Form.Label>End Time Filter</Form.Label>
                                <TimePicker
                                    name="setTimePicker"
                                    id="end_time"
                                    minTime={props.filters.startTimeFilter}
                                    value={props.filters.endTimeFilter}
                                    onChange={setEndTimeFilter}
                                    disableClock={true}
                                />
                            </Form.Group>
                        </div>
                    )
                }
                <Subjects onSelect={setSubjectFilter} subject={props.filters.sessionSubjectFilter}/>
            </div>
        </Form>
    )

}

export default SessionFilters;