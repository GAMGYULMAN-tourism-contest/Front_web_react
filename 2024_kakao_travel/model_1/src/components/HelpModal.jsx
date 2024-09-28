import React from "react";
import styled from "styled-components";
// import test from "/public/test.jpg";
// import searching1 from "/public/searching1.png";
// import schedule1 from "/public/schedule1.png";
// import schedule2 from "/public/schedule2.png";
// import map1 from "/public/map1.png";
// import map2 from "/public/map2.png";

// 스타일 컴포넌트 정의
const ModalContainer = styled.div`
  position: fixed;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75vw;
  height: 75vh;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
`;

const HelpContentBox = styled.div`
  width: 90%;
  background-color: #f1f1f1;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ContentTitle = styled.span`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ContentBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 80%;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Description = styled.div`
  font-size: 18px;
  color: #555;
  text-align: center;
  padding: 5px;
`;

// HelpTopBox 스타일링
const HelpTopBox = styled.div`
  width: 89%;
  display: flex;
  justify-content: center; /* 버튼과 제목을 양쪽으로 배치 */
  align-items: center; /* 세로축 정렬 */
  background-color: #f0f0f0; /* 배경색 */
  padding: 5px 20px; /* 패딩 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 가벼운 그림자 */
  margin-bottom: 10px; /* margin-bottom: 10px; */
  /* gap: -20px; */
  /* 하위 모든 요소에 스타일 적용 */
  & > * {
    position: relative;
    right: -2%;
  }
`;

// CloseButton 스타일링
const CloseButton = styled.button`
  /* background-color: transparent; 배경 제거 */
  border: none; /* 테두리 제거 */
  font-size: 28px; /* 글자 크기 */
  cursor: pointer; /* 커서 포인터 모양 */
  color: #333; /* 글자 색 */
  transition: color 0.2s ease-in-out; /* 호버 시 색 변화 애니메이션 */
  position: relative;
  right: -30%;

  &:hover {
    color: #ff6b6b; /* 호버 시 빨간색으로 변경 */
  }
`;

const HelpModal = (props) => {
  console.log(props);
  const { setHelpBoxOpen } = props;
  return (
    <ModalContainer>
      <HelpTopBox>
        <ContentTitle>How to use your's JEJU</ContentTitle>
        <CloseButton onClick={() => setHelpBoxOpen(false)}>X</CloseButton>
      </HelpTopBox>

      <HelpContentBox>
        <ContentTitle>1. Keyword Search</ContentTitle>
        <ContentBody>
          <Image src="/searching1.png" alt="Keyword search" />
          <Description>
            Create a schedule by *dragging* the search result block!
          </Description>
        </ContentBody>
      </HelpContentBox>

      <HelpContentBox>
        <ContentTitle>2. Schedule Page</ContentTitle>
        <ContentBody>
          <Image src="/schedule1.png" alt="Schedule page" />
          <Description>
            Drag the created schedule block to move it to the desired time zone!
          </Description>
          <Image src="/schedule2.png" alt="Schedule page" />
          <Description>Wow!</Description>
        </ContentBody>
      </HelpContentBox>

      <HelpContentBox>
        <ContentTitle>3. Map Page</ContentTitle>
        <ContentBody>
          <Image src="/map1.png" alt="Map page" />
          <Description>
            Search results locations are displayed on the map. Click on a marker
            to see detailed information!
          </Description>
          <Image src="/map2.png" alt="Map page" />
          <Description>
            Shh, press the marker one more time and it will disappear!
          </Description>
        </ContentBody>
      </HelpContentBox>
    </ModalContainer>
  );
};

export default HelpModal;
