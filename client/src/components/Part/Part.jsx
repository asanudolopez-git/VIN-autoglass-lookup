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
    <p>
      <strong>Description:</strong> {Description}
    </p>
    <p>
      <strong>Price:</strong> {WebsitePrice1_CanAm}
    </p>
    <p>
      <strong>Availability:</strong> {Availability}
    </p>
    <p>
      <strong>Ships:</strong> {Ships}
    </p>
  </div>
);

export default Part;
