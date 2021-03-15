import React from "react";
import { useFetch } from "../custom-hooks/2-useFetch";
import RequestBuilder from "../utils/RequestBuilder";
export default function Home() {

  const testhook = async () => {
    const builder = new RequestBuilder(
      "https://find-your-gap-api.herokuapp.com",
      "/results"
    );
    builder.setOptions({
      method: "POST",
      body: { name: "casa" },
    });
    
    const response = fetch(builder.getRequest());
    const data = await response.json();
    console.log(data)

    
  };

  return (
    <div>
        {/* {loading && <p>Cargando</p>} */}
      <button onClick={testhook}>Click to test</button>
    </div>
  );
}
