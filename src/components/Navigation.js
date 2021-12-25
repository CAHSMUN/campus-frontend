import { 
    Drawer,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { NavLink, useHistory } from 'react-router-dom';
import { useAuthContext } from '../authentication/AuthContext';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person' 
import DescriptionIcon from '@material-ui/icons/Description';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import LogoBlack from '../img/black.png';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    toolBar: {
        padding: '10px 24px',
        fontWeight: '500',
        fontSize: '1rem',
    },
    drawer: {
      width: 'calc(75px + 2vw)',
      flexShrink: 0,
      zIndex: 700,
    },
    drawerPaper: {
    //   height: 'calc(100% - 4vw)',
    //   margin: '2vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid #EEEEEE',
      
      background: 'hsla(0,0%,100%,.85)',
      backdropFilter: 'blur(20px)',
    //   boxShadow: '0 0 10px rgb(0 0 0 / 2%)',
    //   background: '#B2CDFF',
    },
    menuLink: {
        color: '#CCCCCC',
        borderRadius: '0',
        boxSizing: 'border-box',
        width: 'auto',
        fontSize: '12px',
        letterSpacing: '-0.1px',
        padding: '15px 10px 13px 10px',
        display: 'flex',
        flexDirection: 'column',
    },
    icons: {
        fontSize: '22px',
    }
}));

const linkActiveStyle = {
    color: "#333333",
    background: "#EEEEEE"
}

const Navigation = () => {

    const classes = useStyles();

    const { currentUser, getUserData, logOut } = useAuthContext();
    const history = useHistory();

    const role = currentUser ? getUserData().role : '';

    function handleLogout() {
        logOut();
        history.go('/');
    }

    return (
        
        <Drawer
           className={classes.drawer}
           variant="permanent"
           anchor="left" 
           classes={{
               paper: classes.drawerPaper,
           }}>

            <div className='list-item-group'>
                <ListItem button  className={classes.menuLink} component={NavLink} exact to="/dash" activeStyle={linkActiveStyle} >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                    }}>
                        <img style={{
                            width: 55,
                        }} alt='' src={LogoBlack} />
                    </div>
                </ListItem>
                
                {(role === 'SECRETARIAT') ? (
                    <>
                        <ListItem button className={classes.menuLink} component={NavLink} exact to="/secretariat/delegates" activeStyle={linkActiveStyle}>
                            <PersonIcon className={classes.icons} />
                            <ListItemText disableTypography primary={'Delegates'} />
                        </ListItem>

                        <ListItem button className={classes.menuLink} component={NavLink} exact to="/secretariat/sponsors" activeStyle={linkActiveStyle}>
                            <WorkIcon className={classes.icons} />
                            <ListItemText disableTypography primary={'Sponsors'} />
                        </ListItem>

                        <ListItem button className={classes.menuLink} component={NavLink} to="/secretariat/schools" activeStyle={linkActiveStyle}>
                            <DescriptionIcon className={classes.icons}/>
                            <ListItemText disableTypography primary={'Schools'} />
                        </ListItem>

                        <ListItem button disabled className={classes.menuLink} component={NavLink} exact to="/secretariat/matrix" activeStyle={linkActiveStyle}>
                            <AssignmentIcon className={classes.icons}/>
                            <ListItemText disableTypography primary={'Matrix'} />
                        </ListItem> 
                    </>
                ) : ''}
                
                {(role === 'SPONSOR') ? (
                    <>
                        <ListItem button disabled className={classes.menuLink} component={NavLink} exact to="/sponsor/delegates" activeStyle={linkActiveStyle}>
                            <PersonIcon className={classes.icons} />
                            <ListItemText disableTypography primary={'Delegates'} />
                        </ListItem>
                        <ListItem button disabled className={classes.menuLink} component={NavLink} exact to="/sponsor/rooming" activeStyle={linkActiveStyle}>
                            <PersonIcon className={classes.icons} />
                            <ListItemText disableTypography primary={'Rooming'} />
                        </ListItem>
                    </>
                ) : ''}
                
                {(role === 'HEAD') ? (
                    <>
                        <ListItem button disabled className={classes.menuLink} component={NavLink} exact to="/head/delegates" activeStyle={linkActiveStyle}>
                            <PersonIcon className={classes.icons} />
                            <ListItemText disableTypography primary={'Delegates'} />
                        </ListItem>
                        <ListItem button disabled className={classes.menuLink} component={NavLink} exact to="/head/rooming" activeStyle={linkActiveStyle}>
                            <PersonIcon className={classes.icons} />
                            <ListItemText disableTypography primary={'Rooming'} />
                        </ListItem>
                    </>
                ) : ''}
               
            </div>

            <div className='list-item-action'>
                {(role === 'SECRETARIAT') ? (
                    <ListItem button disabled className={classes.menuLink} component={NavLink} exact to="/secretariat/export" activeStyle={linkActiveStyle}>
                        <SupervisorAccountIcon className={classes.icons}/>
                        <ListItemText disableTypography primary={'Export'} />
                    </ListItem> 
                ) : ''}
                <ListItem button className={classes.menuLink} onClick={e=>handleLogout()}>
                    <ExitToAppIcon className={classes.icons}/>
                    <ListItemText disableTypography primary={'Sign Out'} />
                </ListItem> 
            </div>

        </Drawer>
    )
}

export default Navigation;