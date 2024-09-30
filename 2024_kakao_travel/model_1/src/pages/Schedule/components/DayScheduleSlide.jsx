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
import {
  SendDeleteMessage,
  SendUpdateMessage,
} from "../../../utils/sendMessages";
import useSendUpdateMessage from "../../../Hooks/useUpdateMessage";
import ModifyingMainBox from "./DayScheduleSlideModifyBox";
import ConfirmModal from "./../../../components/ConfirmModal";
import { authInstance } from "../../../api/axiosInstance";

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
  display: ${(props) => (props.$isVisible ? "flex" : "none")};
  transition: display 0.5s allow-discrete;
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
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -10vh;
  gap: 25px;
  overflow-y: auto;
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

  h1 {
    font-size: 24px;
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

function DayScheduleSlide({ socketClient, address }) {
  const {
    eventDetailOpen,
    currentEvent,
    firstSchedulePageVisit,
    currentSchedule,
  } = useSelector((state) => state.schedules);
  const dispatch = useDispatch();
  const [isModifying, setIsModifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thisEvent, setThisEvent] = useState({});
  console.log(socketClient);

  function modifyClickHandler() {
    setIsModifying(true);
    console.log("modify");
  }

  // send 메시지 훅 만들까말까
  function deleteClickHandler() {
    const chatMessage = {
      scheduleId: currentSchedule.id,
      eventId: currentEvent.id,
    };
    if (!confirm("Please click Confirm or Cancel.")) {
      return;
    } else {
      SendDeleteMessage(JSON.stringify(chatMessage), socketClient);
      // dispatch(deleteDayEvent(currentSchedule.id, currentEvent.id));
      dispatch(setEventDetailOpen(false));
    }
  }

  useEffect(() => {
    async function getThisEvent(id) {
      setIsLoading(true);
      try {
        const resApi = await authInstance.get("/events/" + id);
        console.log(resApi);
        setThisEvent(resApi.data.result);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }

    if (eventDetailOpen && currentEvent) {
      getThisEvent(currentEvent.id);
    }
  }, [eventDetailOpen, currentEvent]); // eventDetailOpen이 true로 변경될 때 useEffect 실행

  return (
    <Container
      $isVisible={eventDetailOpen}
      // $isFirst={first}
    >
      <MinButton onClick={() => dispatch(setEventDetailOpen(false))}>
        {" "}
        {">>"}{" "}
      </MinButton>
      {currentEvent &&
        (isModifying ? (
          <ModifyingMainBox
            currentEvent={currentEvent}
            setIsModifying={setIsModifying}
            currentSchedule={currentSchedule}
            socketClient={socketClient}
          />
        ) : (
          <MainBox>
            <ButtonBox>
              <Button onClick={modifyClickHandler} $buttonType="modify">
                modify
              </Button>
              <Button onClick={deleteClickHandler} $buttonType="delete">
                delete
              </Button>
            </ButtonBox>
            {/* <ConfirmModal status={isDeleting} /> */}
            <TitleBox>
              <h1>{currentEvent.title}</h1>
            </TitleBox>
            <DurationBox>
              <span>
                {currentEvent.startTime} ~ {currentEvent.endTime}
              </span>
            </DurationBox>
            <DescriptionBox key={1}>
              <span>{currentEvent.description}</span>
            </DescriptionBox>
            <DescriptionBox>
              {isLoading ? (
                <span>loading...</span>
              ) : (
                thisEvent.location && <span>{thisEvent.location?.address}</span>
              )}
            </DescriptionBox>
          </MainBox>
        ))}
    </Container>
  );
}

export default DayScheduleSlide;
