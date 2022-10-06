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
import Setup from './screens/Setup';
import DeepMatrix from './screens/secretariat/DeepMatrix';
import Export from './screens/secretariat/Export';
import DelegateCancel from './screens/registration/DelegateCancel';
import DelegateSuccess from './screens/registration/DelegateSuccess';
import HeadDelegates from './screens/head/HeadDelegates';

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

  function HeadRoute({ component: Component, ...rest}) {
    const { currentUser, getUserData } = useAuthContext();
    const role = currentUser ? getUserData().role : '';

    return (
      <Route
        {...rest}
          render={(props) => 
            (role === 'HEAD') ? (
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
        <Route exact path='/success' component={DelegateSuccess} />
        <Route exact path='/cancel' component={DelegateCancel} />
        <Route exact path='/register/school' component={SchoolRegistration} />
        <Route exact path='/matrix' component={Matrix} />

        <AuthRoute exact path='/dash' component={Dashboard} />
        
        <SecretariatRoute exact path='/secretariat/setup' component={Setup} />
        <SecretariatRoute exact path='/secretariat/delegates' component={Delegates} />
        <SecretariatRoute exact path='/secretariat/delegates/detail/:id' component={DelegateDetail} />
        <SecretariatRoute exact path='/secretariat/matrix' component={DeepMatrix} />
        <SecretariatRoute exact path='/secretariat/sponsors' component={Sponsors} />
        <SecretariatRoute exact path='/secretariat/sponsors/detail/:id' component={SponsorDetail} />
        <SecretariatRoute exact path='/secretariat/schools' component={Schools} />
        <SecretariatRoute exact path='/secretariat/schools/detail/:id' component={SchoolDetail} />
        <SecretariatRoute exact path='/secretariat/export' component={Export} />
        
        <SponsorRoute exact path='/sponsor/delegates' component={SponsorDelegates} />
        {/* <SponsorRoute exact path='/sponsor/rooming' component={SponsorRooming} /> */}
        
        <HeadRoute exact path='/head/delegates' component={HeadDelegates} />
        {/* <HeadRoute exact path='/head/rooming' component={HeadRooming} /> */}

      </Switch>
    </AuthProvider>
  );
}

export default App;
