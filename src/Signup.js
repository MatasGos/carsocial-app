import React from 'react';
import { Form, Button } from 'react-bootstrap';
import {Redirect, Route} from "react-router-dom";
import {Alert} from 'react-bootstrap';
import {API, LOCAL, NUMBER, TEXT} from './const'
import {login, setClient_id, UserRole} from './Auth'
import jwt_decode from "jwt-decode";

export class Signup extends React.Component {
    constructor(props){
        super(props)
        this.state = ({isLoggedIn : UserRole(), email: "", password: "", name: "", username: "", phone: "" ,
        redirect: null, error: null, lol: "", load: false
      });
        this.handleSignup = this.handleSignup.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);       
    }
  //   {
  //     "name": "aaaaa@admin.admin",
  //     "username": "aaaa",
  //     "phone": "", optional
  //     "email": "aaa@aaaa.aaa",
  //     "password": "admin"
  // },

    render(){
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = "/login"/>)
    }
    let form;
      
      form = <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>El. paštas</Form.Label>
        <Form.Control type="email" name="email" placeholder="Įveskite El. paštą" maxLength="40" required="required" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Slaptažodis</Form.Label>
        <Form.Control type="password" name="password" placeholder="Įveskite slaptažodį" maxLength="40" required="required" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tel. numeris</Form.Label>
        <Form.Control type="text" name="phone" placeholder="Įveskite numerį" maxLength="12" pattern={NUMBER} title="Netinkamas numeris" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Vardas</Form.Label>
        <Form.Control type="text" name="name" placeholder="Įveskite vardą" maxLength="50" pattern={TEXT} title="Naudojami netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Vartotojo slapyvardis</Form.Label>
        <Form.Control type="text" name="username" placeholder="Įveskite unikalų vardą" maxLength="30" pattern={TEXT} title="Naudojami netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Button variant="primary" type="submit" onClick={this.handleSignup}>Registruotis</Button>
      </Form>

      return (
        <div>
        {form}
        </div>
      );
    }
    async handleSignup(event){
      event.preventDefault();
      if(this.state.load){
        return
      }
        const data = {
            "email": this.state.email,
            "password": this.state.password,
            "phone":this.state.phone,
            "name":this.state.name,
            "username":this.state.username
          }
        let response = await fetch(LOCAL+"users/", {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: "["+JSON.stringify(data)+"]" // body data type must match "Content-Type" header
          });
          //let body = await response.json();
          if(response.status === 200){
            this.setState({error: ""})
            this.setState({redirect: true})
          }else if (response.status === 400)
          {
            this.setState({error: "Klaidingi duomenys", isLoading: false});
          }else if (response.status === 404)
          {
            this.setState({error: "Puslapis nerastas", isLoading: false});
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
