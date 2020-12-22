import React from 'react';
import { Form, Button, Card , Modal} from 'react-bootstrap';
import {Redirect, Route} from "react-router-dom";
import {Alert} from 'react-bootstrap';
import {API, LOCAL, NUMBER, TEXT} from './const'
import {login, setClient_id, UserRole} from './Auth'
import jwt_decode from "jwt-decode";

class CarUnit extends React.Component {
  constructor(props){
    super(props)
    this.state = {car: this.props.car, show: false, error: null, redirect: null,
      plate: "", vin: "", model: "", manufacturer: "", color: ""
    
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  render() 
  {
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = {this.state.redirect}/>)
    }
    const canEdit = this.state.car.fkuser === window.localStorage.getItem("id") || window.localStorage.getItem("role") === "admin"

    let modal = <Modal show={this.state.show} onHide={this.handleClick}>
    <Modal.Header closeButton>
      <Modal.Title>Redaguoti profilį</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Gamintojas</Form.Label>
        <Form.Control type="text" name="manufacturer" value={this.state.manufacturer} maxLength="20" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Modelis</Form.Label>
        <Form.Control type="text" name="model" value={this.state.model} maxLength="20" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>VIN</Form.Label>
        <Form.Control type="text" name="vin" value={this.state.vin} maxLength="50" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Registruoti numeriai</Form.Label>
        <Form.Control type="text" name="plate" value={this.state.plate} maxLength="10" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Spalva</Form.Label>
        <Form.Control type="text" name="color" value={this.state.color} maxLength="12" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
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
    
    
    return(  
    <Card
    bg="light"
    text='dark'
    style={{ width: '18rem' }}
    className="mb-2 mt-4"
  >
    <Card.Header>{this.state.car.manufacturer+" "+this.state.car.model}</Card.Header>
    <Card.Body>
    {this.state.error &&
        <Alert variant='danger'>
        {this.state.error}
        </Alert>}
    {this.state.car.color===null || this.state.car.color===""
     ? <></>
     : <><Card.Title>Spalva</Card.Title><Card.Text>{this.state.car.color}</Card.Text></>
    }
    {this.state.car.year===null || this.state.car.year===""
     ? <></>
     : <><Card.Title>Metai</Card.Title><Card.Text>{this.state.car.year}</Card.Text></>
    }
    {this.state.car.plate===null || this.state.car.plate===""
     ? <></>
     : <><Card.Title>Numeris</Card.Title><Card.Text>{this.state.car.plate}</Card.Text></>
    }
      {canEdit &&<Button variant="primary" type="submit" className="mr-2" onClick={this.handleClick}>
       Redaguoti
      </Button>}
      {canEdit &&<Button variant="primary" type="submit" onClick={this.handleDelete}>
       Ištrinti
      </Button>}
    </Card.Body>
    {modal}
  </Card>
  )}
  async handleDelete(){
    let response = await fetch(LOCAL+"cars/"+this.state.car.id, {
        method: 'DELETE',
        //mode: 'no-cors',
        headers: {
          'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
      });
      //let body = await response.json();
      if(response.status === 200){
        this.setState({error: "", redirect: "/auto", vin: this.state.car.vin, plate: this.state.car.plate, 
        color: this.state.car.color, manufacturer: this.state.car.manufacturer, model: this.state.car.model})
        this.setState({redirect: "/auto"})
        
      }else if (response.status === 400)
      {
        this.setState({error: "Negalimas veiksmas", isLoading: false});
      }else if (response.status === 404)
      {
        this.setState({error: "Puslapis nerastas", isLoading: false});
      }else{
        this.setState({error: "Serverio klaida", isLoading: false});
      }  
}
async handleSave(){
  const data = {
    "model":this.state.model,
    "manufacturer":this.state.manufacturer,
    "vin":this.state.vin,
    "plate":this.state.plate,
    "color":this.state.color
  }
  let response = await fetch(LOCAL+"cars/"+this.state.car.id, {   
      method: 'PUT',
      //mode: 'no-cors',
      headers: {
        'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    //let body = await response.json();
    if(response.status === 200){
      this.setState({error: ""})
      this.setState({redirect: "/auto"})
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
async handleClick(event){
  this.setState({show: !this.state.show})
  this.setState({ error: "", vin: this.state.car.vin, plate: this.state.car.plate, 
  color: this.state.car.color, manufacturer: this.state.car.manufacturer, model: this.state.car.model})
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

export class CarsView extends React.Component {
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = ({isLoggedIn : UserRole(), model:"", manufacturer:"", year:"", vin:"", color:"", plate:"",
        redirect: null, error: null, lol: "", load: false, body: null, show: false
      });
    }

    render(){
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = {this.state.redirect}/>)
    }
    
    //{this.state.body.username}
    let post;
    let form;
    let modal = 
    <Modal show={this.state.show} onHide={this.handleClick}>
    <Modal.Header closeButton>
      <Modal.Title>Prideti automobili</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Gamintojas</Form.Label>
        <Form.Control type="text" name="manufacturer" value={this.state.manufacturer} maxLength="20" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Modelis</Form.Label>
        <Form.Control type="text" name="model" value={this.state.model} maxLength="20" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>VIN</Form.Label>
        <Form.Control type="text" name="vin" value={this.state.vin} maxLength="50" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Registruoti numeriai</Form.Label>
        <Form.Control type="text" name="plate" value={this.state.plate} maxLength="10" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Spalva</Form.Label>
        <Form.Control type="text" name="color" value={this.state.color} maxLength="12" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Metai</Form.Label>
        <Form.Control type="number" name="year" value={this.state.year} maxLength="4" pattern={NUMBER} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
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
  </Modal>;
    if(this.state.body){
      let i;
      form = []
      if (UserRole()>0) {
      post = <Button variant="secondary" size="lg" value="Reset" size="small" className="mt-2" 
      onClick={this.handleClick}>Pridėti naują</Button>
      }
      for (i = 0; i< this.state.body.length; i++){
      let unit = this.state.body[i] 
      form.push(<CarUnit car={this.state.body[i]} forceUpdate={this.props.forceUpdate}/>)
      }
    }

      return (
        
        <div className="container">
        <div style={{"margin": "0 auto", "display": "table"}}>
        {post}
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
          let response = await fetch(LOCAL+"cars/" , {
            method: 'GET',
            headers: {
              'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
              'Content-Type': 'application/json'
            }
          });
          if(response.status === 200){
            let body = await response.json();
            this.setState({error: "", body: body})
          }else if (response.status === 404)
          {
            this.setState({error: "Puslapis nerastas", isLoading: false});
            this.setState({redirect: "/404"})
          }else{
            this.setState({error: "Serverio klaida", isLoading: false});
          }  
      }
      handleEdit
      async handleSave(){
        const data = {
            "manufacturer":this.state.manufacturer,
            "model":this.state.model,
            "vin":this.state.vin,
            "plate":this.state.plate,
            "year":this.state.year,
            "color":this.state.color
          }
        let response = await fetch(LOCAL+"cars/", {
            method: 'POST',
            headers: {
              'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
              'Content-Type': 'application/json'
            },
            body: "["+JSON.stringify(data)+"]" // body data type must match "Content-Type" header
          });
          if(response.status === 200){
            this.setState({error: ""})
            this.setState({redirect: "/auto"})
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
  
  





