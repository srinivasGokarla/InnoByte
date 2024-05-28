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
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };
  return (
    <>
      {" "}
      <Container>
        <Text fontSize={"5xl"} textAlign={"center"}>
          Signin
        </Text>
        <Box>
          <form onSubmit={handleSubmit}>
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" mt={4} colorScheme="teal">
              Login
            </Button>
          </form>
          <Text>
            Don't You Have an Account{" "}
            <span style={{ color: "red", fontWeight: "bold" }}>
              <Link to={"/"}>Signup</Link>
            </span>{" "}
          </Text>
        </Box>
      </Container>
    </>
  );
}
export default Login;
