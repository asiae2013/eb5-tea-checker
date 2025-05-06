import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 37.0902,
  lng: -95.7129,
};

const TEAChecker = () => {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [tractInfo, setTractInfo] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!address) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    setError("");
    setTractInfo(null);

    try {
      // Step 1: 地址 → 经纬度
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status !== "OK") {
        setError("地址解析失败，请检查地址是否正确！");
        return;
      }

      const result = data.results[0].geometry.location;
      setLocation(result);
      const { lat, lng } = result;

      // Step 2: 经纬度 → Census Tract
      const fccRes = await fetch(
        `https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lng}&format=json`
      );
      const fccData = await fccRes.json();

      if (!fccData.Block) {
        setError("无法获取 Tract 信息");
        return;
      }

      const fipsCode = fccData.Block.FIPS;

      // Step 3: 查询本地 TEA 数据
      const teaRes = await fetch("/data/unemployment.json");
      const teaData = await teaRes.json();

      const resultInfo = teaData[fipsCode];

      setTractInfo({
        state: fipsCode.substring(0, 2),
        county: fipsCode.substring(2, 5),
        tract: fccData.Block.tract,
        unemploymentRate: resultInfo?.unemploymentRate ?? null,
        isTEA: resultInfo?.isTEA ?? null,
      });
    } catch (err) {
      console.error(err);
      setError("查询过程中发生错误，请稍后重试。");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>EB-5 TEA Mapping Tool</h1>
      <h2>EB-5 目标就业区域（TEA）资格查询</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="请输入地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "300px", padding: "8px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
          查询
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      {tractInfo && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>
            <strong>State:</strong> {tractInfo.state}
          </p>
          <p>
            <strong>County:</strong> {tractInfo.county}
          </p>
          <p>
            <strong>Tract:</strong> {tractInfo.tract}
          </p>
          {tractInfo.unemploymentRate !== null && (
            <>
              <p>
                <strong>失业率:</strong> {tractInfo.unemploymentRate}%
              </p>
              <p>
                <strong>是否 TEA 区:</strong>{" "}
                {tractInfo.isTEA ? "✅ 是" : "❌ 否"}
              </p>
            </>
          )}
        </div>
      )}

     <div style={{ width: "100%", height: "500px", marginTop: "20px" }}>
  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={location || defaultCenter}
      zoom={location ? 13 : 4}
    >
      {location && <Marker position={location} />}
    </GoogleMap>
        </LoadScript>
       </div>
  );
};

export default TEAChecker;
