/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from 'react';
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";

const Logout = function () {
    const { setAuth } = useAuth();
    setAuth(null);
    return <Redirect to="/" />;
};

export default Logout;
