
import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Profile() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, otp: "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const sendOtp = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/auth/profile/${user._id}/send-otp`
      );
      setOtpSent(true);
      console.log("OTP sent:", res.data.message);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8000/api/auth/profile/${user._id}`,
        {
          ...formData,
        }
      );
      if (res.status === 200) {
        console.log("Profile updated:", res.data.message);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <Container>
    <Text fontSize="5xl" textAlign={"center"}>
      Update Profile
    </Text>
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>
        {otpSent && (
          <FormControl>
            <FormLabel>OTP</FormLabel>
            <Input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
            />
          </FormControl>
        )}
        {!otpSent ? (
          <Button onClick={sendOtp} mt={4} colorScheme="teal">
            Send OTP
          </Button>
        ) : (
          <Button type="submit" mt={4} colorScheme="teal">
            Update Profile
          </Button>
        )}
      </form>
    </Box>
  </Container>
  );
}

export default Profile;
