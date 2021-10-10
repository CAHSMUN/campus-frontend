import React, { useState, useEffect } from "react";
import { 
    Button,
    Container, 
    Grid,
    Typography
} from '@material-ui/core';
import Navigation from '../../components/Navigation';
import SchoolsList from "../../components/SchoolsList";
import { useAuthContext } from "../../authentication/AuthContext";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Schools = () => {

    const { currentUser } = useAuthContext();
    
    const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [schoolsData, setSchoolsData] = useState([]);
    
    function handleDetail(link) {
        history.push(link);
    }

    async function loadSchools() {
        setDataLoading(true);

        try {
            let res = await axios.get(`${API_URL}/schools/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            console.log(res.data);

            let functional_list = res.data.map((item) => {return {...item, action: {school_id: item._id, detail_fn: handleDetail}} });
            setSchoolsData(functional_list);
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
                    }}>Schools</Typography>

                
                <SchoolsList
                  refresh={dataRefresh}
                  loading={dataLoading}
                  data={schoolsData} />
            </Container>
        </div>
    )
}

export default Schools;