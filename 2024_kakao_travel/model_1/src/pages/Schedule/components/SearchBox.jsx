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
  const [searchKeyword, setSearchKeyword] = useState("");
  const dispatch = useDispatch();

  // async function getSearches({ keyword, page, size }) {
  //   console.log(keyword, page, size);
  //   let url = "/travels";
  //   const apiResult = await authInstance.get(
  //     url + "?page=" + page + "&size=" + size + "&keyword=" + keyword
  //   );
  //   console.log(apiResult);
  //   setSearches(apiResult.data.result.item); // item, numOfRows, pageNo, totalcount 있음
  // }

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchKeyword);
    dispatch(getSearchItems({ keyword: searchKeyword, page: 1, size: 10 }));
    // getSearches({ keyword: searchKeyword, page: 1, size: 10 });
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
