import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from '~/utils/formatter';
import { refreshTokenAPI } from '~/apis';
import { logoutUserAPI } from '~/redux/user/userSlice';
/**
 * Không thể  import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp : Inject store : là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore()
ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/

let axiosReduxStore;

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};
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

/**
 * Khởi tạo một cái promise cho việc gọi api refresh_token
 * Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
 * https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
 */
let refreshTokenPromise = null;

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

    /** Quan trọng: Xử lí Refresh Token tự động */
    // Trường hợp 1 : Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false));
    }
    // Trường hợp 2 : Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequests = error.config;
    console.log('originalRequests', originalRequests);

    if (error.response?.status === 410 && !originalRequests._retry) {
      // Gán thêm một giá trị _retry luôn =true trong khoảng thời gian chờ, đảm bảo việc refresh token này
      // luôn chỉ gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ngay phía trên)
      originalRequests._retry = true;

      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời
      // gán vào cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
            return data?.accessToken;
          })
          .catch((_error) => {
            // Nếu nhận bất kì lỗi nào từ api refresh token thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false));
            return Promise.reject(_error);
          })
          .finally(() => {
            // Dù API có ok hay lỗi thì gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null;
          });
      }
      // Cần return trường hợp refreshTokenPromise chạy thành công và xử lí thêm ở đây:
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì
         sẽ viết code xử lí ở đây
         * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lí phía BE)
         sau khi api refreshToken được gọi thành công

         // Bước 2: Bước quan trọng : Return lại axios instance của chúng ta kết hợp các originalRequests để
         gọi lại những api ban đầu bị lỗi
         */
        return authorizedAxiosInstance(originalRequests);
      });
    }
    // Xử lí tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần : Clean Code)
    // console.log error ra là sẽ thấy cấu trúc data dẫ tới message lỗi như dưới đây
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
