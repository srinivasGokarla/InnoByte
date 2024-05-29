import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useBreakpointValue,
  Stack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../Redux/Auth/authSlice";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const display = useBreakpointValue({ base: "none", md: "flex" });
  const mobileDisplay = useBreakpointValue({ base: "flex", md: "none" });

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box bg="teal" px={4} py={3}>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="md" color="white">
        <Link to={"/"}>InnoByte Services</Link>
        </Heading>
        <Spacer display={display} />
        <Flex display={display} gap={10} color="white">
          <Link to="/">Home</Link>
          <Link to="/">About</Link>
        </Flex>
        <Flex alignItems="center" display={display}>
          {user && user.user ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="teal"
                ml={2}
              >
                {user.user.name}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="whiteAlpha" ml={3}>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </Flex>
        <IconButton
          aria-label="Open Menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          display={mobileDisplay}
          onClick={toggleMenu}
          color="white"
        />
      </Flex>
      {isOpen && (
        <Box pb={4} display={mobileDisplay}>
          <Stack as="nav" spacing={4}>
            <Link to="/" onClick={toggleMenu} style={{ color: "white" }}>
              Home
            </Link>
            <Link to="/" onClick={toggleMenu} style={{ color: "white" }}>
              About
            </Link>
            {user && user.user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                color="white"
                justifyContent="start"
              >
                {user.user.name} - Logout
              </Button>
            ) : (
              <Button variant="ghost" onClick={toggleMenu} color="white">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
