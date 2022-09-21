import {
    Chip, Container,
    Grid,
    LinearProgress,
    Typography,
    Button,
    Modal,
    Box,
    IconButton,
    TextField,
    Switch
} from '@material-ui/core';
import {
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/Close'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useAuthContext } from "../authentication/AuthContext";
import Navigation from '../components/Navigation';
import { API_URL } from "../config";
import { modalStyles } from '../helpers';


const AddModal = ({open, fnClose, fnAdd, label, buttonLabel, placeholder }) => {
    const [name, setName] = useState('')

    const handleAddCountry = () => {
        fnAdd(name)
        setName('')
        fnClose()
    }

    return (
        <>
            <Modal
              open={open}
              onClose={fnClose}
              style={modalStyles.modalWrapper}>
                <Box style={{...modalStyles.modal, ...modalStyles.modalSmall}}>
                    <div style={{...modalStyles.modalTop, ...modalStyles.modalActions}}>
                        <Typography id="modal-modal-title" variant="subtitle1">
                            {label}
                        </Typography>
                        <IconButton size="small" onClick={fnClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={modalStyles.modalContent}>
                        <TextField 
                          value={name} 
                          onChange={e=>setName(e.target.value.toLowerCase())} 
                          variant="outlined" 
                          label={placeholder}
                          margin="normal" 
                          size="small" 
                          fullWidth />
                    </div>
                    <div style={{...modalStyles.modalBottom, ...modalStyles.modalActions}}>
                        <div></div>
                        <Button 
                        variant="contained" 
                        color="primary" 
                        size="medium" 
                        disableElevation
                        onClick={handleAddCountry}>
                            {buttonLabel}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

const MatrixItem = ({ committee, fnRefresh }) => {
    const {currentUser} = useAuthContext();
    const history = useHistory()

    const [loadingChanges, setLoadingChanges] = useState(false)

    const [isExpanded, setIsExpanded] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [editCountries, setEditCountries] = useState(committee.countries)

    const handleOpenModal = () => {
        setIsEditing(true)
        setEditCountries(JSON.parse(JSON.stringify(committee?.countries)))
    }

    const handleCloseModal = () => {
        setIsEditing(false)
    }

    const [innerOpen, setInnerOpen] = useState(false)

    const handleOpenInner = () => {
        setInnerOpen(true)
    }

    const handleCloseInner = () => {
        setInnerOpen(false)
    }

    const handleAddCountry = (name) => {
        const currentCountries = JSON.parse(JSON.stringify(editCountries))
        currentCountries.push({
            name,
            assigned: ''
        })
        setEditCountries(currentCountries)
    }

    const handleDeleteCountry = (index) => {
        let currentCountries = JSON.parse(JSON.stringify(editCountries))
        currentCountries.splice(index, 1)
        setEditCountries(currentCountries)
    }

    const handleSaveChanges = async () => {
        if(loadingChanges) return 
        setLoadingChanges(true)

        try {
            axios.patch(`${API_URL}/committees/edit/${committee._id}/countries`, {
                countries: editCountries,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                },
            })

            fnRefresh()
            setLoadingChanges(false)
            handleCloseModal()
            history.go(0)
        } catch (error) {
            setLoadingChanges(false)
            console.error(error)
        }
    }

    return (
            <>
            <div className='bare-outline-box'>
                <div style={{
                    display: 'flex',
                    padding: '1rem',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <div>
                        <Typography variant="subtitle1">
                            {committee.name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {committee.countries.length} countries
                        </Typography>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                    }}>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="medium" 
                            disableElevation
                            onClick={()=>setIsExpanded(!isExpanded)}>
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="medium" 
                            disableElevation
                            onClick={handleOpenModal}>
                            Edit
                        </Button>
                        <Button 
                            variant="contained" 
                            color="secondary"
                            size="medium"
                            disableElevation
                            onClick={()=>{
                                if(isDeleting) {
                                    // handleDeleteCommitte()
                                } else {
                                    setIsDeleting()
                                }
                            }}>
                            Delete
                        </Button>
                    </div>
                </div>
                {isExpanded ? (
                <div>
                    <table style={{
                        padding: '0 1rem 1rem 1rem',
                        fontSize: '0.9rem'
                    }}>
                        <tr style={{
                            fontWeight: 600
                        }}>
                            <td>Country</td>
                            {/* <td>Assigned To</td> */}
                        </tr>
                        {committee.countries?.map((country, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {country['name']}
                                    </td>
                                    {/* <td>
                                        {userIdToName[country['assigned']]}
                                    </td> */}
                                </tr>
                            )
                        })}
                    </table>
                </div>
                ) : <></>}
            </div>

            <Modal
                open={isEditing}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={modalStyles.modalWrapper}>
                <Box style={modalStyles.modal}>
                    <div style={{...modalStyles.modalTop, ...modalStyles.modalActions}}>
                        <Typography id="modal-modal-title" variant="subtitle1">
                            Edit Committee
                        </Typography>
                        <IconButton size="small" onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {loadingChanges ? (
                        <div style={{
                            width: '100%',
                            height: 0,
                        }}>
                            <LinearProgress />
                        </div>
                    ) : ''}
                    <div style={modalStyles.modalContent}>
                        <Typography id="modal-modal-description" variant="subtitle2">
                            Countries
                        </Typography>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                            paddingTop: '1rem'
                        }}>
                            {editCountries?.map((country, index) => {
                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'stretch',
                                        border: '1px solid #EEE',
                                    }}>
                                        <div key={index} style={{
                                            padding: '0.5rem 0.8rem',
                                            fontSize: '0.9rem',
                                            background: country.assigned_to ? 'lightyellow' : 'lightgreen'
                                        }}>
                                            {country.name} 
                                        </div>
                                        <div className="hoverable" style={{
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            color: "#777"
                                        }} onClick={()=>handleDeleteCountry(index)}>
                                            <CloseIcon fontSize="small" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div style={{...modalStyles.modalBottom, ...modalStyles.modalActions}}>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="large" 
                          disableElevation
                          onClick={handleOpenInner}>
                            Add Country
                        </Button>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="large" 
                          disableElevation
                          disabled={loadingChanges}
                          onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </div>
                    <AddModal 
                        label="Add Country"
                        buttonLabel="Add Country"
                        placeholder="Type here"
                        open={innerOpen}
                        fnClose={handleCloseInner}
                        fnAdd={handleAddCountry} />
                </Box>
            </Modal>
        </>
    )
}

const Setup = () => {
    const history = useHistory()

    const {currentUser, getUserData} = useAuthContext();
    const userData = getUserData();
    const role = currentUser ? userData.role : '';

    const [dataRefresh, setDataRefresh] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // committee data
    const [committeeData, setCommitteeData] = useState([])

    // registration edit (flags, year, registration forms, etc.)
    const [isEditing, setIsEditing] = useState(false)
    const [isSavingEdit, setIsSavingEdit] = useState(false)
    const [editFlags, setEditFlags] = useState('')
    const [madeChanges, setMadeChanges] = useState(false)

    // adding committee
    const [isAdding, setIsAdding] = useState(false)
    
    // feature flags
    const [flagData, setFlagData] = useState('');

    const handleRefresh = () => {
        setDataRefresh(!dataRefresh)
    }

    const parseFlagData = ({ featureFlags }) => {
        const clean = {}
        for(let i = 0; i < featureFlags.length; i++) {
            const featureFlagPair = featureFlags[i]
            const mapToFlag = ['isRegistrationOpen', 'isSchoolRegistrationOpen']
            const mapToDatified = []; // ['earlyEndFlag', 'regEndFlag', 'lateEndFlag']
            if(mapToFlag.includes(featureFlagPair.feature)) {
                clean[featureFlagPair.feature] = featureFlagPair.flag
            } else if (mapToDatified.includes(featureFlagPair.feature)) {
                clean[featureFlagPair.feature] = new Date(featureFlagPair.note).toString()
            } else {
                clean[featureFlagPair.feature] = featureFlagPair.note
            }
        }
        return clean
    }

    async function loadFlagsData() {

        if(!(role === 'SECRETARIAT')) return
        
        try {
            const res = await axios.get(`${API_URL}/auth/admin/flag/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            setFlagData(parseFlagData(res.data))
            setEditFlags(parseFlagData(res.data))
        } catch(error) {
            console.error(error)
        }
    }

    async function loadMatrix() {
        if(!(role === 'SECRETARIAT')) return

        try {
            const { data } = await axios.get(`${API_URL}/committees/matrix`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            setCommitteeData(data)
            setDataLoading(false)
        } catch (error) {
            console.error(error)
            setDataLoading(false)
        }
    }

    useEffect(() => {
        setDataLoading(false)
        loadFlagsData()
        loadMatrix()
    }, [dataRefresh])

    // Adding a committee modal control
    const handleOpenModal = () => {
        setIsAdding(true)
    }

    const handleCloseModal = () => {
        setIsAdding(false)
    }

    const handleAddCommittee = async (committeeName) => {
        if(!(role === 'SECRETARIAT')) return

        try {
            const { data } = await axios.post(`${API_URL}/committees/add`, {
                name: committeeName,
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            history.go(0)
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditRegistration = () => {
        setIsEditing(true)
        setEditFlags(flagData)
    }
    const handleCloseEditing = () => {
        setIsEditing(false)
    }
    const handleEditFlag = (key, value) => {
        let editedFlag = JSON.parse(JSON.stringify(editFlags))
        editedFlag[key] = value
        setEditFlags(editedFlag)
        // if(JSON.stringify(editFlags) !== JSON.stringify(flagData)) {
        //     setMadeChanges(true)
        // }
        // console.log(editFlags, flagData)
    }
    const handleSaveRegistration = async () => {
        if (isSavingEdit) return
        setIsSavingEdit(true)

        
        axios
        .post(`${API_URL}/auth/admin/flag/save`, {
            conferenceYear: editFlags.conferenceYear,
            earlyRegEnd: new Date(editFlags.earlyEndFlag).toISOString().substring(0, 10),
            regRegEnd: new Date(editFlags.regEndFlag).toISOString().substring(0, 10),
            lateRegEnd: new Date(editFlags.lateEndFlag).toISOString().substring(0, 10),
            isRegistrationOpen: editFlags.isRegistrationOpen,
            isSchoolRegistrationOpen: editFlags.isSchoolRegistrationOpen,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            
            setIsSavingEdit(false)
            handleCloseEditing()
        
        }).catch((error) => {
            setIsSavingEdit(false)
            if(error?.response) {
                console.error(error?.response?.data?.message);
            } else {
                console.error('Connection with server is bad');
            }
        });

        setDataRefresh(!dataRefresh)
        history.go(0)
    }
    
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

                {role === 'SECRETARIAT' ? (
                    <Container maxWidth="md">
                        <div style={{ display: 'flex', gap: '0.5rem'}}>
                            <Typography variant="subtitle1">Registration Setup</Typography>
                            {/* <Chip 
                            style={{ textTransform: 'uppercase', fontWeight: 500, fontSize: '0.75rem', userSelect: 'none',
                                backgroundColor: flagData?.isSetupComplete ? 'lightgreen' : '#FED8B1',
                                color: flagData?.isSetupComplete ? 'darkgreen' : 'darkorange' }} 
                            label={flagData?.isSetupComplete ? 'Completed' : 'Incomplete'} /> */}
                        </div>
                
                        <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={4}>
                                <div className='outline-box' style={{
                                    marginBottom: '1rem',
                                    borderColor: flagData?.isRegistrationOpen ? 'green' : '#FED8B1',
                                    color: flagData?.isRegistrationOpen ? 'darkgreen' : 'darkorange'
                                }}>
                                    <span className='big-text'>
                                        {flagData?.isRegistrationOpen ? 'Opened' : 'Closed'}
                                    </span>
                                    <span style={{
                                        color: "black",
                                        paddingTop: '0.25rem',
                                        display: 'table'
                                    }}>Delegate Registration</span>
                                </div>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="medium" 
                                    disableElevation
                                    onClick={handleEditRegistration}>
                                    Registration Settings
                                </Button>
                            </Grid><Grid item xs={4}>
                                <div className='outline-box' style={{
                                    borderColor: flagData?.isSchoolRegistrationOpen ? 'green' : '#FED8B1',
                                    color: flagData?.isSchoolRegistrationOpen ? 'darkgreen' : 'darkorange'
                                }}>
                                    <span className='big-text'>
                                        {flagData?.isSchoolRegistrationOpen ? 'Opened' : 'Closed'}
                                    </span>
                                    <span style={{
                                        color: "black",
                                        paddingTop: '0.25rem',
                                        display: 'table'
                                    }}>School Registration</span>
                                </div>
                            </Grid>
                            {/* 
                            <Grid item xs={4}>
                                <div className='outline-box' style={{
                                    borderColor: flagData?.isCompletePortal ? 'green' : '#FED8B1',
                                    color: flagData?.isCompletePortal ? 'darkgreen' : 'darkorange'
                                }}>
                                    <span className='big-text'>
                                        {flagData?.IsCompletePortal ? 'Complete' : 'Incomplete'}
                                    </span>
                                    <span style={{
                                        color: "black",
                                        paddingTop: '0.25rem',
                                        display: 'table'
                                    }}>Campus Portal</span>
                                </div>
                            </Grid> */}
                        </Grid>
                
                        {/* <Grid container spacing={1} style={{marginTop: '3rem'}}>
                            <Grid item xs={12}>
                            <Typography variant="subtitle2" style={{marginBottom: 10}}>Registration Forms</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>Delegate Registration</span>
                                    <span>Complete</span>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className='outline-box'>
                                    <span className='big-text'>School Registration</span>
                                    <span>Complete</span>
                                </div>
                            </Grid>
                        </Grid> */}
                        
                        <Typography variant="subtitle2" style={{marginTop: '3rem', marginBottom: 10}}>Committees</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '1rem' }}>
                            {!dataLoading && committeeData?.map((item, index) => {
                                return <MatrixItem key={index} committee={item} fnRefresh={handleRefresh} />
                            })}
                        </div>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="large" 
                          disableElevation
                          onClick={handleOpenModal}>
                            Add a Committee
                        </Button>
                    </Container>
                ) : 'Unauthorized'}

            </div>

            
            <Modal
              open={isEditing}
              onClose={handleCloseEditing}
              style={modalStyles.modalWrapper}>
                <Box style={{...modalStyles.modal, ...modalStyles.modalSmall}}>
                    <div style={{...modalStyles.modalTop, ...modalStyles.modalActions}}>
                        <Typography id="modal-modal-title" variant="subtitle1">
                            Edit Registration Settings
                        </Typography>
                        <IconButton size="small" onClick={handleCloseEditing}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div style={modalStyles.modalContent}>
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography id="modal-modal-title" variant="paragraph">
                                    Conference Year
                                </Typography>
                                <TextField 
                                    value={editFlags?.conferenceYear} 
                                    onChange={e=>handleEditFlag('conferenceYear', e.target.value)} 
                                    variant="outlined"
                                    label={'Year'}
                                    margin="normal" 
                                    size="small" />
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography id="modal-modal-title" variant="paragraph">
                                    Early Reg Ends Before
                                </Typography>
                                <TextField
                                    id="eardate"
                                    label="Date"
                                    type="date"
                                    variant="outlined"
                                    margin="normal"
                                    size="small"
                                    value={editFlags?.earlyEndFlag}
                                    onChange={e=>handleEditFlag('earlyEndFlag', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography id="modal-modal-title" variant="paragraph">
                                    Regular Reg Ends Before
                                </Typography>
                                <TextField
                                    id="regdate"
                                    label="Date"
                                    type="date"
                                    variant="outlined"
                                    margin="normal"
                                    size="small"
                                    value={editFlags?.regEndFlag}
                                    onChange={e=>handleEditFlag('regEndFlag', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography id="modal-modal-title" variant="paragraph">
                                    Late Reg Ends Before
                                </Typography>
                                <TextField
                                    id="latdate"
                                    label="Date"
                                    type="date"
                                    variant="outlined"
                                    margin="normal"
                                    size="small"
                                    value={editFlags?.lateEndFlag}
                                    onChange={e=>handleEditFlag('lateEndFlag', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    />
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography id="modal-modal-title" variant="paragraph">
                                    Delegate Registration Open
                                </Typography>
                                <Switch checked={editFlags?.isRegistrationOpen} onChange={()=>handleEditFlag('isRegistrationOpen', !editFlags.isRegistrationOpen)} />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography id="modal-modal-title" variant="paragraph">
                                    School Registration Open
                                </Typography>
                                <Switch checked={editFlags?.isSchoolRegistrationOpen} onChange={()=>handleEditFlag('isSchoolRegistrationOpen', !editFlags.isSchoolRegistrationOpen)} />
                            </div>
                        </div>
                    </div>
                    <div style={{...modalStyles.modalBottom, ...modalStyles.modalActions}}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="large" 
                          disableElevation
                          disabled={isSavingEdit}
                          onClick={handleSaveRegistration}>
                            Save Settings
                        </Button>
                    </div>
                </Box>
            </Modal>

            <AddModal 
                label="Add a Committee"
                buttonLabel="Add Committee"
                placeholder="Type here"
                open={isAdding}
                fnClose={handleCloseModal}
                fnAdd={handleAddCommittee} />
        </>
    )
}

export default Setup