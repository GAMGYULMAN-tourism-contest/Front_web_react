import AppLayout from "../layout/AppLayout";
import SchedulePage from "../pages/Schedule/SchedulePage";
import {
  LoginPage,
  MainPage,
  MyPage,
  MapPage,
  NotFoundPage,
} from "../pages/index";

const Router = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/schedule/:scheduleId",
        element: <SchedulePage />,
      },
      {
        path: "/mypage",
        element: <MyPage />,
      },
      {
        path: "/map/:scheduleId",
        element: <MapPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
];

export default Router;
