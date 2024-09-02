import styled from "styled-components";

const AppContainer = styled.div`
  width: calc(100vw - 17px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OutletWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffcc99;
`;

export { AppContainer, OutletWrapper };
