import React, { useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import { axios_non_auth_instance } from '..';


const EmailRegistration = () => {
    const location = useLocation();
    const history = useHistory();
    const token = location.search.substr(7);
    console.log(token)
    const config = {
        crossDomain: true,
        headers: {
          'Authorization':  ` Bearer ${token}`
      }
      }
    useEffect(()=>{
        axios_non_auth_instance.get('/finalize', config)
       .then((res)=>{
            // if(res.data.access_token){
                setTimeout(()=>{
                    localStorage.clear()
                    localStorage.setItem("token", res.data.access_token);
                    history.push("/")
                    window.location.reload(true)
                }, 2000)
           // }
        })
        .catch((err)=>{
            console.log(token)
            console.log(err);
        })

    }, [])
    return (
    <div>
        <h1>Successful registration</h1>
        <p>Redirecting home...</p>
    </div>)
}

export default EmailRegistration;