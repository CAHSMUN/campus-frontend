import './App.css';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './authentication/AuthContext';

import Home from './screens/Home';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Matrix from './screens/Matrix';

// Reg form imports
import SchoolRegistration from './screens/registration/SchoolRegistration';
import DelegateRegistration from './screens/registration/DelegateRegistration';

// Sec screen imports
import Sponsors from './screens/secretariat/Sponsors';
import Schools from './screens/secretariat/Schools';
import SchoolDetail from './screens/secretariat/SchoolDetail';
import Delegates from './screens/secretariat/Delegates';
import DelegateDetail from './screens/secretariat/DelegateDetail';
import Work from './screens/Chacuterie'

// Sponsor screen imports
import SponsorDelegates from './screens/sponsor/SponsorDelegates';
import SponsorDetail from './screens/sponsor/SponsorDetail';

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

        
        <Route exact path='/work' component={Work} />


        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        
        <Route exact path='/register/delegate' component={DelegateRegistration} />
        <Route exact path='/register/school' component={SchoolRegistration} />
        <Route exact path='/matrix' component={Matrix} />

        <AuthRoute exact path='/dash' component={Dashboard} />
        
        <SecretariatRoute exact path='/secretariat/delegates' component={Delegates} />
        <SecretariatRoute exact path='/secretariat/delegates/detail/:id' component={DelegateDetail} />
        {/* <SecretariatRoute exact path='/secretariat/matrix' component={Matrix} /> */}
        <SecretariatRoute exact path='/secretariat/sponsors' component={Sponsors} />
        <SecretariatRoute exact path='/secretariat/sponsors/detail/:id' component={SponsorDetail} />
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
