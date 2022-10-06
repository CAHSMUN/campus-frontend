import React, { useState, useEffect } from "react";
import { 
    Button,
    Card,
    Container, 
    Grid,
    LinearProgress,
    Typography
} from '@material-ui/core';
import Navigation from '../../components/Navigation';
import { useAuthContext } from "../../authentication/AuthContext";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";

const DelegateDetail = ({ match }) => {

    const { currentUser } = useAuthContext();
    const history = useHistory()
    
    // const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [delegateData, setDelegateData] = useState({});
    const [displaySchoolData, setDisplaySchoolData] = useState([]);

    const prettify = {
        attendance: "Attendance Format", // online or inperson attendance
        capacity: "Capacity",
        email: "Email",
        passcode: "Passcode",
        firstName: "First Name",
        lastName: "Last Name",
        grade: "Grade",
        school: "School", 
        sex: "Sex",
        phoneNumber: "Phone Number",
        postal: "Postal Code/Zip Number", // postal code or zip
        refereePosition: "Referee Position", // who referred (optional)
        refereeName: "Referee Name", // name of who referred (optional)
        ec_firstName: "Emergency Contact First Name",
        ec_lastName: "Emergency Contact Last Name",
        ec_relationship: "Emergency Contact Relationship",
        ec_phoneNumber: "Emergency Contact Phone Number",
        prefOneComm: "First Preference: Committee", // ID reference
        prefOneCountry: "First Preference: Country",
        prefTwoComm: "Second Preference: Committee", // ID reference
        prefTwoCountry: "Second Preference: Country",
        prefThreeComm: "Third Preference: Committee", // ID reference
        prefThreeCountry: "Third Preference: Country",
        numPrevConferences: "# Previous Conferences", // number of previous conferences
        pastConferences: "Past Conferences", // past conferences and awards
        signature: "Signature", // signature to abide by COVID policy
        paymentId: "Payment ID", // to be internally generated after payment
    }

    async function loadSchool(id) {
        setDataLoading(true);

        if(!typeof id === "string") return

        try {
            let res = await axios.get(`${API_URL}/schools/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            
            setDisplaySchoolData(res.data.name);
            setDataLoading(false);

        } catch(error) {
            setDataLoading(false);
        }
    }

    async function loadDelegate() {
        if(!typeof id === "string") return

        try {
            let res = await axios.get(`${API_URL}/delegates/${match.params.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            
            setDelegateData(res.data);
            loadSchool(res.data.school)
        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        loadDelegate()
    }, [])

    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    async function handleDeleteDelegate() {
        if(isLoadingDelete) return
        setIsLoadingDelete(true)
        
        if(!typeof id === "string") return

        try {
            let res = await axios.delete(`${API_URL}/delegates/${match.params.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });

            console.log(res.status)
            
            setIsLoadingDelete(false)
            history.push('/secretariat/delegates')
        } catch(error) {
            setIsLoadingDelete(false)
        }
    }

    return (
        <div className='app-container'>
            <Navigation />

            <Container maxWidth="md">
                <Typography variant="subtitle1">Delegate Detail</Typography>
                <Typography variant="subtitle2" 
                    style={{
                        marginBottom: '3rem',
                    }}>{delegateData.firstName}</Typography>

                <Card>
                    <div className="detail-grid">
                        {delegateData && Object.keys(delegateData).map((key, index) => {
                            return prettify[key] ? (
                                <div key={index} className="detail-grid-row">
                                    <div key={key} className="detail-key">
                                        {prettify[key]}
                                    </div>
                                    <div className="detail-item">
                                        {key === 'school' ? displaySchoolData : key === 'pastConferences' ? (
                                            <div style={{
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {delegateData[key]}
                                            </div>
                                        ) : delegateData[key]}
                                    </div>
                                </div>
                            ) : ''
                        })}
                    </div>
                </Card>

                <Card style={{ marginTop: '2rem' }}>
                    <Typography variant="subtitle1" style={{paddingBottom: '1rem', color: '#940000'}}>Danger Zone</Typography>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoadingDelete}
                        onClick={handleDeleteDelegate}>
                        Delete Delegate
                    </Button>
                </Card>
            </Container>
        </div>
    )
}

export default DelegateDetail;