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

const FloatingSave = styled.button`
  width: 80px;
  height: 80px;
  position: fixed;
  bottom: calc(12vh + 20px);
  right: 40px;
  background-color: #4caf50;
  color: white;
  padding: 20px 20px;
  border: none;
  cursor: pointer;
  z-index: 20;
  border-radius: 50%;
  font-size: 38px;
  background-color: #4caf50;
`;

const DayEventsAdditionButton = styled.button`
  width: 40px;
  height: 40px;
  position: relative;
  /* bottom: calc(12vh + 20px); */
  top: 45vh;
  right: -4vw;
  background-color: #4caf50;
  color: white;
  padding: 5px 5px;
  border: none;
  cursor: pointer;
  /* z-index: 20; */
  border-radius: 50%;
  font-size: 30px;
  background-color: #4caf50;
`;

export {
  Container,
  MenuBox,
  ScheduleBox,
  FloatingButton,
  FloatingSave,
  DayEventsAdditionButton,
};
