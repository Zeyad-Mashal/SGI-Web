import React, { Suspense } from "react";
import ClientShop from "./ClientShop";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientShop />
      </Suspense>
    </div>
  );
};

export default page;
