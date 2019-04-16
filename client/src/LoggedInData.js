import React, {Component} from 'react';

class LoggedInData extends Component{
    constructor(props){
        super(props);
        this.state={
            loggedIn: false,
        };
        console.log(this.props.logInfo);
    }

    render() {
        if(!this.props.logInfo.loggedIn){
            return(<div>
                <h1>Not Logged In!!!!!!</h1>
            </div>);
        }

        else{
            return (
                <div>
                    <h1>Welcome{this.props.logInfo.email}</h1>
                </div>
            );
        }
    }
}

export default LoggedInData;