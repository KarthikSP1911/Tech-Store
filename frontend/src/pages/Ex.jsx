import { useEffect, useState } from "react";

function Ex() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/v1/ex")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <>
      <p className="text-3xl bg-amber-300">
        Start Building your app here ......
      </p>
      {data && <p className="text-lg mt-4">{data.message}</p>}
    </>
  );
}

export default Ex;
