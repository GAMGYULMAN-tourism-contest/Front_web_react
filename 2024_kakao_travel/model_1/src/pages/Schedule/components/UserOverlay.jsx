import React, { useState } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa"; // 사람 모양 아이콘을 위해 react-icons 사용
import { useSelector } from "react-redux";

// 스타일 컴포넌트
const OverlayContainer = styled.div`
  position: fixed;
  top: 12vh;
  right: 20px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  width: auto;
  z-index: 1;
`;

const UserIcon = styled.div`
  margin-right: 5px;
  position: relative;

  &:hover .tooltip {
    display: block;
  }
`;

const Tooltip = styled.div`
  display: none;
  position: absolute;
  bottom: 120%;
  left: -120%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
`;

const Ellipsis = styled.div`
  font-size: 20px;
  margin-left: 5px;
`;

function UserOverlay() {
  // 전역으로 관리 필요
  // const [users] = useState([
  //   { id: 1, name: "사용자 1" },
  //   { id: 2, name: "사용자 2" },
  //   { id: 3, name: "사용자 3" },
  //   { id: 4, name: "사용자 4" },
  //   { id: 5, name: "사용자 5" },
  // ]);

  // const { participants, members } = useSelector((state) => state.socket);
  const { participants, members } = useSelector(
    (state) => state.socketSlice
  ) || {
    participants: 0,
    members: [],
  };

  return (
    participants !== 0 && (
      <OverlayContainer>
        {members.slice(0, 4).map((user, idx) => (
          <UserIcon key={idx}>
            <FaUser size={20} />
            <Tooltip className="tooltip">{user.email}</Tooltip>
          </UserIcon>
        ))}
        {members.length > 4 && <Ellipsis>...</Ellipsis>}
      </OverlayContainer>
    )
  );
}

export default UserOverlay;
