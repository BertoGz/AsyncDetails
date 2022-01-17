import logo from "./logo.svg";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { useAsyncDataFetch, useAsyncDataFetchChunk } from "./Helpers";

const samplePayload = [
  { label: "carlos" },
  { label: "brian" },
  { label: "Jp" },
  { label: "Berto" },
  { label: "Subway" },
  { label: "Mcdonalds" },
  { label: "Burger King" },
  { label: "Wendys" },
];
const sampleLoadMore = [
  { label: "Toyota" },
  { label: "Honda" },
  { label: "Jeep" },
  { label: "Volkswagen" },
  { label: "Ford" },
  { label: "Chevy" },
  { label: "Suburu" },
  { label: "Kia" },
];

function App() {
  const [flatListData, setFlatListData] = useState(samplePayload);
  const [dataToFetch, setDataToFetch] = useState([]);

  useEffect(() => {
    const missingData = samplePayload.filter((item, i) => {
      const found = Math.round(Math.random());
      if (!found) {
        return true;
      }
    });
    setDataToFetch(missingData);
    // [{},{}]
  }, []);

  const postRequest = async () => {
    return new Promise((res, rej) => {
      const time = Math.random() * 3000 + 1000;
      setTimeout(() => res(), time);
    });
  };

  const { resolvedData, loadingData, doneFetching } = useAsyncDataFetchChunk({
    oGpayload: dataToFetch,
    endpoint: postRequest,
  });
  const RenderItem = ({ item, isLoading }) => {
    if (isLoading) {
      return (
        <div style={{ backgroundColor: "yellow" }}>
          <p>Loading...</p>
        </div>
      );
    } else {
      return <p>{item.label}</p>;
    }
  };

  const getMoreAsyncData = async () => {
    const response = () => {
      return new Promise((res, rej) => {
        let missingData = [];
        let data = [];
        sampleLoadMore.map((item, i) => {
          const found = Math.round(Math.random());
          if (!found) {
            missingData.push(item);
          }
          data.push(item);
        });
        res({ data, missingData });
      });
    };
    response().then((payload) => {
      // append new payload to flatlistData,
      setFlatListData([...flatListData, ...payload.data]);
    
      console.log('fetching more',payload.missingData)
      setDataToFetch(payload.missingData);
    });
  };

  return (
    <div className="App">
      <h1>Async Render</h1>
      {flatListData.map((item) => (
        <RenderItem item={item} isLoading={loadingData.has(item.label)} />
      ))}
      <div style={{ alignItems: "center" }}>
        <div
          style={{ width: 100, backgroundColor: "lightblue" }}
          onClick={() => {
            // get more, find any missing data to fetch;
            getMoreAsyncData();
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
