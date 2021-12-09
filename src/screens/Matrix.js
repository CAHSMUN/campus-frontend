
import React, { useState, useEffect } from "react";
import { 
    Button,
    Container, 
    Grid,
    LinearProgress,
    Typography
} from '@material-ui/core';
import { API_URL } from "../config";
import axios from "axios";
import { useHistory } from "react-router-dom";


const Matrix = () => {
    
    const history = useHistory();

    const [dataLoading, setDataLoading] = useState(true);
    const [committeesData, setCommitteesData] = useState([]);
    const [displayMatrix, setDisplayMatrix] = useState([])

    async function loadCommittees() {
        setDataLoading(true);

        try {
            let res = await axios.get(`${API_URL}/committees/matrix`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setCommitteesData(res.data);
            setDataLoading(false);

        } catch(error) {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        loadCommittees();
    }, []);




    const renderCountries = (i) => {
        let committeeCountriesDisplay = []
        
        for(let j = 0; j < committeesData[i].countries.length; j++) {
            committeeCountriesDisplay.push(
                <div 
                  className={`item ${committeesData[i].countries[j].assigned ? 'taken' : 'vacant'}`} 
                  key={committeesData[i].countries[j]._id}>
                    {committeesData[i].countries[j].name}
                </div>
            )
        }

        return committeeCountriesDisplay
    }

    // Render
    useEffect(() => {
        let display = [];

        if(committeesData) {

            for (let i = 0; i < committeesData.length; i++) {

                display.push(
                    <div className="committee" key={i}>
                        <div className="item head">
                            {committeesData[i].name}
                        </div>
                        {renderCountries(i)}
                    </div>
                )

            }

        }

        setDisplayMatrix(display)
    }, [committeesData])

    return (
        <div className='matrix-container'>
            {dataLoading && <LinearProgress />}

            <div className='matrix-head'>
                
                <img src="/logo192.png" alt="CAHSMUN" />
                <div style={{
                    display:"flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <h2 style={{
                        margin:0,
                    }}>Country Matrix</h2>
                    <Typography variant="subtitle2">
                        Scroll + Shift for horizontal scrolling
                    </Typography>
                </div>
                
            </div>

            <div className="matrix-body">
                {displayMatrix}
            </div>

        </div>
    )
}

export default Matrix;