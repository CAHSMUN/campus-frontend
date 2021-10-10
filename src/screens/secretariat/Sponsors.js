import React, { useState, useEffect } from "react";
import { 
    Button,
    Container, 
    Grid,
    Typography
} from '@material-ui/core';
import Navigation from '../../components/Navigation';
import { useAuthContext } from "../../authentication/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import SponsorsList from "../../components/SponsorsList";

const Sponsors = () => {

    const { currentUser } = useAuthContext();
    
    const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [sponsorsData, setSponsorsData] = useState([]);
    
    function handleDetail(link) {
        history.push(link);
    }

    async function loadSchools() {
        setDataLoading(true);

        try {
            let res = await axios.get(`${API_URL}/sponsors/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            console.log(res.data);

            let functional_list = res.data.map((item) => {return {...item, action: {sponsor_id: item._id, detail_fn: handleDetail}} });
            setSponsorsData(functional_list);
            setDataLoading(false);

        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        loadSchools();
    }, [dataRefresh]);

    return (
        <div className='app-container'>
            <Navigation />


            <Container maxWidth="md">
                <Typography variant="subtitle1" 
                    style={{
                        marginBottom: '3rem',
                    }}>Sponsors</Typography>

                
                <SponsorsList
                  refresh={dataRefresh}
                  loading={dataLoading}
                  data={sponsorsData} />
            </Container>
        </div>
    )
}

export default Sponsors;