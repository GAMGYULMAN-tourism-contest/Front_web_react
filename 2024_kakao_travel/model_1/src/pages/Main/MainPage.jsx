import React, { useState, useEffect } from "react";
import * as S from "./MainPage.style";
import Google from "../../assets/google.png";
import { useNavigate } from "react-router-dom";
import { setSchedules } from "../../state/schedules/schedulesSlice";
import { useDispatch, useSelector } from "react-redux";
import { setMakeModalOpen } from "../../state/schedules/schedulesSlice";
import { DefaultButton } from "../../components";
import { authInstance } from "../../api/axiosInstance";
import { setUser } from "../../state/socket/socketSlice";

function MainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { user } = useSelector((state) => state.socket || {}); // user가 없는 경우에도 안전하게 빈 객체를 반환
  useEffect(() => {
    async function getMember() {
      const resApi = await authInstance.get("/members");
      dispatch(setUser(resApi.data.result));
    }
    if (localStorage.getItem("accessToken")) {
      getMember();
    }
  }, []);
  return (
    <S.Container>
      <S.TopBox>
        <S.TopTitle>YOUR'S JEJU</S.TopTitle>
        {!localStorage.getItem("accessToken") && (
          <S.TopLoginButton
            onClick={() => {
              const url = "http://3.35.101.171/oauth2/authorization/google";
              window.location.href = url;
            }}
          >
            <S.TopLoginButtonImg src={Google} alt="Google" />
            <span>Continue with Google</span>
          </S.TopLoginButton>
        )}
        {/* {localStorage.getItem("accessToken") && user && (
          <S.TopBoxWelcome>WELCOME {user.email}!</S.TopBoxWelcome>
        )} */}
        <S.MainFeatBox>
          <S.MainFeatItem
            onClick={() => {
              if (!localStorage.getItem("accessToken")) {
                alert("google login please!");
                const url = "http://3.35.101.171/oauth2/authorization/google";
                window.location.href = url;
              }
              dispatch(setSchedules([]));
              dispatch(setMakeModalOpen(true));
              navigate("/schedule/1");
            }}
          >
            <DefaultButton inText="make new schedule"></DefaultButton>
          </S.MainFeatItem>
          <S.MainFeatItem
            onClick={() => {
              if (!localStorage.getItem("accessToken")) {
                alert("google login please!");
                const url = "http://3.35.101.171/oauth2/authorization/google";
                window.location.href = url;
              }
              navigate("/mypage");
            }}
          >
            <DefaultButton inText="view my schedules"></DefaultButton>
          </S.MainFeatItem>
        </S.MainFeatBox>
      </S.TopBox>
    </S.Container>
  );
}

export default MainPage;
