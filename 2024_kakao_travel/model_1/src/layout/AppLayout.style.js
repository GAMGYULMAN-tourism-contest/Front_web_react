import styled from "styled-components";

const AppContainer = styled.div`
  width: calc(100vw);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OutletWrapper = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff5d3;
`;

export { AppContainer, OutletWrapper };
