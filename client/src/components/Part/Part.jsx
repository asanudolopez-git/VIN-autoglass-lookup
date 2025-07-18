import React from 'react';

const Part = ({ part: {
  PartNumber,
  ModelHref,
  BodyHref,
  Year,
  Make,
  Model,
  Body,
  Description,
  WebsitePrice1_CanAm,
  Availability,
  Ships,
} }) => (
  <div className="Part" style={{ 'borderTop': '1px solid' }}>
    <h2>{PartNumber}</h2>
    <a href={BodyHref || ModelHref}><p>{Year} {Make} {Model}{Body ? ` ${Body}` : ''}</p></a>
    <p>Description: {Description}</p>
    <p>Price: {WebsitePrice1_CanAm}</p>
    <p>Availability: {Availability}</p>
    <p>Ships: {Ships}</p>
  </div>
);

export default Part;