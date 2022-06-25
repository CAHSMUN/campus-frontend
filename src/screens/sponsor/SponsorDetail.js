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

const SponsorDetail = ({ match }) => {

    const { currentUser } = useAuthContext();
    
    // const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [sponsorData, setSponsorData] = useState({});
    const [displaySponsorData, setDisplaySponsorData] = useState([]);

    const prettify = {
        lastUpdated: "Last Updated",
        name: "Name",
        phoneNumber: "Phone Number",
        email: "Email",
        school: "School ID",
    }

    async function loadSponsor(id) {
        setDataLoading(true);

        if(!typeof id === "string") return

        try {
            let res = await axios.get(`${API_URL}/sponsors/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            
            setSponsorData(res.data);
            setDataLoading(false);

            console.log(res.data)

        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        if(Object.keys(sponsorData).length < 1) {
            loadSponsor(match.params.id);
        }

        if(sponsorData) {
            let displayData = [];

            Object.keys(sponsorData).map((key) => {
                if(prettify[key]) {
                    displayData.push(
                        <>
                            <div key={key} className="detail-key">
                                {prettify[key]}
                            </div>
                            <div key={sponsorData[key]} className="detail-item">
                                {typeof sponsorData[key] === "boolean" ? sponsorData[key] === true ? "Yes" : "No" : sponsorData[key]}
                            </div>
                        </>
                    )
                }
            })

            setDisplaySponsorData(displayData);
        }
    }, [match, sponsorData, dataRefresh]);

    return (
        <div className='app-container'>
            <Navigation />

            <Container maxWidth="md">
                <Typography variant="subtitle1">Sponsor Detail</Typography>
                <Typography variant="subtitle2" 
                    style={{
                        marginBottom: '3rem',
                    }}>{sponsorData.name}</Typography>

                <Card>
                    <div className="detail-grid">
                        {displaySponsorData}
                    </div>
                </Card>
            </Container>
        </div>
    )
}

export default SponsorDetail;