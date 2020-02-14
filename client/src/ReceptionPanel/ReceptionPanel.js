import React from 'react';
import SQLTable from '../Shared/SQLTable';
import { Select, MenuItem, IconButton } from '@material-ui/core';
import { Refresh } from '../Shared/Refresh';
import DbmsFetch from '../Shared/DbmsFetch';
import { Redirect } from 'react-router-dom';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { AddPatientDialog, EditPatientDialog, SignTreatmentDialog } from './Dialogs';

export default class ReceptionPanel extends React.Component {
    constructor(props) {
        super(props)
        this.pesel = [] //reference to string
        this.state = {
            clickedRows: [],
            selectedTable: 1,
            ready: false,
            redirect: false
        }
        this.dialogs = {
            'addPatient': {
                open: false
            },
            'editPatient': {
                open: false
            },
            'signTreatment': {
                open: false
            }
        }
        this.state['tables'] = [
                {
                    name: 'Zabiegi pacjentów', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Zabiegi pacjentów', 'show patients cards'),
                    selectable: true,
                    selectRowCheckbox: true
                },
                {
                    name: 'Kartoteka pacjentów', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Kartoteka pacjentów', 'show table patients'),
                    selectable: true,
                    selectRowCheckbox: true
                },
                {
                    name: 'Lekarze prowadzący zabieg', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Lekarze prowadzący zabieg', 'show assignment doctors', 'id_lekarze_zabieg', null, () => this.state.clickedRows[0].id_lekarze_zabieg),
                    selectable: false,
                    selectRowCheckbox: false,
                    returnsTo: 'Zabiegi pacjentów'
                },
                {
                    name: 'Oferowane zabiegi', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Oferowane zabiegi', 'show treatments services'),
                    selectable: true,
                    selectRowCheckbox: true
                }
            ]

        this.fetch = new DbmsFetch(this.props.connection, this.props.user).fetch
        this.getPesel().then(() => {
            this.state.tables[this.state.selectedTable].get()
        })
    }

    getPesel = () => {
        return (
            this.fetch('show pesel')
            .then(json => {
                if(json.error) {
                    alert(json.error)
                } else {
                    if(json.pesel == null) {
                        alert('Nie skonfigurowano konta pracownika.')
                        const state = this.state
                        state.redirect = true
                        this.setState(state)
                    } else {
                        this.pesel.push(json.pesel) //reference to string
                    }
                }
            })
            .catch(error => {
                alert(error)
            })
        )
    }

    retrieveData = (tableName, operation, dataName, data, functionRetrieveData) => {
        if(typeof functionRetrieveData === 'function') {
            data = functionRetrieveData()
        }
        
        this.fetch(operation, dataName, data)
        .then(json => {
            if(json.error) {
                alert(json.error)
            } else {
                const state = this.state
                const indx = state.tables.findIndex((val, indx) => val.name === tableName)
                state.tables[indx].headers = json.headers
                state.tables[indx].rows = json.rows
                state.clickedRows = []
                this.setState(state)
                this.reload()
            }
        })
        .catch(error => {
            alert(error)
        })
    }

