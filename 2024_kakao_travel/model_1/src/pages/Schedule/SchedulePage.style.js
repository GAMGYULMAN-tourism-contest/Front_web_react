import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const MenuBox = styled.div`
  width: 30%;
  /* overflow-y: auto; */
`;
const ScheduleBox = styled.div`
  width: 70%;
  height: 90vh;
  overflow-x: auto;
  display: flex;
`;

const FloatingButton = styled.button`
  width: 80px;
  height: 80px;
  position: fixed;
  bottom: 20px;
  right: 40px;
  background-color: #4caf50;
  color: white;
  padding: 20px 20px;
  border: none;
  cursor: pointer;
  z-index: 20;
  border-radius: 50%;
  font-size: 38px;
  background-color: #ffbd49;
`;

export { Container, MenuBox, ScheduleBox, FloatingButton };
