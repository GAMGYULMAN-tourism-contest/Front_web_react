import { useSelector } from "react-redux";

const token = localStorage.getItem("accessToken");

const useSendUpdateMessage = (chatMessage) => {
  // console.log(eventId);
  const { socketClient } = useSelector((state) => state.schedules);
  console.log(socketClient);
  if (socketClient) {
    console.log(chatMessage);

    socketClient.send(
      "/events/update",
      {
        Authorization: "Bearer " + token,
      },
      chatMessage
    );
  }
};

export default useSendUpdateMessage;
