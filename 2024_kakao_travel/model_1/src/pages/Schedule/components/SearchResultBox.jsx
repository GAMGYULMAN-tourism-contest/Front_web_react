import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import {
  getSearchItems,
  setCurrentPage,
} from "../../../state/searches/searchesSlice";

const Container = styled.div`
  display: flex;
  overflow-y: auto;
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

const PlaceBox = styled.div`
  border-bottom: 1px solid #eaeaea;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PlaceDetails = styled.div`
  /* width: 80%; */
  flex: 1;
  border: 1px solid #eaeaea;
  background-color: #eaeaea;
  padding: 10px;
  cursor: move; /* 드래그 가능한 커서 */
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const BottomOfList = styled.div`
  width: 100%;
  height: 20px;
  /* position: relative; */
  /* top: 50px; */
  margin-top: -30px;
  border: 1px solid #000000;
  /* display: none; */
  z-index: -10;
`;

// 드래그 가능한 PlaceDetails 컴포넌트
const DraggablePlaceDetails = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "searchItem", // 현재 드래그의 타입
    item: { ...item, type: "searchItem" }, // 현재 드래그 아이템의 내부 값들, location 객체 참조하자!
    collect: (monitor) => ({
      // 모니터링할 상태값
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <PlaceDetails ref={drag} isDragging={isDragging}>
      <PlaceTitle>{item.title}</PlaceTitle>
      <PlaceImage src={item.images[0]} />
      <PlaceAddress>{item.address}</PlaceAddress>
      <PlaceContact>{item.tel}</PlaceContact>
    </PlaceDetails>
  );
};

function SearchResultBox(props) {
  const { searchKeyword } = props;
  const searchesState = useSelector((state) => state.searches);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();

  useEffect(() => {
    // inView가 true 일때만 실행한다.
    if (
      inView &&
      searchesState.searches &&
      searchesState.searches.length >= 10
    ) {
      // console.log(inView, "무한 스크롤 요청 🎃", searchesState.currentPage);
      // 실행할 함수
      dispatch(
        getSearchItems({
          keyword: searchKeyword,
          page: searchesState.currentPage + 1,
          size: 10,
          isLoadMore: true, // 무한 스크롤링이라는 걸 slice에 알려줌
        })
      );
      dispatch(setCurrentPage(searchesState.currentPage + 1));
    }
  }, [inView]);

  return (
    <Container>
      <PlaceBox>
        {searchesState.searches ? (
          searchesState.searches
            .filter((item) => item !== null && item !== undefined) // null이나 undefined인 항목 필터링
            .map((item) => (
              <DraggablePlaceDetails key={item.contentId} item={item} />
            ))
        ) : (
          <div>no searching data</div> // 검색 결과가 없을 때 처리
        )}
        {searchesState.searches &&
          searchesState.searches.length >= 10 &&
          !searchesState.isLast && <BottomOfList ref={ref}>.</BottomOfList>}
      </PlaceBox>
    </Container>
  );
}

export default SearchResultBox;
