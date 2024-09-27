import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import {
  addDayEvent,
  updateDayEvent,
  deleteDayEvent,
  setEventDetailOpen,
  setCurrentEvent,
} from "../../../state/schedules/schedulesSlice"; // 경로를 실제 위치에 맞게 변경하세요
import { ResizableBox } from "react-resizable";
import DayScheduleSlide from "./DayScheduleSlide";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { SendCreateMessage } from "../../../utils/sendMessages";
import { authInstance } from "../../../api/axiosInstance";

// Styled Components 정의
// const ScheduleContainer = styled.div`
//   flex: 0 0 40%; /* 요소가 줄어들지 않고 40% 너비를 유지하도록 설정 */
//   width: 40%;
//   display: grid;
//   grid-template-columns: 1fr;
//   position: relative;
//   margin: 20px 0px 20px 20px;
//   background-color: #f9f9f9; /* 심플한 배경색 */
//   border-radius: 8px; /* 부드러운 모서리 */
//   padding: 10px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 최소한의 그림자 */
//   overflow-y: auto;
// `;

// const HourBlock = styled.div`
//   width: 100%;
//   border: 1px solid #e0e0e0; /* 심플한 경계선 */
//   position: relative;
//   height: 60px;
//   background-color: ${({ $isOver }) =>
//     $isOver ? "#f5f5f5" : "#fafafa"}; /* 은은한 색 변화 */
//   transition: background-color 0.3s ease;
// `;

// const HourText = styled.p`
//   margin: 0;
//   padding: 5px;
//   font-size: 13px;
//   color: #333; /* 텍스트를 선명하게 */
//   font-weight: 400;
// `;

// const DraggableScheduleCard = styled.div`
//   position: absolute;
//   background-color: ${({ $isDragging }) =>
//     $isDragging ? "#e0e0e0" : "#ffcc78"};
//   color: #333; /* 다소 어두운 텍스트 색 */
//   cursor: move;
//   width: 70%;
//   top: ${({ $top }) => `${$top}px`};
//   left: 28%;
//   height: ${({ $height }) => `${$height}px`};
//   opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
//   transition: height 0.3s ease, background-color 0.3s ease;
//   z-index: ${({ $isDragging }) => ($isDragging ? 0 : 1)};
//   border-radius: 8px;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 심플한 그림자 */

//   button {
//     position: absolute;
//     left: 90%;
//     top: 5px;
//     background-color: transparent;
//     width: 25px;
//     height: 25px;
//     font-size: 12px;
//     border: none;
//     outline: none;
//     cursor: pointer;
//     opacity: 0.6;
//     transition: opacity 0.2s;
//     border-radius: 50%;

//     &:hover {
//       opacity: 1;
//     }

//     svg {
//       font-size: 18px;
//       position: relative;
//       right: 2px;
//       top: 1px;
//       color: #ff663c;
//     }
//   }
// `;

// const ScheduleTitle = styled.div`
//   position: absolute;
//   top: 0;
//   left: 5%;
//   right: 0;
//   width: 90%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   pointer-events: none;
//   word-break: keep-all;
//   text-align: center;
//   font-size: 14px; /* 적당한 크기 */
//   font-weight: 500; /* 가독성 좋은 텍스트 */
//   color: #333;
// `;

// Styled Components 정의

// Styled Components 정의
const ScheduleContainer = styled.div`
  flex: 0 0 40%; /* 요소가 줄어들지 않고 40% 너비를 유지하도록 설정 */
  width: 40%;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  margin: 20px 0px 20px 20px;
`;

const HourBlock = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  position: relative;
  height: 60px;
  background-color: ${({ $isOver }) => ($isOver ? "#777777" : "#ffeebcb8")};
`;

const HourText = styled.p`
  margin: 0;
  padding: 0;
  width: 30%;
  font-size: 13px;
`;

const DraggableScheduleCard = styled.div`
  position: absolute;
  background-color: ${({ $isDragging }) =>
    $isDragging ? "lightgreen" : "#ffcc78"};
  color: white;
  cursor: move;
  width: 70%;
  top: ${({ $top }) => `${$top}px`};
  left: 28%;
  height: ${({ $height }) => `${$height}px`};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: height 0.3s ease;
  z-index: ${({ $isDragging }) =>
    $isDragging ? 0 : 1}; // 뒤로 드래그 가능하도록 함
  border-radius: 15px;

  button {
    position: absolute;
    left: 91%;
    top: 2px;
    background-color: #ff663c;
    width: 25px;
    height: 25px;
    font-size: 12px;
    border: none;
    outline: none;
    cursor: pointer;
    opacity: 0.8;
    border-radius: 50%;
    svg {
      font-size: 18px;
      position: relative;
      right: 2.1px;
      top: 1.6px;
    }
  }
