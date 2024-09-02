import axios from "axios";

const BASE_URL = "http://15.165.185.157:8080";

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

const axiosSellerApi = (url, options) => {
  const token = localStorage.getItem("accessToken");
  const instance = axios.create({
    baseURL: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    ...options,
  });
  return instance;
};

const axiosBuyerApi = (url, options) => {
  const token =
    localStorage.getItem("accessToken") ||
    import.meta.env.VITE_WOONG_BUYER_API_KEY;
  const instance = axios.create({
    baseURL: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    ...options,
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
        import.meta.env.VITE_UNIMADE_ADMIN_API_KEY;
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

export const sellerInstance = axiosSellerApi(BASE_URL);
export const buyerInstance = axiosBuyerApi(BASE_URL);
export const authInstance = axiosAuthApi(BASE_URL);
export const defaultInstance = axiosApi(BASE_URL);
