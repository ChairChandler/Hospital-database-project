import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, DialogContentText }  from '@material-ui/core';

export const FormDialog = ({isOpen, onClose, title = '', message = '', children}) => {
  const [isCancelled, setCancelled] = React.useState(false)

  return (
    <Dialog open={!isCancelled && isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {message && (
          <DialogContentText>
            {message}
          </DialogContentText>)
        }
        {children}
      </DialogContent>
  
      <DialogActions>
        <Button onClick={() => {setCancelled(true); onClose('cancel')}} color="primary">
          cancel
        </Button>
        <Button onClick={() => {onClose('done')}} color="primary">
          done
        </Button>
      </DialogActions>
    </Dialog>
    )
  }

export const QuestionDialog = ({isOpen, title = '', question = '', answers, onClose}) => {
    return (
      <Dialog open={isOpen} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
          {question && (
            <DialogContent>
              <DialogContentText>
                {question}
              </DialogContentText>
            </DialogContent>)
          }
          <DialogActions>
            {answers.map(answer => <Button onClick={() => {onClose(answer)}} color="primary">{answer}</Button>)}
          </DialogActions>
      </Dialog>
    )
  }