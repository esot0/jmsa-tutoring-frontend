
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Link
} from "react-router-dom";
import ReactPaginate from 'react-paginate'
import { Form, Table, Row} from 'react-bootstrap'
import UserTableListing from './UserTableListing'
import UserSessions from './UserSessions'
import Filters from './Filters'
import { axios_instance } from '..';
//ensure that start and end date are after each other in edit/sess create
//allow deletion of profiles
//auto delete if not 'is active' after a certain time period?
//How to verify session happened? 

const AdminPortal = () => {
  //What if only a few head admins could make admin accs, only thru the admin portal?
  const [users, setUsers] = useState({
    userList: [],
    displayed: [],
    filtered: [],
  });

  const [offset, setOffset] = useState(0);
  const perPage = 10;
  let pageCount = Math.ceil(users.filtered.length) / perPage;
  const [mode, setMode] = useState("user")

  const handlePageClick = (e) => {
    let selected = e.selected;
    let offset = Math.ceil(selected * perPage);
    setOffset(offset);
  };

  const setModeFilter = (e) => {
    setMode(e.target.value);
  }

  useEffect(() => {
    setUsers({ ...users, displayed: offset + perPage >= users.filtered.length ? users.filtered.slice(offset, users.filtered.length) : users.filtered.slice(offset, offset + perPage) })
  }, [offset])

  useEffect(() => {
    axios_instance.get('/user')
      .then((res) => {
        //Turn this whole user thing into a hook, consolidate it and Dashboard
        setUsers({ userList: res.data, filtered: res.data, displayed: res.data });
        return res.data;
      })
  }, [])



  //,aybe go back thru checkboxes and automate their creation with an array of sorts, so you don't have to copy-paste another one every time a new subject is added
  return (<div>
    <h1>Admin Portal</h1>
    <Link to="/admin/subjects" >Subjects</Link>
    <Row>
      <Form.Group className="radios">
        <Form.Check
          inline
          value="user"
          name="setModeFilter"
          label="User View"
          type="radio"
          id="mode"
          checked={(mode == "user")}
          onClick={setModeFilter}
        />
        <Form.Check
          inline
          value="session"
          name="setModeFilter"
          label="Session View"
          type="radio"
          id="mode"
          onClick={setModeFilter}
        />
      </Form.Group>
    </Row>
    {mode == "user" && <Filters users={users} setUsers={setUsers} offset={offset} pageCount={pageCount} perPage={perPage} mode={mode} setMode={setMode} />}
    {mode == "user" ? users.displayed.length === 0 ? <span className="flavor-text greyed_out">No Matching Users</span> :
      <div>
        <Table responsive striped bordered hover variant="dark">
          <thead>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Roles</th>
            <th>Tutor's Subjects</th>
            <th>Problem Subjects</th>
            <th>Hours</th>
          </thead>
          <tbody>
            {users.displayed.map((user) => {
              return (
                <UserTableListing
                  key={user._id.$oid}
                  full_name={user.full_name}
                  username={user.username}
                  email={user.email}
                  us_phone_number={user.us_phone_number}
                  roles={user.roles}
                  tutor_subjects={user.tutor_subjects}
                  problem_subjects={user.problem_subjects}
                />
              )
            })}
          </tbody>
        </Table>
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
        />


      </div> :
      <UserSessions perPage={5} />}
  </div>

  )
}





export default AdminPortal;