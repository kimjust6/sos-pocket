import React from "react";
import { desktopAdminDashboardOrderTable } from "@/app/common/data/data";
import Spinner from "./spinner";
import { useAtom } from "jotai";
import { dashboardAtom, shoeDetailsAtom } from "@/app/common/atoms/atoms";
import Modal from "./modal";
const OrderTable = ({ resoleOrders }: any) => {
  const [showModal, setShowModal] = useAtom(dashboardAtom);
  const [shoeDetails, setShoeDetails] = useAtom(shoeDetailsAtom);
  return (
    <>
      {showModal ? <Modal resoleOrder={shoeDetails} /> : ""}
      {resoleOrders ? (
        <div
          className=" relative overflow-x-auto bg-clip-padding backdrop-filter backdrop-blur-sm 
                    bg-opacity-50 outline outline-1 rounded-md outline-zinc-600 shadow-md">
          <table className="w-full text-sm text-left text-zinc-500 ">
            <thead className="text-xs text-zinc-700 uppercase bg-stone-300 bg-opacity-60 ml-95 ">
              <tr>
                {desktopAdminDashboardOrderTable.map((column) => {
                  return (
                    <th key={column.name} scope="col" className="px-6 py-3">
                      {column.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {resoleOrders.map((order: any, index: number) => {
                return (
                  <tr
                    onClick={(e) => {
                      setShoeDetails(order);
                      setShowModal((ShowModal) => !ShowModal);
                    }}
                    className={
                      "border-b cursor-pointer hover:bg-stone-50  hover:opacity-70 " +
                      (index % 2 === 0 ? " bg-white " : " bg-zinc-100 ")
                    }
                    key={order.id}>
                    <td className="px-6 py-4 uppercase">
                      {order.id.slice(-8)}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap capitalize">
                      {order.first_name} {order.last_name}
                    </th>
                    <td className="px-6 py-4 capitalize">{order.status}</td>
                    <td className="px-6 py-4 lowercase">{order.email}</td>
                    <td className="px-6 py-4">{order.phone}</td>
                    <td className="px-6 py-4">
                      {order.shoes.map((shoe: any, index: number) => {
                        return (
                          <span key={index}>
                            {shoe.model + (order.shoes[index + 1] ? ", " : "")}
                          </span>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.created)?.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default OrderTable;
