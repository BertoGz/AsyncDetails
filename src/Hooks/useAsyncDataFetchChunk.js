import { useEffect, useLayoutEffect, useState } from "react";

export const useAsyncDataFetchChunk = ({
  detailsToFetch,
  keyExtractor,
  endpoint,
}) => {
  const mappedKeys = new Map(
    detailsToFetch.map((item) => {
      let o = new Object();
      keyExtractor.forEach((x, i) => {
        o[keyExtractor[i]] = item[keyExtractor[i]];
      });

      return [JSON.stringify(o), true];
    })
  );
  const [resolvedData, setResolvedData] = useState(new Map());
  const [loadingData, setLoadingData] = useState(new Map());
  const [errorData, setErrorData] = useState(new Map());
  const [doneFetching, setDoneFetching] = useState(false);

  const [dataToLoad, setDataToLoad] = useState(null);
  const [dataToNotLoad, setDataToNotLoad] = useState(null);
  const [dataAsError, setDataAsError] = useState(null);
  const [dataAsResolved, setDataAsResolved] = useState(null);
  /**
   * @description
   * this hook receives a payload of ids (detailsToFetch)
   * 1) convert the payload to a map
   * 2)  call the endpoint to fetch the data; set a state of the items in a loading state;
   * 3) once it resolves, we remove the loading items
   * 4) return the resolved data
   */

  //
  useLayoutEffect(() => {
    if (detailsToFetch?.length) {
      setDataToLoad(mappedKeys);
      console.log("items fetching", detailsToFetch);
      setDoneFetching(false);

      new Promise((res, rej) => {
        endpoint(detailsToFetch)
          .then((payload) => {
            setDataAsResolved(
              //['id','dependent_id']
              new Map(
                payload.map((item) => {
                  let o = new Object();
                  keyExtractor.forEach((x, i) => {
                    o[keyExtractor[i]] = item[keyExtractor[i]];
                  });
                  return [JSON.stringify(o), item];
                })
              )
            );

            setDataToNotLoad(mappedKeys);
            res();
          })
          .catch(() => {
            setDataAsError(mappedKeys);
            setDataToNotLoad(mappedKeys);
            rej();
          });
      });
    }
  }, [detailsToFetch]);

  // listener for loading data, we append keys.
  useLayoutEffect(() => {
    if (dataToLoad) {
      setLoadingData(new Map([...loadingData, ...dataToLoad]));
      setDataToLoad(null);
    }
  }, [dataToLoad]);

  // listener for resolved data, we remove keys from the loading state.
  useLayoutEffect(() => {
    if (dataToNotLoad) {
      const changes = new Map(loadingData);
      Array.from(dataToNotLoad, ([name, value]) => name).map((item) =>
        changes.delete(item)
      );
      setLoadingData(changes);
      setDataToNotLoad(null);
    }
  }, [dataToNotLoad]);

  // listener for error data, we push to errorData state
  useLayoutEffect(() => {
    if (dataAsError) {
      setErrorData(new Map([...errorData, ...dataAsError]));
      console.log("data fetch Errors");
      setDataAsError(null);
    }
  }, [dataAsError]);

  // listener for resolved data, we push to resolvedData
  useLayoutEffect(() => {
    if (dataAsResolved) {
      const resData = new Map([...resolvedData, ...dataAsResolved]);
      setResolvedData(resData);
      console.log("data fetched", resData);
      setDataAsResolved(null);
    }
  }, [dataAsResolved]);

  // when loadingData size 0 we set doneFetching to true
  useEffect(() => {
    if (loadingData.size === 0) {
      setDoneFetching(true);
    }
  }, [loadingData]);

  return { resolvedData, loadingData, errorData, doneFetching };
};
