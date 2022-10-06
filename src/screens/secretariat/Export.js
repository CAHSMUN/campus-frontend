import { Button, Card, CircularProgress, Container, Typography } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import CsvDownload from "react-csv-downloader";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../authentication/AuthContext";
import Navigation from "../../components/Navigation"
import { API_URL } from "../../config";

const EXPORTS = {
    delegates: 'Delegates',
    sponsors: 'Sponsors',
    schools: 'Schools',
    matrix: 'Matrix'
}

const Export = () => {

    const {currentUser, getUserData} = useAuthContext();
    const userData = getUserData();
    const role = currentUser ? userData.role : '';

    const [loadingStates, setLoadingStates] = useState({
        [EXPORTS.delegates]: false,
        [EXPORTS.sponsors]: false,
        [EXPORTS.schools]: false,
        [EXPORTS.matrix]: false
    })
    const [pulledData, setPulledData] = useState({
        [EXPORTS.delegates]: null,
        [EXPORTS.sponsors]: null,
        [EXPORTS.schools]: null,
        [EXPORTS.matrix]: null
    })

    const toggleLoading = (key) => {
        let currentLoadingStates = JSON.parse(JSON.stringify(loadingStates))
        currentLoadingStates[key] = !currentLoadingStates[key]
        setLoadingStates(currentLoadingStates)
    }

    const formatResData = (type, data) => {
        let formattedData = null

        if (type === 'delegates') {

            let mapCommitteeIdToName = { na: 'NA' }, mapCountryIdToName = { na: 'NA' }, mapSchoolIdToName = { na: 'NA' }

            for (let i = 0; i < data.schools.length; i++) {
                let { _id, name } = data.schools[i]
                mapSchoolIdToName[_id] = name
            }

            for (let i = 0; i < data.committees.length; i++) {
                let { _id, name, countries } = data.committees[i]
                mapCommitteeIdToName[_id] = name

                for (let j = 0; j < countries.length; j++) {
                    let country = countries[j]
                    mapCountryIdToName[country._id] = country.name
                }
            }

            for (let i = 0; i < data.delegates.length; i++) {
                data.delegates[i]['school'] = mapSchoolIdToName[data.delegates[i].school || 'na']
                data.delegates[i]['prefOneComm'] = mapCommitteeIdToName[data.delegates[i].prefOneComm || 'na']
                data.delegates[i]['prefTwoComm'] = mapCommitteeIdToName[data.delegates[i].prefTwoComm || 'na']
                data.delegates[i]['prefThreeComm'] = mapCommitteeIdToName[data.delegates[i].prefThreeComm || 'na']
                data.delegates[i]['prefOneCountry'] = mapCountryIdToName[data.delegates[i].prefOneCountry || 'na']
                data.delegates[i]['prefTwoCountry'] = mapCountryIdToName[data.delegates[i].prefTwoCountry || 'na']
                data.delegates[i]['prefThreeCountry'] = mapCountryIdToName[data.delegates[i].prefThreeCountry || 'na']
            }

            formattedData = data.delegates
        } else if (type === 'sponsors') {
            let mapIdToName = {}

            for (let i = 0; i < data.schools.length; i++) {
                let { _id, name } = data.schools[i]
                mapIdToName[_id] = name
            }

            for (let i = 0; i < data.sponsors.length; i++) {
                data.sponsors[i].school = mapIdToName[data.sponsors[i].school]
            }

            formattedData = data.sponsors
        } else if (type === 'schools') {
            formattedData = data
        } else if (type === 'matrix') {
            for (let i = 0; i < data.length; i++) {
                const { countries } = data[i]
                delete data[i]._id
                delete data[i].__v

                const strippedCountries = countries?.map((country) => (country.name))

                for (let j = 0; j < countries?.length || 0; j++) {
                    data[i].countries = JSON.stringify(strippedCountries)
                }
            }

            formattedData = data
        }

        return formattedData
    }

    const handleExport = async (key) => {
        if (loadingStates[key]) return
        toggleLoading(key)

        let reqUrl = `${API_URL}/export/${EXPORTS[key].toLowerCase()}`, resData

        try {
            const { data } = await axios.get(reqUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': currentUser
                }
            })
            resData = data
        } catch (error) {
            console.error(error)
            resData = null
        }

        if (!resData) {
            return toggleLoading(key)
        }

        const currentPulledData = JSON.parse(JSON.stringify(pulledData))
        currentPulledData[key] = formatResData(key, resData)
        setPulledData(currentPulledData)
        return toggleLoading(key)
    }

    return role === 'SECRETARIAT' ? (
        <>
            <div className='app-container'>
                <Navigation />

                <Container maxWidth="md">
                    <div style={{ display: 'flex', gap: '0.5rem'}}>
                        <Typography variant="subtitle1">Export</Typography>
                    </div>

                    <Card>
                        {Object.keys(EXPORTS).map((key, index) => {
                            return pulledData[key] ? (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="paragraph">
                                        {EXPORTS[key]}
                                    </Typography>
                                    <div>
                                        <CsvDownload
                                          filename={key}
                                          datas={pulledData[key]} >
                                            <Button 
                                              variant="contained" 
                                              disableElevation
                                              color="primary"
                                              size="small">
                                                Download CSV
                                            </Button>
                                        </CsvDownload>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="paragraph">
                                        {EXPORTS[key]}
                                    </Typography>
                                    <div>
                                        <Button
                                        disabled={loadingStates[key]}
                                        variant="contained" 
                                        color="primary" 
                                        size="small" 
                                        disableElevation 
                                        onClick={()=>handleExport(key)}>
                                            {!loadingStates[key] ? 'Export' : (
                                                <>
                                                    <CircularProgress disableShrink size={20} style={{
                                                        marginRight: 10,
                                                        marginLeft: -5,
                                                        color: '#777777',
                                                    }} />
                                                    Loading
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </Card>
                </Container>
            </div>
        </>
    ) : (<></>)
}

export default Export