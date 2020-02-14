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
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import { AddJobTypeDialog, EditJobTypeDialog, DeleteJobTypeDialog } from './Dialogs/JobDialogs';
import { AddEmployeeDialog, DeleteEmployeeDialog } from './Dialogs/EmployeeDialogs';
import { AddEmployeeSpecDialog } from './Dialogs/EmployeeSpecDialog';
import { AddSpecDialog, EditSpecDialog, DeleteSpecDialog } from './Dialogs/Specialization';
import { AddTreatmentTypeDialog, DeleteTreatmentTypeDialog } from './Dialogs/TreatmentDialogs';

export default class DirectorPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            clickedRows: [],
            selectedTable: 1,
            ready: false,
            redirect: false
        }
        this.dialogs = {
            'addJobType': { //ok
                open: false
            },
            'editJobType': { //ok
                open: false
            },
            'deleteJobType': { //ok
                open: false
            },
            'addEmployee': { //ok
                open: false
            },
            'deleteEmployee': { //ok
                open: false
            },
            'addEmployeeSpecialization': { //ok
                open: false
            },
            'addSpecialization': { //ok
                open: false
            },
            'editSpecialization': { //ok
                open: false
            },
            'deleteSpecialization': { //ok
                open: false
            },
            'addTreatmentType': {
                open: false
            },
            'deleteTreatmentType': {
                open: false
            }
        }
        this.state['tables'] = [
                {
                    name: 'Etaty', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Etaty', 'show full time'),
                    selectable: true,
                    selectRowCheckbox: true
                },
                {
                    name: 'Pracownicy', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Pracownicy', 'show employee'),
                    selectable: true,
                    selectRowCheckbox: true,
                    needTable: [0, 5]
                },
                {
                    name: 'Specjalizacje lekarza', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Specjalizacje lekarza', 'show doctor specializations', 'pesel', null, () => this.state.tables[2].selectedRowsPrevTable[0].pesel),
                    selectable: false,
                    selectRowCheckbox: false,
                    returnsTo: 'Pracownicy',
                    needTable: [3],
                    selectedRowsPrevTable: []
                },
                {
                    name: 'Lista specjalizacji', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Lista specjalizacji', 'show specializations'),
                    selectable: true,
                    selectRowCheckbox: true
                },
                {
                    name: 'Oferowane zabiegi', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Oferowane zabiegi', 'show treatments services'),
                    selectable: true,
                    selectRowCheckbox: true,
                    needTable: [3]
                },
                {
                    name: 'Uzytkownicy', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Uzytkownicy', 'show users')
                },
            ]

        this.fetch = new DbmsFetch(this.props.connection, this.props.user).fetch
        const table = this.state.tables[this.state.selectedTable]
        table.get()
    }

    retrieveData = (tableName, operation, dataName, data, functionRetrieveData) => {
        if(typeof functionRetrieveData === 'function') {
            data = functionRetrieveData()
        }

        const table = this.state.tables.find(val => val.name === tableName)
        if(table.needTable) {
            for(const t of table.needTable) {
                this.state.tables[t].get()
            }
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

    addJobType = () => {
        let data = this.props.user
        data['job'] = this.dialogs.addJobType.data

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
              operation: 'add job type',
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

    editJobType = () => {
        let data = this.props.user
        data['job'] = this.dialogs.editJobType.data
        data.job['prevName'] = this.state.clickedRows[0].nazwa_etatu

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
              operation: 'edit job type',
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

    deleteJobType = () => {
        let data = this.props.user
        data['jobs'] = this.state.clickedRows

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
              operation: 'delete job type',
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

    addEmployee = () => {
        let data = this.props.user
        data['employee'] = this.dialogs.addEmployee.data

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
              operation: 'add employee',
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

    deleteEmployee = () => {
        let data = this.props.user
        data['employees'] = this.state.clickedRows

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
              operation: 'delete employee',
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

    addEmployeeSpecialization = () => {
        let data = this.props.user
        data['specialization'] = this.dialogs.addEmployeeSpecialization.data
        data.specialization.pesel = this.state.tables[2].selectedRowsPrevTable[0].pesel

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
              operation: 'add employee specialization',
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

    addSpecialization = () => {
        let data = this.props.user
        data['specialization'] = this.dialogs.addSpecialization.data

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
              operation: 'add specialization',
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

    editSpecialization = () => {
        let data = this.props.user
        data['specialization'] = this.dialogs.editSpecialization.data
        data.specialization.spec_name = this.state.clickedRows[0].nazwa

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
              operation: 'edit specialization',
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

    deleteSpecialization = () => {
        let data = this.props.user
        data['specializations'] = this.state.clickedRows

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
              operation: 'delete specialization',
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

    addTreatmentType = () => {
        let data = this.props.user
        data['treatment'] = this.dialogs.addTreatmentType.data
        

        const hour = data.treatment.duration.getHours()
        const minutes = data.treatment.duration.getMinutes()

        data.treatment.duration = `${hour}:${minutes}`
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
              operation: 'add treatment type',
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

    deleteTreatmentType = () => {
        let data = this.props.user
        data['treatments'] = this.state.clickedRows

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
              operation: 'delete treatments',
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
        this.reload()
    }

    closeDialog = (id, status) => {
        this.dialogs[id].open = false

        switch(id) {
            case 'addJobType':
                if(status === 'done') {
                    this.addJobType()
                }
            break

            case 'editJobType':
                if(status === 'done') {
                    this.editJobType()
                }
            break

            case 'deleteJobType':
                if(status === 'delete') {
                    this.deleteJobType()
                }
            break

            case 'addEmployee':
                if(status === 'done') {
                    this.addEmployee()
                }
            break

            case 'deleteEmployee':
                if(status === 'delete') {
                    this.deleteEmployee()
                }
            break

            case 'addEmployeeSpecialization':
                if(status === 'done') {
                    this.addEmployeeSpecialization()
                }
            break

            case 'addSpecialization':
                if(status === 'done') {
                    this.addSpecialization()
                }
            break

            case 'editSpecialization':
                if(status === 'done') {
                    this.editSpecialization()
                }
            break

            case 'deleteSpecialization':
                if(status === 'delete') {
                    this.deleteSpecialization()
                }
            break

            case 'addTreatmentType':
                if(status === 'done') {
                    this.addTreatmentType()
                }
            break

            case 'deleteTreatmentType':
                if(status === 'delete') {
                    this.deleteTreatmentType()
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
                        

                        {this.state.tables[this.state.selectedTable].name === 'Etaty' && (
                            <span>
                                <IconButton onClick={this.openDialog.bind(this, 'addJobType')}>
                                    <AddOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={() => {if(this.state.clickedRows.length === 1) this.openDialog('editJobType'); else alert('Wybierz 1 wiersz')}}>
                                    <EditOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={() => {if(this.state.clickedRows.length > 0) { 
                                        if(this.state.clickedRows.filter((val) => val.nazwa_etatu === 'lekarz').length > 0) {
                                            alert('Nie można usunąć predefiniowanego etatu.')
                                        } else {
                                            this.openDialog('deleteJobType')
                                        }
                                    }
                                    else alert('Wybierz min. 1 wiersz')}}>
                                    

                                    <RemoveCircleOutlineOutlinedIcon/>
                                </IconButton>
                            </span>
                        )}
                        
                        {this.state.tables[this.state.selectedTable].name === 'Pracownicy' && (
                            <span>
                                <IconButton onClick={() => {if(this.state.clickedRows.length === 1) {
                                        if(this.state.clickedRows[0].etat === 'lekarz') {
                                            const state = this.state
                                            state.tables[2].selectedRowsPrevTable = this.state.clickedRows
                                            this.setState(state)
                                            this.changeTable('Specjalizacje lekarza');
                                        } else {
                                            alert('Specjalizacje dostępne jedynie dla lekarzy')
                                        }
                                    } 
                                    else alert('Wybierz 1 wiersz')}}>
                                    <InfoOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={this.openDialog.bind(this, 'addEmployee')}>
                                    <AddOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={() => {if(this.state.clickedRows.length > 0) this.openDialog('deleteEmployee'); else alert('Wybierz min. 1 wiersz')}}>
                                    <RemoveCircleOutlineOutlinedIcon/>
                                </IconButton>
                            </span>
                        )}

                        {this.state.tables[this.state.selectedTable].name === 'Specjalizacje lekarza' && (
                            <span>
                            <IconButton onClick={this.openDialog.bind(this, 'addEmployeeSpecialization')}>
                                <AddOutlinedIcon/>
                            </IconButton>

                            <IconButton onClick={() => {this.changeTable(this.state.tables[this.state.selectedTable].returnsTo)}}>
                                <KeyboardBackspaceOutlinedIcon/>
                            </IconButton>
                            </span>
                        )}

                        {this.state.tables[this.state.selectedTable].name === 'Lista specjalizacji' && (
                            <span>
                                <IconButton onClick={this.openDialog.bind(this, 'addSpecialization')}>
                                    <AddOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={() => {if(this.state.clickedRows.length === 1) this.openDialog('editSpecialization'); else alert('Wybierz 1 wiersz')}}>
                                    <EditOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={() => {if(this.state.clickedRows.length) this.openDialog('deleteSpecialization'); else alert('Wybierz min. 1 wiersz')}}>
                                    <RemoveCircleOutlineOutlinedIcon/>
                                </IconButton>
                            </span>
                        )}

                        {this.state.tables[this.state.selectedTable].name === 'Oferowane zabiegi' && (
                            <span>
                                <IconButton onClick={this.openDialog.bind(this, 'addTreatmentType')}>
                                    <AddOutlinedIcon/>
                                </IconButton>

                                <IconButton onClick={() => {if(this.state.clickedRows.length) this.openDialog('deleteTreatmentType'); else alert('Wybierz min. 1 wiersz')}}>
                                    <RemoveCircleOutlineOutlinedIcon/>
                                </IconButton>
                            </span>
                        )}

                        {this.state.tables[this.state.selectedTable].selectable && (
                            <Select value={this.state.tables[this.state.selectedTable].name} onChange={(event) => this.changeTable(event.target.value)}>
                                {this.state.tables.map(table => table.selectable ? <MenuItem value={table.name}>{table.name}</MenuItem> : null)}
                            </Select>
                        )}
                        <label style={{'text-decoration': 'underline'}}>{this.pesel}</label> 
                    </SQLTable>
                </Refresh>

                {this.dialogs.addJobType.open && (
                    <AddJobTypeDialog onClose={this.closeDialog.bind(this, 'addJobType')} title="Dodaj etat"
                    setData={(data) => {this.dialogs.addJobType.data = data}} 
                    jobs={this.state.tables[this.state.selectedTable].rows}/>
                )}

                {this.dialogs.editJobType.open && (
                    <EditJobTypeDialog onClose={this.closeDialog.bind(this, 'editJobType')} title="Edytuj etat"
                    setData={(data) => {this.dialogs.editJobType.data = data}} 
                    selected={this.state.clickedRows[0]}/>
                )}

                <DeleteJobTypeDialog isOpen={this.dialogs.deleteJobType.open} onClose={this.closeDialog.bind(this, 'deleteJobType')} 
                title={this.state.clickedRows.length>1 ? "Usun etaty" : "Usun etat"}/>


                {this.dialogs.addEmployee.open && (
                    <AddEmployeeDialog onClose={this.closeDialog.bind(this, 'addEmployee')} title="Dodaj pracownika"
                    setData={(data) => {data.date_of_employment = data.date_of_employment.toISOString().slice(0, 10); this.dialogs.addEmployee.data = data}} 
                    jobsTypes={this.state.tables[0].rows.map(val => val.nazwa_etatu)}
                    employees={this.state.tables[1].rows}
                    users={this.state.tables[5].rows.filter(val => !val.pesel)}
                    />
                )}

                <DeleteEmployeeDialog isOpen={this.dialogs.deleteEmployee.open} onClose={this.closeDialog.bind(this, 'deleteEmployee')} 
                title={this.state.clickedRows.length>1 ? "Usun pracowników" : "Usun pracownika"}/>

                {this.dialogs.addEmployeeSpecialization.open && (
                    <AddEmployeeSpecDialog onClose={this.closeDialog.bind(this, 'addEmployeeSpecialization')} title="Dodaj specjalizacje"
                    setData={(data) => {data.date_of_gain_spec = data.date_of_gain_spec.toISOString().slice(0, 10); this.dialogs.addEmployeeSpecialization.data = data}} 
                    specs={
                    this.state.tables[3].rows.filter(x => 
                    !(this.state.tables[2].rows.find(val => val.nazwa_specjalizacji === x.nazwa))).map(val => val.nazwa)
                    }
                    />
                )}

                {this.dialogs.addSpecialization.open && (
                    <AddSpecDialog onClose={this.closeDialog.bind(this, 'addSpecialization')} title="Dodaj specjalizacje"
                    setData={(data) => {this.dialogs.addSpecialization.data = data}} 
                    specs={this.state.tables[3].rows}
                    />
                )}

                {this.dialogs.editSpecialization.open && (
                    <EditSpecDialog onClose={this.closeDialog.bind(this, 'editSpecialization')} title="Edytuj płace dodatkową"
                    setData={(data) => {this.dialogs.editSpecialization.data = data}} 
                    selected={this.state.clickedRows[0]}
                    />
                )}
                
                <DeleteSpecDialog isOpen={this.dialogs.deleteSpecialization.open} onClose={this.closeDialog.bind(this, 'deleteSpecialization')} 
                title="Usun specjalizacje"/>

                {this.dialogs.addTreatmentType.open && (
                    <AddTreatmentTypeDialog onClose={this.closeDialog.bind(this, 'addTreatmentType')} title="Dodaj zabieg"
                    setData={(data) => {this.dialogs.addTreatmentType.data = data}} 
                    treatments={this.state.tables[4].rows}
                    specs={this.state.tables[3].rows}
                    />
                )}

                <DeleteTreatmentTypeDialog isOpen={this.dialogs.deleteTreatmentType.open} onClose={this.closeDialog.bind(this, 'deleteTreatmentType')} 
                title={this.state.clickedRows.length>1 ? "Usun zabiegi" : "Usun zabieg"}/>

                {this.state.redirect && (<Redirect to='/login'/>)}
            </div>
        )
    }
}