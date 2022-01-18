import "./SampleApp.css";
import { useEffect, useState } from "react";
import {doDetailsExist} from './Helpers'
import { useAsyncDataFetchChunk } from "./Hooks/index.js";
import { getRandomIdsEndpoint, getDetailsEndpoint } from "./Requests";


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
        setDetailsToFetch(payload);
      });
    });
  };
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
            handleGetDetails(10)
            console.log("fetching more");
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
