/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useAuth } from "../context/auth";

const SellerInvoicing = function() {
  const { auth } = useAuth();
  const [invoiceGroup, setInvoiceGroup] = useState();
  const [emails, setEmails] = useState('["seller@fb.com"]');
  const [name, setName] = useState('TAA Invoice Group');
  const [invoiceGroupID, setInvoiceGroupID] = useState('2742746285973044');
  const [adsAccountID, setAdsAccountID] = useState('act_768156353980606');

  const onCreateInvoiceGroup = useCallback(async () => {
    let request = `/api/createinvoicegroup?` +
                `emails=${emails}&` +
                `name=${name}&` +
                `userID=${auth.userID}&` +
                `accessToken=${auth.accessToken}`;
    handleRequest(request);
  }, [emails, name]);

  const onHandleAdsAccount = useCallback(async (requestType) => {
    let request = `/api/handleinvoiceadsaccount?` +
                `request_type=${requestType}&` +
                `id=${invoiceGroupID}&` +
                `ad_account_id=${adsAccountID}&` +
                `userID=${auth.userID}&` +
                `accessToken=${auth.accessToken}`;
    handleRequest(request);
  }, [invoiceGroupID, adsAccountID]);

  const onCheckInvoiceGroup = useCallback(async () => {
    let request = `/api/checkinvoicegroup?` +
                  `adsAccountID=${adsAccountID}&` +
                  `userID=${auth.userID}&` +
                  `accessToken=${auth.accessToken}`;
    handleRequest(request);
  },[adsAccountID]);

  const handleRequest = async function (request) {
    let invoiceGroup = await fetch(request);
    invoiceGroup = await invoiceGroup.json();
    setInvoiceGroup(invoiceGroup);
  }

  return (
    <div>
      <h1>Seller Invoicing</h1>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Note: Invoice groups cannot be created, edited or deleted 2 business days before
                        and 4 businness days after the end of the month.
            </Form.Label>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Emails</Form.Label>
            <Form.Control
              value={emails}
              onChange={e => setEmails(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Invoice Group ID</Form.Label>
            <Form.Control
              value={invoiceGroupID}
              onChange={e => setInvoiceGroupID(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Ads Account ID</Form.Label>
            <Form.Control
              value={adsAccountID}
              onChange={e => setAdsAccountID(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="primary"
              onClick={() => {
                onCreateInvoiceGroup();
              }}
            >
              Create Invoice Group
            </Button>
          </Form.Group>
          <Form.Group as={Col}>
            <Button
              variant="info"
              onClick={() => {
                onHandleAdsAccount('post');
              }}
            >
              Add Ads Account
            </Button>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Button
              variant="success"
              onClick={() => {
                onCheckInvoiceGroup();
              }}
            >
              Check Invoice Group
            </Button>
          </Form.Group>
          <Form.Group as={Col}>
            <Button
              variant="secondary"
              onClick={() => {
                onHandleAdsAccount('delete');
              }}
            >
              Remove Ads Account
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
              value={JSON.stringify(invoiceGroup, null, 2)}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default SellerInvoicing;
