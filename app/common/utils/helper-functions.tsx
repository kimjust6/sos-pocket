import { IResoleOrdersDB } from "@/app/common/data/interfaces";

export const getOrderTotal = (order: IResoleOrdersDB) => {
  let total = 0;
  order?.subtotals?.forEach((price: number) => {
    total += price;
  });
  return total;
};
