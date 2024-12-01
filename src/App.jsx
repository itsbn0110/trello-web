import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Board from '~/pages/Boards/_id';

import NotFound from '~/pages/404/NotFound';

import Auth from '~/pages/Auth/Auth';

import AccountVerification from '~/pages/Auth/AccountVerification';

import { useSelector } from 'react-redux';

import { selectCurrentUser } from '~/redux/user/userSlice';

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản mới cho truy cập
 * Sử dụng <Outlet/> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://www.robinwieruch.de/react-router-private-routes/
 */

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />;
  return <Outlet />;
};

function App() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Routes>
      {/* Redirect Route */}

      {/** Ở đây cần replace giá trị true để nó thay thế route , có thể hiểu là route / sẽ không còn
      nằm trong history của Browser
      // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp
      có replace hoặc không có */}
      <Route path="/" element={<Navigate to="/boards/672b1ed01b5582d5310145a2" replace={true} />} />

      {/* ProtectedRoute sẽ bọc những route chỉ cho truy cập sau khi đã login */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}
        {/* Board Details */}
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>

      {/* Authentication */}

      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
