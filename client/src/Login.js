import React, { Component } from 'react';

class Login extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
        };
    }

    submitLogin=(e)=>{
        e.preventDefault();
        console.log('submitting login');
        fetch('userRoutes/login',
            {
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Conent-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            }).then(data=>{return data.text()})
    };


    render() {
        return(
            <div>
                <h1>Login</h1>
                <form onSubmit={this.submitLogin}>
                    <input type="text" name={'username'} placeholder={'Enter username'} autoFocus/>
                    <input type="password" name={'password'} placeholder={'Enter password'} />
                    <button>Login</button>
                </form>
                {this.state.data}
            </div>
        );
    }


}

export default Login