"use client";
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { dashboardAtom } from "@/app/common/atoms/atoms";

const Modal = ({ resoleOrder }: any) => {
  const [ShowModal, setShowModal] = useAtom(dashboardAtom);

  return (
    <div
      className="fixed z-40 pointer-cursor"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={() => setShowModal((ShowModal) => !ShowModal)}>
      <div className="fixed inset-0 bg-stone-950 bg-opacity-30 transition-all "></div>
      <div className="fixed inset-0 z-50 overflow-hidden ">
        <div className="flex min-h-full items-center justify-center p-8 text-center sm:p-0 backdrop-blur-[2px] ">
          <b
            className=" relative transform overflow-hidden rounded-md bg-stone-100 text-left transition-all 
                        sm:my-8 sm:w-full sm:max-w-lg"
            onClick={() => setShowModal((ShowModal) => !ShowModal)}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3  sm:ml-4 sm:mt-0 text-left">
                  <h3 className="card_title" id="modal-title">
                    {resoleOrder.fName} {resoleOrder.lName}
                  </h3>

                  <div className="card_text">
                    <p className="">
                      <span className="card_label">Order No:</span>{" "}
                      {resoleOrder._id.slice(-8)}
                    </p>
                    <p className="card_label">
                      Status:{" "}
                      <span className="card_text">{resoleOrder.status}</span>
                    </p>
                    <p className="card_label">
                      Phone No:{" "}
                      <span className="card_text">{resoleOrder.phone}</span>
                    </p>
                    <p className="card_label">
                      Order Date:{" "}
                      <span className="card_text">
                        {new Date(resoleOrder.created).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="card_label">
                      Address:{" "}
                      <span className="card_text">
                        <span className="capitalize">
                          {resoleOrder.address}, {resoleOrder.city},{" "}
                          {resoleOrder.province}
                        </span>
                        ,{" "}
                        <span className="uppercase">
                          {resoleOrder.postalCode}
                        </span>
                      </span>
                    </p>
                    <p className="card_label">
                      {resoleOrder.shoes.map((shoe: any, index: number) => {
                        return (
                          <span key={"shoe" + index}>
                            Shoe {index + 1}:{" "}
                            <span className="card_text">
                              {shoe.serviceType} {shoe.model} <br />
                            </span>
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-stone-200 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                onClick={() => {
                  setShowModal((ShowModal) => !ShowModal);
                }}
                type="button"
                className="inline-flex button_accent">
                Edit
              </button>
              <button
                onClick={() => {
                  setShowModal((ShowModal) => !ShowModal);
                }}
                type="button"
                className="mt-1 button_primary">
                Back
              </button>
            </div>
          </b>
        </div>
      </div>
    </div>
  );
};

export default Modal;
