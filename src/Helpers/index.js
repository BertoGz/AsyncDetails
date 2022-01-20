// checks if details exist in the front end using ids as primary key
// if detail does not exist we return the missing details

export const doDetailsExist = async (ids, details) => {
  const response = () => {
    return new Promise((res, rej) => {
     // let missingDetails = new Map();
      let missingDetails = [];
      ids.map((item) => {
        const found = details.has(JSON.stringify({id:item.id}));
        if (!found) {
          //missingDetails.set(item.id,item);
          missingDetails.push(item);
        }
      });
      res(missingDetails);
    });
  };
  return response();
};
