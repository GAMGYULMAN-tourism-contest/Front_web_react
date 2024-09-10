import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { defaultInstance, authInstance } from "../../api/axiosInstance";

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

  return <div>로그인 페이지입니다</div>;
}

export default LoginPage;
