import React, { useEffect } from "react";
import { authInstance } from "./../../api/axiosInstance";

async function getCrawl() {
  const url =
    "https://cors-anywhere.herokuapp.com/www.smu.ac.kr/kor/life/notice.do";

  const apiRes = await authInstance.get(url);
  console.log(apiRes.data);
}

function NotFoundPage() {
  useEffect(() => {
    getCrawl(); // api call
  }, []);
  return <div>오류페이지입니다</div>;
}

export default NotFoundPage;
