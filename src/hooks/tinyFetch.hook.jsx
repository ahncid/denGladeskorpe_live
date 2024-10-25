import { useState } from "react";
import { serverPath } from "../services/settings"; 

const useTinyFetch = () => {
  const [data, setData] = useState([]);

  const fetchData = async (url) => {

    const response = await fetch(`${serverPath}${url}`);
    const result = await response.json();
    setData(result.data);

    return result;
  };

  return {
    data,
    fetchData,
  };
};

export default useTinyFetch;
