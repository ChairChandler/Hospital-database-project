import React from 'react';
import { TextField } from '@material-ui/core';
import { FormDialog, QuestionDialog } from '../Shared/Dialog';

export class AddUserDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        login: '',
        password: '',
        type: null
      },
      errors: {
        login: false,
        password: false
      },
      errorsLabel: {
        login: '',
        password: ''
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const userCreated = this.props.users.some(row => row.nazwa === this.state.inputs.login)

    return { //true means error
      errors: {
        login: !this.state.inputs.login.length || userCreated,
        password: !this.state.inputs.password.length
      },
      errorsLabel: {
        login: !this.state.inputs.login.length ? 'Pusty login' : (userCreated ? 'Taki uzytkownik juz istnieje' : ''),
        password: !this.state.inputs.password.length ? 'Puste haslo' : ''
      }
    }
  }

  setInputValue = (name, val) => {
    const state = this.state
    state.inputs[name] = val
    this.setState(state)
  }

  exit = () => {
    const state = this.state
    state.isCancelled = true
    this.setState(state)
  }

  setErrors = (errors, label) => {
    const state = this.state
    state.errors = errors
    state.errorsLabel = label
    this.setState(state)
  }

  submit = (button) => {
    if(button === 'cancel') {
      this.exit()
      this.props.onClose(button)
    } else {
      const errors = this.validate()
      const isError = Object.keys(errors.errors).some(key => errors.errors[key])
      
      if(isError) {
        this.setErrors(errors.errors, errors.errorsLabel)
      } else {
        this.props.setData(this.state.inputs)
        this.exit()
        this.props.onClose(button)
      }
    }
  }

  render = () => {
    return !this.state.isCancelled && (
    <FormDialog title={this.props.title} isOpen={true} message={this.props.message} onClose={(type) => {this.submit(type)}}>
      
      <TextField
      autoFocus
      required
      error={this.state.errors.login}
      helperText={this.state.errorsLabel.login}
      margin="dense"
      id="login"
      label="Login"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('login', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <TextField
      autoFocus
      required
      error={this.state.errors.password}
      helperText={this.state.errorsLabel.password}
      margin="dense"
      id="password"
      label="Haslo"
      type="password"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('password', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <select name="Typ" onChange={(event) => {
        if(event.target.value === 'null') {
          this.setInputValue('type', null)
        } else {
          this.setInputValue('type', event.target.value)
        }}}
      >

        <option value="null" selected>---</option>
        {this.props.types.map(type => <option value={type}>{type}</option>)}

      </select>
    </FormDialog>
  )}
}

export class EditUserDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        password: null,
        type: this.props.selected.rola
      },
      isCancelled: false,
    } 
  }

  setInputValue = (name, val) => {
    const state = this.state
    state.inputs[name] = val
    this.setState(state)
  }

  exit = () => {
    const state = this.state
    state.isCancelled = true
    this.setState(state)
  }

  submit = (button) => {
    if(button === 'done') {
      this.props.setData(this.state.inputs)
    }

    this.exit()
    this.props.onClose(button)
  }

  render = () => {
    return !this.state.isCancelled && (
    <FormDialog title={this.props.title} isOpen={true} message={this.props.message} onClose={(type) => {this.submit(type)}}>
      
      <TextField
      autoFocus
      margin="dense"
      id="password"
      label="Haslo"
      type="password"
      fullWidth
      onChange={(event) => {this.setInputValue('password', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <select name="Typ" onChange={(event) => {
        if(event.target.value === 'null') {
          this.setInputValue('type', null)
        } else {
          this.setInputValue('type', event.target.value)
        }}}
      >

        <option value="null" selected={this.props.selected.rola == null}>---</option>
        {this.props.types.map(type => <option value={type} selected={this.props.selected.rola === type}>{type}</option>)}

      </select>
    </FormDialog>
  )}
}

export const DeleteUserDialog = ({isOpen, title, onClose}) =>
    <QuestionDialog isOpen={isOpen} title={title} question="Czy jestes pewny?" answers={['cancel', 'delete']} onClose={onClose}/>