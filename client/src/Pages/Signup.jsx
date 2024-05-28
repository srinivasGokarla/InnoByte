import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Container,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from "../Redux/Auth/authSlice";

function Singup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("srinivasgokarla270@gmail.com");
  const [name, setName] = useState("Srinivas");
  const [password, setPassword] = useState("123456");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signupStart());
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/register`, {
        name,
        email,
        password,
      });
      console.log(res);
      dispatch(signupSuccess(res.data));
      navigate("/verification");
    } catch (error) {
      console.log(error);
      dispatch(signupFailure(error.message));
    }
  };
  return (
    <>
      <Container>
        <Text fontSize="5xl" textAlign={"center"}>
          Register
        </Text>
        <Box>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" mt={4} colorScheme="teal">
              Register
            </Button>
          </form>
        </Box>
        <Text>
          Already Have an Account{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            <Link to={"/login"}>Login</Link>
          </span>{" "}
        </Text>
      </Container>
    </>
  );
}
export default Singup;
