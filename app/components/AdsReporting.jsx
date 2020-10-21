/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useEffect } from 'react';
import {
  useParams,
  Link
} from "react-router-dom";

const AdsReporting = function () {
  const [data, setData] = useState([]);

  return (
    <div>
      <h1>Ads Reporting Page</h1>
      <Link to={'/'}>Back</Link>
    </div>
  );
};

export default AdsReporting;
