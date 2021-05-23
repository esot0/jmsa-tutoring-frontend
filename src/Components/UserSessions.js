import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axios_instance } from '..'
import {Table} from 'react-bootstrap'
import SessionListing from './SessionListing';
import SessionFilters from './SessionFilters'
import ReactPaginate from 'react-paginate'

const UserSessions = (props) => {
    let { username } = useParams();
    const perPage = props.perPage ? props.perPage : 1;
    const [sessions_list, set_sessions_list] = useState({
        raw_sessions: [],
        displayed_sessions: [],
        filtered: []
    })
    //Filtered is not neeeded with offset
    //Put session list in var and change it when offset state changes
    const [offset, setOffset] = useState(0)
    const [filters, setFilters] = useState({
        tutorFilter: '',
        studentFilter: '',
        sessionSubjectFilter: '',
        startDateFilter: null,
        startTimeFilter: null,
        endTimeFilter: null
    })
    const pageCount = Math.ceil(sessions_list.filtered.length) / perPage;

    const formatDateTime = (date, time) => {
        const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const formattedDate = date.getFullYear() + "-" + month + "-" + day;
        const formattedTime = "T" + time + ":00"
        return new Date(formattedDate + formattedTime);
    }

    useEffect(() => {
        const filteredSessions = sessions_list.raw_sessions.filter((session) => {
            let allChecks = true;
            allChecks = filters.tutorFilter ? (session.tutor.username.includes(filters.tutorFilter) ? allChecks : false) : allChecks;
            allChecks = filters.studentFilter ? (session.student.username.includes(filters.studentFilter) ? allChecks : false) : allChecks;
            if (filters.startDateFilter) {
                const sessionDate = new Date(session.date.$date);
                const sameDate = filters.startDateFilter.getDate() === sessionDate.getDate()
                    && filters.startDateFilter.getFullYear() === sessionDate.getFullYear()
                    && filters.startDateFilter.getMonth() === sessionDate.getMonth();
                allChecks = sameDate ? allChecks : false

                if (filters.startTimeFilter) {
                    const startDateTime = formatDateTime(filters.startDateFilter, filters.startTimeFilter);
                    allChecks = sameDate && startDateTime.getHours() === sessionDate.getHours() && startDateTime.getMinutes() === sessionDate.getMinutes() ? allChecks : false
                }

                if (filters.endTimeFilter) {
                    const endDateTime = formatDateTime(filters.startDateFilter, filters.endTimeFilter);
                    const sessionEndDate = new Date(session.end_time.$date)
                    allChecks = sameDate && endDateTime.getHours() === sessionEndDate.getHours() && endDateTime.getMinutes() === sessionEndDate.getMinutes() ? allChecks : false
                }
            }
            allChecks = filters.sessionSubjectFilter ? (filters.sessionSubjectFilter === session.subject ? allChecks : false) : allChecks;
            return allChecks;

        })

        set_sessions_list({ ...sessions_list, displayed_sessions: perPage >= filteredSessions.length ? filteredSessions.slice(offset, filteredSessions.length) : filteredSessions.slice(offset, offset + perPage), filtered: filteredSessions })
    }, [filters.studentFilter, filters.tutorFilter, filters.startDateFilter, filters.startTimeFilter, filters.endTimeFilter, filters.sessionSubjectFilter])




    useEffect(() => {
        const config = {
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }

        if (username) {
            axios_instance.get(`http://127.0.0.1:5000/user/${username}/sessions`, config)
                .then((res) => {
                    console.log(res.data)
                    set_sessions_list({
                        raw_sessions: res.data,
                        displayed_sessions: res.data.slice(0, perPage),
                        filtered: res.data
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            axios_instance.get(`http://127.0.0.1:5000/sessions`, config)
                .then((res) => {
                    set_sessions_list({
                        raw_sessions: res.data,
                        displayed_sessions: res.data.slice(0, perPage),
                        filtered: res.data
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    //Update display when page clicked
    useEffect(() => {
        set_sessions_list({ ...sessions_list, displayed_sessions: offset + perPage >= sessions_list.filtered.length ? sessions_list.filtered.slice(offset, sessions_list.filtered.length) : sessions_list.filtered.slice(offset, offset + perPage) })
    }, [offset])

    const handlePageClick = (e) => {
        let selected = e.selected;
        setOffset(Math.ceil(selected * perPage));
    };

    const sessions = sessions_list.displayed_sessions.map((session) => (
        <SessionListing key={session._id.$oid} session={session} mode={!username ? "listing" : "card"} />
    ))

    return (
        <div>
            <div>
                {!username && <SessionFilters sessions={sessions_list.raw_sessions} filters={filters} setFilters={setFilters} />}
                {sessions.length !== 0 ? !username ? (
                    <Table responsive striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Tutor</th>
                                <th>Subject</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sessions}
                            </tbody>
                    </Table>
                ) : sessions : <h3>No sessions scheduled</h3>}
            </div>
            <ReactPaginate
                pageCount={pageCount}
                pageRangeDisplayed={5}
                marginPagesDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
            />
        </div>
    )
}

export default UserSessions;