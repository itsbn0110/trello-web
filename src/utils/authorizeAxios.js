import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from '~/utils/formatter';
// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom
// và cấu hình chung cho dụ án

let authorizedAxiosInstance = axios.create();
// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;
// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta
// sẽ lưu JWT tokens (refesher & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true;
/**
 * Cấu hình Interceptors ( Bộ đánh chặn vào giữa mọi request & response)
 * https://axios-http.com/docs/interceptors
 */

// Can thiệp vào giữa request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click (xem kỹ mô tả file ở formatters chứa function)
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Can thiệp vào giữa reponse API

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    interceptorLoadingElements(false);

    let errorMessage = error?.message;
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }

    // Dùng react-toastify hiển thị mã lỗi lên màn hình - Ngoại trừ mã 410 -GONE phục vụ việc tự động refesh token
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);
export default authorizedAxiosInstance;
