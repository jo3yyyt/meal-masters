import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
});

export async function loginUser(username, password) {
  try {
    const res = await api.post("/login", { username, password });

    const token = res?.data?.token || res?.data?.accessToken;
    if (!token) return false;

    localStorage.setItem("token", token);
    return true;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
}

export async function signupUser(username, password) {
  try {
    const res = await api.post("/signup", { username, password });

    const token = res?.data?.token || res?.data?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
    }
    return true;
  } catch (err) {
    console.error("Signup error:", err);
    return false;
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.hash = "#/login";
}
