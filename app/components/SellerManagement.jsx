/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useEffect } from 'react';
import SellerTable from './SellerTable';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const SellerManagement = function() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    async function fetchSellers() {
      let data = await fetch("/api/getsellers");
      data = await data.json();
      setSellers(data.sellers);
    }
    fetchSellers();
  }, []);

  return (
    <div>
      <h1>Seller Management</h1>
      <SellerTable sellers={sellers}/>
      <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Debugging</Form.Label>
            <Form.Control
              as="textarea"
              rows="12"
              placeholder="Response"
            />
          </Form.Group>
        </Form.Row>
    </div>
  );
};

export default SellerManagement;
