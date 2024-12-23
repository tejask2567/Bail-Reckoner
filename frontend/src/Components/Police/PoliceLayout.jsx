import { Outlet } from "react-router-dom";
import PoliceHeader from "./PoliceHeader/PoliceHeader";
function PoliceLayout() {
    return (
      <div>
        <PoliceHeader/>
        <Outlet />
      </div>
    );
  }
export default PoliceLayout;