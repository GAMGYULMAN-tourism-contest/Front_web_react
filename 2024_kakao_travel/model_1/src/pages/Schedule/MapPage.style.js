import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
`;
const SearchBox = styled.div`
  width: 30%;
`;
const MapBox = styled.div`
  width: 70%;
`;

const FloatingButton = styled.button`
  width: 80px;
  height: 80px;
  position: fixed;
  bottom: 20px;
  right: 40px;
  color: white;
  padding: 20px 20px;
  border: none;
  cursor: pointer;
  z-index: 20;
  border-radius: 50%;
  font-size: 38px;
  background-color: #ffbd49;
`;

export { Container, SearchBox, MapBox, FloatingButton };
