import React from 'react';
import { TextField } from '@material-ui/core';
import { FormDialog, QuestionDialog } from '../../Shared/Dialog';

export class AddJobTypeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        name: '',
        payment: 0
      },
      errors: {
        name: false
      },
      errorsLabel: {
        name: '',
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const jobTypeCreate = this.props.jobs.some(job => job.nazwa_etatu === this.state.inputs.name)
    return { //true means error
      errors: {
        name: jobTypeCreate || !this.state.inputs.name.length,
      },
      errorsLabel: {
        name: jobTypeCreate? 'Etat już istnieje' : (!this.state.inputs.name.length ? 'Puste imie' : '')
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
      error={this.state.errors.name}
      helperText={this.state.errorsLabel.name}
      margin="dense"
      id="name"
      label="Etat"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('name', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

    <label style={{"paddingRight": '5px'}}>Płaca podstawowa  </label>
     <input type="number" min="0" max="30000" value={this.state.inputs.payment} onChange={(event) => {this.setInputValue('payment', event.target.value)}}/>

    </FormDialog>
  )}
}

export class EditJobTypeDialog extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        inputs: {
          name: this.props.selected.nazwa_etatu,
          payment: this.props.selected.placa_pod
        },
        errors: {
          name: false
        },
        errorsLabel: {
          name: '',
        },
        isCancelled: false,
        isDoctor: this.props.selected.nazwa_etatu === 'lekarz'
      } 
    }
  
    validate = () => {
        return { //true means error
          errors: {
            name: !this.state.inputs.name.length || (this.state.isDoctor && this.state.inputs.name !== 'lekarz') || (!this.state.isDoctor && this.state.inputs.name === 'lekarz')
          },
          errorsLabel: {
            name: !this.state.inputs.name.length ? 'Puste imie' : (this.state.isDoctor && this.state.inputs.name !== 'lekarz' ? 'Edycja predefiniowanego etatu zabroniona' : 
            (!this.state.isDoctor && this.state.inputs.name === 'lekarz' ? 'Nie można użyć predefiniowanego etatu': ''))
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
        error={this.state.errors.name}
        helperText={this.state.errorsLabel.name}
        value={this.state.inputs.name}
        margin="dense"
        id="name"
        label="Etat"
        type="text"
        fullWidth
        onChange={(event) => {if(event.target.value !== null) this.setInputValue('name', event.target.value)}}
        inputProps={{ maxLength: 45 }}
        />
  
        <label style={{"paddingRight": '5px'}}>Płaca podstawowa  </label>
       <input type="number" min="0" max="30000" value={this.state.inputs.payment} onChange={(event) => {this.setInputValue('payment', event.target.value)}}/>
  
      </FormDialog>
    )}
  }

export const DeleteJobTypeDialog = ({isOpen, title, onClose}) =>
  <QuestionDialog isOpen={isOpen} title={title} question="Czy jestes pewny?" answers={['cancel', 'delete']} onClose={onClose}/>