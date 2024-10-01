import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";

// 스타일링
const Container = styled.div`
  width: 90%;
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 90%;
  height: 22vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeaderImage = styled.img`
  width: 40%;
  height: 100%;
  border-radius: 10px;
`;

const HeaderText = styled.div`
  width: 50%;
  font-size: 1.2rem;
  color: #333;
`;

const CategoryNav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #8ae0d4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #ddd;
  }
`;

const PhraseList = styled.div`
  width: 100%;
  height: 50vh; /* 높이 고정 및 스크롤 가능 */
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto; /* 세로 스크롤 가능하게 설정 */
  gap: 1rem; /* 스크롤바로 인해 너비가 줄어드는 것을 방지 */
`;

const PhraseItem = styled.div`
  width: 45%;
  height: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  font-size: 1.5rem;
  color: #007bff;
`;

const PhraseItemTopBox = styled.div`
  display: flex;
  gap: 20px;
`;

const PhraseText = styled.div`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const MeaningText = styled.div`
  font-size: 1rem;
  color: #666;
`;

const AudioContainer = styled.div`
  display: flex;
  /* align-items: center; */
  justify-content: flex-end;

  button {
    position: relative;
    top: -6px;
  }
`;

const AudioButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }
`;

const AudioElement = styled.audio`
  width: 100px; /* 오디오 플레이어 너비 */
`;

// 데이터셋 (각 표현의 영어 뜻 포함)
const dataSet = [
  {
    type: "greeting",
    header:
      "In this guide, you can find several sentences that can be useful in any situation.",
    headerImg: "/dictionary_img/greeting.webp",
    phrases: [
      {
        text: "안녕하세요",
        pronounce: "annyeonghaseyo",
        meaning: "Hello",
        mp3: "/audio/pronunciation_ko_안녕하세요.mp3",
      },
      { text: "실례합니다", pronounce: "sillyehamnida", meaning: "Excuse me" },
      { text: "감사합니다", pronounce: "gamsahamnida", meaning: "Thank you" },
      {
        text: "반갑습니다",
        pronounce: "bangapseumnida",
        meaning: "Nice to meet you",
      },
      {
        text: "안녕히 가세요",
        pronounce: "annyeonghi gaseyo",
        meaning: "Goodbye",
      },
      {
        text: "또 뵙겠습니다",
        pronounce: "tto boepgetseumnida",
        meaning: "See you again",
      },
      { text: "죄송합니다", pronounce: "joesonghamnida", meaning: "I'm sorry" },
      {
        text: "아주 감사드립니다",
        pronounce: "aju gamsadeurimnida",
        meaning: "Thank you very much",
      },
    ],
  },
  {
    type: "shopping",
    header:
      "Many people spend a lot of time shopping for souvenirs while on vacation. Knowing the basics will help you a lot. Here are some phrases you need for shopping.",
    headerImg: "/dictionary_img/shopping.webp",
    phrases: [
      {
        text: "이거 얼마예요?",
        pronounce: "igeo eolma-eyo?",
        meaning: "How much is this?",
      },
      {
        text: "이거 입어 봐도 되요?",
        pronounce: "igeo ibeo bwado doeyo?",
        meaning: "Can I try this on?",
      },
      {
        text: "카드로 계산할 수 있어요?",
        pronounce: "kadeuro gyesanhal su isseoyo?",
        meaning: "Can I pay by card?",
      },
      {
        text: "저한테 맞는 사이즈 좀 찾아 주시겠어요?",
        pronounce: "jeohante manneun saijeu jom chaja jusigetseoyo?",
        meaning: "Can you help me find my size?",
      },
      {
        text: "부과세 있나요?",
        pronounce: "bugwase issnayo?",
        meaning: "Is there tax included?",
      },
      {
        text: "이 물건에 대해 물어보고 싶은 게 있어요",
        pronounce: "i mulgeone daehae mureobogo sipeun ge isseoyo",
        meaning: "I have a question about this item.",
      },
      {
        text: "영수증 주세요",
        pronounce: "yeongsujeung juseyo",
        meaning: "Can I have a receipt?",
      },
      {
        text: "영수증 가지고 있어요",
        pronounce: "yeongsujeung gajigo isseoyo",
        meaning: "I have the receipt.",
      },
      {
        text: "가격이 틀렸어요",
        pronounce: "gagyeogi teullyeosseoyo",
        meaning: "The price is wrong.",
      },
      {
        text: "이거 세일하나요?",
        pronounce: "igeo seilhannayo?",
        meaning: "Is this on sale?",
      },
      {
        text: "...는(은) 어디서 찾을 수 있나요?",
        pronounce: "...neun(eun) eodiseo chajeul su innayo?",
        meaning: "Where can I find ...?",
      },
    ],
  },
  {
    type: "meal",
    header:
      "Ordering food or drinks in an unfamiliar language can be a challenge. This guide will help you navigate cafes, bars and restaurants more easily.",
    headerImg: "/dictionary_img/meal.webp",
    phrases: [
      {
        text: "마지막 주문 시간이 언제인가요?",
        pronounce: "majimak jumun sigani eonjengayo?",
        meaning: "What time is the last order?",
      },
      {
        text: "예약할 수 있을까요?",
        pronounce: "yeyakhal su isseulkkayo?",
        meaning: "Can I make a reservation?",
      },
      {
        text: "메뉴 좀 주시겠어요?",
        pronounce: "menyu jom jusigetseoyo?",
        meaning: "Can I have the menu?",
      },
      {
        text: "마스터카드로 계산해도 되나요?",
        pronounce: "maseuteokadeuro gyesanhaedo doenayo?",
        meaning: "Can I pay with a Mastercard?",
      },
      {
        text: "이 음식에 글루텐 들어 있나요?",
        pronounce: "i eumsige geulluten deureo innayo?",
        meaning: "Does this dish contain gluten?",
      },
      {
        text: "예약했어요.",
        pronounce: "yeyakhaesseoyo",
        meaning: "I made a reservation.",
      },
      {
        text: "카드로 계산해도 되나요?",
        pronounce: "kadeuro gyesanhaedo doenayo?",
        meaning: "Can I pay by card?",
      },
      {
        text: "저는 땅콩 알레르기가 있어요.",
        pronounce: "jeoneun ttangkong allelergiga isseoyo",
        meaning: "I have a peanut allergy.",
      },
      {
        text: "수저 좀 주시겠어요?",
        pronounce: "sujeo jom jusigetseoyo?",
        meaning: "Could I have a spoon?",
      },
      {
        text: "어린이 메뉴 있나요?",
        pronounce: "eorini menyu innayo?",
        meaning: "Do you have a kids' menu?",
      },
      {
        text: "디저트는 뭐가 있나요?",
        pronounce: "dijeoteuneun mwoga innayo?",
        meaning: "What desserts do you have?",
      },
      {
        text: "화장실은 어디에 있나요?",
        pronounce: "hwajangsireun eodie innayo?",
        meaning: "Where is the restroom?",
      },
      {
        text: "양이 얼마나 되나요?",
        pronounce: "yangi eolmana doenayo?",
        meaning: "How much is the portion?",
      },
      {
        text: "얼마에요?",
        pronounce: "eolma-eyo?",
        meaning: "How much is it?",
      },
    ],
  },
];

