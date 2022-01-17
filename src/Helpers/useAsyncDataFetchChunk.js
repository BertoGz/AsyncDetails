import { useEffect, useLayoutEffect, useState } from "react";

export const useAsyncDataFetchChunk = ({ oGpayload, endpoint }) => {
  const initVals = new Map(oGpayload.map((item) => [item.label, true]));
  const [resolvedData, setResolvedData] = useState(new Map());
  const [loadingData, setLoadingData] = useState(new Map());
  const [errorData, setErrorData] = useState(new Map());
  const [doneFetching, setDoneFetching] = useState(false);

  const [dataToLoad, setDataToLoad] = useState(null);
  const [dataToNotLoad, setDataToNotLoad] = useState(null);
  
  /**
   * @description
   * everytime this hook receives a payload (oGpayload)
   * 1) convert the payload to a map
   * 2) set a state of the items we want to put in a loading state;
   * 2) call the endpoint to fetch the data;
   * 3) once it resolves, we remove the loading items
   */
  useLayoutEffect(() => {
    if (oGpayload?.length) {
      const mappedPayload = new Map(initVals);
      setDataToLoad(mappedPayload);
      console.log("items fetching", oGpayload);
      setDoneFetching(false);

      new Promise((res, rej) => {
        endpoint()
          .then(() => {
            setDataToNotLoad(mappedPayload);
            res();
          })
          .catch(() => {
            const updatedMap = new Map([
              oGpayload.map((item) => [item.label, true]),
              ...errorData,
            ]);
            setErrorData(updatedMap);
            setDoneFetching(true);
            rej();
          });
      });
    }
  }, [oGpayload]);

  useLayoutEffect(() => {
    if (dataToLoad) {
      setLoadingData(new Map([...loadingData, ...dataToLoad]));
      setDataToLoad(null);
    }
  }, [dataToLoad]);

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

  useEffect(() => {
    if (loadingData.size === 0) {
      setDoneFetching(true);
    }
  }, [loadingData]);

  return { resolvedData, loadingData, errorData, doneFetching };
};
