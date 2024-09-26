export const optimizeImageHighQ = (url: string | null) => {
  return url ? url.replace("/upload/", "/upload/q_70/") : "";
};

export const optimizeImageMediumQ = (url: string | null) => {
  return url ? url.replace("/upload/", "/upload/q_50/") : "";
};

export const optimizeImageLowQ = (url: string | null) => {
  return url ? url.replace("/upload/", "/upload/q_30/") : "";
};
