import React, { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

// 스타일드 컴포넌트

const Modal = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) =>
    isOpen ? "0" : "-40vw"}; /* 모달이 열리면 0, 닫히면 -30vw */
  width: 30vw;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease; /* 부드러운 슬라이드 애니메이션 */
  display: flex;
  flex-direction: column;
  padding: 2rem;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 999;
`;

const MenuItem = styled.div`
  padding: 1rem 0;
  font-size: 1.2rem;
  color: #333;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const MenuModal = ({ menuModalIsOpen, toggleMenu }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* <MenuButton onClick={toggleMenu}>Menu</MenuButton>/ */}
      <Overlay isOpen={menuModalIsOpen} onClick={toggleMenu} />
      <Modal isOpen={menuModalIsOpen}>
        <CloseButton onClick={toggleMenu}>&times;</CloseButton>
        <MenuItem
          onClick={() => {
            toggleMenu();
            navigate("/");
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={() => {
            toggleMenu();
            navigate("/dictionary");
          }}
        >
          Travel Glossary
        </MenuItem>
        <MenuItem
          onClick={() => {
            localStorage.removeItem("accessToken");
            toggleMenu();
            navigate("/");
          }}
        >
          Log Out
        </MenuItem>
      </Modal>
    </>
  );
};

export default MenuModal;
