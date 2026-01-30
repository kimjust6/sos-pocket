import { IconProps } from "@radix-ui/react-icons/dist/types";
import React from "react";

const Spinner = (props: IconProps) => {
  return (
    // <div
    //   className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-stone-700
    //                 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    //   role="status"
    // >
    //   <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
    //     Loading...
    //   </span>
    // </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default Spinner;
