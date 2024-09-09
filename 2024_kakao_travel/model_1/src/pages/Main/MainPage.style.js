import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopBox = styled.div`
  width: 100%;
  height: 800px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("https://cdn.pixabay.com/photo/2014/05/05/17/27/jeju-island-338343_1280.jpg");
  background-size: 100% 100%;
`;
const TopTitle = styled.div`
  margin-top: 60px;
  font-size: 80px;
  margin-bottom: 30px;
`;
const TopLoginButton = styled.button`
  width: 400px;
  height: 70px;
  font-size: 20px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-radius: 50px;

  img {
    margin-right: 40px;
  }

  &:hover {
    background-color: #3498db;
    color: white;
    cursor: pointer;
  }
`;
const TopLoginButtonImg = styled.img`
  width: 60px;
  /* height: 40px; */
  margin: 20px;
`;

const MainFeatBox = styled.div`
  margin-top: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  gap: 5%;
`;
const MainFeatItem = styled.div`
  width: 40%;
  height: 200px;
  background-color: #fdf4ea;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  cursor: pointer;
  opacity: 0.7;
  border-radius: 20px;
  &:hover {
    opacity: 1;
    transition: opacity 0.8s ease;
  }
`;

export {
  Container,
  TopBox,
  TopTitle,
  TopLoginButton,
  TopLoginButtonImg,
  MainFeatBox,
  MainFeatItem,
};
