import { Outlet } from "react-router-dom";
import JudgeHeader from "./Header/JudgeHeader";
function JudgeLayout() {
    return (
        
      <div>
        <JudgeHeader/>
        {/* Outlet renders the nested route components */}
        <Outlet />
      </div>
    );
  }
export default JudgeLayout;