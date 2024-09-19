import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
  /* width: 500px; */
  display: flex;
  /* flex-direction: column; */
`;

const PlaceBox = styled.div`
  border-bottom: 1px solid #eaeaea;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlaceDetails = styled.div`
  flex: 1;
  border: 1px solid #eaeaea;
  background-color: #eaeaea;
  padding: 10px;
  cursor: pointer;
`;

const PlaceTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0 0 5px;
`;

const PlaceRating = styled.div`
  font-size: 14px;
  color: #f39c12;
  margin: 5px 0;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 200px;
`;

const PlaceAddress = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0;
`;

const PlaceContact = styled.p`
  font-size: 14px;
  color: #777;
  margin: 5px 0 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

function SearchResultBox() {
  const searchesState = useSelector((state) => state.searches);
  console.log(searchesState);
  return (
    <Container>
      <PlaceBox>
        {searchesState.searches.map((item) => {
          return (
            <PlaceDetails key={item.contentTypeId}>
              <PlaceTitle>{item.title}</PlaceTitle>
              <PlaceImage src={item.images[0]} />
              {/* <PlaceRating>⭐ 4.8 | 리뷰 225</PlaceRating> */}
              <PlaceAddress>{item.address}</PlaceAddress>
              <PlaceContact>{item.tel}</PlaceContact>
            </PlaceDetails>
          );
        })}
        {/* <Actions>
          <ActionButton>상세보기</ActionButton>
          <ActionButton>홈페이지</ActionButton>
        </Actions> */}
      </PlaceBox>
      {/* PlaceBox를 복사해서 다른 항목을 추가할 수 있습니다 */}
    </Container>
  );
}

export default SearchResultBox;
