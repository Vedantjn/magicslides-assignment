export const setOpenAIKey = (key) => {
  localStorage.setItem('openaiKey', key);
};

export const getOpenAIKey = () => {
  return localStorage.getItem('openaiKey');
};