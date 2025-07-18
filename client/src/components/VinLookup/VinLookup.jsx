import React, { useRef } from "react";
import Part from "../Part";

export const VinLookup = ({
  vin,
  loading,
  results,
  error,
  onTextChange,
  onImageUpload,
  onLookup,
}) => {
  const fileRef = useRef(null);
  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <header className="flex w-full flex-row flex-wrap justify-between bg-red-700 p-2 text-white">
        <span className="">Dynasty Auto Glass Parts Lookup by VIN</span>
        <div>
          <span className="mr-10">📞403-250-5000</span>
          <span>info@dynasty-autoglass.com</span>
        </div>
      </header>
      <div className="flex w-full flex-wrap items-center justify-center px-2">
        <button
          className="m-3 cursor-pointer rounded-md border-2 border-dotted border-black bg-gray-200 p-2 text-black transition-colors hover:bg-red-800 hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            fileRef.current.click();
          }}
          disabled={loading}
        >
          {loading ? (
            "Loading..."
          ) : (
            <span>
              Upload <strong>Clear</strong> VIN Image
            </span>
          )}
        </button>
        <input
          className="hidden"
          ref={(ref) => (fileRef.current = ref)}
          type="file"
          name="vinImage"
          accept="image/*"
          onChange={onImageUpload}
        />
        <div className="flex flex-1 flex-col rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input
            id="vin"
            name="vin"
            type="text"
            value={vin}
            placeholder="1HGCM82633A004352"
            onChange={(e) => onTextChange(e.target.value)}
            className="block min-w-0 grow px-3 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/4"
          />
        </div>
        <button
          className="mx-3 cursor-pointer rounded-md bg-red-700 p-2 text-white transition-colors hover:bg-red-800"
          onClick={() => onLookup(vin)}
          disabled={loading}
        >
          {loading ? "Looking up..." : "Lookup"}
        </button>
      </div>

      {error && <p>{error}</p>}

      {results && results.vehicle && (
        <div className="flex w-full flex-col justify-center">
          <h1 className="my-4 w-full flex-1 text-center text-2xl font-bold text-red-700">
            {results.vehicle.year} {results.vehicle.make}{" "}
            {results.vehicle.model} ({results.vehicle.body})
          </h1>
          <div className="border-b-1 px-5"></div>
          <ul role="list" className="divide-y divide-black">
            {results.parts.map((part, i) => (
              <Part key={i} part={part} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default VinLookup;
