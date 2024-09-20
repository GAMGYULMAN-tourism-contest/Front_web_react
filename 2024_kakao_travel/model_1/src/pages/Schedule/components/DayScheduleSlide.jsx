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
  width: 50vw;
  height: 100vh;
  background-color: #ffe8b4;
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
  background-color: #ffcc78;
`;
const DurationBox = styled.div`
  width: 70%;
  height: 10%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffcc78;
`;
const DescriptionBox = styled.div`
  width: 70%;
  height: 40%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffcc78;
`;

function DayScheduleSlide() {
  const { eventDetailOpen } = useSelector((state) => state.schedules);
  // const [showComponent, setShowComponent] = useState(true); // 전역 상태로 관리
  console.log(eventDetailOpen);
  const dispatch = useDispatch();

  // 애니메이션 완료 후 DOM에서 요소 제거
  const handleAnimationEnd = (isOpen) => {
    dispatch(setEventDetailOpen(false)); // 슬라이드 아웃 애니메이션이 끝난 후 요소 숨김
  };

  return (
    <div>
      <Container
        $isVisible={eventDetailOpen}
        // onAnimationEnd={()=>handleAnimationEnd(eventDetailOpen)}
      >
        <MinButton onClick={() => dispatch(setEventDetailOpen(false))}>
          {" "}
          {">>"}{" "}
        </MinButton>
        <MainBox>
          <TitleBox>
            <h1>제목</h1>
          </TitleBox>
          <DurationBox>
            <span>몇시부터 몇시까지</span>
          </DurationBox>
          <DescriptionBox>
            <span>내용내용</span>
          </DescriptionBox>
        </MainBox>
      </Container>
    </div>
  );
}

export default DayScheduleSlide;
