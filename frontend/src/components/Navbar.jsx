const Navbar = () => {
  return (
    <>
      <div className="navbar bg-base-300 shadow-sm p-4 md:p-8">
        <div className="flex-1">
          <a className="btn btn-ghost text-3xl">DevConnect 🎀</a>
        </div>
        <div className="flex gap-2">
           
          <div className="dropdown dropdown-end ">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://avatars.githubusercontent.com/u/144619665?v=4"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-xl dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">View</span>
                </a>
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
      </div>
    </>
  );
};

export default Navbar;
