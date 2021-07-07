/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useEffect } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const Dashboard = function () {
  const { auth } = useAuth();
  const [marketplace, setMarketplace] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let marketplace =
        await fetch(`/api/getmarketplace?user_id=${auth.userID}&access_token=${auth.accessToken}`);
        marketplace = await marketplace.json();
        setMarketplace(marketplace);
      }
      catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  return (
    <Container>
      <Jumbotron>
        <h1 className="header">Welcome To Managed Partner Ads Onboarding</h1>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Marketplace
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                plaintext
                readOnly
                defaultValue={marketplace.name}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Business ID
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                plaintext
                readOnly
                defaultValue={marketplace.businessID}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Catalog ID
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                plaintext
                readOnly
                defaultValue={marketplace.catalogID}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Credit Line ID
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                plaintext
                readOnly
                defaultValue={marketplace.creditLineID}
              />
            </Col>
          </Form.Group>
        </Form>
      </Jumbotron>
    </Container>
  );
};

export default Dashboard;
