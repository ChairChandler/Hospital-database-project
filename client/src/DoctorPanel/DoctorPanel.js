import React from 'react';
import SQLTable from '../Shared/SQLTable';
import { Select, MenuItem, IconButton } from '@material-ui/core';
import { Refresh } from '../Shared/Refresh';
import DbmsFetch from '../Shared/DbmsFetch';
import { Redirect } from 'react-router-dom';
import AccessibleOutlinedIcon from '@material-ui/icons/AccessibleOutlined';
import KeyboardBackspaceOutlinedIcon from '@material-ui/icons/KeyboardBackspaceOutlined';

export default class DoctorPanel extends React.Component {
    constructor(props) {
        super(props)
        this.pesel = [] //reference to string
        this.state = {
            clickedRows: [],
            selectedTable: 1,
            ready: false,
            redirect: false
        }

        this.state['tables'] = [
                {
                    name: 'Karta pacjenta', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Karta pacjenta', 'show patients cards'),
                    selectable: true,
                    selectRowCheckbox: true
                },
                {
                    name: 'Grafik', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Grafik', 'show schedule', 'pesel', null, () => this.pesel),
                    selectable: true,
                    selectRowCheckbox: false
                },
                {
                    name: 'Harmonogram zabiegów', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Harmonogram zabiegów', 'show treatments schedule', 'pesel', null, () => this.pesel),
                    selectable: true,
                    selectRowCheckbox: false
                },
                {
                    name: 'Zabiegi pacjenta', 
                    headers: [], 
                    rows: [], 
                    get: this.retrieveData.bind(this, 'Zabiegi pacjenta', 'show assignment doctors', 'id_lekarze_zabieg', null, () => this.state.clickedRows[0].id_lekarze_zabieg),
                    selectable: false,
                    selectRowCheckbox: false,
                    returnsTo: 'Karta pacjenta'
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

    onRowClick = (rows) => {
        const state = this.state
        state.clickedRows = rows
        this.setState(state)
    }

    reload = () => {
        this.ready = false  
    }

    changeTable = (name) => {
        const state = this.state
        state.selectedTable = this.state.tables.findIndex(table => table.name === name)
        this.setState(state)
        this.reload()
        state.tables[state.selectedTable].get()
    }

    set ready(value) {
        const state = this.state
        state.ready = value 
        this.setState(state) 
    }

    render = () => {
        return(
            <div> 
                <Refresh value={this.state.ready} onRefresh={() => {this.ready = true}}>
                    <SQLTable headers={this.state.tables[this.state.selectedTable].headers} rows={this.state.tables[this.state.selectedTable].rows} onRowClick={this.onRowClick} 
                    selectRowChecbox={this.state.tables[this.state.selectedTable].selectRowCheckbox}>
                        {this.state.tables[this.state.selectedTable].name === 'Karta pacjenta' && (
                            <IconButton onClick={() => {if(this.state.clickedRows.length === 1) this.changeTable('Zabiegi pacjenta'); else alert('Wybierz 1 wiersz')}}>
                                <AccessibleOutlinedIcon/>
                            </IconButton>
                        )}
                        
                        
                        {this.state.tables[this.state.selectedTable].name === 'Zabiegi pacjenta' && (
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

                {this.state.redirect && (<Redirect to='/login'/>)}
            </div>
        )
    }
}
