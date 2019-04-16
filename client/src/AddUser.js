import React, { Component } from 'react';


class AddUser extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
        };
    }



    submitForm = (e)=>{
        e.preventDefault();
        console.log('Submitting new user');
        fetch('/userRoutes/newuser',
            {
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                    email: e.target.email.value,
                }),
            }).then(data=>{return data.text()}).then(data=>console.log(data));
                // console.log({this.state.data})
    };


    render() {
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={this.submitForm}>
                    <input type="text" name={'username'} placeholder={'Enter username'} autoFocus/>
                    <input type="password" name={'password'} placeholder={'Enter password'} />
                    <input type="email" name={'email'} placeholder={'Enter email address'} />
                    <button>Register</button>
                </form>
                {this.state.data}
            </div>
        );
    }


}

export default AddUser;