import React, { Component } from 'react'
import { API_URL } from '../constants'
import './Auth.css'

class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            error:"",
            login:false
        }
    }

    onClickHandler = async (e) => {
        e.preventDefault();
        try {
            const body = new FormData();
            body.append('email', this.state.email);
            body.append('password', this.state.password);
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: `POST`,
                body: body
            });
            const result = await response.json();
            localStorage.setItem('login', result.result);
            console.log(result)
            if(result.success){
                this.setState({error:"", login:true})
                this.props.history.push('/dashboard');
            }else {
                this.setState({error:"Login failed", login:false})
            }
        } catch (err) {
            console.log(err)
            this.setState({error:err, login:false})
        }
    }

    render() {
        return (
            <div className="login-wrapper">
                <div className="middle">
                {!this.state.login && this.state.error &&<div>Incorrect username or password</div>}
                <form onSubmit={(e) => setInterval(this.onClickHandler(e), 3000)}>
                    <h1 style={{marginBottom:"10px"}}>Login to <span style={{ fontWeight: "bolder", color:"#fff" }}>Admin Panel</span></h1>
                    <div> <input type="email" onChange={(e) => { this.setState({ email: e.target.value }) }} name="email" id="email" placeholder="Email"/></div>
                    <div style={{marginTop:"10px"}}><input type="password" name="password" id="password" onChange={(e) => { this.setState({ password: e.target.value }) }} placeholder="Password"/></div>
                    <button className="login-button">Login</button>
                </form>
                </div>
            </div>

        )
    }
}

export default Auth
