import React from "react";

const Part = ({
  part: {
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
  },
}) => (
  <div className="p-2">
    <h2>
      <strong>{PartNumber}</strong>
    </h2>
    <a
      className="w-min text-blue-600 hover:underline"
      href={BodyHref || ModelHref}
      target="_blank"
    >
      <span>
        {Year} {Make} {Model}
        {Body ? ` ${Body}` : ""}
      </span>
    </a>
    <p>Description: {Description}</p>
    <p>Price: {WebsitePrice1_CanAm}</p>
    <p>Availability: {Availability}</p>
    <p>Ships: {Ships}</p>
  </div>
);

export default Part;
