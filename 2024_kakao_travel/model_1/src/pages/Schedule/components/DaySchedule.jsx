import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled, { keyframes } from "styled-components";
import { ResizableBox } from "react-resizable";

// 애니메이션 정의
const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

// TimeDisplay 스타일: 트랜지션 애니메이션 적용
const TimeDisplay = styled.div`
  position: fixed;
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left + 20}px`};
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: ${({ visible }) => (visible ? "scale(1)" : "scale(0.8)")};
  z-index: 1000;
  /* pointer-events: none; */
`;

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
  background-color: ${({ $isOver }) => ($isOver ? "#777777" : "#cdcdcdb8")};
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
  width: 70%;
  top: ${({ $top }) => `${$top}px`};
  left: 28%;
  height: ${({ $height }) => `${$height}px`};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: height 0.3s ease;
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
  transition: height 0.05s;
`;

// 리사이즈 핸들 스타일
const StyledResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #cdfffc;
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
  const [draggedTime, setDraggedTime] = useState(null);
  const [mousePosition, setMousePosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  console.log(mousePosition);

  // 드래그 상태와 마우스 위치 추적
  const [{ isDragging }, drag, preview] = useDrag({
    type: "schedule",
    item: { title: schedule.title, startTime: schedule.startTime },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      // clientOffset: monitor.getClientOffset(),
    }),
    canDrag: () => !isResizing,
  });
  // mousemove 이벤트 리스너를 추가하여 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      console.log("mousemove 이벤트 발생:", e.clientX, e.clientY); // 마우스 좌표 출력
      if (isDragging) {
        setMousePosition({ top: e.clientY, left: e.clientX });
        setDraggedTime(calculateDraggedTime(e.clientY, 60)); // HourBlock 높이로 계산
        setVisible(true); // 마우스가 움직이면 TimeDisplay 표시
      }
    };

    if (isDragging) {
      console.log("mousemove 이벤트 리스너 등록"); // 이벤트 리스너 등록 로그
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      console.log("mousemove 이벤트 리스너 해제"); // 이벤트 리스너 해제 로그
      setVisible(false); // 드래그가 끝나면 TimeDisplay 숨김
    }

    // Cleanup
    return () => {
      console.log("mousemove 이벤트 리스너 정리 (cleanup)"); // 이벤트 리스너 해제 로그
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  const handleResizeStart = () => setIsResizing(true);

  const handleResizeStop = (e, data) => {
    setIsResizing(false);
    onResizeStop(e, data); // 리사이즈 끝난 후 스케줄 업데이트
  };

  return (
    <>
      <DraggableScheduleCard
        ref={drag}
        $top={top}
        $height={height}
        $isDragging={isDragging}
      >
        <ResizableCard
          height={height}
          onResizeStart={handleResizeStart}
          onResize={onResize}
          onResizeStop={handleResizeStop}
          handle={<StyledResizeHandle />}
        >
          {children}
        </ResizableCard>
      </DraggableScheduleCard>
      {draggedTime && (
        <TimeDisplay
          top={mousePosition.top}
          left={mousePosition.left}
          visible={visible}
        >
          {draggedTime}
        </TimeDisplay>
      )}
    </>
  );
};

// HourBlockComponent
const HourBlockComponent = ({ hour, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "schedule",
    drop: (item, monitor) => {
      const newStartTime = `${hour}:00`;
      onDrop(item.title, newStartTime); // 스케줄 title과 새 시간 전달
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
          onDrop={handleDrop}
        >
          {renderScheduleForHour(hour, scheduleList, onScheduleUpdate)}
        </HourBlockComponent>
      ))}
    </ScheduleContainer>
  );
};

// 렌더링 함수
const renderScheduleForHour = (hour, scheduleList, onScheduleUpdate) => {
  return scheduleList.map((schedule) => {
    const scheduleStart = parseTimeToHour(schedule.startTime);
    const scheduleEnd = parseTimeToHour(schedule.endTime);

    if (scheduleStart >= hour && scheduleStart < hour + 1) {
      const top = (scheduleStart - hour) * 60;
      const initialHeight = (scheduleEnd - scheduleStart) * 60;

      return (
        <DraggableScheduleCardComponent
          key={schedule.scheduleId}
          schedule={schedule}
          height={initialHeight}
          top={top}
          onResize={(e, data) =>
            handleResize(e, data, schedule, onScheduleUpdate)
          }
          onResizeStop={(e, data) =>
            handleResizeStop(e, data, schedule, onScheduleUpdate)
          }
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
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const calculateDraggedTime = (top, blockHeight) => {
  const hour = Math.floor(top / blockHeight);
  const minutes = Math.round(((top % blockHeight) / blockHeight) * 60);
  return `${hour}:${minutes < 10 ? "0" : ""}${minutes}`;
};

const handleResize = (e, data, schedule, onScheduleUpdate) => {
  const newHeight = Math.round(data.size.height / 15) * 15;
  const newEndTime = calculateNewEndTime(schedule.startTime, newHeight);
  const updatedSchedule = { ...schedule, endTime: newEndTime };
  onScheduleUpdate(updatedSchedule);
};

const calculateNewEndTime = (startTime, newHeight) => {
  const minutesAdded = newHeight;
  const [startHour, startMinutes] = startTime.split(":").map(Number);
  const totalMinutes = startHour * 60 + startMinutes + minutesAdded;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHour}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;
};

export default DaySchedule;
