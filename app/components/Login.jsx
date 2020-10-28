/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback, useEffect } from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { AUTH_APP_ID } from "../../config";

const LoginButton = ({facebookResponse}) => (
  <FacebookLoginWithButton
    appId={AUTH_APP_ID}
    fields="name,email,picture"
    callback={facebookResponse}
    icon="fa-facebook"/>
  )

const Login = function (props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const { setAuth } = useAuth();

    const facebookResponse = useCallback((response) => {
        setAuth(response);
        setLoggedIn(true);
    }, []);

    const referer = props.location.state.referer || '/';
    if (AUTH_APP_ID === '') {
      setAuth("mock");
      return <Redirect to={referer} />;
    }
    if (isLoggedIn) {
      return <Redirect to={referer} />;
    }

    return (
        <div style={{ margin: "auto", textAlign: "center", paddingTop: "2em" }}>
          <LoginButton facebookResponse={facebookResponse}/>
        </div>
    );
};

export default Login;
