import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { FormDialog, QuestionDialog } from '../../Shared/Dialog';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Switch from '@material-ui/core/Switch';

export class AddEmployeeDialog extends React.Component {
    static parseDate = (date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      }
      
    static today = AddEmployeeDialog.parseDate(new Date())
  
    constructor(props) {
    super(props)
    this.state = {
      inputs: {
        user: null,
        pesel: '',
        name: '',
        surname: '',
        jobType: this.props.jobsTypes[0],
        date_of_employment: AddEmployeeDialog.today,

        monday_work: true,
        tuesday_work: true,
        wednesday_work: true,
        thursday_work: true,
        friday_work: true
      },
      errors: {
        pesel: false,
        name: false,
        surname: false,
        date_of_employment: false
      },
      errorsLabel: {
        pesel: '',
        name: '',
        surname: '',
        date_of_employment: ''
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const userCreated = this.props.employees.some(row => row.pesel === this.state.inputs.pesel)
    const containsChars = Array.from(this.state.inputs.pesel).some((val) => val < '0' || val > '9')

    return { //true means error
      errors: {
        pesel: this.state.inputs.pesel.length !== 11 || containsChars || userCreated,
        name: !this.state.inputs.name.length,
        surname: !this.state.inputs.surname.length,
        date_of_employment: this.state.inputs.date_of_employment > AddEmployeeDialog.today
      },
      errorsLabel: {
        pesel: this.state.inputs.pesel.length !== 11  || containsChars? 'Niewłaściwy numer pesel' : (userCreated ? 'Taki uzytkownik juz istnieje' : ''),
        name: !this.state.inputs.name.length ? 'Puste imie' : '',
        surname: !this.state.inputs.surname.length ? 'Puste nazwisko': '',
        date_of_employment: this.state.inputs.date_of_employment > AddEmployeeDialog.today ? 'Niewłaściwa data zatrudnienia' : ''
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
        
        <label style={{paddingRight: "5px"}}>Użytkownik </label>
            <select name="Użytkownik" onChange={(event) => {
            this.setInputValue('user', event.target.value)
            }}
            >
            <option value={null} selected>---</option>
            {this.props.users.map(user => <option value={user.nazwa}>{user.nazwa}</option>)}
        </select>

        <div></div>

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

        <label style={{paddingRight: "5px"}}>Etat </label>
            <select name="Etat" onChange={(event) => {
            this.setInputValue('jobType', event.target.value)
            }}
            >
            {this.props.jobsTypes.map((jobType, indx) => <option value={jobType} selected={indx === 0}>{jobType}</option>)}
        </select>

        <div></div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Data zatrudnienia"
            error={this.state.errors.date_of_employment}
            helperText={this.state.errorsLabel.date_of_employment}
            format="MM/dd/yyyy"
            value={this.state.inputs.date_of_employment}
            onChange={(date) => {if(date !== null) this.setInputValue('date_of_employment', AddEmployeeDialog.parseDate(date))}}
            KeyboardButtonProps={{
            'aria-label': 'change date',
            }}
            />
      </MuiPickersUtilsProvider>

        <Grid container>
            <Grid item xs={2}>
                <label style={{paddingRight: "5px"}}>Poniedziałek</label>
            </Grid>
            <Grid item xs={10}>
                <Switch
                checked={this.state.inputs.monday_work}
                onChange={(event) => {if(event.target.value !== null) this.setInputValue('monday_work', event.target.checked)}}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </Grid>

            <Grid item xs={2}>
                <label style={{paddingRight: "5px"}}>Wtorek</label>
            </Grid>
            <Grid item xs={10}>
                <Switch
                checked={this.state.inputs.tuesday_work}
                onChange={(event) => {if(event.target.value !== null) this.setInputValue('tuesday_work', event.target.checked)}}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </Grid>

            <Grid item xs={2}>
                <label style={{paddingRight: "5px"}}>Środa</label>
            </Grid>
            <Grid item xs={10}>
                <Switch
                checked={this.state.inputs.wednesday_work}
                onChange={(event) => {if(event.target.value !== null) this.setInputValue('wednesday_work', event.target.checked)}}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </Grid>

            <Grid item xs={2}>
                <label style={{paddingRight: "5px"}}>Czwartek</label>
            </Grid>
            <Grid item xs={10}>
                <Switch
                checked={this.state.inputs.thursday_work}
                onChange={(event) => {if(event.target.value !== null) this.setInputValue('thursday_work', event.target.checked)}}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </Grid>

            <Grid item xs={2}>
                <label style={{paddingRight: "5px"}}>Piątek</label>
            </Grid>
            <Grid item xs={10}>
                <Switch
                checked={this.state.inputs.friday_work}
                onChange={(event) => {if(event.target.value !== null) this.setInputValue('friday_work', event.target.checked)}}
                inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </Grid>
        </Grid>
    </FormDialog>
  )}
}

export const DeleteEmployeeDialog = ({isOpen, title, onClose}) =>
  <QuestionDialog isOpen={isOpen} title={title} question="Czy jestes pewny?" answers={['cancel', 'delete']} onClose={onClose}/>