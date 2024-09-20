import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import {
  addDayEvent,
  updateDayEvent,
} from "../../../state/schedules/schedulesSlice"; // 경로를 실제 위치에 맞게 변경하세요
import { ResizableBox } from "react-resizable";
import DayScheduleSlide from "./DayScheduleSlide";

// Styled Components 정의
const ScheduleContainer = styled.div`
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
  background-color: ${({ $isOver }) => ($isOver ? "#777777" : "#cdcdcdb8")};
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
`;

const ScheduleTitle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

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
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [tempHeight, setTempHeight] = useState(height); // 로컬 상태로 임시 높이 관리
  const [{ isDragging }, drag] = useDrag({
    type: "schedule",
    item: {
      title: schedule.title,
      scheduleId: schedule.scheduleId,
      currentDay,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isResizing,
  });

  // 클릭 핸들러 함수
  const handleClick = (e) => {
    if (!isDragging && !isResizing) {
      // 드래그나 리사이즈 중이 아닐 때만 클릭 이벤트 처리
      console.log("클릭");
    }
  };

  return (
    <DraggableScheduleCard
      ref={drag}
      $top={top}
      $height={tempHeight} // 임시 높이로 애니메이션 적용
      $isDragging={isDragging}
      onClick={() => handleClick()}
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
      </ResizableBox>
    </DraggableScheduleCard>
  );
};

// HourBlockComponent
const HourBlockComponent = ({ hour, day, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ["schedule", "searchItem"],
    drop: (item) => {
      const newStartTime = `${hour}:00`;
      onDrop(item.title, newStartTime, day);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <HourBlock ref={drop} $isOver={isOver}>
      <HourText>
        {hour}:00 - {hour + 1}:00
      </HourText>
      {children}
    </HourBlock>
  );
};

// DaySchedule 컴포넌트
const DaySchedule = ({ day }) => {
  const dispatch = useDispatch();
  const schedules = useSelector((state) => state.schedules.schedules);
  const dayData = schedules.find((schedule) => schedule.day == day);
  const events = dayData ? dayData.events : [];

  const handleDrop = (title, newStartTime, newDay) => {
    const existingEvent = events.find((event) => event.title === title);

    if (existingEvent) {
      // 기존 이벤트의 지속 시간을 계산
      const duration =
        parseTimeToHour(existingEvent.endTime) -
        parseTimeToHour(existingEvent.startTime);

      // 기존 이벤트의 지속 시간을 사용하여 새로운 종료 시간을 계산
      const newEndTime = calculateNewEndTime(newStartTime, duration * 60);

      const updatedEvent = {
        ...existingEvent,
        startTime: newStartTime,
        endTime: newEndTime,
      };

      dispatch(updateDayEvent({ day: newDay, updatedEvent, originDay: day }));
    } else {
      // 새로운 이벤트 생성 시 기본 지속 시간을 1시간으로 설정
      const newEndTime = calculateNewEndTime(newStartTime, 60);
      const newEvent = {
        scheduleId: `schedule-${Date.now()}`,
        startTime: newStartTime,
        endTime: newEndTime,
        title,
      };

      dispatch(addDayEvent({ day: newDay, newEvent }));
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
    dispatch(updateDayEvent({ day: day, updatedEvent }));
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
      {Array.from({ length: 24 }, (_, index) => (
        <HourBlockComponent
          key={`${day}-${index}`}
          hour={index}
          onDrop={handleDrop}
          day={day}
        >
          {eventsByHour[index] &&
            eventsByHour[index].map((event) => {
              const scheduleStart = parseTimeToHour(event.startTime);
              const scheduleEnd = parseTimeToHour(event.endTime);
              const top = (scheduleStart - index) * 60;
              const initialHeight = (scheduleEnd - scheduleStart) * 60;

              return (
                <DraggableScheduleCardComponent
                  key={event.scheduleId}
                  schedule={event}
                  height={initialHeight}
                  top={top}
                  currentDay={day}
                  onResize={handleResize}
                  onResizeStop={handleResizeStop}
                >
                  <ScheduleTitle>{event.title}</ScheduleTitle>
                </DraggableScheduleCardComponent>
              );
            })}
        </HourBlockComponent>
      ))}
      <DayScheduleSlide></DayScheduleSlide>
    </ScheduleContainer>
  );
};

export default DaySchedule;
