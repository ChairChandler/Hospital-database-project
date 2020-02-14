import React from 'react';
import { DataGrid, ToolbarOptions } from 'tubular-react';
import { ColumnModel, ColumnDataType} from 'tubular-common';
import { Checkbox, IconButton } from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { Redirect } from 'react-router-dom';

export default class SQLTable extends React.Component {
  constructor(props) {
    super(props)

    this.createToolbar()
    this.createColumns()
    this.createRows()

    this.state = {
      clickedRows: [],
      rows: this.rows,
      columns: this.columns,
      redirect : false
    }
  }

  logout = () => {
    const state = this.state
    state.redirect = true
    this.setState(state)
  }

  createColumns = () => {
    this.columns = this.props.headers.map(({header, label, visible}) => 
    new ColumnModel(header, {
      sortable: true,
      searchable: true,
      label: label,
      visible: visible,
      dataType: ColumnDataType.String
    }))
    this.columns.push(new ColumnModel('rownum', {
      visible: false,
      isKey: true
    }))
  }

  createRows = () => {
    if(this.props.selectRowChecbox) {
      this.columns.push(new ColumnModel('selected', {label: ' '}))
      this.rows = this.props.rows.map((val, indx) => {
          val['selected'] = <Checkbox onClick={this.onRowClick.bind(this, val)}></Checkbox>
          val['rownum'] = indx
          for(const key in val) {
            if(val[key] === null) {
              val[key] = ''
            } else if(val[key].toString() !== '[object Object]') {
              val[key] = val[key].toString()
            }
          }
          return val
      })
    } else {
      this.rows = this.props.rows.map((val, indx) => {
        val['rownum'] = indx
        for(const key in val) {
          if(val[key] === null) {
            val[key] = ''
          }
        }
        return val
      })
    }
  }
  
  createToolbar = () => {
    this.toolbarButton = new ToolbarOptions({
      customItems: (
      <div>
        {this.props.children}
        <IconButton onClick={this.logout}>
          <ExitToAppOutlinedIcon/>
        </IconButton>
      </div>),
      exportButton: false,
      printButton: false
    });
  }

  onRowClick = (row) => {
    const state = this.state
    const indx = state.clickedRows.findIndex((val) => val.rownum === row.rownum)
    if(indx < 0) {  
      state.clickedRows.push(row)
    } else {
      state.clickedRows.splice(indx, 1)
    }

    this.setState(state)
    this.props.onRowClick(state.clickedRows)
  } 
  
  render = () => {
    return (
      <div>
        <DataGrid
        gridName=''
        columns={this.state.columns}
        dataSource={this.state.rows}
        toolbarOptions={this.toolbarButton}
        onError={(err) => alert(err)}
      />

      {this.state.redirect && (<Redirect to='/login'/>)}
    </div>
  )}
}