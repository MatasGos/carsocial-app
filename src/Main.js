import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import {MyNavbar} from './Navbar';
import ReactDOM from 'react-dom';
import {UserRole} from './Auth'
import {Login, Logout} from './Login'
import {UserView} from './Users'
import {Signup} from './Signup'
import {Home} from './Home'
import {Four04} from './404'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

import './Main.css';

export class App extends React.Component {
    refresh = () => {
    this.forceUpdate();
}

    render(){
        let route;
        let userRole = UserRole();
        if(userRole === 2){
            route = <Switch>
            <Route exact path="/logout" component={(props) => (<Logout forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/users/:id(\d+)" component={(props) => (<UserView forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/user" component={(props) => (<UserView forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/" component={(props) => (<Home forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/404" component={(props) => (<Four04 forceUpdate={this.refresh} {...props}/>)}></Route>
            
            <Route path="/"><Redirect to = "/404"/></Route>
            </Switch>
        } else if(userRole === 1){
            route = <Switch>
            <Route exact path="/logout" component={(props) => (<Logout forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/user" component={(props) => (<UserView forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/" component={(props) => (<Home forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/404" component={(props) => (<Four04 forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route path="/"><Redirect to = "/404"/></Route>
            </Switch>
        }else{
            route = <Switch>
            <Route exact path="/login" component={(props) => (<Login forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/signup" component={(props) => (<Signup forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/" component={(props) => (<Home forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route exact path="/404" component={(props) => (<Four04 forceUpdate={this.refresh} {...props}/>)}></Route>
            <Route path="/"><Redirect to = "/404"/></Route>
            </Switch>
        }

        return(
        <div>
            <MyNavbar/>
            <div className="bodypage">
            {route}
            </div>
        </div>
            );
    }
}


