import React, { useState, useEffect } from "react";
import axios from 'axios';
import { 
    Button,
    Container, 
    Grid,
    LinearProgress,
    Typography,
    Chip
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Navigation from '../components/Navigation';
import { useAuthContext } from "../authentication/AuthContext";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

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

    // secretariat states
    const [flagData, setFlagData] = useState('');
    const [statsData, setStatsData] = useState({})

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
                console.error(error)
            }
        } else {
            setDataLoading(false);
        }
    }

    const parseFlagData = ({ featureFlags }) => {
        const clean = {}
        for(let i = 0; i < featureFlags.length; i++) {
            const featureFlagPair = featureFlags[i]
            clean[featureFlagPair.feature] = featureFlagPair.flag
        }
        return clean
    }

    async function loadFlagsData() {
        setDataLoading(true)
        
        if(role === 'SECRETARIAT') {
            try {
                const res = await axios.get(`${API_URL}/auth/admin/flag/all`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': currentUser
                    }
                })

                setFlagData(parseFlagData(res.data))
                setDataLoading(false)
            } catch(error) {
                console.error(error)
            }
        } else {
            setDataLoading(false)
        }
    }

    const getCommitteeAggregate = (committees) => {
        const byComm = {}
        
        for (let i = 0; i < committees.length; i++) {
            let totalCountries = committees[i].countries.length
            let assignedCountries = 0

            for (let j = 0; j < committees[i].countries.length; j++) {
                if(committees[i].countries[j].assigned) {
                    assignedCountries += 1
                }
            }
            
            byComm[committees[i].name] = {
                total: totalCountries,
                assigned: assignedCountries
            }
        }

        return { total: committees.length, by_committee: byComm }
    }

    async function loadAggregatesData() {
        setDataLoading(true)

        if(role !== 'SECRETARIAT') return

        try {
            const { data } = await axios.get(`${API_URL}/secretariat/admin/stats`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            let committee_stats = getCommitteeAggregate(data.committees)

            setStatsData({
                committee_stats,
                total_delegates: data.total_delegates,
                total_schools: data.total_schools
            })
            setDataLoading(false)
        } catch (error) {
            console.error(error)
            setDataLoading(false)
        }
    }

    useEffect(() => {
        loadSchoolData();
        loadFlagsData();
        loadAggregatesData();
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
                                    <span className='big-text'>{statsData?.total_delegates || '-'}</span>
                                    <span>Delegates Registered</span>
                                </div>
                            </Grid>
                            {/* <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_delegates_paid || '-'}</span>
                                    <span>Delegates Paid</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_rooms_finalized || '-'}</span>
                                    <span>Rooms Set</span>
                                </div>
                            </Grid> */}
                        </Grid>

                        <Alert severity="success" style={{marginTop:'3rem'}}>
                            <AlertTitle>Successfully Registered</AlertTitle>
                            {schoolData ? schoolData.name : 'The school'} has been successfully registered.
                        </Alert>

                        {/* <Alert severity="warning" style={{marginTop:'1rem'}}>
                            <AlertTitle>Limited Functionality</AlertTitle>
                            The CAHSMUN Campus is currently working at limited capacity. As conference day approaches, additional features such as 
                            rooming management and viewing delegate information will appear.
                        </Alert> */}
                    </Container>
                ) : ''}

                {(role === 'SPONSOR') ? (
                    <Container maxWidth="md">
                        <Typography variant="h5">{schoolData ? schoolData.name : ''}</Typography>
                        <Typography variant="subtitle2">{name}</Typography>

                        <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_delegates || '-'}</span>
                                    <span>Delegates Registered</span>
                                </div>
                            </Grid>
                            {/* <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_delegates_paid || '-'}</span>
                                    <span>Delegates Paid</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_rooms_finalized || '-'}</span>
                                    <span>Rooms Set</span>
                                </div>
                            </Grid> */}
                        </Grid>

                        
                        <Alert severity="success" style={{marginTop:'3rem'}}>
                            <AlertTitle>Successfully Registered</AlertTitle>
                            {schoolData ? schoolData.name : 'The school'} has been successfully registered.
                        </Alert>

                        {/* <Alert severity="warning" style={{marginTop:'1rem'}}>
                            <AlertTitle>Limited Functionality</AlertTitle>
                            The CAHSMUN Campus is currently working at limited capacity. As conference day approaches, additional features such as 
                            rooming management and viewing delegate information will appear.
                        </Alert> */}
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
                                    <span className='big-text'>{statsData?.total_delegates || '—'}</span>
                                    <span>Delegates Registered</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_delegates_paid || '—'}</span>
                                    <span>Delegates Paid</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.total_schools || '—'}</span>
                                    <span>Schools Registered</span>
                                </div>
                            </Grid>
                        </Grid>


                        <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" style={{marginBottom: 10}}>Committee Numbers</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <div className='outline-box'>
                                    <span className='big-text'>{statsData?.committee_stats?.total || '—'}</span>
                                    <span>Committees</span>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        paddingTop: '3rem'
                                    }}>
                                        {statsData?.committee_stats?.by_committee && Object.keys(statsData?.committee_stats?.by_committee).map((key, index) => {
                                            const thisCommittee = statsData?.committee_stats?.by_committee[key] || 1
                                            return (
                                                <div key={index}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        paddingBottom: '0.5rem'
                                                    }}>
                                                        <div style={{ fontWeight: 500 }}>{key}</div>
                                                        <div>{thisCommittee.assigned}/{thisCommittee.total}</div>
                                                    </div>
                                                    <LinearProgress variant="determinate" size={10} value={Math.ceil(thisCommittee.assigned / thisCommittee.total)} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                ) : ''}

            </div>
        </>
    )
}

export default Dashboard;