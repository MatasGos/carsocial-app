import React from 'react';
import { Form, Button, Card , Modal} from 'react-bootstrap';
import {Redirect, Route} from "react-router-dom";
import {Alert} from 'react-bootstrap';
import {API, LOCAL, NUMBER, TEXT} from './const'
import {login, setClient_id, UserRole} from './Auth'
import jwt_decode from "jwt-decode";

export class UserView extends React.Component {
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = ({isLoggedIn : UserRole(), name:"", phone:"", username:"",
        redirect: null, error: null, lol: "", load: false, body: null, show: false
      });
    }
//this.props.match.params.id 
    render(){
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = {this.state.redirect}/>)
    }
    
    //{this.state.body.username}
    
    let form;
    let modal;
    if(this.state.body != null){form = 
      
    <Card
      bg="light"
      text='dark'
      style={{ width: '18rem' }}
      className="mb-2 mt-4"
    >
      <Card.Header>Mano profilis</Card.Header>
      <Card.Body>
      <Card.Title>El. Paštas</Card.Title>
        <Card.Text>
        {this.state.body.email}
        </Card.Text>
        <Card.Title>Slapyvardis</Card.Title>
        <Card.Text>
        {this.state.body.username}
        </Card.Text>
        <Card.Title>Vardas</Card.Title>
        <Card.Text>
        {this.state.body.name ? this.state.body.name : "-"}
        </Card.Text>
        <Card.Title>Narys nuo</Card.Title>
        <Card.Text>
        {this.state.body.usercreated}
        </Card.Text>
        <Card.Title>Tel. Numeris</Card.Title>
        <Card.Text>
        {this.state.body.phone ? this.state.body.phone : "-"}
        </Card.Text>
        <Card.Title>Role</Card.Title>
        <Card.Text>
        {this.state.body.role ? this.state.body.role : "-"}
        </Card.Text>
        <Button variant="primary" type="submit" onClick={this.handleClick}>
         Redaguoti
        </Button>
      </Card.Body>
    </Card>
    modal = <Modal show={this.state.show} onHide={this.handleClick}>
    <Modal.Header closeButton>
      <Modal.Title>Redaguoti profilį</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tel. numeris</Form.Label>
        <Form.Control type="text" name="phone" value={this.state.phone} maxLength="12" pattern={NUMBER} title="Netinkamas numeris" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Vardas</Form.Label>
        <Form.Control type="text" name="name" value={this.state.name} maxLength="50" pattern={TEXT} title="Naudojami netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Vartotojo slapyvardis</Form.Label>
        <Form.Control type="text" name="username" value={this.state.username} maxLength="30" pattern={TEXT} title="Naudojami netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      {this.state.error &&
        <Alert variant='danger'>
        {this.state.error}
        </Alert>}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={this.handleSave}>
        Išsaugoti
      </Button>
    </Modal.Footer>
  </Modal>
    }

      return (
        
        <div className="container">
        <div style={{"margin": "0 auto", "display": "table"}}>
        {form}
        {modal}
        </div>
        </div>
      );
    }
    async handleClick(event){
      this.setState({show: !this.state.show})
    }
    handleInputChange(event) {
      
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }
    async componentDidMount(){
        //let response = await fetch(LOCAL+"users/"+this.props.match.params.id , {
          let response = await fetch(LOCAL+"users/"+window.localStorage.getItem("id") , {
            method: 'GET',
            headers: {
              'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
              'Content-Type': 'application/json'
            }
          });
          if(response.status === 200){
            let body = await response.json();
            this.setState({error: "", body: body})
            this.setState({phone: this.state.body.phone, name: this.state.body.name, username: this.state.body.username})
          }else if (response.status === 404)
          {
            this.setState({error: "Puslapis nerastas", isLoading: false});
            this.setState({redirect: "/404"})
          }else{
            this.setState({error: "Serverio klaida", isLoading: false});
          }  
      }
      async handleSave(){
        const data = {
            "phone":this.state.phone,
            "name":this.state.name,
            "username":this.state.username
          }
        let response = await fetch(LOCAL+"users/"+window.localStorage.getItem("id"), {
            method: 'PUT',
            //mode: 'no-cors',
            headers: {
              'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          });
          //let body = await response.json();
          if(response.status === 200){
            this.setState({error: ""})
            this.setState({redirect: "/user"})
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
  }
  
  





  export class UserEdit extends React.Component {
    constructor(props){
        super(props)
        this.state = ({isLoggedIn : UserRole(), 
        redirect: null, error: null, lol: "", load: false
      });
        this.handleSignup = this.handleSignup.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);       
    }

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

