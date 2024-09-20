import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";

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
  background-color: #ffcc78;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed; /* 고정된 위치 */
  right: 17px; /* 오른쪽 끝에 붙임 */
  top: 10%;
  /* transform: translateY(-50%); */
  border: 1px solid black;
  /* 상태에 따라 슬라이드 인/아웃 애니메이션 적용 */
  ${({ $isVisible }) =>
    $isVisible
      ? css`
          animation: ${slideInFromRight} 0.4s ease-out forwards;
        `
      : css`
          animation: ${slideOutToRight} 1s ease-out forwards;
        `}
  z-index: 10;
`;

const MinButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
`;

function DayScheduleSlide() {
  const [showComponent, setShowComponent] = useState(true); // 전역 상태로 관리

  return (
    <div>
      {showComponent && (
        <Container $isVisible={showComponent}>
          <MinButton onClick={() => setShowComponent(false)}>
            {" "}
            {">>"}{" "}
          </MinButton>
          <div>
            <div>
              <h1>제목</h1>
            </div>
            <div>
              <div></div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}

export default DayScheduleSlide;
