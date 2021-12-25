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

    async function loadDelegates() {
        setDataLoading(true);

        try {
            let res = await axios.get(`${API_URL}/delegates/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser,
                }
            });
            let functional_list = res.data.map((item) => {return {...item, action: {school_id: item._id, detail_fn: handleDetail}} });
            setDelegatesData(functional_list);
            setDataLoading(false);

        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        loadDelegates();
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