    addPatient = () => {
        let data = this.props.user
        data['patient'] = this.dialogs.addPatient.data

        /*
        {
            login: null,
            password: null,
            type: null
        }
        */
        
        fetch(`http://${this.props.connection.ip}:${this.props.connection.port}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              operation: 'add patient',
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.error) {
                alert(json.error)
              } else {
                this.state.tables[this.state.selectedTable].get()
                this.reload()
              }
          })
          .catch(error => {
              alert(error)
          })
    }

    editPatient = () => {
        let data = this.props.user
        data['patient'] = this.dialogs.editPatient.data
        data.patient.pesel = this.state.clickedRows[0].pesel

        /*
        {
            login: null,
            password: null,
            type: null
        }
        */
        
        fetch(`http://${this.props.connection.ip}:${this.props.connection.port}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              operation: 'edit patient',
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.error) {
                alert(json.error)
              } else {
                this.state.tables[this.state.selectedTable].get()
                this.reload()
              }
          })
          .catch(error => {
              alert(error)
          })
    }

    signTreatment = () => {
        let data = this.props.user
        data['patient'] = this.dialogs.signTreatment.data
        data.patient['treatmentType'] = this.state.clickedRows[0].typ

        /*
        {
            login: null,
            password: null,
            type: null
        }
        */
        
        fetch(`http://${this.props.connection.ip}:${this.props.connection.port}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              operation: 'sign treatment',
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.error) {
                alert(json.error)
              } else {
                alert(`Termin zabiegu: ${json.date}`)
                this.state.tables[this.state.selectedTable].get()
                this.reload()
              }
          })
          .catch(error => {
              alert(error)
          })
    }

    onRowClick = (rows) => {
        const state = this.state
        state.clickedRows = rows
        this.setState(state)
    }

    reload = () => {
        const state = this.state
        state.clickedRows = []
        this.setState(state)
        this.ready = false  
    }

    changeTable = (name) => {
        const state = this.state
        state.selectedTable = this.state.tables.findIndex(table => table.name === name)
        this.setState(state)
        
        state.tables[state.selectedTable].get()
    }

    closeDialog = (id, status) => {
        this.dialogs[id].open = false
        switch(id) {
            case 'addPatient':
                if(status === 'done') {
                    this.addPatient()
                }
            break

            case 'editPatient':
                if(status === 'done') {
                    this.editPatient()
                }
            break

            case 'signTreatment':
                if(status === 'done') {
                    this.signTreatment()
                }
            break

            default:
        }
        
        this.reload()
    }

    set ready(value) {
        const state = this.state
        state.ready = value 
        this.setState(state) 
    }

    openDialog = (id) => {
        this.dialogs[id].open = true
        this.forceUpdate()
    }

    render = () => {
        return(
            <div> 
                <Refresh value={this.state.ready} onRefresh={() => {this.ready = true}}>
                    <SQLTable headers={this.state.tables[this.state.selectedTable].headers} rows={this.state.tables[this.state.selectedTable].rows} onRowClick={this.onRowClick} 
                    selectRowChecbox={this.state.tables[this.state.selectedTable].selectRowCheckbox}>
                        
                        {this.state.tables[this.state.selectedTable].name === 'Kartoteka pacjentów' && (
                            <span>
                                <IconButton onClick={this.openDialog.bind(this, 'addPatient')}>
                                    <AddOutlinedIcon/>
                                </IconButton>
                                
                                <IconButton onClick={() => {if(this.state.clickedRows.length === 1) this.openDialog('editPatient'); else alert('Wybierz 1 wiersz')}}>
                                    <EditOutlinedIcon/>
                                </IconButton>
                            </span>
                        )}
                        
                        {this.state.tables[this.state.selectedTable].name === 'Oferowane zabiegi' && (
                            <IconButton onClick={() => {if(this.state.clickedRows.length === 1) 
                            {
                                if(this.state.tables[1].rows.length) {
                                    this.openDialog('signTreatment');
                                } else {
                                    alert('Brak pacjentów')
                                }
                            } 
                            else alert('Wybierz 1 wiersz')}}>
                                <AddOutlinedIcon/>
                            </IconButton>
                        )}
                        
                        {this.state.tables[this.state.selectedTable].name === 'Zabiegi pacjentów' && (
                            <IconButton onClick={() => {if(this.state.clickedRows.length === 1) this.changeTable('Lekarze prowadzący zabieg'); else alert('Wybierz 1 wiersz')}}>
                                <InfoOutlinedIcon/>
                            </IconButton>
                        )}

                        {this.state.tables[this.state.selectedTable].name === 'Lekarze prowadzący zabieg' && (
                            <IconButton onClick={() => {this.changeTable(this.state.tables[this.state.selectedTable].returnsTo)}}>
                                <KeyboardBackspaceOutlinedIcon/>
                            </IconButton>
                        )}

                        {this.state.tables[this.state.selectedTable].selectable && (
                            <Select value={this.state.tables[this.state.selectedTable].name} onChange={(event) => this.changeTable(event.target.value)}>
                                {this.state.tables.map(table => table.selectable ? <MenuItem value={table.name}>{table.name}</MenuItem> : null)}
                            </Select>
                        )}
                        <label style={{'text-decoration': 'underline'}}>{this.pesel}</label> 
                    </SQLTable>
                </Refresh>

                {this.dialogs.addPatient.open && (
                    <AddPatientDialog onClose={this.closeDialog.bind(this, 'addPatient')} title="Dodaj pacjenta"
                    setData={(data) => {data.date_of_birth = data.date_of_birth.toISOString().slice(0, 19).replace('T', ' '); this.dialogs.addPatient.data = data}} 
                    users={this.state.tables[this.state.selectedTable].rows}/>
                )}

                {this.dialogs.editPatient.open && (
                    <EditPatientDialog onClose={this.closeDialog.bind(this, 'editPatient')} title="Edytuj pacjenta"
                    setData={(data) => {
                        data.date_of_birth = data.date_of_birth.toISOString().slice(0, 19).replace('T', ' ');
                        if(data.date_of_death) {
                            data.date_of_death = data.date_of_death.toISOString().slice(0, 19).replace('T', ' ');
                        }
                        this.dialogs.editPatient.data = data
                    }} 
                    users={this.state.tables[this.state.selectedTable].rows}
                    selectedPatient={this.state.clickedRows[0]}
                    />
                )}

                {this.dialogs.signTreatment.open && (
                    <SignTreatmentDialog onClose={this.closeDialog.bind(this, 'signTreatment')} title="Zapisz zabieg"
                    setData={(data) => {this.dialogs.signTreatment.data = data}} 
                    pesels={this.state.tables[1].rows.map((val) => val.pesel)}/>
                )}

                {this.state.redirect && (<Redirect to='/login'/>)}
            </div>
        )
    }
}