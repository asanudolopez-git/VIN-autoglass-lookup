import React from 'react';

const Part = ({ part: { Body, PartNumber, Description, WebsitePrice1_CanAm, } }) => (
  <div className="Part" style={{ 'borderTop': '1px solid' }}>
    <h3>{PartNumber}</h3>
    <p>{Description}</p>
    <p>Body: {Body}</p>
    <p>Price: {WebsitePrice1_CanAm}</p>
  </div>
);

export default Part;