// 컴포넌트
function DictionaryDetailPage() {
  const navigate = useNavigate();
  const { type } = useParams();
  const data = dataSet.find((item) => item.type === type);
  const { phrases } = data;

  // audio 실행
  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // const pauseAudio = () => {
  //   audioRef.current.pause(); // 오디오 일시 정지
  // };

  // 상태로 클릭된 문장의 뜻을 저장
  const [selectedIndex, setSelectedIndex] = useState(null);

  // 클릭 시 뜻을 표시하는 함수
  const toggleMeaning = (index) => {
    setSelectedIndex(selectedIndex === index ? null : index); // 같은 아이템을 클릭하면 토글로 해제
  };

  return (
    <Container>
      <CategoryNav>
        <CategoryButton onClick={() => navigate("/dictionary")}>
          back to category page
        </CategoryButton>
      </CategoryNav>
      <Header>
        <HeaderImage src={data.headerImg} alt="가이드 이미지" />
        <HeaderText>
          <h1>{data.type} expressions</h1>
          <p>{data.header}</p>
        </HeaderText>
      </Header>

      <PhraseList>
        {phrases.map((phrase, index) => (
          <PhraseItem key={index}>
            <PhraseItemTopBox>
              <PhraseText>{phrase.text}</PhraseText>
              <PhraseText>
                {"["} {phrase.pronounce} {"]"}
              </PhraseText>
              {phrase.mp3 && (
                <AudioContainer>
                  <AudioElement ref={audioRef}>
                    <source src={phrase.mp3} type="audio/mp3" />
                    Your browser does not support the audio tag.
                  </AudioElement>
                  <AudioButton onClick={playAudio}>Play</AudioButton>
                </AudioContainer>
              )}
            </PhraseItemTopBox>
            <PlayButton onClick={() => toggleMeaning(index)}>
              {selectedIndex === index ? "▼" : "▶ (Click to see meaning)"}
            </PlayButton>
            {selectedIndex === index && (
              <MeaningText>{phrase.meaning}</MeaningText>
            )}
          </PhraseItem>
        ))}
      </PhraseList>
    </Container>
  );
}

export default DictionaryDetailPage;
