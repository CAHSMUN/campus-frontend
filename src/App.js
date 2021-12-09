import './App.css';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './authentication/AuthContext';

import Home from './screens/Home';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';

// Reg form imports
import SchoolRegistration from './screens/registration/SchoolRegistration';

// Sec screen imports
import Sponsors from './screens/secretariat/Sponsors';
import Schools from './screens/secretariat/Schools';
import SchoolDetail from './screens/secretariat/SchoolDetail';

// Sponsor screen imports
import SponsorDelegates from './screens/sponsor/SponsorDelegates';

function App() {

  function AuthRoute({ component: Component, ...rest}) {
    const { currentUser } = useAuthContext();

    return (
      <Route
        {...rest}
          render={(props) => 
            (currentUser) ? (
              <Component {...props} />
            ) : (
              <Redirect to='/login' />
            )
          }
        />
    )
  }

  function SecretariatRoute({ component: Component, ...rest}) {
    const { currentUser, getUserData } = useAuthContext();
    const role = currentUser ? getUserData().role : '';

    return (
      <Route
        {...rest}
          render={(props) => 
            (role === 'SECRETARIAT') ? (
              <Component {...props} />
            ) : (
              <Redirect to='/' />
            )
          }
        />
    )
  }

  function SponsorRoute({ component: Component, ...rest}) {
    const { currentUser, getUserData } = useAuthContext();
    const role = currentUser ? getUserData().role : '';

    return (
      <Route
        {...rest}
          render={(props) => 
            (role === 'SPONSOR') ? (
              <Component {...props} />
            ) : (
              <Redirect to='/' />
            )
          }
        />
    )
  }

  return (
    <AuthProvider>
      <Switch>

        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        
        <Route exact path='/register/school' component={SchoolRegistration} />

        <AuthRoute exact path='/dash' component={Dashboard} />
        
        {/* <SecRoute exact path='/secretariat/delegates' component={SecretariatDelegates} /> */}
        {/* <SecRoute exact path='/secretariat/matrix' component={Matrix} /> */}
        <SecretariatRoute exact path='/secretariat/sponsors' component={Sponsors} />
        <SecretariatRoute exact path='/secretariat/schools' component={Schools} />
        <SecretariatRoute exact path='/secretariat/schools/detail/:id' component={SchoolDetail} />
        
        <SponsorRoute exact path='/sponsor/delegates' component={SponsorDelegates} />
        {/* <SponsorRoute exact path='/sponsor/rooming' component={SponsorRooming} /> */}
        
        {/* <HeadRoute exact path='/head/delegates' component={HeadDelegates} /> */}
        {/* <HeadRoute exact path='/head/rooming' component={HeadRooming} /> */}

      </Switch>
    </AuthProvider>
  );
}

export default App;
