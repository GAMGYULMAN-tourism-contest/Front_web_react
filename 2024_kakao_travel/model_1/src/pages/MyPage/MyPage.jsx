import React, { useEffect, useState } from "react";
import * as S from "./MyPage.style";
import ScheduleBlock from "./components/ScheduleBlock";
import { authInstance } from "../../api/axiosInstance";
import { getSchedules } from "../../state/schedules/schedulesSlice";
import { useDispatch, useSelector } from "react-redux";

const dataItems = [
  {
    id: 0,
    title: "Project Alpha",
    description: "Detailed description of Project Alpha",
    period: 2,
    startDate: "2024-10-02",
    endDate: "2024-10-04",
  },
  {
    id: 1,
    title: "Campaign Beta",
    description: "Overview for Campaign Beta",
    period: 10,
    startDate: "2024-10-15",
    endDate: "2024-10-25",
  },
  {
    id: 2,
    title: "Event Gamma",
    description: "Summary report of Event Gamma",
    period: 6,
    startDate: "2024-10-17",
    endDate: "2024-10-23",
  },
  {
    id: 3,
    title: "Workshop Delta",
    description: "Planning phase for Workshop Delta",
    period: 4,
    startDate: "2024-10-19",
    endDate: "2024-10-23",
  },
  {
    id: 4,
    title: "Seminar Epsilon",
    description: "Execution of Seminar Epsilon",
    period: 6,
    startDate: "2024-10-11",
    endDate: "2024-10-17",
  },
  {
    id: 5,
    title: "Course Zeta",
    description: "Final stage of Course Zeta",
    period: 7,
    startDate: "2024-10-20",
    endDate: "2024-10-27",
  },
  {
    id: 6,
    title: "Meeting Eta",
    description: "Initial preparation for Meeting Eta",
    period: 3,
    startDate: "2024-10-05",
    endDate: "2024-10-08",
  },
  {
    id: 7,
    title: "Conference Theta",
    description: "Concluding session for Conference Theta",
    period: 5,
    startDate: "2024-10-09",
    endDate: "2024-10-14",
  },
];

function MyPage() {
  const [mySchedules, setMySchedules] = useState([]);
  const [invitedSchedules, setInvitedSchedules] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getMySchedules() {
      const response = await authInstance.get("/schedules/members");
      setMySchedules(response.data.result.list);
    }

    getMySchedules();
  }, []);

  return (
    <S.Container>
      <S.SchedulesBox>
        <S.TopBox>
          <span>my shedules</span>
        </S.TopBox>
        <S.MainBox>
          <S.MainBoxInner>
            {mySchedules.map((item) => {
              return (
                item.role === "OWNER" && (
                  <ScheduleBlock
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    period={item.period}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    // onclick(내비게이트 + 그 스케줄 상세 정보 가져오기)은 ScheduleBlock 컴포넌트에서 구성함
                  />
                )
              );
            })}
          </S.MainBoxInner>
        </S.MainBox>
      </S.SchedulesBox>
      <S.SchedulesBox>
        <S.TopBox>
          <span>invited shedules</span>
        </S.TopBox>
        <S.MainBox>
          <S.MainBoxInner>
            {mySchedules.map((item) => {
              return (
                item.role !== "OWNER" && (
                  <ScheduleBlock
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    period={item.period}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    // onclick(내비게이트 + 그 스케줄 상세 정보 가져오기)은 ScheduleBlock 컴포넌트에서 구성함
                  />
                )
              );
            })}
          </S.MainBoxInner>
        </S.MainBox>
      </S.SchedulesBox>
    </S.Container>
  );
}

export default MyPage;
