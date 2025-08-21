import ClientRoutes from "./routes/ClientRoutes.jsx";
import { initWsClient } from "./api/wsClient.js";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    initWsClient({
      url: "wss://kjjcgsvslatkvloyeraw.hasura.ap-south-1.nhost.run/v1/graphql",
      accessToken,
    });
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900">
      <ClientRoutes />
    </div>
  );
}
