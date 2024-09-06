import React from "react";
import * as S from "./MyPage.style";

function MyPage() {
  return (
    <S.Container>
      <S.TopBox></S.TopBox>
      <S.MainBox>
        <S.MainUpBox></S.MainUpBox>
        <S.MainDownBox></S.MainDownBox>
      </S.MainBox>
    </S.Container>
  );
}

export default MyPage;
