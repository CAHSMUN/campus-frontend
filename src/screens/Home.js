import { 
    Button,
    Container, 
    Grid
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../authentication/AuthContext';

import LogoBlack from '../img/black.png';

const styles = {
    largeButton: {
        textAlign: 'left',
        paddingBottom: 30,
    },
    bigText: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        paddingTop: 30,
        display: 'table',
    }
}

const Home = () => {

    const { currentUser } = useAuthContext();

    return (
        <div className='app-container'>
            <Container maxWidth='md'>
                <img src={LogoBlack} alt='logo' width='80px' />
                <h1 style={{userSelect:'none',}}>CAHSMUN Campus</h1>
                <h2 style={{userSelect:'none',}}>Register for CAHSMUN 2022</h2>

                <Grid container spacing={1} style={{marginTop: '5vh'}}>
                    {currentUser ? (
                        <Grid item xs={6}>
                            <Button className='large-button' variant='outlined' style={{width:'100%',}} component={Link} to={'/dash'} >
                                <div style={styles.largeButton}>
                                    <span style={styles.bigText}>Dashboard</span>
                                    <span>View your registration status.</span>
                                </div>
                            </Button>
                        </Grid>
                    ) : (
                        // <div></div>
                        <Grid item xs={6}>
                            <Button className='large-button' variant='outlined' style={{width:'100%',}} component={Link} to={'/register/school'}>
                                <div style={styles.largeButton}>
                                    <span style={styles.bigText}>Register a School</span>
                                    <span>Must be a sponsor teacher or head delegate.</span>
                                </div>
                            </Button>
                        </Grid>
                    )}
                    {currentUser ? '' : (
                        <Grid item xs={6}>
                            <Button className='large-button' variant='outlined' style={{width:'100%',}} disabled>
                                <div style={styles.largeButton}>
                                    <span style={styles.bigText}>Register as a delegate</span>
                                    <span>Must be a student of a registered school.</span>
                                </div>
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={6}>
                        <Button className='large-button' variant='outlined' style={{width:'100%',}} component={Link} to={'/matrix'}>
                            <div style={styles.largeButton}>
                                <span style={styles.bigText}>View country matrix</span>
                                <span>Explore country and committee preferences.</span>
                            </div>
                        </Button>
                    </Grid>
                    {currentUser ? '' : (
                        <Grid item xs={6}>
                            <Button className='large-button' variant='outlined' style={{width:'100%',}} component={Link} to={'/login'} >
                                <div style={styles.largeButton}>
                                    <span style={styles.bigText}>Log in</span>
                                    <span>Log in to view or manage registration status.</span>
                                </div>
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </div>
    )
}

export default Home;