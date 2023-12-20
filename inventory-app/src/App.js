import { Outlet } from "react-router-dom";
import { useState } from "react";
import './App.css';
import { GoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "./hooks/useAuthContext"
import { LOGIN_ACTION } from './Context/Actions'
import { useCookies, CookiesProvider } from 'react-cookie'

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [ user, setUser ] = useState({});
  const { dispatch, user } = useAuthContext();
  const [cookies, setCookie, removeCookie] = useCookies(['authToken']);

  const responseMessage = (response) => {
    console.log(response);
    // Set the authentication status to true when the user successfully logs in.
    // setIsLoggedIn(true);
    console.log(response.credential)
    setCookie('authToken', response.credential, { path: '/', maxAge: 3600 });
    console.log('set content of cookie at signin', cookies.authToken)
    dispatch({ type: LOGIN_ACTION, payload: response.credential });
  };

  const errorMessage = (error) => {
    console.log("Login Failed: ", error);
  };

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <div className="App">
        {/* Conditionally render the content based on authentication status */}
        {user ? (
          <Outlet />
        ) : (
          <div>
            <h1>Inventory Management System</h1>
            <h2>Sign in with Gooogle 🚀</h2>
            <br />
            <br />
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} type="standard" theme="outline" size="large" width={250} />
          </div>
        )}
      </div>
    </CookiesProvider>
  );
}

export default App;
