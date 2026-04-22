import api from "./api";

export const getCollection = async () => {
  const { data } = await api.get("/collection/me");
  return data;
};

export const patchSticker = async (stickerId) => {
  const { data } = await api.patch(`/collection/me/${stickerId}`);
  return data;
};