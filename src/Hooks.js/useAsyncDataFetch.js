/* WIP
import { useEffect, useLayoutEffect, useState } from "react";

export const useAsyncDataFetch = ({ oGpayload, endpoint }) => {
  const initVals = new Map(oGpayload.map((item) => [item.label, true]));
  const [updater, setUpdater] = useState(null);
  const [resolvedData, setResolvedData] = useState(new Map());
  const [loadingData, setLoadingData] = useState(initVals);
  const [errorData, setErrorData] = useState(new Map());
  const [doneFetching, setDoneFetching] = useState(false);
  const [listData, setListData] = useState([]);
  useLayoutEffect(() => {
    if (oGpayload?.length) {
      console.log("!!@@hello i was here");
      setLoadingData(new Map([...initVals, ...loadingData]));
      setDoneFetching(false);
      //setResolvedData(new Map(resolvedData));
      //setErrorData(new Map(errorData));

      //const arr = Array.from(resolvedData, ([name, value]) => value);
      //setListData([...listData,...arr])
    }
  }, [oGpayload]);
  //console.log("!!loading data", loadingData);
  useEffect(() => {
    if (oGpayload?.length) {
      Promise.all(
        oGpayload.map((item, i) => {
          const prom = new Promise((res, rej) => {
            endpoint()
              .then(() => {
                const moreDetails = "extra_data";
                setUpdater({
                  key: item.label,
                  payload: moreDetails,
                  error: false,
                });
                res();
              })
              .catch(() => {
                setUpdater({ key: item.label, payload: null, error: true });
                rej();
              });
          });
          return prom;
        })
      ).then(() => setDoneFetching(true));
    }
  }, [oGpayload]);
  useEffect(() => {
    if (updater?.key) {
      const updatedMap = new Map(loadingData);
      updatedMap.delete(updater.key);
      setLoadingData(updatedMap);

      if (updater.error) {
        const errorMap = new Map(errorData);
        errorMap.set(updater.key, true);
        setErrorData(errorMap);
      } else {
        const updatedMap2 = new Map(resolvedData);
        updatedMap2.set(updater.key, updater.payload);
        setResolvedData(updatedMap2);
      }
    }
  }, [updater]);

  useEffect(() => {}, [doneFetching]);
  return { resolvedData, loadingData, errorData, doneFetching };
};
*/