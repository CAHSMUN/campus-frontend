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

const DelegateDetail = ({ match }) => {

    const { currentUser } = useAuthContext();
    
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
            let res = await axios.get(`${API_URL}/delegates/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            
            setDelegateData(res.data);
            setDataLoading(false);

        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        loadSchool(match.params.id);

        if(delegateData) {
            let displayData = [];

            Object.keys(delegateData).map((key) => {
                if(prettify[key]) {
                    displayData.push(
                        <>
                            <div key={key} className="detail-key">
                                {prettify[key]}
                            </div>
                            <div key={delegateData[key]} className="detail-item">
                                {delegateData[key]}
                            </div>
                        </>
                    )
                }
            })

            setDisplaySchoolData(displayData);
        }
    }, [match, delegateData, dataRefresh]);

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
                        {displaySchoolData}
                    </div>
                </Card>
            </Container>
        </div>
    )
}

export default DelegateDetail;