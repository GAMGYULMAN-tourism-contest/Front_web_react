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
  setSocketClient,
} from "../../state/schedules/schedulesSlice";

function SchedulePage() {
  const [stompClient, setStompClient] = useState(null);
  const [eventId, setEventId] = useState("");
  const [scheduleId, setScheduleId] = useState();
  const [dayEventsId, setDayEventId] = useState();
  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
    // "Bearer 123" // TODO: token 받아서 ��기
  );

  const navigate = useNavigate();
  const data = useSelector((state) => state.schedules.schedules);
  const currentSchedule = useSelector(
    (state) => state.schedules.currentSchedule
  );
  console.log(data);

  const dispatch = useDispatch();

  const handleSaveClick = () => {
    //TODO: 스케줄 수정 api, reqData 중 dayEvents만 = schedules.schedules로 바꿔서 실행
  };

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

  useEffect(() => {
    dispatch(getSearchItems({ page: 1, size: 10 }));
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
            // TODO: 로직 처리
            setEventId(json.result.id);
          }
        );
        stompClient.subscribe(
          "/user/schedules/delete/" + currentSchedule.id,
          (messageOutput) => {
            const json = JSON.parse(messageOutput.body);
            console.log(json);
          }
        );
        stompClient.subscribe(
          "/user/schedules/update/" + currentSchedule.id,
          (messageOutput) => {
            const json = JSON.parse(messageOutput.body);
            console.log(json);
            getSchedules(currentSchedule.id);
          }
        );
      }
    );

    console.log("연결 성공", stompClient);
    setStompClient(stompClient);
    dispatch(setSocketClient(stompClient));

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <S.Container>
      <MakeModal></MakeModal>
      <S.MenuBox>
        <SearchBox />
      </S.MenuBox>
      {data && (
        <S.ScheduleBox>
          {data.map((dayEvents, idx) => (
            <DaySchedule
              key={dayEvents.day + idx}
              day={dayEvents.day}
              dayEventsId={dayEvents.id}
              // scheduleList={dayEvents.schedules}
              // onScheduleUpdate={handleScheduleUpdate}
              sendCreateMessage={sendCreateMessage}
              sendUpdateMessage={sendUpdateMessage}
              sendDeleteMessage={sendDeleteMessage}
            />
          ))}
          <S.FloatingButton onClick={() => navigate("/map/1")}>
            <FaMapMarkerAlt />
          </S.FloatingButton>
          {/* <S.FloatingSave onClick={() => handleSaveClick()}>
            <IoIosSave />
          </S.FloatingSave> */}
          <S.DayEventsAdditionButton>
            <IoIosAddCircleOutline />
          </S.DayEventsAdditionButton>
        </S.ScheduleBox>
      )}
    </S.Container>
  );
}

export default SchedulePage;
