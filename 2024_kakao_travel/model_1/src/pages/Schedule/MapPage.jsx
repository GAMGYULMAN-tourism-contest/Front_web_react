import React, { useEffect } from "react";
import * as S from "./MapPage.style";
import SearchBox from "./components/SearchBox";

function Kakao() {
  const { kakao } = window;
  useEffect(() => {
    var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    console.log(container);
    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    var ps = new kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch("hotel", (data, status, pagination) => {
      console.log(data, status, pagination);
    });
  }, []);

  return <div id="map" style={{ width: "100%", height: "90vh" }}></div>;
}

function MapPage() {
  return (
    <S.Container>
      <S.SearchBox>
        <SearchBox />
      </S.SearchBox>
      <S.MapBox>
        <Kakao></Kakao>
      </S.MapBox>
    </S.Container>
  );
}

export default MapPage;
