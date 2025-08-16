import { useSelector } from "react-redux";
import { Link } from "react-router";

const Navbar = () => {
  const user = useSelector((store) => store.user);

  // console.log(user);n

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm p-4 md:p-8">
        <div className="flex-1">
          <Link to={"/"} className="btn btn-ghost text-3xl">DevConnect 🎀</Link>
        </div>
        {!user && (
          <p className="px-4 py-2">Welcome Guest</p>
        )}

        {user && (
          <div className="flex gap-2">
            <div className="dropdown dropdown-end flex">
              <p className="px-4 py-2">
                Welcome {user ? user.firstName || user.message.firstName : "Guest"}
              </p>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Image"
                    src={user.profileUrl || user.message.profileUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-xl dropdown-content bg-base-100 rounded-box z-1 mt-12 w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/profile"} className="justify-between">
                    Profile
                    <span className="badge">View</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
