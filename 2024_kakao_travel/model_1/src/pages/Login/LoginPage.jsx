import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { defaultInstance, authInstance } from "../../api/axiosInstance";
import styled from "styled-components";
import Spinner from "./../../components/Spinner";

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

function LoginPage() {
  let params = new URL(window.location.href).searchParams;
  let code = params.get("code");
  const navigate = useNavigate();
  // console.log(code);

  if (code) {
    localStorage.removeItem("accessToken");
    const login = async () => {
      try {
        const response = await defaultInstance.post("/oauth2/callback/google", {
          code: code,
        });
        console.log(response.data);
        localStorage.setItem("accessToken", response.data.result.accessToken);
        console.log(localStorage.getItem("accessToken"));
        navigate("/", { replace: true });
      } catch (error) {
        console.error(error);
      }
    };
    login();
  }

  return (
    <Container>
      <TopBox>
        <Spinner />
      </TopBox>
    </Container>
  );
}

export default LoginPage;
