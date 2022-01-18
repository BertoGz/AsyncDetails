import { useEffect, useLayoutEffect, useState } from "react";

export const useAsyncDataFetchChunk = ({
  detailsToFetch,
  keyExtractor,
  endpoint,
}) => {
  const initVals = new Map(
    detailsToFetch.map((item) => [item[keyExtractor], true])
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
   * everytime this hook receives a payload (detailsToFetch)
   * 1) convert the payload to a map
   * 2) set a state of the items we want to put in a loading state;
   * 2) call the endpoint to fetch the data;
   * 3) once it resolves, we remove the loading items
   */
  useLayoutEffect(() => {
    if (detailsToFetch?.length) {
      const mappedPayload = new Map(initVals);
      setDataToLoad(mappedPayload);
      console.log("items fetching", detailsToFetch);
      setDoneFetching(false);

      new Promise((res, rej) => {
        endpoint(detailsToFetch)
          .then((payload) => {
            setDataAsResolved(
              new Map(payload.map((item) => [item[keyExtractor], item]))
            );
            setDataToNotLoad(mappedPayload);
            res();
          })
          .catch(() => {
            setDataAsError(mappedPayload);
            setDataToNotLoad(mappedPayload);
            rej();
          });
      });
    }
  }, [detailsToFetch]);

  // listener for loading data, we add the key from the loading state.
  useLayoutEffect(() => {
    if (dataToLoad) {
      setLoadingData(new Map([...loadingData, ...dataToLoad]));
      setDataToLoad(null);
    }
  }, [dataToLoad]);

  // listener for resolved data, we remove the key from the loading state.
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

  // listener for when loadingData is 0 we set doneFetching to true

  // listener for error data, we push to errorData state
  useLayoutEffect(() => {
    if (dataAsError) {
      setErrorData(new Map([...errorData, ...dataAsError]));
      setDataAsError(null);
    }
  }, [dataAsError]);

  // listener for error data, we push to errorData state
  useLayoutEffect(() => {
    if (dataAsResolved) {
      setResolvedData(new Map([...resolvedData, ...dataAsResolved]));
      setDataAsResolved(null);
    }
  }, [dataAsResolved]);

  // listener for when loadingData is 0 we set doneFetching to true
  useEffect(() => {
    if (loadingData.size === 0) {
      setDoneFetching(true);
    }
  }, [loadingData]);

  return { resolvedData, loadingData, errorData, doneFetching };
};
