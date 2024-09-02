import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";

const Container = styled.div`
  width: 100%;
  height: 10vh;
  background-color: #8ae0d4;
  display: flex;
  justify-content: space-between;
`;

const LeftBox = styled.div`
  width: 25%;
  height: 100%;
  margin-left: 20px;
  font-size: 32px;
  color: white;
  display: flex;
  align-items: center;
  /* justify-content: center; */

  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    position: relative;
    top: -4px;
    &:hover {
      cursor: pointer;
      scale: 1.05;
    }
  }

  div {
    position: relative;
    top: 2px;
    &:hover {
      cursor: pointer;
      scale: 1.05;
    }
  }
`;
const RightBox = styled.div`
  width: 40%;
  height: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  gap: 15px;

  div {
    position: relative;
    top: 2px;
    &:hover {
      cursor: pointer;
      scale: 1.05;
    }
  }
`;

function Navbar() {
  const navigate = useNavigate();
  return (
    <Container>
      <LeftBox>
        <img src={logo} alt="logo" />
        <div onClick={() => navigate("/")}>YOUR'S JEJU</div>
      </LeftBox>
      <RightBox></RightBox>
    </Container>
  );
}

export default Navbar;
