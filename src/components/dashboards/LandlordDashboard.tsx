import { For } from "solid-js";
import { rentalProperties } from "./TEMP_rentalProperties";

const LandlordDashboard = () => {
  return (
    <div class="border border-blue-400">
      <br />
      <div class="m-2 text-4xl text-center border border-blue-600">Landloard Dashboard</div>
      <br />
      <div class="m-4 grid grid-cols-4 gap-4">
        <For each={rentalProperties}>
          {(property) => (
            <div class="bg-amber-600 hover:bg-amber-800 text-black text-center rounded-2xl m-1 cursor-pointer">
              <div>{property.icon()}</div>
              {property.name} {property.number}
            </div>
          )}
        </For>
        <br />
      </div>
      <br />
    </div>
  );
};

export default LandlordDashboard;
