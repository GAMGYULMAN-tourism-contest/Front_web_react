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
  position: relative;
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

  button {
    position: absolute;
    top: 0px;
    right: 10px;
    width: 30px;
    height: 30px;
    background-color: #ff6666;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #45a049;
    }
    margin-top: 10px;
    z-index: 10;
  }
`;

function ScheduleBlock({
  id,
  title,
  description,
  period,
  startDate,
  endDate,
  role,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(id, title, description, period, startDate, endDate, role);

  async function deleteSchedule() {
    const apiRes = await authInstance.delete("/schedules/" + id);
    dispatch(setSchedules({}));
  }

  return (
    <Container
      onClick={() => {
        dispatch(getSchedules(id));
        async function getScheduleById() {
          const res = await authInstance.get("/schedules/" + id);
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
      {role === "OWNER" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteSchedule();
          }}
        >
          x
        </button>
      )}
    </Container>
  );
}

export default ScheduleBlock;
