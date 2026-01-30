// import { IResoleShoes } from "@/app/common/data/interfaces";

// const localStorage = window.localStorage;
// const RESOLE_FORM_STEPPER = "RESOLE_FORM_STEPPER";
// const RESOLE_SHOE_DETAILS = "RESOLE_SHOE_DETAILS";

// export const incrementResoleFormStepper = (): void => {
//     let stepper: string = JSON.parse(localStorage.getItem(RESOLE_FORM_STEPPER) ?? "0");
//     localStorage.setItem(RESOLE_FORM_STEPPER, (parseInt(stepper) + 1).toString());
// };

// export const decrementResoleFormStepper = (): void => {
//     let stepper: string = JSON.parse(localStorage.getItem(RESOLE_FORM_STEPPER) ?? "0");
//     localStorage.setItem(RESOLE_FORM_STEPPER, (parseInt(stepper) - 1).toString());
// };

// export const addShoeDetails = (shoeDetails: IResoleShoes) => {
//     let shoes: IResoleShoes[] = JSON.parse(localStorage.getItem(RESOLE_SHOE_DETAILS) ?? "");
//     shoes = [...shoes, shoeDetails];
//     localStorage.setItem(RESOLE_SHOE_DETAILS, JSON.stringify(shoes));
//     return shoes;
// };

// export const getShoeDetails = (): IResoleShoes[] => {
//     let shoes: IResoleShoes[] = JSON.parse(localStorage.getItem(RESOLE_SHOE_DETAILS) ?? "");
//     return shoes;
// };
// export const removeShoeDetails = (index: number): IResoleShoes[] => {
//     let shoes: IResoleShoes[] = JSON.parse(localStorage.getItem(RESOLE_SHOE_DETAILS) ?? "");
//     if (index >= shoes.length) {
//         return shoes;
//     }
//     shoes = shoes.splice(index, 1);
//     localStorage.setItem(RESOLE_SHOE_DETAILS, JSON.stringify(shoes));
//     return shoes;
// };
