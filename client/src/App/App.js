import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from '../SignIn/SignIn';
import AdminPanel from '../AdminPanel/AdminPanel';
import DirectorPanel from '../DirectorPanel/DirectorPanel';
import DoctorPanel from '../DoctorPanel/DoctorPanel';
import ReceptionPanel from '../ReceptionPanel/ReceptionPanel';
import PrivateRoute from '../Shared/PrivateRoute';

class App extends React.Component {
  
  connection = {
    ip: '127.0.0.1',
    port:'1234'
  }

  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }

    window.addEventListener('popstate', ev => {
      this.setState(ev.state)
    })
  }

  set user(user) {
    this.setState({user: user})
    window.history.pushState(this.state, 'App', '/login')
  }

  get user() {
    return this.state.user
  }

  render = () => {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            <SignIn connection={this.connection} onLogged={(usr) => {this.user = usr}}/>
          </Route>

          <PrivateRoute exact path="/konto/administrator" accountTypeUser={this.user['account-type']} accountTypeComponent="administrator">
            <AdminPanel connection={this.connection} user={this.user}/>
          </PrivateRoute>

          <PrivateRoute exact path="/konto/dyrektor" accountTypeUser={this.user['account-type']} accountTypeComponent="dyrektor">
            <DirectorPanel connection={this.connection} user={this.user}/>
          </PrivateRoute>

          <PrivateRoute exact path="/konto/recepcja" accountTypeUser={this.user['account-type']} accountTypeComponent="recepcja">
            <ReceptionPanel connection={this.connection} user={this.user}/>
          </PrivateRoute>

          <PrivateRoute exact path="/konto/lekarz" accountTypeUser={this.user['account-type']} accountTypeComponent="lekarz">
            <DoctorPanel connection={this.connection} user={this.user}/>
          </PrivateRoute>
        </Switch>

        <Redirect exact from="/" to="/login"/>
      </BrowserRouter>
    );
  }
}

export default App;
