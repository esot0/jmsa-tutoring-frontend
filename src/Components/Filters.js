import { useState, useEffect } from 'react';
import { Form, FormControl, Collapse, Button, Dropdown, Col, Row, Pagination } from 'react-bootstrap'
import jwt from 'jsonwebtoken';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Subjects from '../Components/Subjects'
const Filters = (props) => {
    const [open, setOpen] = useState(false);

    // const [filter, setFilter] = useState({
    //     nameFilter: '',
    //     emailFilter: '',
    //     usernameFilter: '',
    //     phoneFilter: '',
    //     roleFilter: '',
    //     subjectsFilter: [],
    //     availabilityFilter: null
    // })
    //This will replace the long string of use states later
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [usernameFilter, setUsernameFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [role, setRole] = useState('');
    const [subjectsFilter, setSubjectsFilter] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState(null);
    //USER availability not defined
    // not working subjects filter
    //

    const inputChange = (e) => {
        hookUpdateFunctions[e.target.name](e.target.value)
    }

    let userToken = localStorage.getItem('token');
    let decoded;
    if (userToken) {
        try {
            decoded = jwt.verify(userToken, '/NJIBYUGHBYUHIKNBJBYBTGYIUJNBGFB/')
        }
        catch (e) {
            console.log(e);
        }
    }

    const handleDayClick = (day, { selected }) => {
        const selectedDay = selected ? undefined : day;
        setAvailabilityFilter(selectedDay);
    }

    const availabilityCheck = (user) => {
        let foundSameDate = false;
        let i = 0;

        while (!foundSameDate && i < user.availability.length) {
            const date = new Date(user.availability[i++].$date);
            foundSameDate = availabilityFilter.getDate() === date.getDate()
                && availabilityFilter.getFullYear() === date.getFullYear()
                && availabilityFilter.getMonth() === date.getMonth();
        }

        return foundSameDate;
    }

    useEffect(() => {
        const filtered = props.users.userList.filter((user) => {

            let allChecks = true;

            allChecks = nameFilter ? (user.full_name.toLowerCase().includes(nameFilter.toLowerCase()) ? allChecks : false) : allChecks;

            allChecks = emailFilter ? (user.email.toLowerCase().includes(emailFilter.toLowerCase()) ? allChecks : false) : allChecks;

            allChecks = phoneFilter ? (user.us_phone_number.startsWith(phoneFilter) ? allChecks : false) : allChecks;

            allChecks = subjectsFilter.length !== 0 ? ((user.tutor_subjects &&
                subjectsFilter.every((element) => user.tutor_subjects.includes(element)))
                || (user.problem_subjects && subjectsFilter.every((element) => user.problem_subjects.includes(element))) ? allChecks : false) : allChecks;

            allChecks = usernameFilter ? (user.username.toLowerCase().includes(usernameFilter.toLowerCase()) ? allChecks : false) : allChecks;

            allChecks = role ? (user.roles.includes(role) ? allChecks : false) : allChecks;

            allChecks = availabilityFilter && user.availability ? (availabilityCheck(user) ? allChecks : false) : allChecks;
            return allChecks;
        })


        props.setUsers({ ...props.users, filtered: filtered, displayed: (props.offset + props.perPage >= filtered.length ? filtered.slice(props.offset, filtered.length) : filtered.slice(props.offset, props.offset + props.perPage)) })

    }, [nameFilter, emailFilter, usernameFilter, phoneFilter, role, subjectsFilter, availabilityFilter])


    const setCheckFilter = (value) => {
        if (subjectsFilter.includes(value)) {
            setSubjectsFilter(subjectsFilter.filter(element => element != value));
        }
        else {
            setSubjectsFilter([...subjectsFilter, value])
        }
    }

    const setRoleFilter = (e) => {
        if (e.target.value === role) {
            e.target.checked = false;
            setRole("");
        }
        else {
            setRole(e.target.value);
        }
    }

    const hookUpdateFunctions = {
        "setNameFilter": setNameFilter,
        "setEmailFilter": setEmailFilter,
        "setUsernameFilter": setUsernameFilter,
        "setPhoneFilter": setPhoneFilter,
        "setRoleFilter": setRoleFilter,
        "setSubjectsFilter": setCheckFilter,
    }
    return (
        <div className="filtering">
            <Button
				id="open-filters"
                onClick={() => setOpen(!open)}
                aria-controls="filter-form"
                aria-expanded={open}
            >
                Filter
      </Button>
            <Collapse in={open}>
                <div id="filter-form" >
                    <Form className="form-comp">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <FormControl className="search-input" type="text" name="setNameFilter" onChange={inputChange} />
                                    {decoded.rls.includes('admin') && (<div>
                                        <Form.Label>Email</Form.Label>
                                        <FormControl className="search-input" type="text" name="setEmailFilter" onChange={inputChange} />
                                    </div>)}
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Label>Username</Form.Label>
                                <FormControl className="search-input" type="text" name="setUsernameFilter" onChange={inputChange} />

                                {decoded.rls.includes('admin') && (<div>
                                    <Form.Label>Phone # (Stored in format xxx-xxx-xxxx)</Form.Label>
                                    <FormControl className="search-input" type="text" name="setPhoneFilter" onChange={inputChange} />
                                </div>)}
                            </Col>
                        </Row>
                        <Row>
                            <Subjects checkboxes={true} name="setSubjectsFilter" onCheck={inputChange} />
                        </Row>
                        <Row>

                            <DayPickerInput
                                className="calendar"
                                format="M/D/YYYY"
                                name="setStartDateFilter"
                                id="date"
                                onDayChange={handleDayClick}
                                value={availabilityFilter}
                            />
                        </Row>
                        <Row>
                            <Form.Group className="radios" controlId="role">
                                <Form.Check
                                    inline
                                    value="tutor"
                                    name="setRoleFilter"
                                    label="Tutor"
                                    type="radio"
                                    id="tutor"
                                    onClick={setRoleFilter}
                                />
                                <Form.Check
                                    inline
                                    value="student"
                                    name="setRoleFilter"
                                    label="Student"
                                    type="radio"
                                    id="student"
                                    onClick={setRoleFilter}
                                />
                                <Form.Check
                                    inline
                                    value="student,tutor"
                                    name="setRoleFilter"
                                    label="Both"
                                    type="radio"
                                    id="both"
                                    onClick={setRoleFilter}
                                />
                            </Form.Group>
                        </Row>
                    </Form>
                </div>
            </Collapse>
        </div>)
}


export default Filters;