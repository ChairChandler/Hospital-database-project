import React from 'react';
import { FormDialog, QuestionDialog } from '../../Shared/Dialog';
import { TextField } from '@material-ui/core';

export class AddSpecDialog extends React.Component { 
    constructor(props) {
    super(props)
    this.state = {
      inputs: {
        spec_name: '',
        payment: 0,
      },
      errors: {
        spec_name: false,
      },
      errorsLabel: {
        spec_name: '',
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const specsCreate = this.props.specs.some(spec => spec.nazwa === this.state.inputs.spec_name)
    return { //true means error
      errors: {
        spec_name: this.state.inputs.spec_name.length === 0 || specsCreate,
      },
      errorsLabel: {
        spec_name: this.state.inputs.spec_name.length === 0 ? 'Pusta nazwa specjalizacji' : (specsCreate ? 'Taka specjalizacja już istnieje' : ''),
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
        error={this.state.errors.spec_name}
        helperText={this.state.errorsLabel.spec_name}
        margin="dense"
        id="spec_name"
        label="Nazwa specjalizacji"
        type="text"
        fullWidth
        onChange={(event) => {if(event.target.value !== null) this.setInputValue('spec_name', event.target.value)}}
        inputProps={{ maxLength: 45 }}
        />

        <label style={{"paddingRight": '5px'}}>Płaca dodatkowa  </label>
        <input type="number" min="0" max="30000" value={this.state.inputs.payment} onChange={(event) => {this.setInputValue('payment', event.target.value)}}/>

    </FormDialog>
  )}
}

export class EditSpecDialog extends React.Component { 
    constructor(props) {
    super(props)
    this.state = {
      inputs: {
        payment: this.props.selected.placa,
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
      
        this.props.setData(this.state.inputs)
        this.exit()
        this.props.onClose(button)
    }
  }

  render = () => {
    return !this.state.isCancelled && (
    <FormDialog title={this.props.title} isOpen={true} message={this.props.message} onClose={(type) => {this.submit(type)}}>

        <label style={{"paddingRight": '5px'}}>Płaca dodatkowa  </label>
        <input type="number" min="0" max="30000" value={this.state.inputs.payment} onChange={(event) => {this.setInputValue('payment', event.target.value)}}/>

    </FormDialog>
  )}
}

export const DeleteSpecDialog = ({isOpen, title, onClose}) =>
  <QuestionDialog isOpen={isOpen} title={title} question="Czy jestes pewny?" answers={['cancel', 'delete']} onClose={onClose}/>