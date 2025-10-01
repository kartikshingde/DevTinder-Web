# DevTinder Frontend

- Create a Vite+React Application
- Remove unnecessary code and create a app
- Install Tailwind CSS
- Install daisyui
- Add Navbar component to App.jsx
- Create a Navbar.jsx seperate component file
- Install react-router
- Create BrowserRouter > creare a route / and its children routes
- Create an Outlet in body component
- Create a footer

- create a login page
- Install axios
- CORS - install cors in backend =>add middleware to with configuration as credentials:true
- Whenever you are making api call in frontend pass axios=> {withCredentials:true}

- redux toolkit -> https://redux-toolkit.js.org/tutorials/quick-start
- Create react-redux + @redux.js/toolkit
- ConfigureStore => Provider => createSlice => add reducer to Store
- Add redux devtools in chrome
- Login and see if your data is coming properly in the store
- Navbar should update as soon as user logs in
- Refactor our code to add constant file i.e. add BASE_URL of backend

- You should not be able to access other route without login
- If token is not present , redirect user to login page
- Logout Feature
- Get the feed and add the feed in the store
- Build the user card on feed
- Built profile edit page
- Added s3 for storing profile image
- Cloudfront integrated.
- Page to See all my connnections
- Page to See all my Connection Requests

Body
Navbar
Route= / =>Feed
Route= /login =>Login
Route= /connections =>Connections
Route= /profile =>Profile
