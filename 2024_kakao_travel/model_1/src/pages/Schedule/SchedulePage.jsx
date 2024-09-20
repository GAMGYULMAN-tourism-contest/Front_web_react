import React, { useEffect, useState } from "react";
import { Navbar } from "../../components";
import * as S from "./SchedulePage.style";
import DaySchedule from "./components/DaySchedule";
import SearchBox from "./components/SearchBox";
import { useNavigate } from "react-router";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getSearchItems } from "../../state/searches/searchesSlice";

function SchedulePage() {
  const navigate = useNavigate();
  // const [schedules, setSchedules] = useState([
  //   {
  //     day: "1",
  //     schedules: [
  //       {
  //         scheduleId: "1",
  //         startTime: "6:00",
  //         endTime: "9:15",
  //         title: "Morning Exercise",
  //       },
  //       {
  //         scheduleId: "2",
  //         startTime: "10:00",
  //         endTime: "11:00",
  //         title: "Team Meeting",
  //       },
  //     ],
  //   },
  //   {
  //     day: "2",
  //     schedules: [
  //       {
  //         scheduleId: "3",
  //         startTime: "8:00",
  //         endTime: "9:00",
  //         title: "Breakfast",
  //       },
  //       {
  //         scheduleId: "4",
  //         startTime: "12:00",
  //         endTime: "13:00",
  //         title: "Lunch",
  //       },
  //     ],
  //   },
  // ]);

  // 스케줄 업데이트 함수
  // const handleScheduleUpdate = (updatedSchedule) => {
  //   setSchedules((prevSchedules) =>
  //     prevSchedules.map((daySchedule) => ({
  //       ...daySchedule,
  //       schedules: daySchedule.schedules.map((schedule) =>
  //         schedule.scheduleId === updatedSchedule.scheduleId
  //           ? updatedSchedule
  //           : schedule
  //       ),
  //     }))
  //   );
  // };

  // console.log(schedules);
  const data = useSelector((state) => state.schedules.schedules);
  console.log(data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSearchItems({ page: 1, size: 10 }));
  }, []);
  return (
    <S.Container>
      <S.MenuBox>
        <SearchBox />
      </S.MenuBox>
      <S.ScheduleBox>
        {data.map((dayEvents, idx) => (
          <DaySchedule
            key={dayEvents.day + idx}
            day={dayEvents.day}
            // scheduleList={dayEvents.schedules}
            // onScheduleUpdate={handleScheduleUpdate}
          />
        ))}
        <S.FloatingButton onClick={() => navigate("/map/1")}>
          <FaMapMarkerAlt />
        </S.FloatingButton>
      </S.ScheduleBox>
    </S.Container>
  );
}

export default SchedulePage;
