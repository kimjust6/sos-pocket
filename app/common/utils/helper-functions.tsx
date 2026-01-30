import { IResoleOrdersDB } from "@/app/common/data/interfaces";

export const getOrderTotal = (order: IResoleOrdersDB) => {
  let total = 0;
  order?.subtotal?.forEach((price) => {
    total += price;
  });
  return total;
};
