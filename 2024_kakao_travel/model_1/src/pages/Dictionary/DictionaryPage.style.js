import styled from "styled-components";

export const Container = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding: 2rem;
  overflow-y: auto;
`;

export const ButtonContainer = styled.div`
  width: 80%;
  display: flex;
  /* justify-content: space-around; */
  flex-wrap: wrap;
  margin-top: 2rem;
`;

export const Button = styled.button`
  width: 280px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background-color: #f5f5f5;
  border: 2px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  margin: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;

  span {
    margin-right: 10px;
    font-size: 2rem;
  }

  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }
`;
