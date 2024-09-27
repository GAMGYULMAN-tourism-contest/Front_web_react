import React from "react";
import styled from "styled-components";
import test from "/public/test.jpg";
import searching1 from "/public/searching1.png";

// 스타일 컴포넌트 정의
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
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
  font-size: 18px;
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
  font-size: 14px;
  color: #555;
  text-align: center;
  padding: 5px;
`;

const HelpModal = () => {
  return (
    <ModalContainer>
      <HelpContentBox>
        <ContentTitle>1. Keyword Search</ContentTitle>
        <ContentBody>
          <Image src={searching1} alt="Keyword search" />
          <Description>키워드 검색 기능에 대한 설명입니다.</Description>
        </ContentBody>
      </HelpContentBox>

      <HelpContentBox>
        <ContentTitle>2. Schedule Page</ContentTitle>
        <ContentBody>
          <Image src={test} alt="Schedule page" />
          <Description>일정 페이지에 대한 설명입니다.</Description>
        </ContentBody>
      </HelpContentBox>

      <HelpContentBox>
        <ContentTitle>3. Map Page</ContentTitle>
        <ContentBody>
          <Image src={test} alt="Map page" />
          <Description>지도 페이지에 대한 설명입니다.</Description>
        </ContentBody>
      </HelpContentBox>
    </ModalContainer>
  );
};

export default HelpModal;
