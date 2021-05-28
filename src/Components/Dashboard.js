import React, { useState, useEffect } from 'react'
import { axios_instance } from '..'
import UserCard from './UserCard'
import ReactPaginate from 'react-paginate'
import { Form } from 'react-bootstrap'
import ReactLoading from 'react-loading';
import Filters from './Filters'
import {verifyJWT} from '../utility'
//Add support for som1 who is tutor + student
const Dashboard = (props) => {
  const jwt = verifyJWT();
  const [userList, setUserlist] = useState({
    userList: [],
    filtered: [],
    displayed: []
  })

  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    username: '',
    fullName: '',
    subject: '',
    type: ''
  })

  const perPage = 20;
  const pageCount = Math.ceil(userList.userList.length) / perPage;


  useEffect(() => {
    const filtered = userList.userList.filter((user) => {
      setLoading(true);
      const usernameCheck = user.username.toLowerCase().includes(filters.username);
      const subjectCheck = user.roles.includes("tutor") && user.tutoring_subjects ? user.tutoring_subjects.includes(filters.subject) : user.problem_subjects ? user.problem_subjects.includes(filters.subject) : false;
      const typeCheck = user.roles.includes(filters.type);
      const fullNameCheck = user.full_name.toLowerCase().includes(filters.fullName.toLowerCase());
      let allChecks = true;

      if (filters.username) {
        allChecks = allChecks && usernameCheck;
      }
      if (filters.subject) {
        allChecks = allChecks && subjectCheck;
      }
      if (filters.fullName) {
        allChecks = allChecks && fullNameCheck;
      }
      if (filters.type) {
        allChecks = allChecks && typeCheck;
      }
      return allChecks
    })
    setLoading(false);
    setUserlist({ ...userList, filtered: filtered, displayed: filtered.slice(0, perPage) })
  }, [filters])


  useEffect(() => {
    if (jwt && jwt.rls.includes('student') && jwt.rls.includes('tutor') || jwt.rls.includes('admin')) {
      axios_instance.get('/user')
        .then((res) => {
          return res.data.filter(user => user.username != props.username)
        })
        .then((response) => {
          setUserlist({ ...userList, userList: response, filtered: response, displayed: response.slice(0, perPage) })
        })
        .then(() => {
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    else if (jwt && jwt.rls.includes('tutor')) {
      axios_instance.get('/user/students')
        .then((res) => {
          return res.data.filter(user => user.username != props.username)
        })
        .then(function (response) {
          setUserlist({ ...userList, userList: response, filtered: response, displayed: response.slice(0, perPage) })
        })
        .then(() => {
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else if (jwt && jwt.rls.includes('student')) {
      axios_instance.get('/user/tutors')
        .then((res) => {
          return res.data.filter(user => user.username != jwt.username)
        })
        .then(function (response) {
          setUserlist({ ...userList, userList: response, filtered: response, displayed: response.slice(0, perPage) })
        })
        .then(() => {
          setLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [])



  const handlePageClick = (e) => {
    let selected = e.selected;
    setOffset(Math.ceil(selected * perPage));
    setUserlist({ ...userList, displayed: perPage >= userList.filtered.length ? userList.filtered.slice(offset, userList.filtered.length) : userList.filtered.slice(offset, offset + 2) })
  };


  const userDash = userList.displayed.map((user) => {
    return (
      <UserCard className="user_card" profile_picture = {user.profile_picture} key={user._id.$oid} full_name={user.full_name} username={user.username} bio={user.biography} />
    )
  })

  const setRoleFilter = (e) => {
    setFilters({ ...filters, type: e.target.value })
  }

  return (
    <div>
      <h1>Users</h1>
      <div>
        <Filters users={userList} offset={offset} perPage={perPage} setUsers={setUserlist} />
        {
          jwt.rls.includes("tutor") && jwt.rls.includes("student") ? (
            <Form className="form-comp">
              <Form.Group controlId="role">
                <Form.Check
                  inline
                  value="tutor"
                  name="role"
                  label="Tutor"
                  type="radio"
                  id="tutor"
                  onClick={setRoleFilter}
                />
                <Form.Check
                  inline
                  value="student"
                  name="role"
                  label="Student"
                  type="radio"
                  id="student"
                  onClick={setRoleFilter}
                />
              </Form.Group>
              </Form>) : null
         
}
      </div>

      {loading && <ReactLoading type={"spin"} color={"white"} height={'10%'} width={'10%'} className="loading_spinner" />}
      {userDash.length != 0 ? <div className="userdash">{userDash}</div> : <h3>No matching users found</h3>}


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

    </div >
  )
}


export default Dashboard;