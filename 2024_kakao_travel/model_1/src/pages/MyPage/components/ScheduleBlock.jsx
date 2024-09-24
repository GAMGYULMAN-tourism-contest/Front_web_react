import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import {
  getSchedules,
  setSchedules,
  setCurrentSchedule,
  setMakeModalOpen,
} from "../../../state/schedules/schedulesSlice";
import { useDispatch } from "react-redux";
import { authInstance } from "../../../api/axiosInstance";

const Container = styled.div`
  width: 43%;
  height: 50%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 10px;
  gap: 5px;
  background-color: #ffd556;

  &:hover {
    background-color: #ffce5a;
    cursor: pointer;
    transform: scale(1.05);
  }

  span {
    font-weight: bold;
    color: #565656;
  }
`;

function ScheduleBlock({ id, title, description, period, startDate, endDate }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(id, title, description, period, startDate, endDate);
  return (
    <Container
      onClick={() => {
        dispatch(getSchedules(id));
        async function getScheduleById() {
          const res = await authInstance.get("/schedules/" + id);
          // console.log(res.data.result);
          dispatch(setCurrentSchedule(res.data.result));
          dispatch(setSchedules(res.data.result.dayEvents));
          dispatch(setMakeModalOpen(false));
          navigate("/schedule/" + id);
        }
        getScheduleById();
      }}
    >
      <p>
        <span>name</span> : {title}
      </p>
      <p>{description}</p>
      <p>
        <span>period</span> : {startDate} ~ {endDate}
      </p>
    </Container>
  );
}

export default ScheduleBlock;
