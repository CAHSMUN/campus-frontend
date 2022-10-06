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

const SchoolDetail = ({ match }) => {

    const { currentUser } = useAuthContext();
    
    const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [schoolData, setSchoolData] = useState({});
    const [displaySchoolData, setDisplaySchoolData] = useState([]);

    const prettify = {
        lastUpdated: "Last Updated",
        name: "Name",
        adminEmail: "Admin Contact",
        district: "School District",
        address1: "Address 1",
        address2: "Address 2",
        city: "City",
        province: "Province",
        postal: "Postal/Zip Code",
        sponsorPresent: "Present Sponsor?",
        schoolPayment: "Payment via School?",
        expectedSize: "Expected Delegation Size",
        additionalInfo: "Additional Info"
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
            
            setSchoolData(res.data);
            setDataLoading(false);

        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        if(Object.keys(schoolData) < 1) {
            loadSchool(match.params.id);
        }

        if(schoolData) {
            let displayData = [];

            Object.keys(schoolData).map((key) => {
                if(prettify[key]) {
                    displayData.push(
                        <>
                            <div key={key} className="detail-key">
                                {prettify[key]}
                            </div>
                            <div key={schoolData[key]} className="detail-item">
                                {typeof schoolData[key] === "boolean" ? schoolData[key] === true ? "Yes" : "No" : schoolData[key]}
                            </div>
                        </>
                    )
                }
            })

            setDisplaySchoolData(displayData);
        }
    }, [match, schoolData, dataRefresh]);
    

    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    async function handleDeleteSchool() {
        if(isLoadingDelete) return
        setIsLoadingDelete(true)
        
        if(!typeof id === "string") return

        try {
            let res = await axios.delete(`${API_URL}/schools/${match.params.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });

            console.log(res.status)
            
            setIsLoadingDelete(false)
            history.push('/secretariat/schools')
        } catch(error) {
            setIsLoadingDelete(false)
        }
    }

    return (
        <div className='app-container'>
            <Navigation />

            <Container maxWidth="md">
                <Typography variant="subtitle1">School Detail</Typography>
                <Typography variant="subtitle2" 
                    style={{
                        marginBottom: '3rem',
                    }}>{schoolData.name}</Typography>

                <Card>
                    <div className="detail-grid">
                        {displaySchoolData}
                    </div>
                </Card>

                <Card style={{ marginTop: '2rem' }}>
                    <Typography variant="subtitle1" style={{paddingBottom: '1rem', color: '#940000'}}>Danger Zone</Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoadingDelete}
                        onClick={handleDeleteSchool}>
                        Delete Delegate
                    </Button>
                    
                    <Typography variant="paragraph" style={{paddingLeft: '1rem', color: '#940000'}}>Make sure no delegates are registered with this school</Typography>
                </Card>
            </Container>
        </div>
    )
}

export default SchoolDetail;