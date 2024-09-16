import React, { useState } from "react";
import { Navbar } from "../../components";
import * as S from "./SchedulePage.style";
import DaySchedule from "./components/DaySchedule";
import SearchBox from "./components/SearchBox";

function SchedulePage() {
  const [schedules, setSchedules] = useState([
    {
      day: "1",
      schedules: [
        {
          scheduleId: "1",
          startTime: "6:00",
          endTime: "9:15",
          title: "Morning Exercise",
        },
        {
          scheduleId: "2",
          startTime: "10:00",
          endTime: "11:00",
          title: "Team Meeting",
        },
      ],
    },
    {
      day: "2",
      schedules: [
        {
          scheduleId: "3",
          startTime: "8:00",
          endTime: "9:00",
          title: "Breakfast",
        },
        {
          scheduleId: "4",
          startTime: "12:00",
          endTime: "13:00",
          title: "Lunch",
        },
      ],
    },
  ]);

  // 스케줄 업데이트 함수
  const handleScheduleUpdate = (updatedSchedule) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((daySchedule) => ({
        ...daySchedule,
        schedules: daySchedule.schedules.map((schedule) =>
          schedule.scheduleId === updatedSchedule.scheduleId
            ? updatedSchedule
            : schedule
        ),
      }))
    );
  };

  return (
    <S.Container>
      <S.MenuBox>
        <SearchBox />
      </S.MenuBox>
      <S.ScheduleBox>
        {schedules.map((daySchedule, idx) => (
          <DaySchedule
            key={daySchedule.day + idx}
            day={daySchedule.day}
            scheduleList={daySchedule.schedules}
            onScheduleUpdate={handleScheduleUpdate}
          />
        ))}
        <button>생성</button>
      </S.ScheduleBox>
    </S.Container>
  );
}

export default SchedulePage;
