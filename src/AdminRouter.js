import  {Switch, Route} from 'react-router-dom';
import React from 'react';
import CreateSubject from './Components/CreateSubject';
import AdminPortal from './Components/AdminPortal';


const AdminRouter = () => {
    return (
    <Switch>
     <Route path="/admin/subjects" component={CreateSubject}/>
     <Route path="/admin" component={AdminPortal}/>
 </Switch>)
}

export default AdminRouter;