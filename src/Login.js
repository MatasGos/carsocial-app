import React from 'react';
import { Form, Button } from 'react-bootstrap';
import {Redirect, Route} from "react-router-dom";
import {Alert} from 'react-bootstrap';
import {API, LOCAL} from './const'
import {login, setClient_id, UserRole} from './Auth'
import jwt_decode from "jwt-decode";

export class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = ({isLoggedIn : UserRole(), email: "", password: "", redirect: null, error: null, lol: "", load: false});
        this.handleLogin = this.handleLogin.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }


    render(){
    if(this.state.redirect){
      this.props.forceUpdate();
      return(<Redirect to = {this.state.redirect}/>)
    }
    console.log(this.state.redirect)
    let form;
    let userRole = UserRole();
    if(userRole ===0)
    {
        form =  <div className="mb-4"><Form >
        <Form.Group controlId="formBasicEmail">
          <Form.Label>El. paštas</Form.Label>
          <Form.Control type="email" name="email" placeholder="Įvesti El. paštas" onChange={this.handleInputChange}
          required="required" maxLength="40" value={this.state.email}/>
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Slaptažodis</Form.Label>
          <Form.Control type="password" name="password" placeholder="Slaptažodis" onChange={this.handleInputChange}
          required="required" maxLength="40" value={this.state.password}/>
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
        <h1>{this.state.lol}</h1>
        {this.state.error &&
        <Alert variant='danger'>
        {this.state.error}
        </Alert>}
        </Form.Group>
        <Button variant="primary" type="submit" onClick={this.handleLogin}>
         Prisijungti
        </Button>
      </Form>
      </div>

      }
      else
      {
          form = <Redirect to="/"/>
      }
      return (
        <div className='mt-5 mb-5'>
        <div className="container" >
        <div id="login">
        {form}
        </div>
        </div>
        </div>
      );
    }
    async handleLogin(event){
      event.preventDefault();
      if(this.state.load){
        return
      }
        const data = {
            "email": this.state.email,
            "password": this.state.password
          }
        let response = await fetch(LOCAL+"login/", {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          });
          //let body = await response.json();
          if(response.status === 200){
            this.setState({error: ""})
            let tokenBody = await response.json()
            window.localStorage.setItem("token", tokenBody.token)
            window.localStorage.setItem("id", jwt_decode(window.localStorage.getItem("token")).id)
            window.localStorage.setItem("role",  jwt_decode(window.localStorage.getItem("token")).role)
            window.localStorage.setItem("exp",  jwt_decode(window.localStorage.getItem("token")).exp)
            this.setState({redirect: "/"})
          }else if (response.status === 400)
          {
            this.setState({error: "Klaidingi duomenys", isLoading: false});
          }else if (response.status === 404)
          {
            this.setState({error: "Vartotojas neegzistuoja", isLoading: false});
          }else{
            this.setState({error: "Serverio klaida", isLoading: false});
          }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
      }
  }
  export class Logout extends React.Component {
    constructor(props){
      super(props)
      window.localStorage.clear()
      this.props.forceUpdate();
      //this.props.history.replace("/")
    }

    render(){
      return(<Redirect to = "/"/>)
    }
  }