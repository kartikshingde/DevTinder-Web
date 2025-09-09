import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(!isOpen);
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      return navigate("/login")


    } catch (err) {
      //Error logic like redirect to error page
    }
  };

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm p-4 md:p-8 sticky top-0 z-50">
        <div className="flex-1">
          <Link to={"/"} className="btn btn-ghost text-3xl">
            DevConnect 🎀
          </Link>
        </div>
        {!user && <p className="px-4 py-2">Welcome Guest</p>}

        {user && (
          <div className="flex gap-2">
            <div className="dropdown dropdown-end flex">
              <p className="px-4 py-2">
                Welcome{" "}
                {user ? (user.firstName || user.message?.firstName) : "Guest"}
              </p>
              <div
                tabIndex={0}
                role="button"
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Image"
                    src={user.profileUrl || user.message?.profileUrl || '/default-avatar.png'}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </div>
              {isOpen && (
                <ul
                  tabIndex={0}
                  className="menu menu-xl dropdown-content bg-base-100 rounded-box z-1 mt-12 w-52 p-2 shadow"
                >
                  <li>
                    <Link
                      to={"/profile"}
                      onClick={() => setIsOpen(!isOpen)}
                      className="justify-between"
                    >
                      Profile
                      <span className="badge">View</span>
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => setIsOpen(!isOpen)}>Settings</Link>
                  </li>
                  <li>
                    <Link onClick={handleLogout}>Logout</Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
