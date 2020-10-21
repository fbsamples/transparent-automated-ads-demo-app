/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, {useState} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./styles.css";

/* Import Components */
import Dashboard from "./components/Dashboard";
import SellerOnboarding from "./components/SellerOnboarding";
import SellerManagement from "./components/SellerManagement";
import SellerEligibility from "./components/SellerEligibility";
import AdsReporting from "./components/AdsReporting";
import SellerBusiness from "./components/SellerBusiness";
import SellerCampaignLaunch from "./components/SellerCampaignLaunch";
import SellerCampaignUpdate from "./components/SellerCampaignUpdate";
import Login from "./components/Login";
import Logout from "./components/Logout";
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

function App(props) {
  const existingAuth = JSON.parse(localStorage.getItem("auth"));
  const [auth, setAuth] = useState(existingAuth);

  const setAuthData = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth: setAuthData }}>
      <Router>
        <div>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <PrivateRoute path="/adsreporting" component={AdsReporting} />
            <PrivateRoute path="/sellereligibility" component={SellerEligibility} />
            <PrivateRoute path="/sellermanagement" component={SellerManagement} />
            <PrivateRoute path="/selleronboarding" component={SellerOnboarding} />
            <PrivateRoute path="/sellerbusiness" component={SellerBusiness} />
            <PrivateRoute path="/sellercampaignlaunch" component={SellerCampaignLaunch} />
            <PrivateRoute path="/sellercampaignupdate" component={SellerCampaignUpdate} />
            <PrivateRoute exact path="/" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("main_render"));
