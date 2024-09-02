import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import styled from "styled-components";

const ScheduleContainer = styled.div`
  width: 40%;
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
`;

const HourBlock = styled.div`
  width: 300px;
  border: 1px solid #ccc;
  position: relative;
  height: 60px;
  background-color: paleturquoise;

  p {
    z-index: 2;
  }
`;

const ScheduleCard = styled(ResizableBox)`
  background-color: #ffcc78;
  color: white;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 1;
`;

const DaySchedule = ({ scheduleList, onScheduleUpdate }) => {
  const hours = Array.from({ length: 24 }, (_, index) => index); // 0 ~ 23

  return (
    <ScheduleContainer>
      {hours.map((hour) => (
        <HourBlock key={hour}>
          <p>
            {hour}:00 - {hour + 1}:00
          </p>
          {renderScheduleForHour(hour, scheduleList, onScheduleUpdate)}
        </HourBlock>
      ))}
    </ScheduleContainer>
  );
};

const renderScheduleForHour = (hour, scheduleList, onScheduleUpdate) => {
  return scheduleList.map((schedule, index) => {
    const scheduleStart = parseTimeToHour(schedule.startTime);
    const scheduleEnd = parseTimeToHour(schedule.endTime);

    if (scheduleStart >= hour && scheduleStart < hour + 1) {
      const top = (scheduleStart - hour) * 60; // 시작 위치
      const initialHeight = (scheduleEnd - scheduleStart) * 60; // 높이 (길이)

      return (
        <ScheduleCard
          key={index}
          width={Infinity}
          height={initialHeight}
          minConstraints={[Infinity, 15]} // 최소 높이 15분
          maxConstraints={[Infinity, Infinity]} // 최대 높이
          axis="y"
          onResizeStop={(e, data) =>
            handleResizeStop(e, data, schedule, onScheduleUpdate)
          }
        >
          <div
            style={{
              top: `${top}px`,
              position: "absolute",
              left: 0,
              right: 0,
            }}
          >
            {schedule.title}
          </div>
        </ScheduleCard>
      );
    }
    return null;
  });
};

const parseTimeToHour = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const handleResizeStop = (e, data, schedule, onScheduleUpdate) => {
  // 새로운 높이를 15분 단위로 스냅
  const snappedHeight = Math.round(data.size.height / 5) * 5;
  const newEndTime = calculateNewEndTime(schedule.startTime, snappedHeight);
  const updatedSchedule = {
    ...schedule,
    endTime: newEndTime,
  };
  onScheduleUpdate(updatedSchedule);
};

const calculateNewEndTime = (startTime, newHeight) => {
  const hoursAdded = newHeight / 60;
  const [startHour, startMinutes] = startTime.split(":").map(Number);
  const totalMinutes = startHour * 60 + startMinutes + hoursAdded * 60;
  const endHour = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHour}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;
};

export default DaySchedule;
