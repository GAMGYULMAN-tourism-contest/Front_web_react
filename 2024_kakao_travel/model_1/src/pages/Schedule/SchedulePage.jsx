import React, { useEffect, useState } from "react";
import { Navbar } from "../../components";
import * as S from "./SchedulePage.style";
import DaySchedule from "./components/DaySchedule";
import SearchBox from "./components/SearchBox";
import { useNavigate } from "react-router";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getSearchItems } from "../../state/searches/searchesSlice";
import MakeModal from "./components/MakeModal";
import { IoIosSave } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
// import SockJS from "sockjs-client";
import SockJS from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";
import {
  getSchedules,
  setCurrentSchedule,
  setFirstSchedulePageVisit,
  // setSocketClient,
} from "../../state/schedules/schedulesSlice";
import { authInstance } from "../../api/axiosInstance";
import UserOverlay from "./components/UserOverlay";

function SchedulePage() {
  const [stompClient, setStompClient] = useState(null);
  const [eventId, setEventId] = useState("");
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [ratio, setRatio] = useState(1); // 화면 확대 축소 비율

  const navigate = useNavigate();
  const data = useSelector((state) => state.schedules.schedules);
  const currentSchedule = useSelector(
    (state) => state.schedules.currentSchedule
  );
  const dispatch = useDispatch();

  const wheelHandler = (e) => {
    setRatio((ratio) => (ratio >= 0.2 ? ratio + 0.001 * e.deltaY : 0.2));
  };

  // 날짜 하루 추가
  const addDayEvents = async () => {
    const reqData = {
      title: currentSchedule.title,
      description: currentSchedule.description,
      period: currentSchedule.period + 1,
      startDate: currentSchedule.startDate,
    };
    console.log(reqData);
    const apiRes = await authInstance.patch(
      "/schedules/" + currentSchedule.id,
      reqData
    );
    console.log(apiRes);
    // dispatch(setCurrentSchedule(apiRes.schedules));
  };

  // 스톰프 send 3 함수 (props 한번까지 전달해서 사용, 그 아래로는 util 함수사용)
  const sendCreateMessage = (chatMessage) => {
    console.log(eventId);
    if (stompClient) {
      // const chatMessage = JSON.stringify({
      //   scheduleId: scheduleId,
      //   dayEventsId: dayEventsId,
      //   title: "title",
      //   description: "desciption",
      //   startTime: "09:00",
      //   endTime: "10:00",
      //   locationContentId: "",
      //   locationContentTypeId: "",
      // });

      console.log(chatMessage);

      stompClient.send(
        "/events/create",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  const sendUpdateMessage = (chatMessage) => {
    // console.log(eventId);
    if (stompClient) {
      // const chatMessage = JSON.stringify({
      //   scheduleId: scheduleId,
      //   eventId: eventId,
      //   dayEventsId: dayEventsId,
      //   title: "title (update)",
      //   description: "desciption (update)",
      //   startTime: "09:30",
      //   endTime: "12:00",
      //   locationContentId: "",
      //   locationContentTypeId: "",
      // });

      console.log(chatMessage);

      stompClient.send(
        "/events/update",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  const sendDeleteMessage = (chatMessage) => {
    console.log(eventId);
    if (stompClient) {
      // const chatMessage = JSON.stringify({
      //   scheduleId: scheduleId,
      //   eventId: eventId,
      // });

      console.log(chatMessage);

      stompClient.send(
        "/events/delete",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  const sendFirstEnterMessage = (stompClient) => {
    console.log("if 전", stompClient);
    if (stompClient) {
      console.log("if도 함");
      const chatMessage = JSON.stringify({
        scheduleId: currentSchedule.id,
      });

      console.log(chatMessage);

      stompClient.send(
        "/events/participants",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  useEffect(() => {
    console.log(currentSchedule);
    dispatch(getSearchItems({ page: 1, size: 10 }));
    // dispatch(setFirstSchedulePageVisit(true));

    // return () => {
    //   dispatch(setFirstSchedulePageVisit(false));
    // };
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://3.35.101.171:8080/socket");
    // const socket = new SockJS("http://3.35.101.171/socket");
    const stompClient = Stomp.over(() => socket);

    stompClient.connect(
      {
        Authorization: "Bearer " + token,
      },
      (frame) => {
        console.log("Connected: " + frame);

        stompClient.subscribe(
          "/user/schedules/create/" + currentSchedule.id,
          (messageOutput) => {
            const json = JSON.parse(messageOutput.body);
            console.log(json);
            dispatch(getSchedules(currentSchedule.id));
          }
        );
        stompClient.subscribe(
          "/user/schedules/delete/" + currentSchedule.id,
          (messageOutput) => {
            const json = JSON.parse(messageOutput.body);
            console.log(json);
            dispatch(getSchedules(currentSchedule.id));
          }
        );
        stompClient.subscribe(
          "/user/schedules/update/" + currentSchedule.id,
          (messageOutput) => {
            const json = JSON.parse(messageOutput.body);
            console.log(json);
            dispatch(getSchedules(currentSchedule.id));
          }
        );
        stompClient.subscribe(
          "/user/schedules/participants/" + currentSchedule.id,
          (messageOutput) => {
            const json = JSON.parse(messageOutput.body);
            console.log(json);
            // json.result.participants 를 가져와서 전역상태로 관리 -> overlay 추가
          }
        );
      }
    );

    console.log("연결 성공", stompClient);
    setStompClient(stompClient);

    // 첫 연결 시 참가한다고 서버에 알림 -> 나중에 실시간 참여자 수 구함
    setTimeout(() => sendFirstEnterMessage(stompClient), 2000);
    // sendFirstEnterMessage(stompClient);
    // sendFirstEnterMessage();
    // dispatch(setSocketClient(stompClient));

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <S.Container>
      <UserOverlay />
      <MakeModal></MakeModal>
      <S.MenuBox>
        <SearchBox />
      </S.MenuBox>
      {data && (
        <S.ScheduleBox>
          {/* <S.SchduleBoxInLay ratio={ratio} onWheel={wheelHandler}> */}
          {data.map((dayEvents, idx) => (
            <DaySchedule
              key={dayEvents.day + idx}
              day={dayEvents.day}
              dayEventsId={dayEvents.id}
              sendCreateMessage={sendCreateMessage}
              sendUpdateMessage={sendUpdateMessage}
              sendDeleteMessage={sendDeleteMessage}
              socketClient={stompClient} // props driling to dayschedule -> dayscheduleSlider -> modifyingBox
            />
          ))}
          <S.FloatingButton onClick={() => navigate("/map/1")}>
            <FaMapMarkerAlt />
          </S.FloatingButton>
          <S.DayEventsAdditionButton onClick={() => addDayEvents()}>
            <IoIosAddCircleOutline />
          </S.DayEventsAdditionButton>
          {/* </S.SchduleBoxInLay> */}
        </S.ScheduleBox>
      )}
    </S.Container>
  );
}

export default SchedulePage;
