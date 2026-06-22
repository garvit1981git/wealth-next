import UpdateAmount from "@/app/actions/UpdateAmount";
import Amount from "@/components/ui/Amount";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  let res = await UpdateAmount(id);
  return (
    <div>
      <Amount accountId={id} goals={res}></Amount>
    </div>
  );
};

export default page;
