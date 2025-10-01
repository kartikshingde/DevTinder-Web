import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Error from "./components/Error";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/", element: <Feed /> },
      { path: "/profile", element: <Profile /> },
      { path: "/error", element: <Error /> },
      { path: "/connections", element: <Connections /> },
      { path: "/requests", element: <Requests /> },
    ],
  },
]);

function App() {
  return (
    <>
      <Provider store={appStore}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
