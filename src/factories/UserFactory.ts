import { $crud } from "./CrudFactory";
import { UserType } from "../types";
import { useSelector } from "react-redux";
import { AppStateType, SET_USER, store } from "../store";

export interface LoginParams {
  email?: string;
  password?: string;
}

export class UserFactory {
  constructor() {
    const user = this.get();
    store.dispatch({
      type: SET_USER,
      user,
    });
  }

  async login(params: LoginParams) {
    const { data } = await $crud.post<LoginParams>("user/login", params);
    this.set(data);
  }

  async logout() {
    this.removeToken();
    this.remove();
  }

  async current(): Promise<UserType> {
    return this.get();
  }

  rememberCredentials(credentials: LoginParams) {
    localStorage.setItem("cred", btoa(JSON.stringify(credentials)));
  }

  forgetCredentials() {
    localStorage.removeItem("cred");
  }

  getRememberedCredentials(): LoginParams {
    try {
      return JSON.parse(atob(localStorage.getItem("cred")));
    } catch (e) {
      return null;
    }
  }

  set(user: UserType) {
    localStorage.setItem("user", btoa(JSON.stringify(user)));
    store.dispatch({
      type: SET_USER,
      user: user,
    });
    this.setToken(user.token);
  }

  get(): UserType {
    try {
      return JSON.parse(atob(localStorage.getItem("user")));
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  setToken(token) {
    localStorage.setItem("login_token", token);
  }

  removeToken() {
    localStorage.removeItem("login_token");
  }

  getToken() {
    return localStorage.getItem("login_token");
  }

  remove() {
    localStorage.removeItem("user");
    store.dispatch({
      type: SET_USER,
      user: null,
    });
  }
}

export const $user = new UserFactory();

export function useCurrentUser() {
  return useSelector<AppStateType, UserType>((state) => state.user);
}

export function useCurrentUserData() {
  return $user.get();
}
