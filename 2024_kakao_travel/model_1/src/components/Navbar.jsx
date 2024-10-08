import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import logo from "/logo.webp";
import { useNavigate } from "react-router";
import { FiMail } from "react-icons/fi";
import { GoMail } from "react-icons/go";
import { IoShareSocialOutline } from "react-icons/io5";
import { authInstance } from "../api/axiosInstance";
import { useSelector } from "react-redux";
import { TbMoodLookUp } from "react-icons/tb";
import { IoMdPerson } from "react-icons/io";
import { GrHelpBook } from "react-icons/gr";
import HelpModal from "./HelpModal";
import { IoIosMenu } from "react-icons/io";
import MenuModal from "./MenuModal";

const Container = styled.div`
  width: 100%;
  height: 10vh;
  background-color: #8ae0d4;
  display: flex;
  justify-content: space-between;
`;

const LeftBox = styled.div`
  width: 25%;
  height: 100%;
  margin-left: 20px;
  font-size: 32px;
  color: white;
  display: flex;
  align-items: center;
  /* justify-content: center; */

  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    position: relative;
    top: -4px;
    &:hover {
      cursor: pointer;
      scale: 1.05;
    }
  }

  div {
    position: relative;
    top: 2px;
    &:hover {
      cursor: pointer;
      scale: 1.05;
    }
  }
`;
const RightBox = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  position: relative;
  left: -8vw;
  gap: 50px;
  font-size: 32px;

  span {
    position: relative;
    top: 5px;
    cursor: pointer;
    &:hover {
      scale: 1.05;
    }
  }
`;

const ShareModalBox = styled.div`
  width: 40vw;
  height: 25vh;
  background-color: #ffe8b4;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed; /* 고정된 위치 */
  right: 16px;
  top: 10%;
  border: 1px solid black;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  font-size: 18px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 20px;
  height: 15%;
`;

const InviteForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  width: 90%;
`;

const InputField = styled.input`
  /* width: 80%; */
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #495057;

  &:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 5px rgba(128, 189, 255, 0.5);
  }
`;

const InviteButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const MailModalBox = styled.div`
  width: 40vw;
  height: 35vh;
  background-color: #ffe8b4;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed; /* 고정된 위치 */
  right: calc(16px + 10vw);
  top: 10%;
  border: 1px solid black;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  font-size: 18px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 16px;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  font-size: 48px;
  color: #adb5bd;
  margin-top: 10px;
`;

const EmptyMessage = styled.div`
  font-size: 24px;
  color: #6c757d;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
`;

const MessageList = styled.div`
  width: 90%;
  height: 70%;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  gap: 10px;
  overflow-y: auto;
`;

const MessageItem = styled.div`
  padding: 10px;
  width: 90%;
  height: 22%;
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => {
    if (props.status === "ACCEPT" || props.status === "DENYED") {
      return "#6e6e6e";
    } else {
      return "#efefef";
    }
  }};
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #495057;
  font-size: 14px;
  border: 1px solid black;
`;

const TextBox = styled.div`
  width: 50%;
  display: flex;
`;

const ButtonBox = styled.div`
  width: 40%;
  display: flex;
  margin-left: 10px;
  gap: 10px;
`;

const AcceptButton = styled.div`
  /* background-color: #28a745; */
  background-color: ${(props) =>
    props.status === "ACCEPT" || props.status === "DENYED"
      ? "#1d7933"
      : "#28a745"};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  width: 45px;
  height: 20px;
  text-align: center;
  pointer-events: ${(props) =>
    props.status === "READ" || props.status === "NOT_READ" ? "all" : "none"};
`;
const DenyButton = styled.div`
  /* background-color: #ff6969; */
  background-color: ${(props) =>
    props.status === "ACCEPT" || props.status === "DENYED"
      ? "#ae4848"
      : "#ff6969"};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  width: 45px;
  height: 20px;
  text-align: center;
  pointer-events: ${(props) =>
    props.status === "READ" || props.status === "NOT_READ" ? "all" : "none"};
`;

