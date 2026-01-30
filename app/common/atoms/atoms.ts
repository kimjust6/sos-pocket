import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { IAddress, IResoleInfo } from "@/app/common/data/interfaces";

// manages whether or not the side bar is open
export const sidebarAtom = atomWithStorage("sidebar", false);

export const uploadingImageAtom = atom<string[]>([]);

export const addressAtom = atomWithStorage("shipAddress", {
  fName: "",
  lName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  apartment: "",
  province: "",
  postal: "",
} as IAddress);
// manages whether the tosModal is open
export const tosModalAtom = atom(false);
export const dashboardAtom = atom(false);
// manages form stepper
export const resoleFormStepper = atomWithStorage("resoleFormStepper", 0);
// manages whether the dashboard item opens in full screen
export const shoeDetailsAtom = atomWithStorage("shoeDetails", {
  shoes: [
    {
      size: "",
      manufacturer: "",
      otherManufacturer: "",
      model: "",
      serviceType: "",
      image: "",
    } as IResoleInfo,
  ],
});
