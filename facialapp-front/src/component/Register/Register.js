import React from 'react';
var validator = require("email-validator");

class Register extends React.Component {
    constructor(){
        super();
        this.state= {
            email: '',
            password: '',
            name: '',
            Error: ''
        }
    }
    onEmailChange = (event) =>{
        this.setState({email: event.target.value})
    }
    onPasswordChange = (event) =>{
        this.setState({password : event.target.value})
    }
    onNameChange = (event) =>{
        this.setState({name : event.target.value})
    }
    onSignup = () =>{
        if (!this.state.name){
            this.setState({Error: "name required"})}

        else if(!validator.validate(this.state.email)) {
            this.setState({Error: "Email not valid"})
        }
        else if (this.state.password.length < 6){
            this.setState({Error: "password too short"})
        }
        else{
            fetch('https://facialreco.herokuapp.com/register',
        {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name

            })
        })
        .then(response => response.json())
        .then(user => {
            if (user === 'user exists'){
                this.setState({Error: "account already exists"})
                return;
            }
            if (user) 
            {
            this.props.onRouteChange('signin');
            }
        }) 
        }       
        }
          
    
    render(){
        // const {onRouteChange} = this.props;
    return (
        <article className="shadow-4 br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input
                            onChange={this.onNameChange}
                            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="text" 
                            name="name"  
                            id="name"/>
                        </div>

                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                            onChange={this.onEmailChange}
                            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" 
                            name="email-address"  
                            id="email-address"/>
                        </div>

                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                            onChange={this.onPasswordChange}
                            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="password" 
                            name="password"  
                            id="password"/>
                        </div>
                    </fieldset>
                    
                    <div>
                        <input
                        onClick={this.onSignup}
                        className="b ph3 pv2  ba b--black bg-transparent pointer f6 dib" 
                        type="submit" 
                        value="Sign up"/>
                    </div>
                        <p id="error" className="red animated shake">
                        {this.state.Error}</p>

                </div>
            </main>
        </article>
    );
}
}

export default Register;