/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { auth } = useAuth();

  return(
    <Route
      {...rest}
      render={props =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { referer: props.location } }} />
        )
      }
    />
  );
}

export default PrivateRoute;
