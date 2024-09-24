import React, { useState } from "react";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import { getSearchItems } from "../../../state/searches/searchesSlice";
import { useDispatch, useSelector } from "react-redux";
import { authInstance } from "../../../api/axiosInstance";
import SearchResultBox from "./SearchResultBox";

export const SearchBoxContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  /* background-color: #ffd97f; */
  background-color: white;
  flex-direction: column;

  /* 전체 스크롤바 스타일을 지정합니다 */
  ::-webkit-scrollbar {
    width: 12px; /* 세로 스크롤바 너비 */
    height: 12px; /* 가로 스크롤바 높이 */
  }

  /* 스크롤바 트랙을 스타일링합니다 */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* 스크롤 트랙 색상 */
    border-radius: 10px; /* 둥근 모서리 적용 */
  }

  /* 스크롤바 손잡이를 스타일링합니다 */
  ::-webkit-scrollbar-thumb {
    background: #888; /* 손잡이 색상 */
    border-radius: 10px; /* 둥근 모서리 적용 */
    border: 3px solid #f1f1f1; /* 손잡이 주변 여백 */
  }

  /* 스크롤바 손잡이 마우스 오버 시 스타일 */
  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* 손잡이 색상 변경 */
  }

  /* 스크롤바 화살표 버튼을 제거합니다 */
  ::-webkit-scrollbar-button {
    display: none; /* 화살표 버튼 숨김 */
  }
`;

export const SearchBoxWrapper = styled.form`
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffbd49;

  h1 {
    position: relative;
    top: 2vh;
  }
`;

export const ResultBox = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SearchInputWrapper = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchInput = styled.input`
  width: 75%;
  height: 60px;
  border: none;
  font-size: 18px;
  outline: none;
  /* padding: 5px 25px; */
`;

export const SearchButton = styled.button`
  width: 15%;
  height: 62px;
  border: none;
  background-color: white;
`;

export const SearchIcon = styled(CiSearch)`
  border: none;
  font-size: 32px;
  cursor: pointer;
  position: relative;
  top: 1px;
`;

const SearchBox = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const dispatch = useDispatch();

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchKeyword);
    dispatch(getSearchItems({ keyword: searchKeyword, page: 1, size: 10 }));
  };

  return (
    <SearchBoxContainer>
      <SearchBoxWrapper onSubmit={(e) => handleSubmit(e)}>
        <h1>YOUR'S JEJU</h1>
        <SearchInputWrapper>
          <SearchInput
            placeholder="input your keyword!"
            onChange={(e) => handleSearchKeywordChange(e)}
          />
          <SearchButton>
            <SearchIcon></SearchIcon>
          </SearchButton>
        </SearchInputWrapper>
      </SearchBoxWrapper>
      <ResultBox>
        <SearchResultBox></SearchResultBox>
      </ResultBox>
    </SearchBoxContainer>
  );
};

export default SearchBox;
