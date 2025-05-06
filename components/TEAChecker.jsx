
import React, { useState } from "react";

export default function TEAChecker() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkTEAStatus = async () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        tract: "06037920100",
        unemploymentRate: "9.2%",
        nationalAvg: "5.6%",
        qualifies: true,
        type: "高失业率地区"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>EB-5 目标就业区域（TEA）资格查询</h1>
      <input
        placeholder="请输入地址"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={checkTEAStatus}>查询</button>
      {loading && <p>正在查询，请稍候...</p>}
      {result && (
        <div>
          <p>Census Tract: {result.tract}</p>
          <p>当前失业率: {result.unemploymentRate}</p>
          <p>全国平均失业率: {result.nationalAvg}</p>
          <p>
            TEA 资格判断：
            {result.qualifies ? `符合（${result.type}）` : "不符合"}
          </p>
        </div>
      )}
    </div>
  );
}
