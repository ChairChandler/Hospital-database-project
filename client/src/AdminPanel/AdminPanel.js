import React from 'react';
import SQLTable from '../Shared/SQLTable';
import IconButton from "@material-ui/core/IconButton";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import {AddUserDialog, EditUserDialog, DeleteUserDialog} from './Dialogs'

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props)
        this.getTypes()
        this.getUsers()
        this.clickedRows = []
        this.types = []
        this.ready = true
        this.dialogs = {
            'addUser': {
                open: false
            },
            'editUser': {
                open: false
            },
            'deleteUser': {
                open: false
            }
        }
    }
    
    reload = () => {
        this.ready = false
        this.forceUpdate()
        this.getUsers()
    }

    getUsers = () => {
        fetch(`http://${this.props.connection.ip}:${this.props.connection.port}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            operation: 'show users',
            data: this.props.user
          })
        })
        .then(res => res.json())
        .then(json => {
            this.headers = json.headers
            this.rows = json.rows
            this.ready = true
            this.forceUpdate()
        })
        .catch(error => {
            alert(error)
        })
    }

    getTypes = () => {
        fetch(`http://${this.props.connection.ip}:${this.props.connection.port}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            operation: 'show types',
            data: this.props.user
          })
        })
        .then(res => res.json())
        .then(json => {
            this.types = json.types
            this.forceUpdate()
        })
        .catch(error => {
            alert(error)
        })
    }

    addUser = () => {
        let data = this.props.user
        data['user'] = this.dialogs.addUser.data

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
              operation: 'add user',
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.error) {
                alert(json.error)
              } else {
                this.clickedRows = []
                this.reload()
              }
          })
          .catch(error => {
              alert(error)
          })
    }

    editUser = () => {
        let data = this.props.user
        data['user'] = this.dialogs.editUser.data
        data.user['login'] = this.clickedRows[0].nazwa
        /*
        {
            password: '',
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
              operation: 'edit user',
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.error) {
                alert(json.error)
              } else {
                this.clickedRows = []
                this.reload()
              }
          })
          .catch(error => {
              alert(error)
          })
    }

    deleteUsers = () => {
        let data = this.props.user
        data['users'] = this.clickedRows

        fetch(`http://${this.props.connection.ip}:${this.props.connection.port}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              operation: 'delete users',
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.error) {
                alert(json.error)
              } else {
                this.clickedRows = []
                this.reload()
              }
          })
          .catch(error => {
              alert(error)
          })
    }

    openDialog = (id) => {
        this.dialogs[id].open = true
        this.forceUpdate()
    }

    closeDialog = (id, status) => {
        this.dialogs[id].open = false
        switch(id) {
            case 'addUser':
                if(status === 'done') {
                    this.addUser()
                }
            break

            case 'editUser':
                if(status === 'done') {
                    this.editUser()
                }
            break

            case 'deleteUser':
                if(status === 'delete') {
                    this.deleteUsers()
                }
            break

            default:
        }
        
        this.forceUpdate()
    }

    onRowClick = (rows) => {
        this.clickedRows = rows
    }

    render = () => {
        return(
            <div>
                {this.headers && this.rows && this.ready && (
                    <SQLTable headers={this.headers} rows={this.rows} onRowClick={this.onRowClick} selectRowChecbox='true'>
                        <IconButton onClick={this.openDialog.bind(this, 'addUser')}>
                            <AddOutlinedIcon/>
                        </IconButton>

                        <IconButton onClick={() => {if(this.clickedRows.length === 1) this.openDialog('editUser'); else alert('Wybierz tylko 1 wiersz')}}>
                            <EditOutlinedIcon/>
                        </IconButton>
                        
                        <IconButton onClick={() => {if(this.clickedRows.length > 0) this.openDialog('deleteUser'); else alert('Nie wybrano uzytkownika/uzytkownikow')}}>
                            <RemoveCircleOutlineOutlinedIcon/>
                        </IconButton>
                    </SQLTable>
                )}

                {this.dialogs.addUser.open && (
                    <AddUserDialog onClose={this.closeDialog.bind(this, 'addUser')} title="Dodaj uzytkownika"
                    types={this.types} setData={(data) => {this.dialogs.addUser.data = data}} users={this.rows}/>
                )}

                {this.dialogs.editUser.open && (
                    <EditUserDialog isOpen={this.dialogs.editUser.open} onClose={this.closeDialog.bind(this, 'editUser')} title="Edytuj uzytkownika"
                    types={this.types} setData={(data) => {this.dialogs.editUser.data = data}} users={this.rows} selected={this.clickedRows[0]}
                    message={this.clickedRows[0].nazwa}
                    />
                )}
                
                <DeleteUserDialog isOpen={this.dialogs.deleteUser.open} onClose={this.closeDialog.bind(this, 'deleteUser')} 
                title={this.clickedRows.length>1 ? "Usun uzytkownikow" : "Usun uzytkownika"}/>
            </div>
        )
    }
}