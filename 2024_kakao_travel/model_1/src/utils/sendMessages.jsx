import { useSelector } from "react-redux";

const token = localStorage.getItem("accessToken");

export const SendCreateMessage = (chatMessage, socketClient) => {
  // const { socketClient } = useSelector((state) => state.schedules);
  if (socketClient) {
    console.log(chatMessage);

    socketClient.send(
      "/events/create",
      {
        Authorization: "Bearer " + token,
      },
      chatMessage
    );
  }
};

export const SendUpdateMessage = (chatMessage, socketClient) => {
  // console.log(eventId);
  // const { socketClient, chatMessage } = props;
  // const { socketClient } = useSelector((state) => state.schedules);
  // console.log(props);
  console.log(chatMessage, socketClient.socketClient);
  if (socketClient) {
    socketClient.socketClient.send(
      "/events/update",
      {
        Authorization: "Bearer " + token,
      },
      chatMessage
    );
  }
};

export const SendDeleteMessage = (chatMessage, socketClient) => {
  // const { socketClient } = useSelector((state) => state.schedules);
  if (socketClient) {
    console.log(chatMessage);

    socketClient.send(
      "/events/delete",
      {
        Authorization: "Bearer " + token,
      },
      chatMessage
    );
  }
};
