/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerReporting = function() {
  const { auth } = useAuth();
  const [campaign, setCampaign] = useState();
  const [campaignID, setCampaignID] = useState('1234567890');
  const [accessToken, setAccessToken] = useState('SellerBussinessAccessToken');

  const onRetrieveReport = useCallback(async () => {
    let request = `/api/campaignreporting?` +
                `campaign_group_id=${campaignID}&` +
                `seller_access_token=${accessToken}&` +
                `userID=${auth.userID}&` +
                `accessToken=${auth.accessToken}`;
    let campaign = await fetch(request);
    campaign = await campaign.json();
    setCampaign(campaign);
  }, [campaignID, accessToken]);

  return (
    <div>
      <h1>Seller Campaign Reporting</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Campaign ID</Form.Label>
            <Form.Control
              value={campaignID}
              onChange={e => setCampaignID(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Seller Access Token</Form.Label>
            <Form.Control
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onRetrieveReport();
              }}
            >
              Campaign Reporting
            </Button>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Debugging</Form.Label>
            <Form.Control
              as="textarea"
              rows="20"
              placeholder="Response"
              value={JSON.stringify(campaign, null, 2)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SellerReporting;
