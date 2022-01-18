import "./SampleApp.css";
import { useEffect, useState } from "react";
import { useAsyncDataFetchChunk } from "./Hooks.js";
import { getRandomIdsEndpoint, getDetailsEndpoint } from "./Requests";

// checks if details exist in the front end using ids as primary key
// if detail does not exist we return the missing details

const doDetailsExist = async (ids, details) => {
  const response = () => {
    return new Promise((res, rej) => {
      let missingDetails = [];
      ids.map((item) => {
        const found = details.has(item.id);
        if (!found) {
          missingDetails.push(item);
        }
      });
      res(missingDetails);
    });
  };
  return response();
};
function App() {
  const [flatListData, setFlatListData] = useState([]);
  const [detailsToFetch, setDetailsToFetch] = useState([]);
  const [details, setDetails] = useState(new Map());
  const { resolvedData, loadingData, doneFetching } = useAsyncDataFetchChunk({
    detailsToFetch,
    endpoint: getDetailsEndpoint,
    keyExtractor: "id",
  });

  const handleGetDetails = (limit) => {
    getRandomIdsEndpoint(limit).then((ids) => {
      doDetailsExist(ids, details).then((payload) => {
        // append new payload to flatlistData,
        setFlatListData([...flatListData, ...ids]);
        console.log("fetching more", payload);
        setDetailsToFetch(payload);
      });
    });
  };
  console.log("flatlistData", flatListData);
  // initial call
  useEffect(() => {
    handleGetDetails(10);
  }, []);

  // as we get resolved data (details)
  // we can save this to a state
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

  return (
    <div className="App">
      <h1>Async Render</h1>
      {flatListData.map((item, i) => (
        <RenderItem
          key={item.id + i.toString()}
          item={item}
          isLoading={loadingData.has(item.id)}
        />
      ))}
      <div style={{ alignItems: "center" }}>
        <div
          style={{ width: 100, backgroundColor: "lightblue" }}
          onClick={() => {
            // get more
            handleGetDetails(10);
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
