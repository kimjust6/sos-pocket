import { IResoleOrdersDB } from "@/app/common/data/interfaces";

export const getOrderTotal = (order: IResoleOrdersDB) => {
  const subs = order?.subtotals;
  if (typeof subs === "number") {
    return subs;
  }
  if (Array.isArray(subs)) {
    return subs.reduce((acc, curr) => acc + curr, 0);
  }
  return 0;
};
