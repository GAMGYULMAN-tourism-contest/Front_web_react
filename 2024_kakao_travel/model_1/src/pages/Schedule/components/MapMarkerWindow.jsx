import React from "react";
import styled from "styled-components";

// 스타일 정의
const Container = styled.div`
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor || "white"};
  color: white;
  width: 300px;
  position: relative;
  z-index: 100;
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: 18px;
  word-wrap: break-word;
  word-break: keep-all;
  white-space: normal;
`;

const Image = styled.img`
  width: 300px;
  height: 200px;
  display: block;
  margin-bottom: 10px;
  border-radius: 20px;
`;

const ContentTypeText = styled.p`
  font-size: 14px;
  margin: 0;
  font-weight: bold;
`;

// 인포윈도우 컴포넌트
const MapMarkerWindow = ({ searchItem, onClickDelete }) => {
  // contentTypeId에 맞는 색상과 텍스트 설정
  console.log(searchItem, onClickDelete);
  const backgroundColor = getColorByType(searchItem.contentTypeId);
  const contentTypeText = getTextByType(searchItem.contentTypeId);

  return (
    <Container backgroundColor={backgroundColor} onClick={() => console.log(1)}>
      <Title>{searchItem.title}</Title>
      <Image
        src={searchItem.images[0]}
        alt={searchItem.title}
        onClick={() => console.log(1)}
      />
      {/* <ContentTypeText>관광 타입: {contentTypeText}</ContentTypeText> */}
    </Container>
  );
};

// 타입에 따라 배경색 설정하는 함수
const getColorByType = (contentTypeId) => {
  switch (contentTypeId) {
    // case 75:
    //   return "#FFD700"; // 레포츠
    // case 76:
    //   return "#FF4500"; // 관광지
    // case 77:
    //   return "#32CD32"; // 교통
    // case 78:
    //   return "#4682B4"; // 문화시설
    // case 79:
    //   return "#DA70D6"; // 쇼핑
    // case 80:
    //   return "#8B4513"; // 숙박
    // case 82:
    //   return "#FF6347"; // 음식점
    // case 85:
    //   return "#8A2BE2"; // 축제/공연/행사
    default:
      return "#ffbd49"; // 기타"#808080"
  }
};

// 타입에 맞는 텍스트 설정하는 함수
const getTextByType = (contentTypeId) => {
  switch (contentTypeId) {
    case 75:
      return "레포츠";
    case 76:
      return "관광지";
    case 77:
      return "교통";
    case 78:
      return "문화시설";
    case 79:
      return "쇼핑";
    case 80:
      return "숙박";
    case 82:
      return "음식점";
    case 85:
      return "축제/공연/행사";
    default:
      return "기타";
  }
};

export default MapMarkerWindow;
