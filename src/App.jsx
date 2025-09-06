import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed"
import Error from "./components/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {path:'/', element:<Feed/>},
      { path: "/login", element: <Login /> },
      { path: "/profile", element: <Profile /> },
      { path: "/error", element: <Error /> },

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
