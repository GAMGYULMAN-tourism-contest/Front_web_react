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
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("https://cdn.pixabay.com/photo/2014/05/05/17/27/jeju-island-338343_1280.jpg");
  background-size: 100% 100%;
`;
const TopTitle = styled.div`
  margin-top: 85px;
  /* font-size: 90px; */
  font-size: 12vh;
  margin-bottom: 90px;
`;
const TopLoginButton = styled.button`
  width: 30vw;
  height: 9vh;
  /* font-size: 20px; */
  font-size: 1.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;

  img {
    /* margin-right: 40px; */
    position: relative;
    left: -2vw;
  }

  span {
    position: relative;
    left: -1vw;
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
  margin-top: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw;
  gap: 5%;
`;
const MainFeatItem = styled.div`
  width: 40%;
  height: 25vh;
  /* background-color: #fdf4ea;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  /* font-size: 30px; */
  font-size: 4vh;
  cursor: pointer;
  /* opacity: 0.8;
  border-radius: 20px; */
  /* &:hover {
    opacity: 1;
    scale: 1.02;
    transition: opacity 0.8s ease;
  } */
  /* box-shadow: 14px 15px 25px 0px rgba(252, 197, 114, 1); */
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