`;

const ScheduleTitle = styled.div`
  position: absolute;
  top: 0;
  left: 5%;
  right: 0;
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  word-break: keep-all;
  text-align: center;
`;

// 소켓 쓰는 함수 이벤트 CRUD

// 유틸리티 함수
const parseTimeToHour = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const calculateNewEndTime = (startTime, newHeight) => {
  const minutesAdded = newHeight;
  const [startHour, startMinutes] = startTime.split(":").map(Number);
  const totalMinutes = startHour * 60 + startMinutes + minutesAdded;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHour}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;
};

// DraggableScheduleCardComponent
const DraggableScheduleCardComponent = ({
  schedule,
  height,
  top,
  currentDay,
  onResize,
  onResizeStop,
  sendDeleteMessage,
}) => {
  // console.log("드래그 아이템에서 schedule이란?", schedule);
  const [isResizing, setIsResizing] = useState(false);
  const [tempHeight, setTempHeight] = useState(height); // 로컬 상태로 임시 높이 관리
  const [{ isDragging }, drag] = useDrag({
    type: "schedule",
    item: {
      title: schedule.title,
      id: schedule.id,
      currentDay,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isResizing,
  });
  const dispatch = useDispatch();

  // 클릭 핸들러 함수
  const handleClick = (event) => {
    if (!isDragging && !isResizing) {
      // 드래그나 리사이즈 중이 아닐 때만 클릭 이벤트 처리
      dispatch(setEventDetailOpen(true));
      dispatch(setCurrentEvent(event));
    }
  };

  return (
    <DraggableScheduleCard
      ref={drag}
      $top={top}
      $height={tempHeight} // 임시 높이로 애니메이션 적용
      $isDragging={isDragging}
      onClick={() => handleClick(schedule)}
    >
      <ResizableBox
        height={tempHeight} // 임시 높이로 애니메이션 적용
        onResizeStart={() => setIsResizing(true)}
        onResize={(e, data) => {
          const newHeight = Math.round(data.size.height / 15) * 15;
          setTempHeight(newHeight); // 실시간 높이 업데이트
          onResize(e, data, schedule); // 필요에 따라 onResize 호출
        }}
        onResizeStop={(e, data) => {
          setIsResizing(false);
          setTempHeight(data.size.height); // 최종 높이 업데이트
          onResizeStop(e, data, schedule);
        }}
        handle={
          <div
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "#cdfffc",
              bottom: "0",
              right: "0",
              cursor: "se-resize",
            }}
          />
        }
      >
        <ScheduleTitle>{schedule.title}</ScheduleTitle>
        {/* 삭제 버튼은 상세정보에서 대체 */}
        {/* <button onClick={(e) => sendDeleteMessage(JSON.stringify({
          id: schedule.id,
          eventId: 
        }))}>
          <IoIosCloseCircleOutline></IoIosCloseCircleOutline>
        </button> */}
      </ResizableBox>
    </DraggableScheduleCard>
  );
};

// HourBlockComponent
const HourBlockComponent = ({ hour, day, children, onDrop, socketClient }) => {
  const { currentSchedule } = useSelector((state) => state.schedules);
  const [{ isOver }, drop] = useDrop({
    accept: ["schedule", "searchItem"],
    drop: (item) => {
      const newStartTime = `${hour}:00`;
      onDrop(item.id, item.title, newStartTime, day, item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <HourBlock ref={drop} $isOver={isOver}>
      <div>
        <HourText>
          {hour}:00 - {hour + 1}:00
        </HourText>
        <button
          onClick={() => {
            //TODO: 1시간 이벤트 추가
            const chatMessage = JSON.stringify({
              scheduleId: currentSchedule.id,
              dayEventsId:
                currentSchedule.dayEvents.find(
                  (dayEvent) => dayEvent.day === day
                )?.id || null,
              title: "empty title",
              description: "desciption",
              startTime: hour + ":00",
              endTime: hour + 1 + ":00",
              locationContentId: "",
              locationContentTypeId: "",
            });
            SendCreateMessage(chatMessage, socketClient);
          }}
        >
          <IoIosAddCircleOutline />
        </button>
      </div>
      {children}
    </HourBlock>
  );
};

// DaySchedule 컴포넌트
const DaySchedule = ({
  day,
  dayEventsId,
  sendCreateMessage,
  sendUpdateMessage,
  sendDeleteMessage,
  socketClient,
}) => {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules.schedules);
  const currentSchedule = useSelector(
    (state) => state.schedules.currentSchedule
  );
  const dayData = schedules.find((schedule) => schedule.day == day);
  const events = dayData ? dayData.events : [];
  // console.log(schedules, dayData, events);

  const handleDrop = (id, title, newStartTime, newDay, type) => {
    // 이전 날짜의 기존 이벤트 추적
    let prevDayEvent;
    schedules.map((dayEvent) => {
      for (let event in dayEvent.events) {
        // console.log(dayEvent.events[event]);
        if (dayEvent.events[event].id === id) {
          prevDayEvent = dayEvent.events[event];
        }
      }
    });
    dispatch(setCurrentEvent(prevDayEvent));
    const existingEvent = events.find((event) => event.id === id);
    // console.log(id, title, newStartTime, newDay, type, existingEvent, events);
    if (existingEvent) {
      // 기존 이벤트의 지속 시간을 계산
      const duration =
        parseTimeToHour(existingEvent.endTime) -
        parseTimeToHour(existingEvent.startTime);
      // 기존 이벤트의 지속 시간을 사용하여 새로운 종료 시간을 계산
      const newEndTime = calculateNewEndTime(newStartTime, duration * 60);
      // 새로운 시간대에 다른 이벤트가 있는지 확인
      const isOverlap = events.some((event) => {
        const eventStart = parseTimeToHour(event.startTime);
        const eventEnd = parseTimeToHour(event.endTime);
        const newStart = parseTimeToHour(newStartTime);
        const newEnd = parseTimeToHour(newEndTime);

        // 새로운 시간대가 기존 이벤트의 시간대와 겹치는지 검사
        return (
          (newStart >= eventStart && newStart < eventEnd) || // 새로운 이벤트의 시작 시간이 기존 이벤트 시간 내에 있는지
          (newEnd > eventStart && newEnd <= eventEnd) || // 새로운 이벤트의 종료 시간이 기존 이벤트 시간 내에 있는지
          (newStart <= eventStart && newEnd >= eventEnd) // 새로운 이벤트가 기존 이벤트를 포함하는지
        );
      });

      if (isOverlap) {
        // 겹치는 이벤트가 있으면 아무런 작업도 하지 않음
        console.log("이 시간대에 이미 다른 이벤트가 있습니다.");
        return;
      }

      const updatedEvent = {
        ...existingEvent,
        startTime: newStartTime,
        endTime: newEndTime,
      };

      dispatch(updateDayEvent({ day: newDay, updatedEvent, originDay: day }));
      // 소켓 메시지 뿌리기
      const chatMessage = JSON.stringify({
        scheduleId: currentSchedule.id,
        eventId: updatedEvent.id,
        dayEventsId: dayEventsId,
        title: updatedEvent.title,
        description: updatedEvent.description,
        startTime: updatedEvent.startTime,
        endTime: updatedEvent.endTime,
        locationContentId: "",
        locationContentTypeId: "",
      });

      sendUpdateMessage(chatMessage);
    } else {
      // 기존 이벤트 현재 날짜에서 못 찾은 경우 (날짜이동 or 검색결과 드래그)
      let newEndTime;
      // 검색결과 케이스
      if (type === "searchItem") {
        newEndTime = calculateNewEndTime(newStartTime, 60);
        // 소켓 메시지 뿌리기 - 추가
        const chatMessageCreate = JSON.stringify({
          scheduleId: currentSchedule.id,
          // eventId: updatedEvent.id,
          dayEventsId: dayEventsId,
          title: title, // drop에서 가져온 title
          description: title, // 설명 없음, 제목 그대로
          startTime: newStartTime,
          endTime: newEndTime,
          locationContentId: "",
          locationContentTypeId: "",
        });
        sendCreateMessage(chatMessageCreate);
      }
      // 날짜이동 케이스
      else {
        // 기존 이벤트의 지속 시간을 계산
        const duration =
          parseTimeToHour(prevDayEvent.endTime) -
          parseTimeToHour(prevDayEvent.startTime);
        // 기존 이벤트의 지속 시간을 사용하여 새로운 종료 시간을 계산
        newEndTime = calculateNewEndTime(newStartTime, duration * 60);
      }

      // 새로운 시간대에 다른 이벤트가 있는지 확인
      const isOverlap = events.some((event) => {
        const eventStart = parseTimeToHour(event.startTime);
        const eventEnd = parseTimeToHour(event.endTime);
        const newStart = parseTimeToHour(newStartTime);
        const newEnd = parseTimeToHour(newEndTime);

        return (
          (newStart >= eventStart && newStart < eventEnd) ||
          (newEnd > eventStart && newEnd <= eventEnd) ||
          (newStart <= eventStart && newEnd >= eventEnd)
        );
      });

      if (isOverlap) {
        // 겹치는 이벤트가 있으면 아무런 작업도 하지 않음
        console.log("이 시간대에 이미 다른 이벤트가 있습니다.");
        return;
      }

      const newEvent = {
        id: prevDayEvent.id,
        startTime: newStartTime,
        endTime: newEndTime,
        title,
      };
      dispatch(addDayEvent({ day: newDay, newEvent }));
      dispatch(deleteDayEvent({ event: prevDayEvent }));

      // 소켓 메시지 뿌리기 - 추가
      const chatMessageCreate = JSON.stringify({
        scheduleId: currentSchedule.id,
        // eventId: updatedEvent.id,
        dayEventsId: dayEventsId,
        title: newEvent.title,
        description: newEvent.description,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        locationContentId: "",
        locationContentTypeId: "",
      });
      sendCreateMessage(chatMessageCreate);
      // 소켓 메시지 뿌리기 - 삭제
      const chatMessageDel = JSON.stringify({
        scheduleId: currentSchedule.id,
        eventId: prevDayEvent.id,
      });
      sendDeleteMessage(chatMessageDel);
    }
  };

  const handleResize = (e, data, schedule) => {
    // 리사이징 중인 동안 실시간으로 높이만 업데이트합니다.
    const newHeight = Math.round(data.size.height / 15) * 15;
    const top = parseTimeToHour(schedule.startTime) * 60;

    // 리사이징 동안 높이를 로컬 상태로만 업데이트하므로 리덕스 상태 변경 없음
  };

  const handleResizeStop = (e, data, schedule) => {
    // 리사이즈가 끝난 후 종료 시간을 계산하고 상태를 업데이트합니다.
    const newHeight = Math.round(data.size.height / 15) * 15;
    const newEndTime = calculateNewEndTime(schedule.startTime, newHeight);
    const updatedEvent = { ...schedule, endTime: newEndTime }; // 업데이트된 스케줄 생성

    // 리사이즈가 끝난 후 상태 업데이트
    dispatch(updateDayEvent({ day: day, updatedEvent, originDay: day }));
    // 소켓 메시지 뿌리기
    console.log(updatedEvent);
    const chatMessage = JSON.stringify({
      scheduleId: currentSchedule.id,
      eventId: updatedEvent.id,
      dayEventsId: dayEventsId,
      title: updatedEvent.title,
      description: updatedEvent.description,
      startTime: updatedEvent.startTime,
      endTime: updatedEvent.endTime,
      locationContentId: "",
      locationContentTypeId: "",
    });
    console.log(chatMessage);
    sendUpdateMessage(chatMessage);
  };

  // 하루 일정 다 삭제
  const deleteDayEvents = async () => {
    const reqData = {
      title: currentSchedule.title,
      description: currentSchedule.description,
      period: currentSchedule.period - 1,
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

  // 각 이벤트를 시간별로 그룹화하여 메모이제이션
  const eventsByHour = useMemo(() => {
    const groupedEvents = {};
    events.forEach((event) => {
      const scheduleStartHour = Math.floor(parseTimeToHour(event.startTime));
      if (!groupedEvents[scheduleStartHour]) {
        groupedEvents[scheduleStartHour] = [];
      }
      groupedEvents[scheduleStartHour].push(event);
    });
    return groupedEvents;
  }, [events]);

  return (
    <ScheduleContainer>
      <button>
        <IoIosCloseCircleOutline />
      </button>
      {Array.from({ length: 24 }, (_, index) => (
        <HourBlockComponent
          key={`${day}-${index}`}
          hour={index}
          onDrop={handleDrop}
          day={day}
          socketClient={socketClient}
        >
          {eventsByHour[index] &&
            eventsByHour[index].map((event) => {
              const scheduleStart = parseTimeToHour(event.startTime);
              const scheduleEnd = parseTimeToHour(event.endTime);
              const top = (scheduleStart - index) * 60;
              const initialHeight = (scheduleEnd - scheduleStart) * 60;

              return (
                <DraggableScheduleCardComponent
                  key={event.id}
                  schedule={event}
                  height={initialHeight}
                  top={top}
                  currentDay={day}
                  onResize={handleResize}
                  onResizeStop={handleResizeStop}
                  sendDeleteMessage
                >
                  <ScheduleTitle>{event.title}</ScheduleTitle>
                </DraggableScheduleCardComponent>
              );
            })}
        </HourBlockComponent>
      ))}

      <DayScheduleSlide socketClient={socketClient}></DayScheduleSlide>
    </ScheduleContainer>
  );
};

export default DaySchedule;
