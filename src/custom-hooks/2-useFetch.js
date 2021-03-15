import { useState, useEffect, useCallback } from "react";

export const useFetch = (request) => {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [data, setData] = useState({});

  const getData = useCallback(async () => {
    try {
      const response = await fetch(request);
      const data = await response.json();
      setData(data);
      setResponse(response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [request]);

  useEffect(() => {
    getData();
  }, [request, getData]);
  
  return { loading, response, data };
};
