import "./App.css";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Singup from "./Pages/Signup";
import OTPVerify from "./Pages/OTPVerify";
import Profile from "./Pages/Profile";
import PrivateRoute from "./Components/PrivateRoute";

function App() {


  return (
    <>
    <Navbar />
    <Routes>
      <Route path={"/"} element={<Singup />} />
      <Route path={"/login"} element={<Login />} />
      <Route path={"/verification"} element={<OTPVerify />} />
      <Route element={<PrivateRoute />}>
        <Route path={"/profile"} element={<Profile />} />
      </Route>
    </Routes>
  </>
  );
}

export default App;
