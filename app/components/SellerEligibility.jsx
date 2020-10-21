/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerEligibility = function() {
  const { auth } = useAuth();
  const [sellerID, setSellerID] = useState('136729');
  const [seller, setSeller] = useState();
  const [marketplace, setMarketplace] = useState([]);
  const [sellerCriteria, setSellerCriteria] = useState('');

  useEffect(() => {
    async function fetchMarketplace() {
      let marketplace =
        await fetch(`/api/getmarketplace?userID=${auth.userID}&accessToken=${auth.accessToken}`);
      marketplace = await marketplace.json();
      setMarketplace(marketplace);
      let sellerCriteria =
        `Average Basket Size: ${marketplace.sellerCriteria.basketSize};
        Number of purchases in 28 days: ${marketplace.sellerCriteria.transactions};
        Number of unique users in 7 days: ${marketplace.sellerCriteria.users}`;
      setSellerCriteria(sellerCriteria);
    }
    fetchMarketplace();
  }, []);

  const onCheckSeller = useCallback(async () => {
    let seller =
      await fetch(`/api/checkseller?sellerID=${sellerID}&userID=${auth.userID}&accessToken=${auth.accessToken}`);
    seller = await seller.json();
    setSeller(seller);
  }, [sellerID]);

  return (
    <div>
      <h1>Seller Eligibility</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Marketplace Name</Form.Label>
            <Form.Control disabled value={marketplace.name || ''} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Business ID</Form.Label>
            <Form.Control disabled value={marketplace.businessID || ''} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Catalog ID</Form.Label>
            <Form.Control disabled value={marketplace.catalogID || ''} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Credit Line ID</Form.Label>
            <Form.Control disabled value={marketplace.creditLineID || ''} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Seller Criteria</Form.Label>
            <Form.Control disabled value={sellerCriteria || ''}/>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Seller ID</Form.Label>
            <Form.Control
              value={sellerID}
              onChange={e => setSellerID(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onCheckSeller();
              }}
            >
              Check
            </Button>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Debugging</Form.Label>
            <Form.Control
              as="textarea"
              rows="15"
              placeholder="Response"
              value={JSON.stringify(seller, null, 2)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SellerEligibility;
