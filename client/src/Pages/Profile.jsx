import React, { useState } from "react";
import {
  Box,
  Container,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import axios from "axios";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: user.user.name,
    email: user.user.email,
    password: "",
    otp: ""
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEditClick = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/send-otp", {
        email: user.user.email,
      });
      if (res.status === 201) {
        toast({
          title: "OTP sent.",
          description: "An OTP has been sent to your email.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsOtpModalOpen(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to send OTP. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/auth/verify-otp", {
        email: user.user.email,
        otp: otp,
      });
      if (res.status === 200) {
        toast({
          title: "OTP verified.",
          description: "OTP verified successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsOtpModalOpen(false);
        setIsEditModalOpen(true);
        setFormData((prevFormData) => ({
          ...prevFormData,
          otp: otp,
        }));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "OTP verification failed.",
        description: "Please check the OTP and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Form data being sent:', formData);
  
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/update-profile/${user.user._id}`, {
        name: formData.name,
        password: formData.password,
        otp: formData.otp, // Ensure OTP is included in the payload
      });
      if (res.status === 200) {
        toast({
          title: "Profile updated.",
          description: "Your profile has been updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to update profile. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <>
      <Text
        fontSize={"4xl"}
        fontWeight={700}
        mt={10}
        textDecoration={"underline"}
        textAlign={"center"}
      >
        Profile
      </Text>

      <Container mt={10}>
        <Box
          m={"auto"}
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          fontSize={"2xl"}
          p={4}
        >
          <Text>Name: {user.user.name}</Text>
          <Text>Email: {user.user.email}</Text>
          <Text>Password: {user.user.password}</Text>
          <Button mt={4} colorScheme="teal" onClick={handleEditClick}>
            Edit
          </Button>
        </Box>
      </Container>

      {/* OTP Modal */}
      <Modal isOpen={isOtpModalOpen} onClose={() => setIsOtpModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter OTP</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleOtpSubmit}>
            <ModalBody>
              <FormControl id="otp" mb={4}>
                <FormLabel>OTP</FormLabel>
                <Input
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setIsOtpModalOpen(false)}>
                Close
              </Button>
              <Button type="submit" colorScheme="teal">
                Verify OTP
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleFormSubmit}>
            <ModalBody>
              <FormControl id="name" mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </FormControl>

              <FormControl id="email" mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  isDisabled
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  placeholder="Enter your new password"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setIsEditModalOpen(false)}>
                Close
              </Button>
              <Button type="submit" colorScheme="teal">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Profile;

