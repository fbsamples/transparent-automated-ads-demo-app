/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from "react";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button';

const SellerTable = ({ sellers }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Seller ID</th>
          <th>Seller Name</th>
          <th>Campaign ID</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        {sellers.length > 0 ? (
          sellers.map((seller, index) => {
            return (
              <tr key={index}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                <td>{seller.campaignID}</td>
                <td>
                  <Button variant="outline-primary">Download Report</Button>{" "}
                  <Button variant="outline-secondary">Stop Ads</Button>{" "}
                  <Button variant="outline-warning">Delete Seller</Button>{" "}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5">Loading...</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default SellerTable;
