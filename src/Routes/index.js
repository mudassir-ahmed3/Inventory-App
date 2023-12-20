import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import App from "../App";
import RoutesConstant from "./Constant";

const Main = lazy(() => import("../Pages/Inventory"));
const Inventory = lazy(() => import("../Pages/Inventory"));


function AppRoutes() {

  return (
      <Routes>
          <Route element={<App />}>
            <Route path={RoutesConstant.main} element={<Main />} />
            <Route path={RoutesConstant.inventory} element={<Inventory />} />
          </Route>
      </Routes>
  );
}
export default AppRoutes;
