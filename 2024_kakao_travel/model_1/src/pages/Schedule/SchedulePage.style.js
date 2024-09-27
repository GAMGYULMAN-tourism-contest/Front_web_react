import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  display: flex;
  /* 전체 스크롤바 스타일을 지정합니다 */
  ::-webkit-scrollbar {
    width: 12px; /* 세로 스크롤바 너비 */
    height: 12px; /* 가로 스크롤바 높이 */
  }

  /* 스크롤바 트랙을 스타일링합니다 */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* 스크롤 트랙 색상 */
    border-radius: 10px; /* 둥근 모서리 적용 */
  }

  /* 스크롤바 손잡이를 스타일링합니다 */
  ::-webkit-scrollbar-thumb {
    background: #888; /* 손잡이 색상 */
    border-radius: 10px; /* 둥근 모서리 적용 */
    border: 3px solid #f1f1f1; /* 손잡이 주변 여백 */
  }

  /* 스크롤바 손잡이 마우스 오버 시 스타일 */
  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* 손잡이 색상 변경 */
  }

  /* 스크롤바 화살표 버튼을 제거합니다 */
  ::-webkit-scrollbar-button {
    display: none; /* 화살표 버튼 숨김 */
  }
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
