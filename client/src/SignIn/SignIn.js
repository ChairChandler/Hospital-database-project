import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  let [error, setError] = useState('')
  let [accountType, setAccountType] = useState()

  function login() {
    const user = { 
      login: document.getElementById('login').value,
      password: document.getElementById('password').value
    }
    
    fetch(`http://${props.connection.ip}:${props.connection.port}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        operation: 'login',
        data: user
      })
    })
    .then(res => res.json())
    .then(json => {
      if(!json.error) {
        user['account-type'] = json['account-type']
        props.onLogged(user)
        setAccountType(json['account-type'])
      } else {
        setError(json.error)
      }
    })
    .catch(error => {
      setError('Blad podczas polaczenia z serwerem')
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Szpitalny System Identyfikacyjny
        </Typography>
        <form className={classes.form} noValidate>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            autoComplete="login"
            autoFocus
            error={error === '' ? false : true}
            helperText={error === '' ? '' : error}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Haslo"
            type="password"
            id="password"
            autoComplete="current-password"
            error={error === '' ? false : true}
          />

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => login()}
          >
            Zaloguj
          </Button>
        </form>
      </div>

      {accountType && (<Redirect to={`/konto/${accountType}`}/>)}
    </Container>
  )
}