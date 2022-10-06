import { 
    Button,
    Container, 
    Grid
} from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../config';

import LogoBlack from '../../img/black.png';

const DelegateCancel = () => {

    const [year, setYear] = useState('')

    const getYear = async () => {
        
        const res = await axios.get(`${API_URL}/auth/admin/flag/conferenceYear`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        setYear(res.data.note)
    }

    useEffect(() => {
        getYear()
    }, [])

    return (
        <div className='app-container'>
            <Container maxWidth='md'>
                <img src={LogoBlack} alt='logo' width='80px' />
                <h1 style={{userSelect:'none',}}>CAHSMUN Campus</h1>
                <h3 style={{userSelect:'none',}}>Register for CAHSMUN {year || ''}</h3>

                <Grid container spacing={1} style={{marginTop: '5vh'}}>
                    <Grid item xs={12}>
                        You've cancelled your payment. Complete your registration by logging in. <a className="inline-link" href="/">Go back home</a>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default DelegateCancel;