import React from 'react';
import { TextField } from '@material-ui/core';
import { FormDialog } from '../Shared/Dialog';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export class AddPatientDialog extends React.Component {
  static parseDate = (date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  }
  
  static today = AddPatientDialog.parseDate(new Date())
  
  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        pesel: '',
        name: '',
        surname: '',
        date_of_birth: AddPatientDialog.today
      },
      errors: {
        pesel: false,
        name: false,
        surname: false,
        date_of_birth: false
      },
      errorsLabel: {
        pesel: '',
        name: '',
        surname: '',
        date_of_birth: ''
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const userCreated = this.props.users.some(row => row.pesel === this.state.inputs.pesel)
    const containsChars = Array.from(this.state.inputs.pesel).some((val) => val < '0' || val > '9')

    return { //true means error
      errors: {
        pesel: this.state.inputs.pesel.length !== 11 || containsChars || userCreated,
        name: !this.state.inputs.name.length,
        surname: !this.state.inputs.surname.length,
        date_of_birth: this.state.inputs.date_of_birth > AddPatientDialog.today
      },
      errorsLabel: {
        pesel: this.state.inputs.pesel.length !== 11  || containsChars? 'Niewłaściwy numer pesel' : (userCreated ? 'Taki uzytkownik juz istnieje' : ''),
        name: !this.state.inputs.name.length ? 'Puste imie' : '',
        surname: !this.state.inputs.surname.length ? 'Puste nazwisko': '',
        date_of_birth: this.state.inputs.date_of_birth > AddPatientDialog.today ? 'Niewłaściwa data urodzenia' : ''
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
      label="Imie"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('name', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <TextField
      autoFocus
      required
      error={this.state.errors.surname}
      helperText={this.state.errorsLabel.surname}
      margin="dense"
      id="surname"
      label="Nazwisko"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('surname', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <TextField
      autoFocus
      required
      error={this.state.errors.pesel}
      helperText={this.state.errorsLabel.pesel}
      margin="dense"
      id="pesel"
      label="Pesel"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('pesel', event.target.value)}}
      inputProps={{ maxLength: 11 }}
      />

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
        margin="normal"
        id="date-picker-dialog"
        label="Data urodzenia"
        error={this.state.errors.date_of_birth}
        helperText={this.state.errorsLabel.date_of_birth}
        format="MM/dd/yyyy"
        value={this.state.inputs.date_of_birth}
        onChange={(date) => {if(date !== null) this.setInputValue('date_of_birth', AddPatientDialog.parseDate(date))}}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        />
      </MuiPickersUtilsProvider>

    </FormDialog>
  )}
}

export class EditPatientDialog extends React.Component {
  static parseDate = (date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  }

  static today = EditPatientDialog.parseDate(new Date())
  
  constructor(props) {
    super(props)
    
    this.state = {
      inputs: {
        name: this.props.selectedPatient.imie,
        surname: this.props.selectedPatient.nazwisko,
        date_of_birth: new Date(this.props.selectedPatient.data_urodzenia),
      },
      errors: {
        name: false,
        surname: false,
        date_of_birth: false,
      },
      errorsLabel: {
        name: '',
        surname: '',
        date_of_birth: '',
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const wrongBornInput = this.state.inputs.date_of_birth > EditPatientDialog.today

    return { //true means error
      errors: {
        name: !this.state.inputs.name.length,
        surname: !this.state.inputs.surname.length,
        date_of_birth: wrongBornInput,
      },
      errorsLabel: {
        name: !this.state.inputs.name.length ? 'Puste imie' : '',
        surname: !this.state.inputs.surname.length ? 'Puste nazwisko': '',
        date_of_birth: wrongBornInput ? 'Niewłaściwa data urodzenia' : '',
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
      label="Imie"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('name', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <TextField
      autoFocus
      required
      error={this.state.errors.surname}
      helperText={this.state.errorsLabel.surname}
      value={this.state.inputs.surname}
      margin="dense"
      id="surname"
      label="Nazwisko"
      type="text"
      fullWidth
      onChange={(event) => {if(event.target.value !== null) this.setInputValue('surname', event.target.value)}}
      inputProps={{ maxLength: 45 }}
      />

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
        margin="normal"
        id="date-picker-dialog"
        label="Data urodzenia"
        error={this.state.errors.date_of_birth}
        helperText={this.state.errorsLabel.date_of_birth}
        format="MM/dd/yyyy"
        value={this.state.inputs.date_of_birth}
        onChange={(date) => {if(date !== null) this.setInputValue('date_of_birth', EditPatientDialog.parseDate(date))}}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        />
      </MuiPickersUtilsProvider>

    </FormDialog>
  )}
}

export class SignTreatmentDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: {
        pesel: this.props.pesels[0]
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
      
      <label>Pesel </label>
      <select name="Pesel" onChange={(event) => {
          this.setInputValue('pesel', event.target.value)
        }}
      >
        {this.props.pesels.map((pesel, indx) => <option value={pesel} selected={indx === 0}>{pesel}</option>)}
      </select>
    </FormDialog>
  )}
}