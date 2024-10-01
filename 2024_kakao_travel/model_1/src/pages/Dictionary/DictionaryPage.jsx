import React from "react";
import * as S from "./DictionaryPage.style";
import { useNavigate } from "react-router";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { GiMeal } from "react-icons/gi";

function DictionaryPage() {
  const navigate = useNavigate();
  return (
    <S.Container>
      <h1>Useful communication expressions in Korea</h1>
      <S.ButtonContainer>
        <S.Button onClick={() => navigate("/dictionary/greeting")}>
          <span>
            <FaHandshakeSimple />
          </span>
          Greetings and apologies
        </S.Button>
        {/* <S.Button onClick={() => navigate("/dictionary/question")}>
          <span>
            <FaQuestion />
          </span>
          Questions
        </S.Button> */}
        <S.Button onClick={() => navigate("/dictionary/meal")}>
          <span>
            <GiMeal />
          </span>
          Meal
        </S.Button>
        <S.Button onClick={() => navigate("/dictionary/shopping")}>
          <span>
            <MdOutlineShoppingCart />
          </span>
          Shopping
        </S.Button>
      </S.ButtonContainer>
    </S.Container>
  );
}

export default DictionaryPage;
