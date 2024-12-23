import { Outlet } from "react-router-dom";
import UserHeader from "./userHeader/userHeader";
function Userlayout() {
  return (
    <div>
      <UserHeader />
      <Outlet />
    </div>
  );
}
export default Userlayout;
