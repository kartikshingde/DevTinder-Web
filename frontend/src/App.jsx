
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children:[
      {path:"/login", element:<Login />},
      {path:"/profile", element:<Profile />}
    ]
  },
  
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
