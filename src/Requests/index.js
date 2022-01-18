import { detailsDB } from "../MockDB";
export const getDetailsEndpoint = async (param) => {
  return new Promise((res, rej) => {
    const time = Math.random() * 3000 + 1000;
    const data = param.map((item) =>
      detailsDB.find((row) => row.id === item.id)
    );

    setTimeout(() => {
      debugger;
      res(data);
    }, time);
  });
};
