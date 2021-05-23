import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import CreateSessionForm from "./CreateSessionForm";
import Dashboard from "./Dashboard";
import HomePage from "./Homepage";
import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import Profile from "./Profile";
import SignUpForm from "./SignUpForm";
import EditUser from './EditUser'
import jwt from 'jsonwebtoken';
import EditSessionForm from "./EditSession";
import Chat from "./Chat"
import EmailRegistration from "./EmailRegistration";
import PasswordReset from "./PasswordReset";
import AdminPortal from "./AdminPortal";
import Errors from "./Errors"
import AdminRouter from "../AdminRouter";
import {verifyJWT} from "../utility"
import {SocketContext, socket} from '../Hooks/socketContext'

const AppRouter = () => {
  const jwt = verifyJWT();
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/finalize_registration" component={EmailRegistration} exact />
          <Route exact path="/reset_password" component={PasswordReset} />
          <Route path="/sign_up" component={SignUpForm} exact />
          <Route path="/sign_in" component={LoginForm} exact />
          <Route path="/dashboard" exact>
            {jwt ? <Dashboard /> : <Errors error={401} />}
          </Route>
          <Route path="/user/create_session" exact>
            {jwt ? <CreateSessionForm /> : <Errors error={401} />}
          </Route>
          <Route exact path="/user/sessions/:session/edit" component={EditSessionForm} />
          <Route exact path="/user/:username" render={({ match }) => {
            return (
              <div>
                {jwt ? <Profile  /> : <Errors error={401} />}
              </div>
            )
          }} />
          <Route exact path="/user/:username/edit" render={({ match }) => {
            return (
              <div>
                {jwt && match.params.username == jwt.username || jwt.rls.includes('admin') ? <EditUser /> : <Errors error={401} />}
              </div>
            )
          }} />

          <Route exact path="/user/:username/chat" render={({ match }) => {
            return (
				<SocketContext.Provider value={socket}>
                {jwt && (match.params.username == jwt.username || jwt.rls.includes('admin')) ? <Chat /> : <Errors error={401} />}
				</SocketContext.Provider>
            )
          }} />
          <Route path="/admin" render={({ match }) => {
            return (
              <div>
              {jwt && jwt.rls.includes('admin') ? <AdminRouter /> : <Errors error={401} />}
			  </div>
            )
            }}/>
          <Route>
            <Errors error={404} />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default AppRouter;