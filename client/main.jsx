import React from "react";
import ReactDOM from "react-dom/client";
import VinLookup from "./src/components/VinLookup";
import "/index.css";

const res = {
  vin: "WDBNF83J05A451260",
  vehicle: {
    make: "HONDA",
    model: "Accord",
    year: "2003",
    body: "Coupe",
  },
  parts: [
    {
      Id: 74863,
      Year: 2003,
      YearHref: "https://www.canamautoglass.ca/nags/2003/",
      Make: "Honda",
      MakeHref: "https://www.canamautoglass.ca/nags/2003/HONDA",
      Model: "Accord",
      ModelHref: "https://www.canamautoglass.ca/nags/2003/HONDA/324",
      Body: "2 Door Coupe",
      BodyHref: "https://www.canamautoglass.ca/nags/2003/HONDA/324/54853",
      PartNumber: "FW02358GBNN",
      Description: "(Solar) (Green Tint / Blue Shade) 3rd Visor Frit",
      WebsitePrice1_CanAm: "$148.02",
      Availability: "In Stock",
      Ships: "1 to 3 Days*",
      ShopPartPrice1_CanAm: null,
      ShopPartPriceOveride: 0,
      RainSensor: 1,
      LaneDeparture: 1,
      Acoustic: 1,
      ElectrochromaticMirror: 0,
      HeatedWiperPark: 1,
      CondensationSensor: 1,
      HeatedWindshield: 1,
      HeadsupDispplay: 1,
      ForwardCollisionAlert: 1,
      Logo: 0,
      HumiditySensor: 1,
      ShopPriceList2_VanFax: null,
      ShopPriceList3_Benson: null,
      ShopPriceList4_PGW: "140.74",
      last_updated: "2025-07-03T21:44:59.007Z",
      href: "https://www.canamautoglass.ca/parts/FW02358GBNN",
      vehicles: [
        {
          name: "2003 Honda Accord 2 Door Coupe",
          href: "https://www.canamautoglass.ca/nags/2003/HONDA/324/54853",
        },
      ],
    },
    {
      Id: 74866,
      Year: 2003,
      YearHref: "https://www.canamautoglass.ca/nags/2003/",
      Make: "Honda",
      MakeHref: "https://www.canamautoglass.ca/nags/2003/HONDA",
      Model: "Accord",
      ModelHref: "https://www.canamautoglass.ca/nags/2003/HONDA/324",
      Body: "2 Door Coupe",
      BodyHref: "https://www.canamautoglass.ca/nags/2003/HONDA/324/54853",
      PartNumber: "FW02387GBNNALT",
      Description: "(Solar) (Green Tint / Blue Shade) 3rd Visor Frit W/Sunroof",
      WebsitePrice1_CanAm: "$89.50",
      Availability: "In Stock",
      Ships: "1 to 3 Days*",
      ShopPartPrice1_CanAm: null,
      ShopPartPriceOveride: 0,
      RainSensor: 1,
      LaneDeparture: 1,
      Acoustic: 1,
      ElectrochromaticMirror: 0,
      HeatedWiperPark: 1,
      CondensationSensor: 1,
      HeatedWindshield: 1,
      HeadsupDispplay: 1,
      ForwardCollisionAlert: 1,
      Logo: 0,
      HumiditySensor: 1,
      ShopPriceList2_VanFax: null,
      ShopPriceList3_Benson: null,
      ShopPriceList4_PGW: "92.55",
      last_updated: "2025-07-03T21:44:59.007Z",
      href: "https://www.canamautoglass.ca/parts/FW02387GBNNALT",
      vehicles: [
        {
          name: "2003 Honda Accord 2 Door Coupe",
          href: "https://www.canamautoglass.ca/nags/2003/HONDA/324/54853",
        },
      ],
    },
  ],
};
const vin = "1HGCM82633A004352";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <VinLookup initialState={{ vin, results: res }} />
  </React.StrictMode>,
);
