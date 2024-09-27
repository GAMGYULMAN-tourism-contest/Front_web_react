import React from "react";
import * as S from "./MainPage.style";
import Google from "../../assets/google.png";
import { useNavigate } from "react-router-dom";
import { setSchedules } from "../../state/schedules/schedulesSlice";
import { useDispatch } from "react-redux";
import { setMakeModalOpen } from "../../state/schedules/schedulesSlice";
import { DefaultButton } from "../../components";

function MainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <S.Container>
      <S.TopBox>
        <S.TopTitle>YOUR'S JEJU</S.TopTitle>
        <S.TopLoginButton
          onClick={() => {
            console.log("routing");
            const url = "http://3.35.101.171/oauth2/authorization/google";
            window.location.href = url;
          }}
        >
          <S.TopLoginButtonImg src={Google} alt="Google" />
          <span>Continue with Google</span>
        </S.TopLoginButton>
        <S.MainFeatBox>
          <S.MainFeatItem
            onClick={() => {
              dispatch(setSchedules([]));
              dispatch(setMakeModalOpen(true));
              navigate("/schedule/1");
            }}
          >
            <DefaultButton inText="make new schedule"></DefaultButton>
          </S.MainFeatItem>
          <S.MainFeatItem onClick={() => navigate("/mypage")}>
            <DefaultButton inText="view my schedules"></DefaultButton>
          </S.MainFeatItem>
        </S.MainFeatBox>
      </S.TopBox>
    </S.Container>
  );
}

export default MainPage;
