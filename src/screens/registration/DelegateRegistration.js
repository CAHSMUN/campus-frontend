import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Button, 
    CircularProgress, 
    CardHeader, 
    CardContent, 
    Container,
    Typography,
    Snackbar,
    FormGroup,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
    MenuItem,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import LogoBlack from '../../img/black.png';
import { API_URL } from '../../config';
import FormInput from '../../components/FormInput';
import FormSelect from '../../components/FormSelect';

const emptyFormState = {
    attendance: '', // online or inperson attendance
    capacity: '',
    email: '',
    passcode: '',
    firstName: '',
    lastName: '',
    grade: '',
    school: '', 
    sex: '',
    phoneNumber: '',
    postal: '', // postal code or zip
    refereePosition: '', // who referred (optional)
    refereeName: '', // name of who referred (optional)
    ec_firstName: '',
    ec_lastName: '',
    ec_relationship: '',
    ec_phoneNumber: '',
    prefOneComm: '', // ID reference
    prefOneCountry: '',
    prefTwoComm: '', // ID reference
    prefTwoCountry: '',
    prefThreeComm: '', // ID reference
    prefThreeCountry: '',
    numPrevConferences: '', // number of previous conferences
    pastConferences: '', // past conferences and awards
    signature: '', // signature to abide by COVID policy
    paymentId: '', // to be internally generated after payment
}

