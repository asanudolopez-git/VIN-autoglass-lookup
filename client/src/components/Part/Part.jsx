import React from "react";

const Part = ({
  part: {
    PartNumber,
    href,
    vehicles = [],
    ModelHref,
    BodyHref,
    Description,
    WebsitePrice1_CanAm,
    Availability,
    Ships,
  },
}) => (
  <div className="p-2">
    <h2>
      <a className="w-min text-blue-600 underline" href={href} target="_blank">
        <strong>{PartNumber}</strong>
      </a>
    </h2>
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
    <div className="my-2 flex flex-wrap gap-1">
      <p>
        <strong>Vehicles This Fits:</strong>
      </p>
      {vehicles.map((vehicle, i) => (
        <span
          key={i}
          className="mx-3 cursor-pointer rounded-md bg-red-700 p-1 text-white transition-colors hover:bg-red-800"
        >
          <a className="" href={vehicle.href} target="_blank">
            {vehicle.name}
          </a>
        </span>
      ))}
    </div>
  </div>
);

export default Part;
