import React from "react";
import { Outlet } from "react-router-dom";
const PublicRouteLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
export default PublicRouteLayout;
