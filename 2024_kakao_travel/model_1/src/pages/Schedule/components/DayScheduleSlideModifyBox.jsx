import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  addDayEvent,
  updateDayEvent,
  deleteDayEvent,
  setCurrentSchedule,
  setEventDetailOpen,
} from "../../../state/schedules/schedulesSlice";
import { SendUpdateMessage } from "../../../utils/sendMessages";
import useSendUpdateMessage from "../../../Hooks/useUpdateMessage";

// 애니메이션 정의: 오른쪽에서 나오는 애니메이션
const slideInFromRight = keyframes`
  from {
    transform: translateX(100%); /* 오른쪽 화면 밖 */
  }
  to {
    transform: translateX(0); /* 원래 위치로 */
  }
`;
const slideOutToRight = keyframes`
  from {
    transform: translateX(0);/* 원래 위치로 */
  }
  to {
    transform: translateX(100%);  /* 오른쪽 화면 밖 */
  }
`;

const Container = styled.div`
  width: 70vw;
  height: 100vh;
  background-color: #f9ffd7;
  color: black;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
  position: fixed; /* 고정된 위치 */
  right: 0px;
  top: 10%;
  /* transform: translateY(-50%); */
  border: 1px solid black;
  /* 상태에 따라 슬라이드 인/아웃 애니메이션 적용 */
  ${(props) =>
    props.$isVisible
      ? css`
          animation: ${slideInFromRight} 0.2s ease-out forwards;
        `
      : css`
          animation: ${slideOutToRight} 0.2s ease-out forwards;
        `}
  z-index: 10;
`;

const MinButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
`;

const MainBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -10vh;
  gap: 25px;
`;

const ButtonBox = styled.div`
  width: 70%;
  height: 7%;
  display: flex;
  gap: 40px;
`;

const Button = styled.button`
  width: 47.8%;
  height: 100%;
  color: white;
  font-size: 20px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    /* opacity: 0.8; */
    transform: scale(1.01);
  }
  background-color: ${(props) => {
    if (props.$buttonType === "modify") {
      return "#4CAF50";
    } else if (props.$buttonType === "delete") {
      return "#f44336";
    } else if (props.$buttonType === "complete") {
      return "#4CAF50";
    }
  }};
`;

const TitleBox = styled.div`
  width: 70%;
  height: 10%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #ffcc78; */

  input {
    width: 80%;
    height: 50%;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid black;
    font-size: 20px;
  }
`;
const DurationBox = styled.div`
  width: 70%;
  height: 10%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #ffcc78; */
`;
const DescriptionBox = styled.div`
  width: 70%;
  height: 40%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #ffcc78; */
`;

function ModifyingMainBox(props) {
  // const [chatMessage, setChatMessage] = useState()
  const { currentEvent, setIsModifying, currentSchedule, socketClient } = props;
  // const { socketClient } = useSelector((state) => state.schedules);
  const [chatMessage, setChatMessage] = useState({});
  const [newTitle, setNewTitle] = useState(
    currentEvent ? currentEvent.title : ""
  );
  const [newDescription, setNewDescription] = useState(
    currentEvent ? currentEvent.description : ""
  );
  function modifyCompleteClickHandler() {
    const chatMessage = {
      scheduleId: currentSchedule.id,
      eventId: currentEvent.id,
      title: newTitle,
      description: newDescription,
      startTime: currentEvent.startTime,
      endTime: currentEvent.endTime,
      locationContentId: "",
      locationContentTypeId: "",
    };
    setChatMessage(chatMessage);
    console.log(socketClient);
    // useSendUpdateMessage(JSON.stringify(chatMessage));
    SendUpdateMessage(JSON.stringify(chatMessage), socketClient);
    setIsModifying(false);
  }
  return (
    currentEvent && (
      <MainBox>
        <ButtonBox>
          <Button
            onClick={() => modifyCompleteClickHandler()}
            $buttonType="complete"
          >
            complete
          </Button>
        </ButtonBox>

        <TitleBox>
          <input
            type="text"
            name="title"
            value={newTitle} // 이후로는 이걸로 관리
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </TitleBox>
        <DurationBox>
          <span>
            {currentEvent.startTime} ~ {currentEvent.endTime}
          </span>
        </DurationBox>
        <DescriptionBox>
          <textarea
            name="description"
            value={newDescription || ""} // 이후로는 이걸로 관리
            onChange={(e) => setNewDescription(e.target.value)}
          ></textarea>
        </DescriptionBox>
      </MainBox>
    )
  );
}

export default ModifyingMainBox;
