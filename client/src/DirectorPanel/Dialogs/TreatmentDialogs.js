import React, { Fragment } from 'react';
import { FormDialog, QuestionDialog } from '../../Shared/Dialog';
import { TextField, Grid, Switch } from '@material-ui/core';

export class AddTreatmentTypeDialog extends React.Component { 
    constructor(props) {
    super(props)
    
    const time = new Date()
    time.setHours(0, 5)

    this.state = {
      inputs: {
        type_name: '',
        price: 0,
        duration: time,
        specs: this.props.specs.map(val => ({name: val.nazwa, checked: false}))
      },
      errors: {
        type_name: false,
        duration: false,
        specs: false
      },
      errorsLabel: {
        type_name: '',
        duration: '',
        specs: ''
      },
      isCancelled: false,
    } 
  }

  validate = () => {
    const treatmentCreate = this.props.treatments.some(treat => treat.typ === this.state.inputs.type_name)
    const hour = this.state.inputs.duration.getHours()
    const minutes = this.state.inputs.duration.getMinutes()
    return { //true means error
      errors: {
        type_name: this.state.inputs.type_name.length === 0 || treatmentCreate,
        duration: (hour === 10 && minutes) || (hour === 0 && minutes < 5),
        specs: !this.state.inputs.specs.some(val => val.checked)
      },
      errorsLabel: {
        type_name: this.state.inputs.type_name.length === 0 ? 'Pusta nazwa zabiegu' : (treatmentCreate ? 'Taki zabieg jest już oferowany' : ''),
        duration: ((hour === 10 && minutes) || (hour === 0 && minutes < 5)) ? 'Niewłaściwy format czasu <00:05 ; 10:00>' : '',
        specs: !this.state.inputs.specs.some(val => val.checked) ? 'Należy wybrać min. 1 specjalizację' : ''
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

  convertTimeToString = (time) => {
      let hour = time.getHours().toString()
      let minutes = time.getMinutes().toString()

      if(hour.length !== 2) {
          hour = '0' + hour
      }

      if(minutes.length !== 2) {
        minutes = '0' + minutes
      }

      return `${hour}:${minutes}`
    }

    convertStringToTime = (string) => {
        const [h, m] = string.split(':')
        const time = new Date()
        time.setHours(h, m)
        return time
      }

    setSpec = (name, val) => {
        const state = this.state
        const x = state.inputs.specs.find(obj => obj.name === name)
        x.checked = val
        this.setState(state)
    }

  render = () => {
    return !this.state.isCancelled && (
    <FormDialog title={this.props.title} isOpen={true} message={this.props.message} onClose={(type) => {this.submit(type)}}>

        <TextField
        autoFocus
        required
        error={this.state.errors.type_name}
        helperText={this.state.errorsLabel.type_name}
        margin="dense"
        id="type_name"
        label="Nazwa zabiegu"
        type="text"
        fullWidth
        onChange={(event) => {if(event.target.value !== null) this.setInputValue('type_name', event.target.value)}}
        inputProps={{ maxLength: 45 }}
        />

        <div>
        <label style={{"paddingRight": '5px'}}>Cena  </label>
        <input type="number" min="0" max="1000000" value={this.state.inputs.price} onChange={(event) => {this.setInputValue('price', event.target.value)}}/>
        </div>

        <div></div>

        <div>
        <label style={{"paddingRight": '5px'}}>{this.state.errors.duration ? this.state.errorsLabel.duration : 'Czas'}</label>
        <input type="time" name="duration" required min="00:05" max="10:00" value={this.convertTimeToString(this.state.inputs.duration)} onChange={(event) => {this.setInputValue('duration', this.convertStringToTime(event.target.value))}}></input>
        </div>

        <Grid container>
            {this.state.inputs.specs.length && (<Grid item xs={12}><label>{this.state.errors.specs ? this.state.errorsLabel.specs : 'Specjalizacje'}</label></Grid>)}
            {this.state.inputs.specs.map(val => (
                <Fragment>
                    <Grid item xs={4}>
                        <label style={{paddingRight: "5px"}}>{val.name}</label>
                    </Grid>
                    <Grid item xs={8}>
                        <Switch
                        checked={val.checked}
                        onChange={(event) => {if(event.target.value !== null) this.setSpec(val.name, event.target.checked)}}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </Grid>
                </Fragment>
            ))}
        </Grid>

    </FormDialog>
  )}
}

export const DeleteTreatmentTypeDialog = ({isOpen, title, onClose}) =>
  <QuestionDialog isOpen={isOpen} title={title} question="Czy jestes pewny?" answers={['cancel', 'delete']} onClose={onClose}/>