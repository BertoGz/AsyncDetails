import { primaryDB, detailsDB } from "../MockDB";
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

export const getRandomIdsEndpoint = (limit) => {
  return new Promise((res, rej) => {
    const length = primaryDB.length;
    let vals = [];
    for (let i = 0; i < limit; i++) {
      const rand = Math.floor(Math.random() * length);
      vals.push(primaryDB[rand]);
    }
    res(vals);
  });
};
