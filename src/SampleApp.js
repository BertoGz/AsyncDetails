import "./SampleApp.css";
import { useEffect, useState } from "react";
import { useAsyncDataFetchChunk } from "./Helpers";
import { primaryDB } from "./MockDB";
import { getDetailsEndpoint } from "./Requests";
const getRandomIds = (limit) => {
  const length = primaryDB.length;
  let vals = [];
  for (let i = 0; i < limit; i++) {
    const rand = Math.floor(Math.random() * length);
    vals.push(primaryDB[rand]);
  }
  return vals;
};
const getDetails = async (ids, details) => {
  const response = () => {
    return new Promise((res, rej) => {
      let missingData = [];
      let data = [];
      ids.map((item) => {
        const found = details.has(item.id);
        if (!found) {
          missingData.push(item);
        }
        data.push(item.id, item);
      });
      res({ data, missingData });
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

  // initial list of ids to use
  useEffect(() => {
    handleGetMoreDetails();
  }, []);

  // as we get resolved data (details)
  // we can save this to a state
  useEffect(() => {
    setDetails(resolvedData);
  }, [resolvedData]);

  const handleGetMoreDetails = () => {
    getDetails(getRandomIds(10), details).then((payload) => {
      // append new payload to flatlistData,
      setFlatListData([...flatListData, ...payload.data]);
      console.log("fetching more", payload.missingData);
      setDetailsToFetch(payload.missingData);
    });
  };

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
            // get more, find any missing data to fetch;
            handleGetMoreDetails();
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
