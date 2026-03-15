"use client";
import { useAtom } from "jotai";
import { dashboardAtom, shoeDetailsAtom } from "@/app/common/atoms/atoms";
import Modal from "./modal";
import { useEffect } from "react";

const OrderCard = ({ resoleOrders }: any) => {
  const [showModal, setShowModal] = useAtom(dashboardAtom);
  const [shoeDetails, setShoeDetails] = useAtom(shoeDetailsAtom);

  // useEffect(() => {}, [resoleOrders]);
  // let myResoleOrders: any = [];
  // let myResoleOrders = JSON.parse(resoleOrders);
  let myResoleOrders = resoleOrders;
  return myResoleOrders ? (
    <>
      {showModal ? <Modal resoleOrder={shoeDetails} /> : ""}
      {myResoleOrders &&
        myResoleOrders.map((shoes: any) => {
          return (
            <button
              key={shoes.id}
              id={shoes.id}
              onClick={(e) => {
                setShoeDetails(shoes);
                setShowModal((ShowModal) => !ShowModal);
              }}
              className="card glassmorphism-sm group">
              <h5 className="card_title">
                {shoes.fName} {shoes.lName}
              </h5>

              <p className="card_label">
                Order No:{" "}
                <span className="card_text">{shoes.id.slice(-8)}</span>
              </p>
              <p className="card_label">
                {shoes.shoes.map((shoe: any, index: number) => {
                  return (
                    <span key={index}>
                      Shoe {index + 1}:{" "}
                      <span className="card_text">
                        {shoe.serviceType} {shoe.model} <br />
                      </span>
                    </span>
                  );
                })}
              </p>
              <p className="card_label">
                Status: <span className="card_text">{shoes.status}</span>
              </p>
              <p className="card_label">
                Phone No: <span className="card_text">{shoes.phone}</span>
              </p>
              <p className="card_label">
                Order Date:{" "}
                <span className="card_text">
                  {new Date(shoes.created).toLocaleDateString()}
                </span>
              </p>
            </button>
          );
        })}
    </>
  ) : (
    ""
  );
};

export default OrderCard;
