import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  addDayEvent,
  updateDayEvent,
  deleteDayEvent,
  setCurrentSchedule,
  setEventDetailOpen,
} from "../../../state/schedules/schedulesSlice";

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
  ${({ $isVisible }) =>
    $isVisible
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

const TitleBox = styled.div`
  width: 70%;
  height: 10%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #ffcc78; */
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

function DayScheduleSlide() {
  const { eventDetailOpen, currentEvent } = useSelector(
    (state) => state.schedules
  );
  const dispatch = useDispatch();

  return (
    <Container
      $isVisible={eventDetailOpen}
      // onAnimationEnd={()=>handleAnimationEnd(eventDetailOpen)}
    >
      <MinButton onClick={() => dispatch(setEventDetailOpen(false))}>
        {" "}
        {">>"}{" "}
      </MinButton>
      {currentEvent && (
        <MainBox>
          <div>
            <button>modify</button>
            <button>delete</button>
          </div>

          <TitleBox>
            <h1>{currentEvent.title}</h1>
          </TitleBox>
          <DurationBox>
            <span>
              {currentEvent.startTime} ~ {currentEvent.endTime}
            </span>
          </DurationBox>
          <DescriptionBox>
            <span>{currentEvent.description}</span>
          </DescriptionBox>
        </MainBox>
      )}
    </Container>
  );
}

export default DayScheduleSlide;
