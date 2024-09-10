import axios from "axios";
// 리액트로 특정 사이트 크롤링
//https://makeit80.tistory.com/entry/React-%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90%EC%84%9C-%ED%81%AC%EB%A1%A4%EB%A7%81%ED%95%98%EA%B8%B0

const BASE_URL = "http://3.35.101.171";

// 단순 get요청으로 인증값이 필요없는 경우
const axiosApi = (url) => {
  const instance = axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
      // "X-CSRFToken": csrftoken,
    },
    // ...options,
  });
  return instance;
};

// post, delete등 api요청 시 인증값이 필요한 경우
// options를 default 값 {}로 정의해야 오류 피할 수 있음
const axiosAuthApi = (url, options = {}) => {
  const instance = axios.create({
    baseURL: url,
    headers: {
      ...options.headers,
    },
    ...options,
  });
  // 요청 인터셉터 추가
  instance.interceptors.request.use(
    (config) => {
      // 로컬 스토리지에서 토큰 가져오기
      const token =
        localStorage.getItem("accessToken") ||
        import.meta.env.VITE_GAMGYULMAN_USER_API_KEY;
      // 토큰이 있으면 Authorization 헤더에 추가
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
};

export const authInstance = axiosAuthApi(BASE_URL);
export const defaultInstance = axiosApi(BASE_URL);
