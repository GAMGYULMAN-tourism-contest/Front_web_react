import React, { useState } from "react";
import styled from "styled-components";

// 스타일 컴포넌트 정의
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:first-child {
    background-color: #007bff;
    color: white;
  }

  &:last-child {
    background-color: #6c757d;
    color: white;
  }
`;

const ConfirmModal = (status) => {
  const [isOpen, setIsOpen] = useState(true);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    // alert("진행이 선택되었습니다.");
    closeModal();
  };

  const handleCancel = () => {
    // alert("취소가 선택되었습니다.");
    closeModal();
  };

  return (
    <div>
      {/* <button onClick={openModal}>모달 열기</button> */}
      {isOpen &&
        status(
          <Modal>
            <ModalContent>
              <p>Please click Confirm or Cancel.</p>
              <Buttons>
                <Button onClick={handleConfirm}>confirm</Button>
                <Button onClick={handleCancel}>cancel</Button>
              </Buttons>
            </ModalContent>
          </Modal>
        )}
    </div>
  );
};

export default ConfirmModal;
