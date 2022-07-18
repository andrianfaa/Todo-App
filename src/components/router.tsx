import { useAppDispatch, useAppSelector } from "app";
import { PrivateRoute, PublicRoute } from "app/routes";
import { logout, setAuth } from "features/auth";
import { memo, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useUserQuery } from "services";

function AppRouter() {
  const { token } = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();
  const { data: userData, isError, isSuccess } = useUserQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    if (isError) dispatch(logout());
    if (isSuccess) dispatch(setAuth(userData.data.user || null));
  }, [isError, isSuccess, userData]);

  return (
    <Router>
      <Routes>
        {(token) ? (
          <>
            {PrivateRoute.map((route) => {
              const Element = route.element;

              return <Route key={route.path} path={route.path} element={<Element />} />;
            })}
          </>
        ) : (
          <>
            {PublicRoute.map((route) => {
              const Element = route.element;

              return <Route key={route.path} path={route.path} element={<Element />} />;
            })}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default memo(AppRouter);
