import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";

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
  console.log(id, title, description, period, startDate, endDate);
  return (
    <Container
      onClick={() => {
        navigate("/schedule/" + id);
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
