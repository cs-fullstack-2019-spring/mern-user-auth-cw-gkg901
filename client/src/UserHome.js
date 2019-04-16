import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AddUser from './AddUser'


class UserHome extends Component{

    render() {
        return (
            <div>
                <Router>
                    <h1>Welcome</h1>
                    <Link className='linkSpacing'  to={'/'}>Home</Link>
                    <Link className='linkSpacing'  to={'/login'}>Sign In</Link>
                    <Link className='linkSpacing'  to={'/adduser'}>Register</Link>




                    <Route exact path='/adduser' component={AddUser}/>
                </Router>
            </div>
        );
    }






}

export default UserHome