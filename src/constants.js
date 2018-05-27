// import keymirror from 'keymirror'

const apiURL = 'http://127.0.0.1:3001';

/** API ENDPOINTS */
export default {
  api: {
    isAuth: `${apiURL}/auth/isAuth`, // GET
    login: `${apiURL}/auth/login`, // POST
    logout: `${apiURL}/auth/logout`, // POST
  },
};
