import React, { Suspense } from "react";
import ClientShop from "./ClientShop";
import { fetchShopInitialData } from "@/lib/server/storefrontPrefetch";

export default async function ShopPage() {
  const initial = await fetchShopInitialData();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientShop
          initialProducts={initial.products}
          initialCategories={initial.categories}
          initialBrands={initial.brands}
          initialPagination={initial.pagination}
        />
      </Suspense>
    </div>
  );
}
