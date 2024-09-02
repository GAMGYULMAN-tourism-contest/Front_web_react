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
          startTime: "6:00",
          endTime: "9:15",
          title: "Morning Exercise",
        },
        {
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
          startTime: "8:00",
          endTime: "9:00",
          title: "Breakfast",
        },
        {
          startTime: "12:00",
          endTime: "13:00",
          title: "Lunch",
        },
      ],
    },
    {
      day: "3",
      schedules: [
        {
          startTime: "8:00",
          endTime: "9:00",
          title: "Breakfast",
        },
        {
          startTime: "12:00",
          endTime: "13:00",
          title: "Lunch",
        },
      ],
    },
    {
      day: "4",
      schedules: [
        {
          startTime: "8:00",
          endTime: "9:00",
          title: "Breakfast",
        },
        {
          startTime: "12:00",
          endTime: "13:00",
          title: "Lunch",
        },
      ],
    },
    // 추가적인 일정 데이터를 여기에 넣을 수 있습니다.
  ]);
  console.log(schedules);

  const handleScheduleUpdate = (updatedSchedule) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
  };

  return (
    <S.Container>
      <S.MenuBox>
        <SearchBox />
      </S.MenuBox>
      <S.ScheduleBox>
        {schedules.map((daySchedule) => (
          <DaySchedule
            key={daySchedule.day}
            scheduleList={daySchedule.schedules}
            onScheduleUpdate={handleScheduleUpdate}
          />
        ))}
      </S.ScheduleBox>
    </S.Container>
  );
}

export default SchedulePage;
