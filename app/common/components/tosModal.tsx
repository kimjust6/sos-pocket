"use client";

import { useAtom } from "jotai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { tosModalAtom } from "@/app/common/atoms/atoms";

const TOSModal = () => {
  const [tosModal, setTosModal] = useAtom(tosModalAtom);

  const router = useRouter();
  // setShowModal(true);
  return (
    tosModal && (
      <div
        className="fixed z-40 pointer-cursor"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        onClick={() => setTosModal((ShowModal: boolean) => !ShowModal)}>
        <div className="fixed inset-0 bg-stone-950 bg-opacity-30 transition-all "></div>
        <div className="fixed inset-0 z-50 overflow-hidden ">
          <div className="flex min-h-full items-center justify-center p-8 text-center sm:p-0 backdrop-blur-[2px] ">
            <b
              className=" relative transform overflow-hidden rounded-md bg-stone-100 text-left transition-all 
                        sm:my-8 sm:w-full sm:max-w-lg"
              onClick={() => setTosModal((ShowModal: boolean) => !ShowModal)}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3  sm:ml-4 sm:mt-0 text-left">
                    TOS Policy
                  </div>
                </div>
              </div>
              <div className="bg-stone-200 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => {
                    setTosModal(false);
                  }}
                  type="button"
                  className="inline-flex button_accent">
                  Accept
                </button>
                <button
                  onClick={() => {
                    setTosModal(false);
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
    )
  );
};

export default TOSModal;
