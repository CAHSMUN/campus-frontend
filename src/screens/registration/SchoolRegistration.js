import React, { useState } from 'react';
import axios from 'axios';
import { 
    Button, 
    CircularProgress, 
    CardHeader, 
    CardContent, 
    TextField,
    Container,
    Typography,
    Snackbar,
    FormGroup,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import LogoBlack from '../../img/black.png';
import { API_URL } from '../../config';

const SchoolRegistration = () => {


    const [capacity, setCapacity] = useState(''); // Registrant Capacity ('sponsor' or 'delegate')
    const [cErr, setCErr] = useState('');
    const [name, setName ] = useState(''); // Registrant name -> Sponsor Account
    const [nErr, setNErr] = useState('');
    const [phone, setPhone] = useState(''); // Registrant phone number -> Sponsor or Delegate account
    const [pErr, setPErr] = useState('');
    const [email, setEmail] = useState(''); // Registrant email for login -> Sponsor or Delegate account
    const [eErr, setEErr] = useState('');
    const [passcode, setPasscode] = useState(''); // Registrant passcode for login -> Sponsor or Delegate account
    const [passErr, setPassErr] = useState('');
    const [adminEmail, setAdminEmail] = useState(''); // School admin email
    const [aErr, setAErr] = useState('');
    const [schoolName, setSchoolName] = useState(''); // school name - string
    const [sErr, setSErr] = useState('');
    const [schoolDistrict, setSchoolDistrict] = useState(''); // school district - string
    const [dErr, setDErr] = useState('');
    const [schoolAddress1, setSchoolAddress1] = useState(''); // school address 1 
    const [addErr, setAddErr] = useState('');
    const [schoolAddress2, setSchoolAddress2] = useState(''); // school address 2
    const [add2Err, setAdd2Err] = useState('');
    const [schoolCity, setSchoolCity] = useState(''); // school city
    const [cityErr, setCityErr] = useState('');
    const [schoolProvince, setSchoolProvince] = useState(''); // school province
    const [provErr, setProvErr] = useState('');
    const [schoolPostal, setSchoolPostal] = useState(''); // school postal
    const [postalErr, setPostalErr] = useState('');
    const [isAttending, setIsAttending] = useState(''); // Is sponsor teacher attending
    const [attErr, setAttErr] = useState('');
    const [isPaying, setIsPaying] = useState(''); // is school paying for delegates
    const [payErr, setPayErr] = useState('');
    const [expectedSize, setExpectedSize] = useState(''); // expected delegation size - string, pseudo number
    const [sizeErr, setSizeErr] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState(''); // additional information
    const [infoErr, setInfoErr] = useState('');

    const [loading, setLoading] = useState(false);
    const [regSuccess, setRegSuccess] = useState(false);
    const [error, setError] = useState('');

    function isValid() {
        let cErr = false,
        nErr = false,
        pErr = false,
        eErr = false,
        passErr = false,
        aErr = false,
        sErr = false,
        dErr = false,
        addErr = false,
        add2Err = false,
        cityErr = false,
        provErr = false,
        postalErr = false,
        attErr = false,
        payErr = false,
        sizeErr = false,
        infoErr = false;

        setCErr(false); // registrant capacity error
        setEErr(false); // registrant email error
        setNErr(false); // registrant name error
        setPErr(false); // registrant phone num error
        setPassErr(false); // passcode error
        setAErr(false); // admin email error
        setSErr(false); // school name error
        setDErr(false); // school district error
        setAddErr(false); // school address error
        setAdd2Err(false); // school address 2 error
        setCityErr(false); // school city error
        setProvErr(false); // school province error
        setPostalErr(false); // school postal error
        setAttErr(false); // sponsor attending (bool) error
        setPayErr(false); // school paying (bool) error
        setSizeErr(false); // expected size error
        setInfoErr(false); // additional information error


        const blankFieldError = 'Required';
        const blankOptionError = 'Must select an option';


        // blank capacity error check
        if(!(capacity === 'sponsor' || capacity === 'delegate')) {
            cErr = true;
            setCErr(blankOptionError);
        }

        // conditional registrant name and phone check (delegates will create account in delegate registration)
        if(capacity === 'sponsor') {

            if(name === '') {
                nErr = true;
                setNErr(blankFieldError);
            }

            if(phone === '') {
                pErr = true;
                setNErr(blankFieldError);
            }
        }

        // blank passcode error check
        if(passcode === '') {
            passErr = true;
            setPassErr(blankFieldError);
        }

        // email error checks
        if(email === '') {
            eErr = true;
            setEErr(blankFieldError);
        }
        if(!email.includes('@') || (email.length === 1)) {
            eErr = true;
            setEErr('Must be a valid email');
        }

        // blank admin error check
        if(adminEmail === '') {
            aErr = true;
            setAErr(blankFieldError);
        }
        if(!adminEmail.includes('@') || (adminEmail.length === 1)) {
            aErr = true;
            setAErr('Must be a valid email');
        }

        // blank school name check
        if(schoolName === '') {
            sErr = true;
            setSErr(blankFieldError);
        }

        // blank school district check
        if(schoolDistrict === '') {
            dErr = true;
            setDErr(blankFieldError);
        }

        // blank school address 1 check
        if(schoolAddress1 === '') {
            addErr = true;
            setAddErr(blankFieldError);
        }

        // blank school city check
        if(schoolCity === '') {
            cityErr = true;
            setCityErr(blankFieldError);
        }

        // blank school province check
        if(schoolProvince === '') {
            provErr = true;
            setProvErr(blankFieldError);
        }

        // blank school postal check
        if(schoolPostal === '') {
            postalErr = true;
            setPostalErr(blankFieldError);
        }

        // blank present sponsor check
        if(isAttending === '') {
            attErr = true;
            setAttErr(blankOptionError);
        }

        // blank school paying check
        if(isPaying === '') {
            payErr = true;
            setPayErr(blankOptionError);
        }

        // blank expected delegation size check
        if(expectedSize === '') {
            sizeErr = true;
            setSizeErr(blankFieldError);
        }


        if(cErr ||
            nErr || 
            pErr || 
            eErr || 
            passErr || 
            aErr || 
            sErr || 
            dErr || 
            addErr || 
            add2Err || 
            cityErr || 
            provErr || 
            postalErr || 
            attErr || 
            payErr || 
            sizeErr || 
            infoErr) {
            return false;
        } else {
            return true;
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        let valid = isValid();

        if(!loading) {
            setLoading(true);
            setError('');

            if(valid) {

                // registering as sponsor
                if(capacity === 'sponsor') {
                    let postBody = {
                        name: name,
                        phone: phone,
                        email: email,
                        passcode: passcode,
        
                        schoolName: schoolName,
                        adminEmail: adminEmail,
                        district: schoolDistrict,
                        address1: schoolAddress1,
                        address2: schoolAddress2,
                        city: schoolCity,
                        province: schoolProvince,
                        postal: schoolPostal,
                        sponsorPresent: isAttending,
                        schoolPayment: isPaying,
                        expectedSize: expectedSize,
                        additionalInfo: additionalInfo,
                    }
                    
                    axios
                    .post(`${API_URL}/schools/register/sponsor`, postBody)
                    .then((res) => {
        
                        setLoading(false);
                        setRegSuccess(true);
        
                    }).catch((error) => {
                        setLoading(false);
                        if(error.response) {
                            setError(error.response.data.message);
                        } else {
                            setError('Connection with server is bad');
                        }
                    });
                }

                // registering as head delegate
                if(capacity === 'delegate') {
                    let postBody = {
                        email: email,
                        passcode: passcode,
        
                        schoolName: schoolName,
                        adminEmail: adminEmail,
                        district: schoolDistrict,
                        address1: schoolAddress1,
                        address2: schoolAddress2,
                        city: schoolCity,
                        province: schoolProvince,
                        postal: schoolPostal,
                        sponsorPresent: isAttending,
                        schoolPayment: isPaying,
                        expectedSize: expectedSize,
                        additionalInfo: additionalInfo,
                    }
                    
                    axios
                    .post(`${API_URL}/schools/register/delegate`, postBody)
                    .then((res) => {
        
                        setLoading(false);
                        setRegSuccess(true);
        
                    }).catch((error) => {
                        setLoading(false);
                        if(error.response) {
                            setError(error.response.data.message);
                        } else {
                            setError('Connection with server is bad');
                        }
                    });
                }
            } else {
                setLoading(false);
            }

        }
    }

    return regSuccess ? (
        <div className='app-container'>
            <Container maxWidth='sm'>
                <Link to={'/'}>
                    <img src={LogoBlack} alt='logo' width='80px' style={{marginBottom: '1rem'}} />
                </Link>
                <Typography variant="h5">CAHSMUN 2022</Typography>
                <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>School Registration</Typography>

                <Alert severity="success" style={{marginTop:'1rem'}}>
                    <AlertTitle>Registration Success</AlertTitle>
                    You have successfully registered a school. You may log in to the system to view your registration status.
                </Alert>
            </Container>
        </div>
    ) : (
        <div className='app-container'>
            <Container maxWidth='sm'>
                <Link to={'/'}>
                    <img src={LogoBlack} alt='logo' width='80px' style={{marginBottom: '1rem'}} />
                </Link>
                <Typography variant="h5">CAHSMUN 2022</Typography>
                <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>School Registration</Typography>

                <Typography style={{paddingTop: '1rem'}} variant="body1">
                    Thank you for your interest in registering for CAHSMUN. This form serves as registration for our Spring conference.
                    {/* Once you have submitted this form, your delegation’s primary contact will receive a confirmation email regarding the status of your school’s registration. */}
                    <br /><br />
                    School and Independent Delegation titles will be posted onto the delegate and sponsor teacher/supervisor forms within 48 hours of submission. Should this form not be completed, students will not be able to register for the conference.
                    <br /><br />
                    Any questions regarding the CAHSMUN school registration process can be forwarded to Neil Hong at delegates@cahsmun.org.
                    <br /><br />
                    Sincerely,<br />
                    The CAHSMUN Team
                </Typography>

                <hr />

                <Typography variant="subtitle1">Account Information</Typography>
                <Typography variant="body1" style={{margin: '1rem 0'}}>
                    To view and manage registration status and rooming, Campus requires an account to be made by everyone who registers a school.
                </Typography>
                
                <FormGroup style={{marginTop:20}}>
                    <FormLabel style={{margin: '2rem 0 1rem 0'}}>In what capacity are you registering a school? *</FormLabel>
                    {cErr ? (<div className='error-help'> {cErr} </div>) : ''}
                    <RadioGroup aria-label="capacity" name="registrantCapacity" value={capacity} onChange={e=>setCapacity(e.target.value)}>
                        <FormControlLabel value="sponsor" control={<Radio margin="dense"/>} label="Sponsor" />
                        <FormControlLabel value="delegate" control={<Radio margin="dense"/>} label="Head Delegate" />
                    </RadioGroup>
                </FormGroup>

                <Grid container spacing={0} style={{marginTop: '2rem'}}>
                    {(capacity === 'sponsor') ? (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField 
                                color='secondary'
                                value={name} 
                                onChange={e=>setName(e.target.value)} 
                                variant="outlined" 
                                label="Full Name" 
                                type="name"  
                                margin="normal" 
                                fullWidth 
                                error={nErr} />
                                {nErr ? (<div className='error-help'> {nErr} </div>) : ''}
                            </Grid>
                            <Grid item xs={6}>
                                <TextField 
                                color='secondary'
                                value={phone} 
                                onChange={e=>setPhone(e.target.value)} 
                                variant="outlined" 
                                label="Phone Number"
                                margin="normal" 
                                fullWidth 
                                error={pErr} />
                                {pErr ? (<div className='error-help'> {pErr} </div>) : ''}
                            </Grid>
                        </Grid>
                    ) : ''}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField 
                                required
                            color='secondary'
                            value={email} 
                            onChange={e=>setEmail(e.target.value)} 
                            variant="outlined" 
                            label="Email"
                            margin="normal" 
                            fullWidth 
                            error={eErr} />
                            {eErr ? (<div className='error-help'> {eErr} </div>) : ''}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                required
                            color='secondary'
                            value={passcode} 
                            onChange={e=>setPasscode(e.target.value)} 
                            variant="outlined" 
                            label="Passcode"
                            type="password"
                            margin="normal" 
                            fullWidth 
                            error={passErr} />
                            {passErr ? (<div className='error-help'> {passErr} </div>) : ''}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                                required
                            color='secondary'
                          value={adminEmail} 
                          onChange={e=>setAdminEmail(e.target.value)} 
                          variant="outlined" 
                          label="School Admin Email"
                          margin="normal" 
                          fullWidth 
                          error={aErr} />
                          {aErr ? (<div className='error-help'> {aErr} </div>) : ''}
                    </Grid>
                </Grid>

                <hr />
                <Typography variant="subtitle1">School Information</Typography>

                <Grid container style={{marginTop: '2rem'}}>
                    <Grid item xs={12}>
                        <TextField 
                                required
                            color='secondary'
                          value={schoolName} 
                          onChange={e=>setSchoolName(e.target.value)} 
                          variant="outlined" 
                          label="School Name"
                          margin="normal" 
                          fullWidth 
                          error={sErr} />
                          {sErr ? (<div className='error-help'> {sErr} </div>) : ''}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                                required
                            color='secondary'
                          value={schoolDistrict} 
                          onChange={e=>setSchoolDistrict(e.target.value)} 
                          variant="outlined" 
                          label="School District"
                          margin="normal" 
                          fullWidth 
                          error={dErr} />
                          {dErr ? (<div className='error-help'> {dErr} </div>) : ''}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                                required
                            color='secondary'
                          value={schoolAddress1} 
                          onChange={e=>setSchoolAddress1(e.target.value)} 
                          variant="outlined" 
                          label="School Address 1"
                          margin="normal" 
                          fullWidth 
                          error={addErr} />
                          {addErr ? (<div className='error-help'> {addErr} </div>) : ''}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            color='secondary'
                          value={schoolAddress2} 
                          onChange={e=>setSchoolAddress2(e.target.value)} 
                          variant="outlined" 
                          label="School Address 2"
                          margin="normal" 
                          fullWidth 
                          error={add2Err} />
                          {add2Err ? (<div className='error-help'> {add2Err} </div>) : ''}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField 
                                required
                            color='secondary'
                            value={schoolCity} 
                            onChange={e=>setSchoolCity(e.target.value)} 
                            variant="outlined" 
                            label="City"
                            margin="normal" 
                            fullWidth 
                            error={cityErr} />
                          {cityErr ? (<div className='error-help'> {cityErr} </div>) : ''}
                        </Grid>
                        <Grid item xs={4}>
                            <TextField 
                                required
                            color='secondary'
                            value={schoolProvince} 
                            onChange={e=>setSchoolProvince(e.target.value)} 
                            variant="outlined" 
                            label="Province/State"
                            margin="normal" 
                            fullWidth 
                            error={provErr} />
                          {provErr ? (<div className='error-help'> {provErr} </div>) : ''}
                        </Grid>
                        <Grid item xs={4}>
                            <TextField 
                                required
                            color='secondary'
                            value={schoolPostal} 
                            onChange={e=>setSchoolPostal(e.target.value)} 
                            variant="outlined" 
                            label="Postal/Zip Code"
                            margin="normal" 
                            fullWidth 
                            error={postalErr} />
                          {postalErr ? (<div className='error-help'> {postalErr} </div>) : ''}
                        </Grid>
                    </Grid>
                </Grid>

                <hr />
                <Typography variant="subtitle1">Additional Information</Typography>
                <Grid container style={{marginTop: '2rem'}}>
                    <Grid item xs={12}>
                        <FormGroup style={{marginTop:'1rem'}}>
                            <FormLabel style={{lineHeight: '150%', marginBottom: '1rem'}}>Will your delegation be accompanied by a sponsor teacher on the day of the conference? *</FormLabel>
                            {attErr ? (<div className='error-help'> {attErr} </div>) : ''}
                            <RadioGroup aria-label="capacity" name="registrantCapacity" value={isAttending} onChange={e=>setIsAttending(e.target.value)} error={attErr}>
                                <FormControlLabel value="yes" control={<Radio margin="dense"/>} label="Yes" />
                                <FormControlLabel value="no" control={<Radio margin="dense"/>} label="No" />
                            </RadioGroup>
                            
                        </FormGroup>
                        <FormGroup style={{marginTop:'2rem'}}>
                            <FormLabel style={{lineHeight: '150%', marginBottom: '1rem'}}>Will the school pay for their delegates’ registration costs? *</FormLabel>
                            {payErr ? (<div className='error-help'> {payErr} </div>) : ''}
                            <RadioGroup aria-label="capacity" name="registrantCapacity" value={isPaying} onChange={e=>setIsPaying(e.target.value)}>
                                <FormControlLabel value="yes" control={<Radio margin="dense"/>} label="Yes" />
                                <FormControlLabel value="no" control={<Radio margin="dense"/>} label="No" />
                            </RadioGroup>
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: '2rem'}}>
                        <TextField 
                                required
                            color='secondary'
                            value={expectedSize} 
                            onChange={e=>setExpectedSize(e.target.value)} 
                            variant="outlined" 
                            label="Expected Delegation Size"
                            margin="normal" 
                            fullWidth 
                            error={sizeErr} />
                          {sizeErr ? (<div className='error-help'> {sizeErr} </div>) : ''}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            multiline
                            rows={6}
                            maxRows={18}
                            color='secondary'
                            value={additionalInfo} 
                            onChange={e=>setAdditionalInfo(e.target.value)} 
                            variant="outlined" 
                            label="Additional Information"
                            margin="normal" 
                            fullWidth 
                            error={infoErr} />
                    </Grid>
                </Grid>

                
                <Typography variant='body2' style={{marginTop: '3rem'}}>
                    By submitting, you are affirming that you have permission to register your school from the school’s administration.
                </Typography>
                {error ? (
                    <Alert severity="error" style={{marginTop:'1rem'}}>{error}</Alert>
                ) : ''}
                <Button
                  disabled={loading}
                  onClick={e=>handleRegister(e)} 
                  color="primary" 
                  variant="contained" 
                  size="large" 
                  style={{
                      marginTop: '1rem',
                      minWidth:'150px'
                  }}
                  disableElevation>
                    {!loading ? 'Submit Registration' : (
                        <>
                            <CircularProgress disableShrink size={20} style={{
                                marginRight: 15,
                                marginLeft: -5,
                                color: '#777777',
                            }} />
                            Submitting...
                        </>
                    )}
                </Button>

            </Container>
        </div>
    )
}

export default SchoolRegistration;