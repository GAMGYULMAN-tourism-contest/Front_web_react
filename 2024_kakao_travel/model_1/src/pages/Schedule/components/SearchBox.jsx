import React from "react";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";

export const SearchBoxContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  /* background-color: #ffd97f; */
  background-color: white;
  flex-direction: column;
`;

export const SearchBoxWrapper = styled.form`
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffbd49;
`;

export const ResultBox = styled.div`
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
  width: 80%;
  height: 44%;
  border: none;
  font-size: 18px;
  outline: none;
  padding: 5px 25px;
`;

export const SearchButton = styled.button`
  width: 20%;
  height: 56%;
  border: none;
  background-color: white;
`;

export const SearchIcon = styled(CiSearch)`
  border: none;
  font-size: 32px;
  cursor: pointer;
`;

const SearchBox = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <SearchBoxContainer>
      <SearchBoxWrapper>
        <h1>YOUR'S JEJU</h1>
        <SearchInputWrapper>
          <SearchInput placeholder="input your keyword!" />
          <SearchButton>
            <SearchIcon></SearchIcon>
          </SearchButton>
        </SearchInputWrapper>
      </SearchBoxWrapper>
      <ResultBox>
        <div>search results...</div>
      </ResultBox>
    </SearchBoxContainer>
  );
};

export default SearchBox;
