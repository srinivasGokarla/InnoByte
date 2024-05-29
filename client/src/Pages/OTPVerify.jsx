import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess } from "../Redux/Auth/authSlice";

function OTPVerify() {
  const [otp, setOtp] = useState("");
  const userState = useSelector((state) => state.user.user);
  const data = userState ? userState.data : {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (data && data.email) {
      console.log("email", data.email, otp);
    }
  }, [data, otp]);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-signup-otp",
        {
          email: data.email,
          otp: otp,
        }
      );
      console.log("res", res.status);
      if (
        res.status === 200 &&
        res.data &&
        res.data.message === "User Successfully Registered"
      ) {
        dispatch(loginSuccess());
        toast({
          title: "Verification successful.",
          description: "Your account has been successfully verified.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      } else {
        toast({
          title: "Verification failed.",
          description: "Please check the OTP and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.log("not Verified");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to verify OTP. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Box>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <p>{data && data.email ? data.email : "No email available"}</p>
          </FormControl>
          <FormControl>
            <FormLabel>OTP</FormLabel>
            <Input
              type="text"
              name="otp"
              value={otp}
              onChange={handleChange}
              placeholder="Enter OTP"
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
