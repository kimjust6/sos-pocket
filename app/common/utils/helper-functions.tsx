import { IResoleOrdersDB } from "@/app/common/data/interfaces";

export const getOrderTotal = (order: IResoleOrdersDB) => {
  let total = 0;
  const subs = order?.subtotals as number | number[] | undefined;
  if (typeof subs === "number") {
    total = subs;
  } else if (Array.isArray(subs)) {
    total = (subs as number[]).reduce(
      (acc: number, curr: number) => acc + curr,
      0
    );
  }

  if (order?.shipping_amount) {
    total += order.shipping_amount;
  }

  if (order?.tax) {
    total += order.tax;
  }

  return total;
};
