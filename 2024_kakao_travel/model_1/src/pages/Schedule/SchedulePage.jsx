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

function SchedulePage() {
  const navigate = useNavigate();
  const data = useSelector((state) => state.schedules.schedules);
  console.log(data);

  const dispatch = useDispatch();

  const handleSaveClick = () => {
    //TODO: 스케줄 수정 api, reqData 중 dayEvents만 = schedules.schedules로 바꿔서 실행
  };

  useEffect(() => {
    dispatch(getSearchItems({ page: 1, size: 10 }));
  }, []);
  return (
    <S.Container>
      <MakeModal></MakeModal>
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
        <S.FloatingSave onClick={() => handleSaveClick()}>
          <IoIosSave />
        </S.FloatingSave>
      </S.ScheduleBox>
    </S.Container>
  );
}

export default SchedulePage;
