import React, { Component } from 'react';
import './login.css';

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            errorUsername: '',
            errorPassword: '',
            errorMessages: []
        };
    }
    
    onLogin(){
        
        var errorUsername = '';
        var errorPassword = '';
        var messages = [];
        
        var isValid = true;
        
        if(this.state.username == '') {
            errorUsername = 'Please enter UserName';
            messages.push(errorUsername);
            isValid = false;
        }
        
        if(this.state.password == '') {
            errorPassword = 'Please enter Password';
            messages.push(errorPassword);
            isValid = false;
        }
        
        this.setState({
            errorUsername: errorUsername,
            errorPassword: errorPassword,
            errorMessages: messages
        });
        
        if(isValid){
            // Redirect to Home Scren
            alert('Validated Successfully');
            var formData = new FormData();
            formData.append('username', this.state.username);
            formData.append('password', this.state.password);

            /*fetch('http://trainingkit.azurewebsites.net/api/Users/CheckUserExists', {
                method: 'POST',
                body: formData
            }).then((response) => {
                debugger;
                if(response.status == 200){
                    return response.json();
                }
            }).then(response => {
                debugger;
                if(response.success){
                    if(response.data){
                        alert('Login Successfully');
                        this.props.history.push("home");
                    } else {
                        alert('Invalid Credentials');
                    }
                } else {
                    alert('Unknown Error');
                }
            }).catch((exception) => {
                debugger;
            });*/
            
            fetch('http://trainingkit.azurewebsites.net/api/Users/Login', {
                method: 'POST',
                body: formData
            }).then((response) => {
                if(response.status == 200){
                    return response.json();
                }
            }).then(response => {
                if(response.success){
                    if(response.data.IsValid){
                        alert('Login Successfully');
                        var role = response.data.Role;
                        var name = response.data.UserName;   
                        sessionStorage.setItem('menu', JSON.stringify(response.data.Menu));
                        sessionStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('role', role);
                        sessionStorage.setItem('userName', name);
                        this.props.history.push("home");
                    } else {
                        alert('Invalid Credentials');
                    }
                } else {
                    alert('Unknown Error');
                }
            }).catch((exception) => {
                debugger;
            });
            
            //
        }
        
    }
    
    getErrorMessages(){
        var items = [];
        
        for(var error of this.state.errorMessages){
            items.push(<li style={{ color: 'red'}}> {error} </li>);
        }
        
        return items;
    }
    
    render() {
        return <div>
            <h3> {this.props.title} </h3>
            <div>
              <label>UserName</label>
                <input type="text" id="username" name="username" onChange={ event => this.state.username = event.target.value } placeholder="Your UserName.." />
                <span style={{ color: 'red'}}>{this.state.errorUsername} </span>
                <br/>
                <label>Password</label>
                <input type="text" id="password" name="password" onChange={ event => this.state.password = event.target.value } placeholder="Your Password.." />
                <span style={{ color: 'red'}}> {this.state.errorPassword}</span>
                <br/>
                <ul>
                    {this.getErrorMessages()}
                </ul>
                <input type="submit" value="Login" onClick={this.onLogin.bind(this)} />
            </div>
            </div>;
    }
}