const DelegateRegistration = () => {

    const [regSuccess, setRegSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // proceed to payment

    const [displaySchools, setDisplaySchools] = useState([]);

    const [committees, setCommittees] = useState([]) // array of committees
    const [displayCommittees, setDisplayCommittees] = useState([]);
    const [committeeMap, setCommitteeMap] = useState();

    const renderSchools = (data) => {
        let renderData = [];
        for (let i = 0; i < data.length; i++) {
            renderData.push(
                <MenuItem value={data[i]._id}>{data[i].name}</MenuItem>
            )
        }
        setDisplaySchools(renderData)
    }

    const renderCommittees = (data) => {
        let renderData = [];
        for (let i = 0; i < data.length; i++) {

            // TODO: don't display committee if full

            renderData.push(
                <MenuItem value={data[i]._id}>{data[i].name}</MenuItem>
            )
        }
        setDisplayCommittees(renderData)
    }
    
    const createCommitteeMap = (data) => {
        // creates map of key: committee _id, value: committee name
        let map = {}

        for(let i = 0; i < data.length; i++ ) {
            map[data[i]._id] = data[i].name;
        }

        setCommitteeMap(map);
    }

    const loadSchools = async () => {
        try {
            let res = await axios.get(`${API_URL}/schools/all/names`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            renderSchools(res.data)
        } catch(error) {
            console.error(error)
        }
    }

    const loadCommittees = async () => {
        try {
            let res = await axios.get(`${API_URL}/committees/matrix`, {
                headers: { 
                    'Content-Type': 'application/json',
                }
            });
            setCommittees(res.data)
            renderCommittees(res.data)
            createCommitteeMap(res.data)
        } catch(error) {
            console.error(error)
        }
    }


    useEffect(() => {
        loadSchools()
        loadCommittees()
    }, [])




    const [capacity, setCapacity] = useState('') // is head delegate or not? CONDITIONAL: create delegate or update in backend
    const [attendance, setAttendance] = useState('') // is online or inperson

    // Registration information
    const [formData, setFormData] = useState({});

    // display committees and countries on form
    
    const [displayCountriesOne, setDisplayCountriesOne] = useState([]) // display array of first pref countries
    const [displayCountriesTwo, setDisplayCountriesTwo] = useState([]) // display array of first pref countries
    const [displayCountriesThree, setDisplayCountriesThree] = useState([]) // display array of first pref countries

    const renderCountries = (preference, committee) => {
        console.log(committee)

        let availableCountries = [];

        // for committee `committee`
        let selectedCommittee = committees.filter((item) => {
            return item.name === committee
        })

        let countries = selectedCommittee[0].countries

        for(let i = 0; i < countries.length; i++) {
            if(countries[i].assigned === "") {
                availableCountries.push(
                    <MenuItem value={countries[i]._id}>{countries[i].name}</MenuItem>
                )
            }
        }
        
        if (preference === 1) setDisplayCountriesOne(availableCountries)
        if (preference === 2) setDisplayCountriesTwo(availableCountries)
        if (preference === 3) setDisplayCountriesThree(availableCountries)
    }
    
    const updateFormData = (key, value) => {
        let newFormData = formData
        newFormData[key] = value
        setFormData(newFormData)
    }


    const handleRegister = () => {
        // should save and then go to stripe payment

        // debug only rn
        console.log(formData);
        setLoading(!loading);


        // All verified by now
        axios
        .post(`${API_URL}/delegates/register/${formData.capacity === "head" ? "head" : "regular"}`, formData)
        .then((res) => {
        
            setLoading(false);
            setRegSuccess(true);
        
        }).catch((error) => {
            setLoading(false);
            if(error.response) {
                console.error(error.response.data.message);
            } else {
                console.error('Connection with server is bad');
            }
        });
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
                    You have successfully for CAHSMUN 2022. You may log in to the system to view your registration status.
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
                <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>Delegate Registration</Typography>

                <Typography style={{paddingTop: '1rem'}} variant="body1">
                    Thank you for your interest in CAHSMUN 2022. This year, the conference will run from April 1st to 3rd. Please fill out the following form to complete your registration for the conference.
                    {/* Once you have submitted this form, your delegation???s primary contact will receive a confirmation email regarding the status of your school???s registration. */}
                    <br /><br />
                    If you are unable to find your school on the list below, it may be that your school has not yet been registered for the conference. The school registration form can be accessed through our registration page: www.cahsmun.org/register. Please note that it may take up to 48 hours after the submission of a school registration form for a school to show up on this form. If your school ??? instead of students paying individually ??? is completing a school payment, please check off the 'School Payment' option on this form. If that option does not appear, please let us know via email to file your school under School Payments.
                    <br /><br />
                    Before registering, please ensure that you have read all of our registration policies on our registration page. Additionally, please note that you cannot save your submission and return at a later time - your submission must be completed in one session.
                    <br /><br />
                    Any questions regarding delegate registration or payment can be forwarded to Neil Hong, USG Delegate Affairs at delegates@cahsmun.org.
                    <br /><br />
                    Sincerely,<br />
                    The CAHSMUN Team
                    <br /><br />
                </Typography>
                
                <Alert severity="warning" style={{marginTop:'1rem'}}>
                    <AlertTitle>Important Notice</AlertTitle>
                    Registration fees this year cover <b>ONLY the conference portion of CAHSMUN, with overnight hotel rooms being a separate cost</b>. For more information on booking hotel rooms, or to initiate a booking, contact Neil Hong, USG Delegate Affairs, at delegates@cahsmun.org.
                    <br /><br />
                    Additionally, we remind delegates that there will be four committees offered <b>only in the online format: SPECPOL, AU, UN Women, and UNSC</b>. In-person delegates will not be able to select these committees.
                </Alert>

                <hr />

                <Typography variant="subtitle1">Account Information</Typography>
                <Typography variant="body1" style={{margin: '1rem 0'}}>
                    To conveniently view and manage registration status, Campus requires an account to be made by delegates.
                </Typography>

                <FormGroup style={{marginTop:20}}>
                    <FormLabel style={{margin: '2rem 0 1rem 0'}}>Did you register a school (as head delegate)? *</FormLabel>
                    {/* {cErr ? (<div className='error-help'> {cErr} </div>) : ''} */}
                    <RadioGroup aria-label="capacity" name="registrantCapacity" value={capacity} onChange={e=>{setCapacity(e.target.value); updateFormData("capacity", e.target.value)}}>
                        <FormControlLabel value="head" control={<Radio margin="dense"/>} label="Yes" />
                        <FormControlLabel value="delegate" control={<Radio margin="dense"/>} label="No" />
                    </RadioGroup>
                </FormGroup>

                {capacity && (
                    <>   
                <Grid container spacing={2}>
                    <Grid item xs={(formData.capacity === "head") ? 12 : 6}>
                        <FormInput 
                        required
                        value={formData.email} 
                        onChange={e=>updateFormData("email", e.target.value)} 
                        label="Email"
                        // error={eErr} 
                        />
                        {/* {eErr ? (<div className='error-help'> {eErr} </div>) : ''} */}
                    </Grid>
                    {formData.capacity === "delegate" && (
                    <Grid item xs={6}>
                        <FormInput 
                            required
                        value={formData.passcode} 
                        onChange={e=>updateFormData("passcode", e.target.value)} 
                        label="Passcode"
                        type="password"
                        // error={passErr}
                         />
                        {/* {passErr ? (<div className='error-help'> {passErr} </div>) : ''} */}
                    </Grid>
                    )}
                </Grid>
                    </>
                )}

                <hr />
                
                <Typography variant="subtitle1">General Information</Typography>

                <Grid container spacing={2} style={{marginTop: '2rem'}}>
                    <Grid item xs={6}>
                        <FormInput 
                        required
                        value={formData.firstName} 
                        onChange={e=>updateFormData("firstName", e.target.value)} 
                        label="First Name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormInput 
                        required
                        value={formData.lastName} 
                        onChange={e=>updateFormData("lastName", e.target.value)} 
                        label="Last Name" />
                    </Grid>
                </Grid>
                
                
                <FormInput 
                    required
                    value={formData.grade} 
                    label="Grade"
                    onChange={e=>updateFormData("grade", e.target.value)} />

                <FormSelect
                    required
                    margin="normal"
                    label="School"
                    labelID="school"
                    value={formData.school}
                    onChange={e=>updateFormData("school", e.target.value)}>
                    {displaySchools}
                </FormSelect>

                <FormSelect
                    required
                    margin="normal"
                    label="Sex"
                    labelID="sex"
                    value={formData.sex}
                    onChange={e=>updateFormData("sex", e.target.value)}>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                </FormSelect>
                
                <FormInput 
                    required
                    value={formData.phoneNumber} 
                    label="Phone Number"
                    onChange={e=>updateFormData("phoneNumber", e.target.value)} />

                    
                <FormInput 
                    required
                    value={formData.postal} 
                    label="Postal Code/Zip Number"
                    onChange={e=>updateFormData("postal", e.target.value)} />

                
                <FormSelect
                    required
                    margin="normal"
                    label="Who referred you to CAHSMUN?"
                    labelID="refereePosition"
                    value={formData.refereePosition}
                    onChange={e=>updateFormData("refereePosition", e.target.value)}>
                    <MenuItem value="delegate">Delegate</MenuItem>
                    <MenuItem value="staff">Staff/Secretariat Member</MenuItem>
                </FormSelect>

                <FormInput 
                    required
                    value={formData.refereeName} 
                    label="Name of Reference"
                    onChange={e=>updateFormData("refereeName", e.target.value)} />


                <hr />
                <Typography variant="subtitle1">Emergency Contact</Typography>


                <Grid container spacing={2} style={{marginTop: '2rem'}}>
                    <Grid item xs={6}>
                        <FormInput 
                        required
                        value={formData.ec_firstName} 
                        onChange={e=>updateFormData("ec_firstName", e.target.value)} 
                        label="First Name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormInput 
                        required
                        value={formData.ec_lastName} 
                        onChange={e=>updateFormData("ec_lastName", e.target.value)} 
                        label="Last Name" />
                    </Grid>
                </Grid>

                <FormInput 
                    required
                    value={formData.ec_relationship} 
                    label="Relationship to Delegate"
                    onChange={e=>updateFormData("ec_relationship", e.target.value)} />

                <FormInput 
                    required
                    value={formData.ec_phoneNumber} 
                    label="Phone Number"
                    onChange={e=>updateFormData("ec_phoneNumber", e.target.value)} />


                <hr />
                <Typography variant="subtitle1">Committee Selection</Typography>
                <Typography style={{paddingTop: '1rem'}} variant="body1">
                    Current availability is viewable here: <Link className="inline-link" to={"/matrix"} target="_blank">CAHSMUN 2022 Country Matrix.</Link>
                    <br /><br />
                    Whenever possible, and when the delegate meets a suitable benchmark of prior experience, CAHSMUN 
                    strives to provide delegates with their first country preference. If the country is no longer 
                    available, or the delegate does not meet the necessary benchmark, our Delegate Affairs team 
                    will work to find a similar country for assignment. We are happy to work with individual 
                    delegates to review their committee/country assignment - if you would like to request a 
                    reassignment, please contact delegates@cahsmun.org.
                    <br /><br />
                    Committee & country selection will only display available countries.
                </Typography>

                <Grid container spacing={2}>

                    {/* FIRST PREFERENCE */}
                    <Grid item xs={12} style={{ paddingTop: "3rem" }}>
                        <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>First Preference</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormSelect
                            required
                            label="Committee"
                            labelID="prefOneComm"
                            value={formData.prefOneComm}
                            onChange={e=>{
                                updateFormData("prefOneComm", e.target.value);
                                renderCountries(1, committeeMap[e.target.value])
                            }}>
                            {displayCommittees}
                        </FormSelect>
                    </Grid>
                    <Grid item xs={6}>
                        <FormSelect
                            required
                            label="Country"
                            labelID="prefOneCountry"
                            value={formData.prefOneCountry}
                            onChange={e=>updateFormData("prefOneCountry", e.target.value)}>
                            {displayCountriesOne}
                        </FormSelect>
                    </Grid>

                    {/* SECOND PREFERENCE */}
                    <Grid item xs={12} style={{ paddingTop: "1rem" }}>
                        <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>Second Preference</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormSelect
                            required
                            label="Committee"
                            labelID="prefTwoComm"
                            value={formData.prefTwoComm}
                            onChange={e=>{
                                updateFormData("prefTwoComm", e.target.value); 
                                renderCountries(2, committeeMap[e.target.value]);
                            }}>
                            {displayCommittees}
                        </FormSelect>
                    </Grid>
                    <Grid item xs={6}>
                        <FormSelect
                            required
                            label="Country"
                            labelID="prefTwoCountry"
                            value={formData.prefTwoCountry}
                            onChange={e=>updateFormData("prefTwoCountry", e.target.value)}>
                            {displayCountriesTwo}
                        </FormSelect>
                    </Grid>

                    {/* THIRD PREFERENCE */}
                    <Grid item xs={12} style={{ paddingTop: "1rem" }}>
                        <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>Third Preference</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <FormSelect
                            required
                            label="Committee"
                            labelID="prefThreeComm"
                            value={formData.prefThreeComm}
                            onChange={e=>{
                                updateFormData("prefThreeComm", e.target.value);
                                renderCountries(3, committeeMap[e.target.value]);
                            }}>
                            {displayCommittees}
                        </FormSelect>
                    </Grid>
                    <Grid item xs={6}>
                        <FormSelect
                            required
                            label="Country"
                            labelID="prefThreeCountry"
                            value={formData.prefThreeCountry}
                            onChange={e=>updateFormData("prefThreeCountry", e.target.value)}>
                            {displayCountriesThree}
                        </FormSelect>
                    </Grid>
                </Grid>

                
                <hr />
                <Typography variant="subtitle1">Model UN Experience</Typography>

                <FormSelect
                    required
                    margin="normal"
                    label="Previous Conferences Attended"
                    labelID="numPrevConferences"
                    value={formData.numPrevConferences}
                    onChange={e=>updateFormData("numPrevConferences", e.target.value)}>
                    <MenuItem value="0">0</MenuItem>
                    <MenuItem value="1-3">1-3</MenuItem>
                    <MenuItem value="4-6">4-6</MenuItem>
                    <MenuItem value="7-9">7-9</MenuItem>
                    <MenuItem value="10+">10+</MenuItem>
                </FormSelect>

                <FormInput
                    required
                    value={formData.pastConferences} 
                    label="Past Conferences and Awards"
                    onChange={e=>updateFormData("pastConferences", e.target.value)} 
                    multiline={true}
                    rows={5} />


                <hr />
                <Typography variant="subtitle1">Attendance</Typography>

                <FormGroup style={{ margin: "20px 0" }}>
                    {/* {cErr ? (<div className='error-help'> {cErr} </div>) : ''} */}
                    <RadioGroup aria-label="format" name="conferenceFormat" value={attendance} onChange={e=>{setAttendance(e.target.value); updateFormData("attendance", e.target.value)}}>
                        <FormControlLabel value="inperson" control={<Radio margin="dense"/>} label="In Person (Sheraton Wall Centre)" />
                        <FormControlLabel value="online" control={<Radio margin="dense"/>} label="Online" />
                    </RadioGroup>
                </FormGroup>

                {attendance && (<>
                    
                <Typography variant="body1" style={{color: 'rgba(0, 0, 0, 0.54)'}}>Payment Information</Typography>
                <Typography style={{ paddingTop: "1rem" }} variant="body1">
                    All CAHSMUN fees are in Canadian dollars. 
                    {attendance === "inperson" && (<>
                        The fee below only covers conference registration. <strong>Hotel rooms are NOT included in the registration fee</strong>; however, rooms can still be arranged directly with the Sheraton Wall Centre. For more information about our fees and rooming policies, you may read more at www.cahsmun.org/register. Please email Neil Hong at delegates@cahsmun.org if you have any questions about this policy.
                    </>)}
                    <br /><br />
                    Please note that your registration will not be processed until we have received your payment. You will automatically receive a receipt from Stripe if you pay by credit card.
                    <br /><br />
                    Registration fee for this period:&nbsp;
                    <strong>
                        {attendance === "inperson" ? "$195" : "$50"}
                    </strong>
                </Typography>
                    
                </>)}

                {attendance === "inperson" && (<>
                <hr />
                <Typography variant="subtitle1">COVID-19 Safety Plan & Agreement</Typography>
                <Typography style={{ padding: "1rem 0" }} variant="body1">
                    By signing below, I confirm that I have read, understood, and agree to the COVID-19 Safety Plan published here. I understand my participation at CAHSMUN 2022 requires my full compliance with all safety policies and future changes.
                    <br /><br />
                    <strong>
                        I confirm that I am not seeking an exemption from the proof of vaccination, universal masking, or rapid testing requirement.
                    </strong>
                </Typography>
                <FormInput
                    required
                    value={formData.signature} 
                    label="Signature"
                    onChange={e=>updateFormData("signature", e.target.value)} />
                </>)}



                {attendance && (
                <Button
                  disabled={loading}
                  onClick={()=>handleRegister()} 
                  color="primary" 
                  variant="contained" 
                  size="large" 
                  style={{
                      marginTop: '2rem',
                      minWidth:'150px'
                  }}
                  disableElevation>
                    {!loading ? 'Proceed to Payment' : (
                        <>
                            <CircularProgress disableShrink size={20} style={{
                                marginRight: 15,
                                marginLeft: -5,
                                color: '#777777',
                            }} />
                            Proceeding...
                        </>
                    )}
                </Button>
                )}

            </Container>
        </div>
    )
}

export default DelegateRegistration