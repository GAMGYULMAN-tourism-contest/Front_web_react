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
import { setMembers, setParticipants } from "../../state/socket/socketSlice";

function SchedulePage() {
  const [socketClient, setSocketClient] = useState(null);
  const [eventId, setEventId] = useState("");
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [ratio, setRatio] = useState(1); // 화면 확대 축소 비율
  const [reconnectAttempts, setReconnectAttempts] = useState(0); // 재연결 시도 횟수

  const navigate = useNavigate();
  const data = useSelector((state) => state.schedules.schedules);
  const currentSchedule = useSelector(
    (state) => state.schedules.currentSchedule
  );
  const dispatch = useDispatch();
  // console.log("소켓상태", data.socketClient);

  const wheelHandler = (e) => {
    setRatio((ratio) => (ratio >= 0.2 ? ratio + 0.001 * e.deltaY : 0.2));
  };

  // 날짜 하루 추가
  const addDayEvents = () => {
    sendCreateDayEvents();
    // dispatch(setCurrentSchedule(apiRes.schedules));
  };

  // 스톰프 send 5 함수 (props 한번까지 전달해서 사용, 그 아래로는 util 함수사용)
  const sendCreateMessage = (chatMessage) => {
    console.log(eventId);
    if (socketClient) {
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

      socketClient.send(
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
    if (socketClient) {
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

      socketClient.send(
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
    if (socketClient) {
      // const chatMessage = JSON.stringify({
      //   scheduleId: scheduleId,
      //   eventId: eventId,
      // });

      console.log(chatMessage);

      socketClient.send(
        "/events/delete",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  // dayEvents 추가
  const sendCreateDayEvents = () => {
    if (socketClient) {
      const chatMessage = JSON.stringify({
        scheduleId: currentSchedule.id,
      });

      console.log(chatMessage);

      socketClient.send(
        "/events/dayEvents/create",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  // dayEvents 삭제
  const sendDeleteDayEvents = (dayEventsId) => {
    if (socketClient) {
      const chatMessage = JSON.stringify({
        scheduleId: currentSchedule.id,
        dayEventsId: dayEventsId,
      });

      socketClient.send(
        "/events/dayEvents/delete",
        {
          Authorization: "Bearer " + token,
        },
        chatMessage
      );
    }
  };

  useEffect(() => {
    // const socket = new SockJS("http://3.35.101.171:8080/socket");
    // const socket = new SockJS("http://3.35.101.171/socket");
    const socket = new SockJS("https://yoursjeju-api.site/socket");
    const stompClient = Stomp.over(() => socket);

    const connectStompClient = () => {
      stompClient.connect(
        {
          Authorization: "Bearer " + token,
        },
        (frame) => {
          console.log("Connected: " + frame);
          setReconnectAttempts(0); // 연결 성공 시 재연결 시도 횟수 초기화

          stompClient.subscribe(
            "/user/schedules/create/" + currentSchedule.id,
            (messageOutput) => {
              const json = JSON.parse(messageOutput.body);
              dispatch(getSchedules(currentSchedule.id));
            }
          );
          stompClient.subscribe(
            "/user/schedules/delete/" + currentSchedule.id,
            (messageOutput) => {
              const json = JSON.parse(messageOutput.body);
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
              dispatch(setParticipants(json.result.participants));
              dispatch(setMembers(json.result.members));
            }
          );
          stompClient.subscribe(
            "/user/schedules/dayEvents/create/" + currentSchedule.id,
            (messageOutput) => {
              const json = JSON.parse(messageOutput.body);
              dispatch(getSchedules(currentSchedule.id));
            }
          );
          stompClient.subscribe(
            "/user/schedules/dayEvents/delete/" + currentSchedule.id,
            (messageOutput) => {
              const json = JSON.parse(messageOutput.body);
              dispatch(getSchedules(currentSchedule.id));
            }
          );
          setSocketClient(stompClient);
        },
        (error) => {
          console.error("STOMP connection error", error);

          // 재연결 시도 로직
          const reconnectInterval = Math.min(
            5000 * (reconnectAttempts + 1),
            30000
          ); // 5초, 10초, 15초 간격으로 재연결 시도
          setReconnectAttempts((prev) => prev + 1);

          console.log(`Reconnecting in ${reconnectInterval / 1000} seconds...`);

          setTimeout(() => {
            connectStompClient(); // 재연결 시도
          }, reconnectInterval);
        }
      );
    };
    connectStompClient();

    // 연결 지연 확인 후 종료
    const timeout = setTimeout(() => {
      if (stompClient && !stompClient.connected) {
        console.error("connect time over");
        stompClient.disconnect(); // 연결이 되지 않으면 강제 종료
      }
    }, 5000); // 5초 타임아웃
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
              sendDeleteDayEvents={sendDeleteDayEvents}
              socketClient={socketClient} // props driling to dayschedule -> dayscheduleSlider -> modifyingBox
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
