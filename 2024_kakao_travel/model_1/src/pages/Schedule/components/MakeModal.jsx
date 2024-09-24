import React, { useState } from "react";
import {
  setMakeModalOpen,
  setSchedules,
} from "../../../state/schedules/schedulesSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { authInstance } from "../../../api/axiosInstance";

const ModalOverlay = styled.div`
  // 모달 뒤의 배경을 흐리게 처리
  width: 100vw;
  height: 100vh;
  content: "";
  position: fixed;
  width: 102vw;
  height: 90vh;
  background-color: rgba(0, 0, 0, 0.3); /* 어두운 반투명 배경 */
  backdrop-filter: blur(5px); /* 흐림 효과 */
  z-index: 21;
`;

const Container = styled.div`
  display: ${(makeModalOpen) => (makeModalOpen ? "block" : "none")};
  opacity: ${(makeModalOpen) => (makeModalOpen ? 1 : 0)};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: opacity 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 메인 박스 스타일
const MainBox = styled.form`
  width: 85%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

// 제목 상자 스타일
const TitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 텍스트 입력 상자 스타일
const TextInputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// 입력 필드 스타일
const TextInput = styled.input`
  /* width: 100%; */
  padding: 12px;
  margin-bottom: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 8px rgba(128, 189, 255, 0.6);
  }
`;

// 날짜 입력 상자 스타일
const DateInputBox = styled.div`
  display: flex;
  /* flex-direction: column; */
  width: 100%;
`;

// 날짜 입력 필드 스타일
const DateInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 8px rgba(128, 189, 255, 0.6);
  }
`;

// 버튼 스타일
const CloseButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #28a745;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #218838;
  }
  &:active {
    background-color: #1e7e34;
  }
`;

function MakeModal() {
  const { makeModalOpen } = useSelector((state) => state.schedules);

  // 4개의 입력 필드를 위한 상태 정의
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 입력 변경 시 상태를 업데이트하는 handleChange 함수
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 필드 이름에 따라 각 상태를 업데이트
    if (name === "title") {
      setTitle(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  // 날짜 차이를 계산하는 함수
  const calculateDateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 두 날짜 간의 차이를 밀리초로 계산
    const timeDifference = end.getTime() - start.getTime();

    // 밀리초를 일 단위로 변환 (1일 = 24 * 60 * 60 * 1000 밀리초)
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    return dayDifference;
  };

  const dispatch = useDispatch();

  async function postSchedule(reqData) {
    const resData = await authInstance.post("/schedules", reqData);
    console.log(reqData, resData);
    dispatch(setSchedules(resData.dayEvents));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqData = {
      title: title || null,
      description: description || null,
      period: calculateDateDifference() + 1 || null, // ex 2일 여행이면 복귀날까지 포함 일정 생성
      startDate: startDate || null,
    };

    if (
      [
        reqData.title,
        reqData.description,
        reqData.period,
        reqData.startDate,
      ].some((value) => value === null)
    ) {
      alert("모든 항목을 입력하세요.");
      return;
    } else {
      postSchedule(reqData);
      dispatch(setMakeModalOpen(false));
      // 전체 스케줄 생성 api 호출 및 currentSchedule에 저장
    }
  };

  return (
    makeModalOpen && (
      <ModalOverlay>
        <Container $makeModalOpen={makeModalOpen}>
          <MainBox onSubmit={(e) => handleSubmit(e)}>
            <TitleBox>
              <h1>make new schedule</h1>
            </TitleBox>
            <TextInputBox>
              <TextInput
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={handleChange}
              />
              <TextInput
                type="text"
                name="description"
                placeholder="Description"
                value={description}
                onChange={handleChange}
              />
            </TextInputBox>
            <DateInputBox>
              <DateInput
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={startDate}
                onChange={handleChange}
              />
              <DateInput
                type="date"
                name="endDate"
                placeholder="End Date"
                value={endDate}
                onChange={handleChange}
              />
            </DateInputBox>
            <CloseButton>Start</CloseButton>
          </MainBox>
        </Container>
      </ModalOverlay>
    )
  );
}

export default MakeModal;
