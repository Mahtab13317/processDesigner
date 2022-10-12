import { LOGOUT_LOADING } from "./actionTypes";
import axios from "axios";

import {
  SERVER_URL_LAUNCHPAD,
  ENDPOINT_LOGOUT,
} from "./../../../Constants/appConstants";

import {
  removeUserSession,
  removeTheme,
} from "../../../utility/CommonFunctionCall/CommonFunctionCall";

export const logoutIsLoading = (bool) => {
  return {
    type: LOGOUT_LOADING,
    payload: bool,
  };
};
export const userLogout = ({ history }) => {
  return (dispatch) => {
    const authKey = JSON.parse(localStorage.getItem("launchpadKey"))?.token;

    dispatch(logoutIsLoading(true));
    if (!!authKey) {
      axios
        .get(`${SERVER_URL_LAUNCHPAD}${ENDPOINT_LOGOUT}`, {
          headers: {
            token: authKey,
          },
        })
        .then((res) => {
          if (res?.data === "Success") {
            window.location.href = window.location.origin + `/lpweb`;
            const timeout = setTimeout(() => {
              removeUserSession();
              removeTheme();
            }, 200);
            clearTimeout(timeout);

            dispatch(logoutIsLoading(false));
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(logoutIsLoading(false));
        });
    } else {
      window.location.href = window.location.origin + `/lpweb`;
      const timeout = setTimeout(() => {
        removeUserSession();
        removeTheme();
      }, 200);
      clearTimeout(timeout);

      dispatch(logoutIsLoading(false));
    }
  };
};
