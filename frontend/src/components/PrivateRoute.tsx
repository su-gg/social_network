import React, {ReactElement, useContext} from "react";
import { Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

interface PrivateRouteProps {
  element: ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const auth = useContext(AuthContext);

  return auth?.user ? element : <Navigate to="/login" />;
};


export default PrivateRoute


