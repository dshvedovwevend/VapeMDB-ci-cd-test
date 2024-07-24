import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Success from "./Success";

const UserInfoForReceipt = () => {
  const { orderId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const app = searchParams.get("app");

  return (
    <div>
      <Success orderId={orderId} app={app} />
    </div>
  );
};

export default UserInfoForReceipt;
