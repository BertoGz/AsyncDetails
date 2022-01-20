import "./SampleApp.css";
import { useEffect, useState } from "react";
import { doDetailsExist } from "./Helpers";
import { useAsyncDataFetch, useAsyncDataFetchChunk } from "./Hooks/index.js";
import { getRandomIdsEndpoint, getDetailsEndpoint } from "./Requests";
import { RenderItem } from "./Components";
// This sample app will fetch from a mockDB a list of random ids;
// once the list of random ids is received;
// it will be used as param to fetch the details
// the useAsyncDataFetchChunk hook will assist with updating the RenderItems
// with the correct state and details

function App() {
  const [flatListData, setFlatListData] = useState([]);
  const [detailsToFetch, setDetailsToFetch] = useState([]);
  const [details, setDetails] = useState(new Map());

  const { resolvedData, loadingData, errorData, doneFetching } =
    useAsyncDataFetchChunk({
      detailsToFetch,
      endpoint: getDetailsEndpoint,
      keyExtractor: ["id"],
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
    handleGetDetails(5);
  }, []);

  // save what we get from resolvedData (details data)
  useEffect(() => {
    setDetails(resolvedData);
  }, [resolvedData]);

  return (
    <div className="App">
      <h1>AsyncDetails</h1>
      {flatListData.map((item, i) => {
        const idKey = JSON.stringify({ id: item.id });
        return (
          <RenderItem
            key={item.id + i.toString()}
            item={{ ...item, index: i }}
            isLoading={loadingData.has(idKey)}
            errorLoading={errorData.has(idKey)}
            details={details?.get(idKey)}
          />
        );
      })}
      <div style={{ alignItems: "center" }}>
        <div
          style={{
            margin: 10,
            borderRadius: 10,
            width: 100,
            backgroundColor: "rgb(100,100,100)",
          }}
          onClick={() => {
            // get more
            handleGetDetails(5);
            console.log("fetching more");
          }}
        >
          <h4 style={{ color: "white" }}>load more</h4>
        </div>
      </div>
      {doneFetching && <h3>All done fetching!</h3>}
    </div>
  );
}

export default App;
