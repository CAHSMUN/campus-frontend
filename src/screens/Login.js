import { 
    Button, 
    CircularProgress, 
    CardHeader, 
    CardContent, 
    TextField,
    Container,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuthContext } from '../authentication/AuthContext';
import { API_URL } from '../config';

import LogoBlack from '../img/black.png';

const Login = () => {

    const {currentUser, updateCurrentUser} = useAuthContext();

    const [type, setType] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [typeError, setTypeError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    function isValid() {
        let uError = false, pError = false, tError = false;

        setUsernameError(false);
        setPasswordError(false);
        setTypeError(false);

        if(username.length === 0) {
            uError = true;
            setUsernameError(uError);
        }
        if(password.length === 0) {
            pError = true;
            setPasswordError(pError);
        }
        if(type.length === 0) {
            tError = true;
            setTypeError(tError);
        }
        

        if(uError || pError || tError) {
            return false;
        } else {
            return true;
        }
    }

    async function handleLogin(e) {
        e.preventDefault();

        let valid = isValid();

        if(!loading) {
            setLoading(true);
            setError('');

            if(valid) {
                try {
                    let res = await axios.post(`${API_URL}/auth/login/${type}`, {
                        email: username,
                        passcode: password
                    });
    
                    updateCurrentUser(res.data);
                    history.push('/');
                } catch (error) {
                    if(error.response) {
                        setError(error.response.data.message);
                    } else {
                        setError('Cannot communicate with server');
                    }
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
    }

    // Press enter key to login
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    }
    
    // If user lands on the login page while already logged in
    useEffect(() => {
        if (currentUser) {
            history.push('/');
        }
    }, []);


    
    // Forgot password 
    const [notifySuccess, setNotifySuccess] = useState({severity: 'closed', message: ''});

    const handleForgotPassword = () => {
        setNotifySuccess({
            severity: 'info',
            message: 'Please contact the delegate affairs to reset your password',
        })
    }


    return !(currentUser) ? (
        <div className='app-container' >
            <Container maxWidth='xs'>
                    <div>
                        <Link style={{
                            marginLeft: '1rem',
                        }} to={'/'}>
                            <img width='80px' src={LogoBlack} alt='Back home' />
                        </Link>
                        <CardHeader title="CAHSMUN Campus" subheader="Login to Campus" />
                        <CardContent>
                            <FormControl
                                error={typeError}
                                variant="outlined"
                                margin="normal" 
                                fullWidth>
                                <InputLabel id="customer-label">Account Type</InputLabel>
                                <Select
                                    labelId="customer-label"
                                    value={type}
                                    onChange={e=>setType(e.target.value)} 
                                    label="Account Type">
                                    <MenuItem value="">
                                        <em>Select account type</em>
                                    </MenuItem>
                                    <MenuItem value="delegate">
                                        Delegate
                                    </MenuItem>
                                    <MenuItem value="sponsor">
                                        Sponsor Teacher
                                    </MenuItem>
                                    <MenuItem value="secretariat">
                                        Secretariat
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <TextField 
                              value={username} 
                              onChange={e=>setUsername(e.target.value.toLowerCase())} 
                              variant="outlined" 
                              label="Email" 
                                margin="normal" 
                              size="medium" 
                              fullWidth 
                              error={usernameError}
                              onKeyDown={e=>handleKeyDown(e)} />
                            <TextField 
                              value={password} 
                              onChange={e=>setPassword(e.target.value)} 
                              variant="outlined" 
                              label="Passcode" 
                              type="password"  
                              margin="normal" 
                              fullWidth 
                              error={passwordError}
                              onKeyDown={e=>handleKeyDown(e)} />
                            <Button
                              disabled={loading}
                              component={Link} to={'/'} 
                              variant="contained" 
                              color="primary" 
                              size="large" 
                              disableElevation 
                              onClick={e=>handleLogin(e)}
                              style={{
                                marginTop:10,
                            }}>
                                {!loading ? 'Log In' : (
                                    <>
                                        <CircularProgress disableShrink size={20} style={{
                                            marginRight: 10,
                                            marginLeft: -5,
                                            color: '#777777',
                                        }} />
                                        Loading
                                    </>
                                )}
                            </Button>
                            <Button 
                              variant="text" 
                              color="primary" 
                              size="large" 
                              disableElevation 
                              style={{
                                marginLeft:10,
                                marginTop:10,
                              }}
                              onClick={handleForgotPassword}>
                                Forgot Password
                            </Button>

                            {error ? (
                                <Alert style={{marginTop:18}} severity="error">{error}</Alert>
                            ) : ''}
                        </CardContent>
                    </div>


                <Snackbar open={(notifySuccess.severity !== 'closed')} autoHideDuration={10000} onClose={e=>setNotifySuccess({...notifySuccess, severity: 'closed'})}>
                    <Alert onClose={e=>setNotifySuccess({...notifySuccess, severity: 'closed'})} severity={notifySuccess.severity}>
                        <AlertTitle>Forgot Password</AlertTitle>
                        {notifySuccess.message}
                    </Alert>
                </Snackbar>

            </Container>
        </div>
    ) : (
        <div className='app-container'>
            <Container maxWidth='sm'>
                <img src={LogoBlack} alt='logo' width='80px' style={{marginBottom: '1rem'}} />
                <Typography variant="h5">CAHSMUN 2022</Typography>
                <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>School Registration</Typography>
                <Typography variant="body2" style={{color: 'rgba(0, 0, 0, 0.54)'}}>You're already logged in.</Typography>
            </Container>
        </div>
    )
}

export default Login;