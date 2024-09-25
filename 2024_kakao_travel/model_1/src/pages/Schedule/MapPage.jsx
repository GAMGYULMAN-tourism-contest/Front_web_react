import React, { useEffect } from "react";
import * as S from "./MapPage.style";
import { RiCalendarScheduleLine } from "react-icons/ri";
import SearchBox from "./components/SearchBox";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function Kakao() {
  const { kakao } = window;
  const { searches } = useSelector((state) => state.searches);
  console.log(searches);

  useEffect(() => {
    var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 9, //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    var ps = new kakao.maps.services.Places();

    // 마커를 표시할 위치와 title 객체 배열입니다
    // var positions = [
    //   {
    //     title: "카카오",
    //     latlng: new kakao.maps.LatLng(33.450705, 126.570677),
    //   },
    //   {
    //     title: "생태연못",
    //     latlng: new kakao.maps.LatLng(33.450936, 126.569477),
    //   },
    //   {
    //     title: "텃밭",
    //     latlng: new kakao.maps.LatLng(33.450879, 126.56994),
    //   },
    //   {
    //     title: "근린공원",
    //     latlng: new kakao.maps.LatLng(33.451393, 126.570738),
    //   },
    // ];

    // 마커 이미지의 이미지 주소입니다
    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < searches.length; i++) {
      // 마커 이미지의 이미지 크기 입니다
      var imageSize = new kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      console.log(searches);
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: new kakao.maps.LatLng(searches[i].mapy, searches[i].mapx), // 마커를 표시할 위치
        title: searches[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
    }

    // // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    // function displayMarker(locPosition, message) {
    //   // 마커를 생성합니다
    //   var marker = new kakao.maps.Marker({
    //     map: map,
    //     position: locPosition,
    //   });

    //   var iwContent = message, // 인포윈도우에 표시할 내용
    //     iwRemoveable = true;

    //   // 인포윈도우를 생성합니다
    //   var infowindow = new kakao.maps.InfoWindow({
    //     content: iwContent,
    //     removable: iwRemoveable,
    //   });

    //   // 인포윈도우를 마커위에 표시합니다
    //   infowindow.open(map, marker);

    //   // 지도 중심좌표를 접속위치로 변경합니다
    //   map.setCenter(locPosition);
    // }
  }, [searches]);

  return <div id="map" style={{ width: "100%", height: "90vh" }}></div>;
}

function MapPage() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <S.SearchBox>
        <SearchBox />
      </S.SearchBox>
      <S.MapBox>
        <Kakao></Kakao>
      </S.MapBox>
      {/* TODO: currentSchedule.id 로 내비게이트 */}
      <S.FloatingButton onClick={() => navigate("/schedule/1")}>
        <RiCalendarScheduleLine />
      </S.FloatingButton>
    </S.Container>
  );
}

export default MapPage;
