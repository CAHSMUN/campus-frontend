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
    
    // const history = useHistory();

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
        loadSchool(match.params.id);

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
            </Container>
        </div>
    )
}

export default SchoolDetail;