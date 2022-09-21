import React, { useState, useEffect } from "react";
import { 
    Button,
    Container, 
    Typography
} from '@material-ui/core';
import Navigation from '../../components/Navigation';
import DelegatesList from "../../components/DelegatesList";
import { useAuthContext } from "../../authentication/AuthContext";
import { API_URL } from "../../config";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Delegates = () => {

    const { currentUser } = useAuthContext();
    
    const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [delegatesData, setDelegatesData] = useState([]);
    
    function handleDetail(link) {
        history.push(link);
    }

    async function loadDelegates(schoolsMap) {
        try {
            let res = await axios.get(`${API_URL}/delegates/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            console.log(res.data)
            let functional_list = res.data.map((item) => {return {...item, school: schoolsMap[item.school], action: {school_id: item._id, detail_fn: handleDetail}} });
            setDelegatesData(functional_list);

            setDataLoading(false);
        } catch(error) {
            setDataLoading(false);
        }
    }

    async function loadSchools() {
        try {
            let res = await axios.get(`${API_URL}/schools/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })
            
            let schoolIdToName = {}

            for (let i = 0; i < res.data.length; i++) {
                schoolIdToName[res.data[i]._id] = res.data[i].name
            }
            
            loadDelegates(schoolIdToName)
        } catch (error) {
            console.error(error)
            setDataLoading(false)
        }
    }

    useEffect(() => {
        loadSchools()
    }, [dataRefresh]);

    return (
        <div className='app-container'>
            <Navigation />

            <Container maxWidth="md">
                <Typography variant="subtitle1" 
                    style={{
                        marginBottom: '3rem',
                    }}>Delegates</Typography>

                
                <DelegatesList
                  refresh={dataRefresh}
                  loading={dataLoading}
                  data={delegatesData} />
            </Container>
        </div>
    )
}

export default Delegates;