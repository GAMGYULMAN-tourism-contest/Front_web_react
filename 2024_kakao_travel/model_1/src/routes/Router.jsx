import AppLayout from "../layout/AppLayout";
import SchedulePage from "../pages/Schedule/SchedulePage";
import {
  DictionaryPage,
  LoginPage,
  MainPage,
  MyPage,
  MapPage,
  NotFoundPage,
  DictionaryDetailPage,
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
      {
        path: "/dictionary",
        element: <DictionaryPage />,
      },
      {
        path: "/dictionary/:type",
        element: <DictionaryDetailPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
];

export default Router;
