import React, { useState, useEffect } from "react";
import axios from 'axios';
import { 
    Button,
    Container, 
    Grid,
    LinearProgress,
    Typography,
    Chip,
    Modal,
    Box,
    IconButton,
    TextField,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Navigation from '../../components/Navigation';
import { useAuthContext } from "../../authentication/AuthContext";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";
import { modalStyles } from "../../helpers";
import CloseIcon from '@material-ui/icons/Close'

const DeepMatrix = () => {

    const {currentUser, getUserData} = useAuthContext();
    const userData = getUserData();
    const role = currentUser ? userData.role : '';

    const [dataRefresh, setDataRefresh] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const [committeesData, setCommitteesData] = useState('')
    const [mapIdToName, setMapIdToName] = useState({})
    const [assignableDelegates, setAssignableDelegates] = useState([])
    const [selectedDelegate, setSelectedDelegate] = useState({
        label: 'Select a delegate',
        id: -1
    })

    const [assigning, setAssigning] = useState(null)

    const truncate = (str) => {
        if (!str) return ''
        return `${str.slice(0, 4)}...${str.slice(str.length - 5)}`
    }

    const parseDelegateRecords = (data) => {
        let map = {}

        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            map[item._id] = `${item.firstName ? item.firstName : ''}${item.lastName ? ` ${item.lastName}` : ''}`
        }

        return map
    }

    const parseAssignableDelegates = (data) => {
        let arr = []

        for(let i = 0; i < data.length; i++) {
            const item = data[i]
            arr.push({
                label: `${item.firstName} ${item.lastName} (${truncate(item._id)})`,
                id: item._id
            })
        }

        return arr
    }
    
    async function loadUsersIdMap() {
        if(role !== 'SECRETARIAT') return

        try {
            const { data } = await axios.get(`${API_URL}/delegates/map`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            setAssignableDelegates(parseAssignableDelegates(data))
            setMapIdToName(parseDelegateRecords(data))
        } catch (error) {
            console.error(error)
            setDataLoading(false)
        }
    }

    async function loadCommittees() {
        if(role !== 'SECRETARIAT') return

        try {
            const { data } = await axios.get(`${API_URL}/committees/matrix`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            setCommitteesData(data)
            setDataLoading(false)
        } catch (error) {
            console.error(error)
            setDataLoading(false)
        }
    }

    useEffect(() => {
        loadUsersIdMap()
        loadCommittees()
    }, [dataRefresh])

    const handleOpenAssign = (payload) => {
        if (!payload) return
        
        setAssigning(payload)
    }

    const handleCloseAssign = () => {
        setAssigning(null)
        setSelectedDelegate(null)
    }

    const handleOnChange = (e) => {
        setSelectedDelegate(e.target.value)
    }

    const handleAssign = async () => {
        const { committee_id, country_id } = assigning

        try {
            await axios.post(`${API_URL}/committees/assign/${committee_id}/${country_id}/${selectedDelegate}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            handleCloseAssign()
            setDataRefresh(!dataRefresh)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnassign = async () => {
        const { committee_id, country_id, delegate_id } = assigning

        try {
            await axios.post(`${API_URL}/committees/unassign/${committee_id}/${country_id}/${delegate_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })

            handleCloseAssign()
            setDataRefresh(!dataRefresh)
        } catch (error) {
            console.log(error)
        }
    }

    return role === 'SECRETARIAT' ? (
        <>
            {dataLoading ? (
                <div style={{
                    width: '100%',
                    height: 0,
                }}>
                    <LinearProgress />
                </div>
            ) : ''}
            <div style={{ display: 'flex' }}>
                <Navigation />
                
                <div style={{
                    overflowY: 'auto',
                    padding: '1rem'
                }}>
                    <Typography variant="subtitle1">Country Matrix</Typography>

                    <div style={{
                        display: 'grid',
                        width: `calc(200px * ${committeesData.length})`,
                        gridTemplateColumns: `repeat(${committeesData.length}, 1fr)`
                    }}>
                        {!dataLoading && committeesData?.map((committee, index) => {
                            return (
                                <div key={index}>
                                    <Typography variant="subtitle1">{committee.name}</Typography>
                                    <div>
                                        {committee.countries.map((country, countryIndex) => {
                                            return (
                                                <div key={countryIndex} style={{
                                                    backgroundColor: country.assigned ? 'lightyellow' : 'lightgreen',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    justifyContent: 'space-between',
                                                    padding: '0.25rem'
                                                }}>
                                                    <div>
                                                        {country.name} 
                                                    </div>
                                                    <div>
                                                        {country.assigned ? (
                                                            <>
                                                                ({mapIdToName[country.assigned]})
                                                                <Button
                                                                // disabled
                                                                variant="text"
                                                                color="primary"
                                                                size="small"
                                                                onClick={()=>{
                                                                    handleOpenAssign({
                                                                        assign: false,
                                                                        delegate_id: country.assigned,
                                                                        country: country.name,
                                                                        committee: committee.name,
                                                                        country_id: country._id,
                                                                        committee_id: committee._id
                                                                    })
                                                                }}>
                                                                    Unassign
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                            // disabled
                                                            variant="text"
                                                            color="primary"
                                                            onClick={()=>{
                                                                handleOpenAssign({
                                                                    assign: true,
                                                                    delegate_id: null,
                                                                    country: country.name,
                                                                    committee: committee.name,
                                                                    country_id: country._id,
                                                                    committee_id: committee._id
                                                                })
                                                            }}>
                                                                Assign
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <Modal
              open={assigning !== null}
              onClose={handleCloseAssign}
              style={modalStyles.modalWrapper}>
                <Box style={{...modalStyles.modal, ...modalStyles.modalSmall}}>
                    <div style={{...modalStyles.modalTop, ...modalStyles.modalActions}}>
                        <Typography id="modal-modal-title" variant="subtitle1">
                            {assigning?.assign ? 'Assign to Delegate' : 'Remove Assignment'}
                        </Typography>
                        <IconButton size="small" onClick={handleCloseAssign}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {assigning?.assign ? (
                    <>
                        <div style={modalStyles.modalContent}>
                            <div style={{ paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                Select delegate to <Typography variant="subtitle1">{assigning?.country} ({assigning?.committee})</Typography>
                            </div>
                            <FormControl fullWidth>
                                <InputLabel id="select-label">Delegate</InputLabel>
                                <Select
                                    labelId="select-label"
                                    id="demo-simple-select"
                                    value={selectedDelegate}
                                    label={`${mapIdToName[selectedDelegate]}`}
                                    variant="filled"
                                    margin="dense"
                                    onChange={handleOnChange}>
                                    {assignableDelegates.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>{item.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={top100Films}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Movie" />} /> */}
                        </div>
                        <div style={{...modalStyles.modalBottom, ...modalStyles.modalActions}}>
                            <div></div>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="medium" 
                                disableElevation
                                onClick={handleAssign}>
                                Assign
                            </Button>
                        </div>
                    </>
                    ) : (
                    <>
                        <div style={modalStyles.modalContent}>
                            <div style={{ paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                                Do you wish to remove <Typography variant="subtitle1">{assigning?.country} ({assigning?.committee})</Typography> from <Typography variant="subtitle1">{mapIdToName[assigning?.delegate_id]} ({truncate(assigning?.delegate_id)})</Typography>?
                            </div>
                        </div>
                        <div style={{...modalStyles.modalBottom, ...modalStyles.modalActions}}>
                            <div></div>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                size="medium" 
                                disableElevation
                                onClick={handleUnassign}>
                                Remove Assignment
                            </Button>
                        </div>
                    </>
                    )}
                </Box>
            </Modal>
        </>
    ) : <></>
}

export default DeepMatrix;