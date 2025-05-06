
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 37.0902, // 默认美国中心
  lng: -95.7129,
};

const TEAChecker = () => {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);

  const handleSearch = async () => {
    if (!address) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === "OK") {
      const result = data.results[0].geometry.location;
      setLocation(result);
    } else {
      alert("地址解析失败，请检查地址是否正确！");
    }
  };

  return (
    <div>
      <h1>EB-5 TEA Mapping Tool</h1>
      <h2>EB-5 目标就业区域（TEA）资格查询</h2>
      <input
        type="text"
        placeholder="请输入地址"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSearch}>查询</button>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={location || center} zoom={location ? 12 : 4}>
          {location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default TEAChecker;
