import { Outlet } from "react-router-dom";
import LawyerHeader from "./LawyerHeader/LawyerHeader";
function LawyerLayout() {
    return (
      <div>
        <LawyerHeader/>
        {/* Outlet renders the nested route components */}
        <Outlet />
      </div>
    );
  }
export default LawyerLayout;