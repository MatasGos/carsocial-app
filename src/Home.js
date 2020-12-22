import React from 'react';
import { Form, Button, Card , Modal} from 'react-bootstrap';
import {Redirect, Route} from "react-router-dom";
import {Alert} from 'react-bootstrap';
import {API, LOCAL, NUMBER, TEXT} from './const'
import {login, setClient_id, UserRole} from './Auth'
import jwt_decode from "jwt-decode";

class CommentUnit extends React.Component {
  constructor(props){
    super(props)
    this.handleDel = this.handleDel.bind(this);
    this.state = {id: this.props.id}
  }
  render(){
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = {this.state.redirect}/>)
    }
    return(<Button size="sm" variant="primary" onClick={this.handleDel}>Ištrinti</Button>)
  }

async handleDel()
  {
    let response = await fetch(LOCAL+"comments/"+this.state.id, {   
        method: 'DELETE',
        headers: {
          'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
      });
      //let body = await response.json();
      if(response.status === 200){
        this.setState({error: ""})
        this.setState({redirect: "/"})
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
class CommentList extends React.Component {
  constructor(props){
    super(props)
    this.state = {comments: this.props.comments}
  }

  render(){
    let ret;
    let test = []
    
    let i;
    if (this.state.comments){
    for (i = 0; i< this.state.comments.length; i++){
      let canDelete = this.state.comments[i].fk_user == window.localStorage.getItem("id") 
      || window.localStorage.getItem("role") == "admin"
      test.push(<><h4>
        {this.state.comments[i].username}</h4>
  <h6>{this.state.comments[i].text}</h6>{canDelete && 
  <CommentUnit id={this.state.comments[i].id} forceUpdate={this.props.forceUpdate}/>}</>)

// test.push(<><Modal.Body>{this.state.comments[i].username}</Modal.Body>
//   <Modal.Header>{this.state.comments[i].text}</Modal.Header></>)
  }
}
return test
}

}
class PostUnit extends React.Component {
  constructor(props){
    super(props)
    this.state = {post: this.props.post, show: false, error: null, redirect: null, car: "", cars: "",
      text: "", comments: null, commentCount: false, showComment: false, commentText: ""
    
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSaveComment = this.handleSaveComment.bind(this);
    this.showComment = this.showComment.bind(this);
    this.getCar()
    this.getComments()
    this.setState({commentCount: false});
    if (this.state.comments != null){
      if(this.state.comments.length > 0)
        this.setState({commentCount: this.state.comments.length});
    }
    this.getCar()
  }
  render() 
  {
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = {this.state.redirect}/>)
    }
    const canEdit = this.state.post.fkuser === window.localStorage.getItem("id") || window.localStorage.getItem("role") === "admin"

    let modal = <Modal show={this.state.show} onHide={this.handleClick} >
    <Modal.Header closeButton>
      <Modal.Title>Redaguoti įrašą</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form>
      <Form.Group controlId="exampleForm.ControlTextarea1">
      <Form.Label>Redaguoti įrašą</Form.Label>
      <Form.Control as="textarea" rows={3} name="text" value={this.state.text} maxLength="500" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
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

   let modalShow
   if(this.state.showComment){
   modalShow = <Modal show={this.state.showComment} onHide={this.showComment} >
    <Modal.Header closeButton>
      <Modal.Title>Komentarai</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {<CommentList comments={this.state.comments} forceUpdate={this.props.forceUpdate}/>}
    </Modal.Body>
    <Modal.Footer>
      <Form>
      <Form.Group controlId="exampleForm.ControlTextarea1" >
        <Form.Label>Naujas Komentaras</Form.Label>
        <Form.Control as="textarea" rows={3} name="commentText" value={this.state.commentText} maxLength="500" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
        </Form.Group>
        <Button variant="primary" onClick={this.handleSaveComment}>
        Išsaugoti
      </Button>
      </Form>
      
    </Modal.Footer>
  </Modal>
   }
  
    return(  
    <Card
    bg="light"
    text='dark'
    style={{ width: '18rem' }}
    className="mb-2 mt-4"
  >
    <Card.Header>{this.state.car.manufacturer+" "+this.state.car.model+" "+this.state.car.color+" "+this.state.car.year}</Card.Header>
    <Card.Body>
    {this.state.error &&
        <Alert variant='danger'>
        {this.state.error}
        </Alert>}
    {this.state.car.text===null || this.state.car.text===""
     ? <></>
     : <><Card.Text>{this.state.post.text}</Card.Text></>
    }
      {canEdit &&<Button variant="primary" type="submit" className="mr-2" onClick={this.handleClick}>
       Redaguoti
      </Button>}
      {canEdit &&<Button variant="primary" type="submit" onClick={this.handleDelete}>
       Ištrinti
      </Button>}
    </Card.Body>
    <Card.Footer>
      <small className="text-muted" onClick={this.showComment}>Komentarai: {this.state.comments !=null && <>{this.state.comments.length}</>}</small>
    </Card.Footer>
    {modal}
    {modalShow}
  </Card>
  )}

  async handleSaveComment()
  {
    const data = {
      "text":this.state.commentText,
      "fk_post":this.state.post.id
    }
    let response = await fetch(LOCAL+"comments/", {   
        method: 'POST',
        headers: {
          'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      //let body = await response.json();
      if(response.status === 200){
        this.setState({error: ""})
        this.setState({redirect: "/"})
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
  async handleDelete(){
    let response = await fetch(LOCAL+"posts/"+this.state.post.id, {
        method: 'DELETE',
        //mode: 'no-cors',
        headers: {
          'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
      });
      //let body = await response.json();
      if(response.status === 200){
        this.setState({error: "", redirect: "/", vin: this.state.car.vin, plate: this.state.car.plate, 
        color: this.state.car.color, manufacturer: this.state.car.manufacturer, model: this.state.car.model})
        
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
    "text":this.state.text
  }
  let response = await fetch(LOCAL+"posts/"+this.state.post.id, {   
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
      this.setState({redirect: "/"})
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
async showComment(event){
  if(this.state.showComment){
    this.getComments()
  }
  this.setState({showComment: !this.state.showComment})
}
async handleClick(event){
  this.setState({text: this.state.post.text})
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
async getCar(){
  let response = await fetch(LOCAL+"cars/"+this.state.post.fk_car , {
    method: 'GET',
    headers: {
      'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
      'Content-Type': 'application/json'
    }
  });
  if(response.status === 200){
    let body = await response.json();
    this.setState({error: "", car: body})
  }else if (response.status === 404)
  {
    this.setState({error: "Puslapis nerastas", isLoading: false});
    this.setState({redirect: "/404"})
  }else{
    this.setState({error: "Serverio klaida", isLoading: false});
  }  
}
async getComments(){
  let response = await fetch(LOCAL+"post/"+this.state.post.id , {
    method: 'GET',
    headers: {
      'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
      'Content-Type': 'application/json'
    }
  });
  if(response.status === 200){
    let body = await response.json();
    this.setState({error: "", comments: body})
  }else if (response.status === 404)
  {
    this.setState({error: "Puslapis nerastas", isLoading: false});
    this.setState({redirect: "/404"})
  }else{
    this.setState({error: "Serverio klaida", isLoading: false});
  }  
}
}

class CarsList extends React.Component {
  constructor(props){
    super(props)
    this.state = {cars: this.props.cars}
  }

  render(){
    let ret;
    let test = []
    let i;
    if (!this.state.car){
    for (i = 0; i< this.state.cars.length; i++){
      test.push(<option key = {this.state.cars[i].id} value={this.state.cars[i].id}>
        {this.state.cars[i].manufacturer+" "+this.state.cars[i].model+" "+this.state.cars[i].year+" "+
      this.state.cars[i].color}</option>)
  }
}
return test
}
}


export class HomeView extends React.Component {
    constructor(props){
        super(props)
        
        this.handleClick = this.handleClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = ({isLoggedIn : UserRole(), cars:null, user:"", car:null,
        redirect: null, error: null, load: false, body: null, show: false
      });
      this.getCars()
    }

    render(){
    if(this.state.redirect){
      this.props.forceUpdate(); 
      return(<Redirect to = {this.state.redirect}/>)
    }
  
    let post;
    let form;
    let modal
      modal = 
      <Modal show={this.state.show} onHide={this.handleClick}>
      <Modal.Header closeButton>
        <Modal.Title>Redaguoti įrašą</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Naujas įrašas</Form.Label>
        <Form.Control as="textarea" rows={3} name="text" value={this.state.text} maxLength="500" pattern={TEXT} title="Netinkami simboliai" onChange={this.handleInputChange}/> 
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlSelect1" >
        <Form.Label>Example select</Form.Label>
        <Form.Control as="select" name="car" key={this.state.car} value={this.state.car} onChange={this.handleInputChange}>
        {<CarsList cars={this.state.cars} forceUpdate={this.props.forceUpdate}/>}
      </Form.Control>
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

    if(this.state.body){
      let i;
      form = []
      if (UserRole()>0) {
        post = <Button variant="secondary" size="lg" value="Reset" size="small" className="mt-2" 
        onClick={this.handleClick}>Pridėti naują</Button>
        }
      for (i = 0; i< this.state.body.length; i++){
        let unit = this.state.body[i] 
        form.push(<PostUnit post={this.state.body[i]} car={this.car} forceUpdate={this.props.forceUpdate}/>)
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
      if(!this.state.show){
        this.getCars()
      }
      this.setState({show: !this.state.show, text: ""})
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
          let response = await fetch(LOCAL+"posts/" , {
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
            "fk_car":0 ,
            "text":this.state.text
          }
        let response = await fetch(LOCAL+"posts/", {
            method: 'POST',
            headers: {
              'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
          });
          if(response.status === 200){
            this.setState({error: ""})
            this.setState({redirect: "/"})
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
    async getCars(){
      let response = await fetch(LOCAL+"cars/", {
        method: 'GET',
        headers: {
          'Authorization': 'BEARER '+ window.localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      });
      if(response.status === 200){
        let body = await response.json();
        this.setState({error: "", cars: body})
      }else if (response.status === 404)
      {
        this.setState({error: "Puslapis nerastas", isLoading: false});
        this.setState({redirect: "/404"})
      }else{
        this.setState({error: "Serverio klaida", isLoading: false});
      }  
    }
    
  }
  
  






