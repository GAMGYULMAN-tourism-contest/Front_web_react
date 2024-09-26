import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import * as S from "./MapPage.style";
import { RiCalendarScheduleLine } from "react-icons/ri";
import SearchBox from "./components/SearchBox";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import MapMarkerWindow from "./components/MapMarkerWindow";

function Kakao() {
  const { kakao } = window;
  const { searches } = useSelector((state) => state.searches);
  console.log(searches);
  // // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  // function makeOverListener(map, marker, infowindow) {
  //   return function () {
  //     infowindow.open(map, marker);
  //   };
  // }

  // // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  // function makeOutListener(infowindow) {
  //   return function () {
  //     infowindow.close();
  //   };
  // }

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
    // ];

    // 검색 결과 마커 이미지의 이미지 주소입니다
    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    console.log(searches);
    if (searches) {
      searches.forEach((searchItem, index) => {
        // var 키워드 (함수 스코프)로 인한 forEach사용
        var imageSize = new kakao.maps.Size(28, 40); // 마커 이미지의 크기
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지 생성

        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: new kakao.maps.LatLng(searchItem.mapy, searchItem.mapx), // 마커의 위치
          title: searchItem.title, // 마커의 타이틀
          image: markerImage, // 마커 이미지
        });

        // 오버레이 컨텐츠 생성
        const contentString = ReactDOMServer.renderToString(
          <MapMarkerWindow
            searchItem={searchItem}
            onClickDelete={() => overlay.setMap(null)} // 오버레이 닫기 함수
          />
        );

        // 커스텀 오버레이 생성
        var overlay = new kakao.maps.CustomOverlay({
          content: contentString,
          position: marker.getPosition(),
          map: null, // 처음에는 맵에 표시하지 않음
          yAnchor: 1.1,
          xAnchor: 0,
        });

        // 마커 클릭 시 해당 오버레이만 표시 나중에 닫기 기능을 분리할 지 고민
        kakao.maps.event.addListener(marker, "click", function () {
          console.log(overlay);
          if (overlay.getMap()) {
            overlay.setMap(null); // 이미 표시 중이면 오버레이를 닫음
            return;
          }

          overlay.setMap(map); // 클릭 시 오버레이 표시
        });
      });
    } else {
      alert("no search items!");
    }
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
      {/* <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27406.878219625392!2d126.52369461028783!3d33.466700273554736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x350cfb08ab075f1f%3A0xb6bd0e0e38809ca8!2z64iE7Juo66eI66Oo6rGw66as!5e0!3m2!1sko!2skr!4v1727327830240!5m2!1sko!2skr"
        width="600"
        height="450"
        // allowFullScreen=""
        // loading="lazy"
        // referrerPolicy="no-referrer-when-downgrade"
      ></iframe> */}
      {/* TODO: currentSchedule.id 로 내비게이트 */}
      <S.FloatingButton onClick={() => navigate("/schedule/1")}>
        <RiCalendarScheduleLine />
      </S.FloatingButton>
    </S.Container>
  );
}

export default MapPage;
