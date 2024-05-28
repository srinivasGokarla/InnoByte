import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../Redux/Auth/authSlice";

function OTPVerify() {
  const [formData, setFormData] = useState({
    otp: "",
  });

  const { data } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-signup-otp",
        {
          email: data.email,
          otp: formData.otp,
        }
      );
      console.log("res", res);
      if (res.data.status == 200  && res.data && res.data.message === "User Successfully Registered") {
        const updatedData = { ...data, verified: true };
        
        dispatch(loginSuccess(updatedData));

        navigate("/login");
      } 
    } catch (error) {
      console.error("Error verifying OTP:", error);
     
    }
  };

  return (
    <Container>
      <Box>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <p>{data.email}</p>
          </FormControl>
          <FormControl>
            <FormLabel>OTP</FormLabel>
            <Input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" mt={4} colorScheme="teal">
            Verify OTP
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default OTPVerify;
