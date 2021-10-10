import React, { useState, useEffect } from "react";
import axios from 'axios';
import { 
    Button,
    Container, 
    Grid,
    LinearProgress,
    Typography
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Navigation from '../components/Navigation';
import { useAuthContext } from "../authentication/AuthContext";
import { API_URL } from "../config";

const Dashboard = () => {

    const {currentUser, getUserData} = useAuthContext();
    const userData = getUserData();
    const role = currentUser ? userData.role : '';
    const schoolID = ((role === 'SPONSOR') || (role === 'HEAD')) ? userData.school : '';
    const name = (role === 'SPONSOR') ? userData.name : '';

    const [dataRefresh, setDataRefresh] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // sponsor states
    const [schoolData, setSchoolData] = useState('');

    async function loadSchoolData() {
        if(role === 'SPONSOR' || role === 'HEAD') {

            try {
                let res = await axios.get(`${API_URL}/schools/${schoolID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': currentUser,
                    }
                });
    
                setSchoolData(res.data);
    
                setDataLoading(false);
    
            } catch(error) {
                console.log(error)
            }
        } else {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        loadSchoolData();
    }, [dataRefresh]);

    return (
        <>
            {dataLoading ? (
                <div style={{
                    width: '100%',
                    height: 0,
                }}>
                    <LinearProgress />
                </div>
            ) : ''}
            <div className='app-container'>
                <Navigation />

                {(role === 'HEAD') ? (
                    <Container maxWidth="md">
                        <Typography variant="h5">{schoolData ? schoolData.name : ''}</Typography>

                        <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Delegates Registered</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Delegates Paid</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Rooms Set</span>
                                </div>
                            </Grid>
                        </Grid>

                        <Alert severity="success" style={{marginTop:'3rem'}}>
                            <AlertTitle>Successfully Registered</AlertTitle>
                            {schoolData ? schoolData.name : 'The school'} has been successfully registered.
                        </Alert>

                        <Alert severity="warning" style={{marginTop:'1rem'}}>
                            <AlertTitle>Limited Functionality</AlertTitle>
                            The CAHSMUN Campus is currently working at limited capacity. As conference day approaches, additional features such as 
                            rooming management and viewing delegate information will appear.
                        </Alert>
                    </Container>
                ) : ''}

                {(role === 'SPONSOR') ? (
                    <Container maxWidth="md">
                        <Typography variant="h5">{schoolData ? schoolData.name : ''}</Typography>
                        <Typography variant="subtitle2">{name}</Typography>

                        <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Delegates Registered</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Delegates Paid</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Rooms Set</span>
                                </div>
                            </Grid>
                        </Grid>

                        
                        <Alert severity="success" style={{marginTop:'3rem'}}>
                            <AlertTitle>Successfully Registered</AlertTitle>
                            {schoolData ? schoolData.name : 'The school'} has been successfully registered.
                        </Alert>

                        <Alert severity="warning" style={{marginTop:'1rem'}}>
                            <AlertTitle>Limited Functionality</AlertTitle>
                            The CAHSMUN Campus is currently working at limited capacity. As conference day approaches, additional features such as 
                            rooming management and viewing delegate information will appear.
                        </Alert>
                    </Container>
                ) : ''}

                {(role === 'SECRETARIAT') ? (
                    <Container maxWidth="md">
                        <Typography variant="subtitle1">Dashboard</Typography>

                        
                        <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={12}>
                            <Typography variant="subtitle2" style={{marginBottom: 10}}>Registration Numbers</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Delegates Registered</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Delegates Paid</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>&mdash;</span>
                                    <span>Schools Registered</span>
                                </div>
                            </Grid>
                        </Grid>

                        <Alert severity="warning" style={{marginTop:'3rem'}}>
                            <AlertTitle>Limited Functionality</AlertTitle>
                            The CAHSMUN Campus is currently working at limited capacity. As conference day approaches, additional features such as 
                            rooming management and viewing delegate information will appear.
                        </Alert>
                    </Container>
                ) : ''}

            </div>
        </>
    )
}

export default Dashboard;