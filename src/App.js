import "./App.css";
import { useEffect, useState } from "react";
import { useAsyncDataFetch, useAsyncDataFetchChunk } from "./Helpers";

const payload1 = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
];
const payload2 = [
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
];
const randomPayload = [...payload1, ...payload2];
const details = [
  { id: 1, label: "carlos" },
  { id: 2, label: "brian" },
  { id: 3, label: "Jp" },
  { id: 4, label: "Berto" },
  { id: 5, label: "Subway" },
  { id: 6, label: "Mcdonalds" },
  { id: 7, label: "Burger King" },
  { id: 8, label: "Wendys" },
  { id: 9, label: "Toyota" },
  { id: 10, label: "Honda" },
  { id: 11, label: "Jeep" },
  { id: 12, label: "Volkswagen" },
  { id: 13, label: "Ford" },
  { id: 14, label: "Chevy" },
  { id: 15, label: "Suburu" },
  { id: 16, label: "Kia" },
];
const postRequest = async (param) => {
  return new Promise((res, rej) => {
    const time = Math.random() * 3000 + 1000;
    const data = param.map((item) => details.find((row) => row.id === item.id));

    setTimeout(() => {
      debugger;
      res(data);
    }, time);
  });
};

function App() {
  const [flatListData, setFlatListData] = useState([]);
  const [detailsToFetch, setDetailsToFetch] = useState([]);
  const [details, setDetails] = useState(new Map());
  const { resolvedData, loadingData, doneFetching } = useAsyncDataFetchChunk({
    detailsToFetch,
    endpoint: postRequest,
    keyExtractor: "id",
  });

  const getRandomFlatlistData = (size) => {
    const length = randomPayload.length;
    let vals = [];
    for (let i = 0; i < size; i++) {
      const rand = Math.floor(Math.random() * length);
      vals.push(randomPayload[rand]);
    }
    return vals;
  };
  useEffect(() => {
    getDetails(getRandomFlatlistData(10));
  }, []);
  useEffect(() => {
    setDetails(resolvedData);
  }, [resolvedData]);
  const RenderItem = ({ item, isLoading }) => {
    if (isLoading) {
      return (
        <div style={{ backgroundColor: "yellow" }}>
          <p>Loading...</p>
        </div>
      );
    } else {
      return <p>{details.get(item.id)?.label}</p>;
    }
  };

  const getDetails = async (pay) => {
    const response = () => {
      return new Promise((res, rej) => {
        let missingData = [];
        let data = [];
        pay.map((item) => {
          const found = details.has(item.id);
          if (!found) {
            missingData.push(item);
          }
          data.push(item.id, item);
        });
        res({ data, missingData });
      });
    };
    response().then((payload) => {
      // append new payload to flatlistData,
      setFlatListData([...flatListData, ...payload.data]);
      console.log("fetching more", payload.missingData);
      setDetailsToFetch(payload.missingData);
    });
  };

  return (
    <div className="App">
      <h1>Async Render</h1>
      {flatListData.map((item) => (
        <RenderItem item={item} isLoading={loadingData.has(item.id)} />
      ))}
      <div style={{ alignItems: "center" }}>
        <div
          style={{ width: 100, backgroundColor: "lightblue" }}
          onClick={() => {
            // get more, find any missing data to fetch;
            getDetails(getRandomFlatlistData(10));
          }}
        >
          <h4>load more</h4>
        </div>
      </div>
      {doneFetching && <h3>All done fetching!</h3>}
    </div>
  );
}

export default App;
