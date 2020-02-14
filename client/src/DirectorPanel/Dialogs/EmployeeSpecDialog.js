import React from 'react';
import { FormDialog } from '../../Shared/Dialog';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export class AddEmployeeSpecDialog extends React.Component {
    static parseDate = (date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      }
      
    static today = AddEmployeeSpecDialog.parseDate(new Date())
  
    constructor(props) {
    super(props)
    this.state = {
      inputs: {
        spec_name: this.props.specs[0],
        date_of_gain_spec: AddEmployeeSpecDialog.today,
      },
      errors: {
        spec_name: !this.props.specs[0],
        date_of_gain_spec: false
      },
      errorsLabel: {
        spec_name: !this.props.specs[0] ? 'Przypisano już wszystkie możliwe specjalizacje' : '',
        date_of_gain_spec: ''
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    return { //true means error
      errors: {
        spec_name: !this.state.inputs.spec_name,
        date_of_gain_spec: this.state.inputs.date_of_gain_spec > AddEmployeeSpecDialog.today
      },
      errorsLabel: {
        spec_name: !this.state.inputs.spec_name ? 'Przypisano już wszystkie możliwe specjalizacje' : '',
        date_of_gain_spec: this.state.inputs.date_of_gain_spec > AddEmployeeSpecDialog.today ? 'Niewłaściwa data zatrudnienia' : ''
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

        <label style={{paddingRight: "5px"}}>{this.state.errors.spec_name === true ?  this.state.errorsLabel.spec_name : 'Specjalizacja'} </label>
            
            {!this.state.errors.spec_name && (

                <select name="Specjalizacja" onChange={(event) => {
                this.setInputValue('spec_name', event.target.value)
                }}
                >
                {this.props.specs.map((spec, indx) => <option value={spec} selected={indx === 0}>{spec}</option>)}
                </select>
            )}
        

        <div></div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Data uzyskania specjalizacji"
            error={this.state.errors.date_of_gain_spec}
            helperText={this.state.errorsLabel.date_of_gain_spec}
            format="MM/dd/yyyy"
            value={this.state.inputs.date_of_gain_spec}
            onChange={(date) => {if(date !== null) this.setInputValue('date_of_gain_spec', AddEmployeeSpecDialog.parseDate(date))}}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
      </MuiPickersUtilsProvider>
    </FormDialog>
  )}
}