function Navbar() {
  const navigate = useNavigate();
  const [mailBoxOpen, setMailBoxOpen] = useState(false);
  const [shareBoxOpen, setShareBoxOpen] = useState(false);
  const [helpBoxOpen, setHelpBoxOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [invitedMessages, setInvitedMessages] = useState([]);
  const [validInvitationNumber, setValidInvitationNumber] = useState("");
  const { currentSchedule } = useSelector((state) => state.schedules);
  const [menuModalIsOpen, setMenuModalIsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuModalIsOpen(!menuModalIsOpen);
  };

  const handleMailBoxClick = () => {
    setMailBoxOpen(!mailBoxOpen);
    if (shareBoxOpen) {
      setShareBoxOpen(false);
    }
  };
  const handleShareClick = () => {
    setShareBoxOpen(!shareBoxOpen);
    if (mailBoxOpen) {
      setMailBoxOpen(false);
    }
  };
  const handleShareSubmit = (e) => {
    e.preventDefault();
    if (!currentSchedule.id) return;
    authInstance
      .post("/invitations", {
        scheduleId: currentSchedule.id,
        receiverEmail: emailAddress,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setShareBoxOpen(false);
    setEmailAddress("");
  };
  // const handleInvitation = async (invitationId, status) => {
  //   console.log(invitationId, status);
  //   const apiRes = await authInstance.patch("/invitations", {
  //     invitationId: invitationId,
  //     status: status,
  //   });
  //   console.log(apiRes);
  // };

  const handleInvitation = async (invitationId, status) => {
    try {
      const apiRes = await authInstance.patch("/invitations", {
        invitationId: invitationId,
        status: status,
      });
      setMailBoxOpen(false);
      navigate(`/schedule/${apiRes.data.result.schedule.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function getMessages() {
      try {
        const res = await authInstance.get("/invitations");

        setInvitedMessages(res.data.result.invitations);
      } catch (error) {
        console.log(error);
      }
    }

    getMessages();
  }, []);

  return (
    <Container>
      <LeftBox>
        <img src={logo} alt="logo" />
        <div onClick={() => navigate("/")}>YOUR'S JEJU</div>
      </LeftBox>

      <RightBox>
        {localStorage.getItem("accessToken") && (
          <span>
            <IoMdPerson onClick={() => navigate("/mypage")} />
          </span>
        )}

        {localStorage.getItem("accessToken") && (
          <span>
            <GoMail onClick={() => handleMailBoxClick()} />
          </span>
        )}

        {mailBoxOpen && (
          <MailModalBox>
            {console.log(invitedMessages)}
            {!invitedMessages.length ? (
              <EmptyState>
                <EmptyMessage>not yet invitations arrival</EmptyMessage>
                <IconWrapper>
                  <TbMoodLookUp />
                </IconWrapper>
              </EmptyState>
            ) : (
              <>
                <Title>
                  <p>invitations to you</p>
                </Title>
                <MessageList>
                  {invitedMessages.map((message) => (
                    <MessageItem key={message.id} status={message.status}>
                      {console.log(message)}
                      <TextBox>
                        <p>
                          {message.schedule.title}
                          &nbsp;
                        </p>
                        <p>from {message.sender.name}</p>
                      </TextBox>
                      <ButtonBox>
                        <AcceptButton
                          onClick={() => handleInvitation(message.id, "ACCEPT")}
                          status={message.status}
                        >
                          accept
                        </AcceptButton>
                        <DenyButton status={message.status}>deny</DenyButton>
                      </ButtonBox>
                    </MessageItem>
                  ))}
                </MessageList>
              </>
            )}
          </MailModalBox>
        )}
        {window.location.href.includes("/schedule/") && (
          <span>
            <IoShareSocialOutline onClick={() => handleShareClick()} />
          </span>
        )}
        {shareBoxOpen && (
          <ShareModalBox>
            <Title>Share with your travel group</Title>
            <InviteForm onSubmit={(e) => handleShareSubmit(e)}>
              <InputField
                type="email"
                placeholder="Enter the email you wish to invite"
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <InviteButton type="submit">Invite</InviteButton>
            </InviteForm>
          </ShareModalBox>
        )}
        <span>
          <GrHelpBook onClick={() => setHelpBoxOpen((prev) => !prev)} />
        </span>
        {
          //TODO: 도움말 모달 열기
          helpBoxOpen && <HelpModal setHelpBoxOpen={setHelpBoxOpen} />
        }
        {/* <HelpModal /> */}
        <span>
          <IoIosMenu onClick={() => toggleMenu()}></IoIosMenu>
        </span>
        <MenuModal menuModalIsOpen={menuModalIsOpen} toggleMenu={toggleMenu} />
      </RightBox>
    </Container>
  );
}

export default Navbar;
