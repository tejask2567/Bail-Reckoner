import { Routes, Route } from "react-router-dom";
import {
  RoleSelection,
  UserLogin,
  LawyerLogin,
  JudgeLogin,
  PoliceLogin
} from "./Components/Login/Login";
import {
  SignupRoleSelection,
  UserSignupForm,
  LawyerSignupForm,
  JudgeSignupForm,
  /* PoliceSignup */
} from "./Components/signup/Signup";

import LawyerLayout from "./Components/Lawyer/LawyerLayout";
import Home from "./Components/Home/Home";
import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import PublicRouteLayout from "./Components/PublicRouteLayout";

import Judge_Dashboard from "./Components/Judge/Dashboard/Judge_dashboard";
import JudgeLayout from "./Components/Judge/JudgeLayout";
import BailCaseView from "./Components/Judge/BailView/BailCaseView";
import LawyerDashboard from "./Components/Lawyer/LawyerDashboard/LawyerDashboard";
import CurrentCase from "./Components/Lawyer/CurrentCase/CurrentCase";
import BailApplicationForm from "./Components/Lawyer/LawyerForm/BailApplicationForm";
import PoliceDashboard from "./Components/Police/PoliceDashboard/PoliceDashboard";
import PoliceLayout from "./Components/Police/PoliceLayout";
import ChargeSheetForm from "./Components/Police/FileChargeSheet/ChargeSheetForm";
import AiResponse from "./Components/Judge/AiResponse/AiResponse";
import LawyerSearch from "./Components/User/LawyerSearch/LawyerSearch";
import UserDashboard from "./Components/User/UserDashboard/UserDashboard";
import Userlayout from "./Components/User/Userlayout";
import { PoliceSignupForm } from "./Components/signup/Signup";
import PastCaseReview from "./Components/Lawyer/PastCaseReview/PastCaseReview";
import CaseStatus from "./Components/User/CaseStatus/CaseStatus";
function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <PublicRouteLayout />
          </PublicRoute>
        }
      >
        <Route index element={<RoleSelection />} />
        <Route path="user" element={<UserLogin />} />
        <Route path="lawyer" element={<LawyerLogin />} />
        <Route path="judge" element={<JudgeLogin />} />
        <Route path="police" element={<PoliceLogin/>}/>
      </Route>
      
      {/* Signup */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <PublicRouteLayout />
          </PublicRoute>
        }
      >
        <Route index element={<SignupRoleSelection />} />
        <Route path="user" element={<UserSignupForm />} />
        <Route path="lawyer" element={<LawyerSignupForm />} />
        <Route path="judge" element={<JudgeSignupForm />} />
      <Route path="police" element={<PoliceSignupForm />} /> 
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
      <Route
        path="/lawyer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["lawyer"]}>
            <LawyerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LawyerDashboard/>}/>
        <Route path='create' element={<BailApplicationForm/>}/>
        <Route path='status' element={<CurrentCase/>}/>
        <Route path='past' element={<PastCaseReview/>}/>
      </Route>
      <Route
        path="/judge-dashboard"
        element={
          <ProtectedRoute allowedRoles={["judge"]}>
            <JudgeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Judge_Dashboard/>}/>
        <Route path=":bailId" element={<BailCaseView />} />
        <Route path="reportai" element={<AiResponse />} />
        {/* Nested routes go inside the parent route */}
      </Route>

      <Route
        path="/police-dashboard"
        element={
          <ProtectedRoute allowedRoles={["police"]}>
            <PoliceLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PoliceDashboard/>}/>
        {/* Nested routes go inside the parent route */}
        <Route path="create" element={<ChargeSheetForm/>}/>
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Userlayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard/>}/>
        {/* Nested routes go inside the parent route */}
        <Route path="search" element={<LawyerSearch/>}/>
        <Route path="cases" element={<CaseStatus/>}/>
      </Route>
    </Routes>
  );
}
export default App;
