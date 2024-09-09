import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { ResizableBox } from "react-resizable";

// Schedule 컨테이너 스타일
const ScheduleContainer = styled.div`
  width: 40%;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
`;

// HourBlock 스타일
const HourBlock = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  position: relative;
  height: 60px;
  background-color: ${({ $isOver }) =>
    $isOver ? "lightblue" : "paleturquoise"};
`;

// Hour 텍스트 스타일
const HourText = styled.p`
  margin: 0;
  padding: 0;
  width: 30%;
`;

// DraggableScheduleCard 스타일
const DraggableScheduleCard = styled.div`
  background-color: ${({ $isDragging }) =>
    $isDragging ? "lightgreen" : "#ffcc78"};
  color: white;
  border-radius: 4px;
  position: absolute;
  box-sizing: border-box;
  z-index: 1;
  cursor: move;
  width: 68%;
  top: ${({ $top }) => `${$top}px`};
  left: 30%;
  height: ${({ $height }) => `${$height}px`};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: height 0.3s ease; // 실시간 애니메이션 적용
`;

// ResizableCard 스타일
const ResizableCard = styled(ResizableBox)`
  width: 100%;
  height: 100%;
  background-color: #ffcc78;
  color: white;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 1;
  transition: height 0.05s; /* 애니메이션 추가 */
`;

// 리사이즈 핸들 스타일
const StyledResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: blue;
  bottom: 0;
  right: 0;
  cursor: se-resize;
`;

// 스케줄 타이틀 스타일
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

// DraggableScheduleCardComponent
const DraggableScheduleCardComponent = ({
  schedule,
  onResizeStop,
  onResize,
  height,
  top,
  children,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    type: "schedule",
    item: { title: schedule.title, startTime: schedule.startTime },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isResizing,
  });

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = (e, data) => {
    setIsResizing(false);
    onResizeStop(e, data); // 리사이즈 끝난 후 스케줄 업데이트
  };

  return (
    <DraggableScheduleCard
      ref={drag}
      $top={top}
      $height={height}
      $isDragging={isDragging}
    >
      <ResizableCard
        height={height}
        onResizeStart={handleResizeStart}
        onResize={onResize} // 실시간 리사이즈
        onResizeStop={handleResizeStop} // 리사이즈 완료 시
        handle={<StyledResizeHandle />}
      >
        {children}
      </ResizableCard>
    </DraggableScheduleCard>
  );
};

// HourBlockComponent
const HourBlockComponent = ({ hour, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "schedule",
    drop: (item, monitor) => {
      const newStartTime = `${hour}:00`; // 드랍된 시간 블록의 시간 계산
      onDrop(item.title, newStartTime); // 스케줄 title와 새 시간 전달
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

// DaySchedule
const DaySchedule = ({ day, scheduleList = [], onScheduleUpdate }) => {
  const hours = Array.from({ length: 24 }, (_, index) => index); // 0 ~ 23

  const handleDrop = (title, newStartTime) => {
    const schedule = scheduleList.find((s) => s.title === title);
    if (schedule) {
      const duration =
        parseTimeToHour(schedule.endTime) - parseTimeToHour(schedule.startTime);
      const [newHour, newMinutes] = newStartTime.split(":").map(Number);
      const newEndHour = newHour + duration;
      const newEndTime = `${newEndHour}:${
        newMinutes < 10 ? "0" : ""
      }${newMinutes}`;

      const updatedSchedule = {
        ...schedule,
        startTime: newStartTime,
        endTime: newEndTime,
      };

      onScheduleUpdate(updatedSchedule);
    }
  };

  return (
    <ScheduleContainer>
      {hours.map((hour) => (
        <HourBlockComponent
          key={`${day}-${hour}`}
          hour={hour}
          onDrop={(title, newStartTime) => handleDrop(title, newStartTime)} // onDrop 콜백 전달
        >
          {renderScheduleForHour(hour, scheduleList, onScheduleUpdate)}
        </HourBlockComponent>
      ))}
    </ScheduleContainer>
  );
};

// 렌더링
const renderScheduleForHour = (hour, scheduleList, onScheduleUpdate) => {
  return scheduleList.map((schedule) => {
    const scheduleStart = parseTimeToHour(schedule.startTime);
    const scheduleEnd = parseTimeToHour(schedule.endTime);

    if (scheduleStart >= hour && scheduleStart < hour + 1) {
      const top = (scheduleStart - hour) * 60;
      const initialHeight = (scheduleEnd - scheduleStart) * 60;

      return (
        <DraggableScheduleCardComponent
          key={schedule.scheduleId} // 고유한 키로 schedule.title 사용
          schedule={schedule}
          height={initialHeight}
          top={top}
          onResize={(e, data) =>
            handleResize(e, data, schedule, onScheduleUpdate)
          } // 리사이즈 중 실시간 업데이트
          onResizeStop={(e, data) =>
            handleResizeStop(e, data, schedule, onScheduleUpdate)
          } // 리사이즈 완료 후 업데이트
        >
          <ScheduleTitle>{schedule.title}</ScheduleTitle>
        </DraggableScheduleCardComponent>
      );
    }
    return null;
  });
};

// 유틸리티 함수
const parseTimeToHour = (time) => {
  if (!time) return 0; // time 값이 없을 경우 기본값으로 0을 반환
  const [hours, minutes] = time.split(":").map(Number);

  // hours 또는 minutes가 NaN인 경우 기본값 0을 반환
  if (isNaN(hours) || isNaN(minutes)) return 0;

  return hours + minutes / 60;
};

// handleResizeStop에서 onScheduleUpdate가 스케줄을 제대로 업데이트하도록 로직 유지
const handleResizeStop = (e, data, schedule, onScheduleUpdate) => {
  const snappedHeight = Math.round(data.size.height / 15) * 15;
  const newEndTime = calculateNewEndTime(schedule.startTime, snappedHeight);
  const updatedSchedule = {
    ...schedule,
    endTime: newEndTime,
  };
  onScheduleUpdate(updatedSchedule);
};

// handleResize 중 실시간 업데이트
const handleResize = (e, data, schedule, onScheduleUpdate) => {
  const currentHeight = Math.round(data.size.height / 15) * 15;
  const newEndTime = calculateNewEndTime(schedule.startTime, currentHeight);
  const updatedSchedule = {
    ...schedule,
    endTime: newEndTime,
  };
  onScheduleUpdate(updatedSchedule);
};

// calculateNewEndTime에서 리사이즈된 높이에 맞게 종료 시간을 다시 계산
const calculateNewEndTime = (startTime, newHeight) => {
  const minutesAdded = newHeight; // 높이에 따라 추가된 분 계산
  const [startHour, startMinutes] = startTime.split(":").map(Number);
  const totalMinutes = startHour * 60 + startMinutes + minutesAdded;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHour}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;
};

export default DaySchedule;
