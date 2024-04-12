export const decryptData = (data: string): string => {
  return atob(data);
};

export const reverseDateFormat = (inputDate: string): string => {
  const dateComponents = inputDate.split('/');
  return `${dateComponents[2]}/${dateComponents[1]}/${dateComponents[0]}`;
};
