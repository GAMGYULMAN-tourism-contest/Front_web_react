import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const MenuBox = styled.div`
  width: 30%;
  overflow-y: auto;
`;
const ScheduleBox = styled.div`
  width: 70%;
  height: 90vh;
  overflow-x: auto;
  display: flex;
`;

export { Container, MenuBox, ScheduleBox };
