import api from "./api";

export const loginUser = async (email, password) => {
  /* FastAPI OAuth2 espera form-data, no JSON */
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  const { data } = await api.post("/auth/login", form);
  return data;
};

export const registerUser = async (username, email, password) => {
  const { data } = await api.post("/auth/register", { username, email, password });
  return data;
};