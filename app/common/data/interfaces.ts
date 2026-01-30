export interface IUsersDB {
  email: string;
  password?: string | undefined;
  image: string | null;
  fName: string;
  lName: string;
  role: string;
  orders: [string] | [];
  phone: string | null;
  forgotPasswordToken: string | null;
  forgotPasswordTokenExpiration?: Date | null;
  verifyToken: string | null;
  verifyTokenExpiration?: Date | null;
  isVerified?: boolean | null;
  provider: string | null;
  tocAccepted: boolean | null;
}

// this is strictly to iterate over the keys of the interface object for puts
export const sampleUser: IUsersDB = {
  email: "",
  password: "",
  image: "",
  fName: "",
  lName: "",
  role: "",
  orders: [""],
  phone: null,
  forgotPasswordToken: null,
  forgotPasswordTokenExpiration: null,
  verifyToken: null,
  verifyTokenExpiration: null,
  isVerified: false,
  provider: "",
  tocAccepted: false,
};

export interface IResoleShoesDB {
  orderId?: string;
  size: string;
  manufacturer: string;
  model: string;
  serviceType: string;
  addons: [{ name: string; price: number }] | [];
  image: string;
  location: string;
  status: string;
  price: number;
}

// save form into this data structure before sending to db
export interface IResoleInfo {
  size: string;
  manufacturer: string;
  otherManufacturer?: string;
  model: string;
  serviceType: string;
  image: string;
}

// this is strictly to iterate over the keys of the interface object for puts
export const sampleResoleShoes: IResoleShoesDB = {
  orderId: "",
  size: "",
  manufacturer: "",
  model: "",
  serviceType: "",
  addons: [{ name: "", price: 0 }],
  image: "",
  location: "",
  status: "",
  price: 0,
};

export interface IResoleOrdersDB {
  _id?: string;
  fName: string;
  lName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  provider: string;
  postalCode: string;
  country: string;
  phone: string;
  status: string;
  shoes: IResoleShoesDB[] | string[]; //array of ids
  created: Date;
  updated: Date;
  subtotal: number[];
  deliveryType: string;
}

// this is strictly to iterate over the keys of the interface object when checking for puts
export const sampleResoleOrders: IResoleOrdersDB = {
  fName: "",
  lName: "",
  email: "",
  address: "",
  city: "",
  province: "",
  provider: "",
  postalCode: "",
  country: "",
  phone: "",
  status: "",
  shoes: [],
  created: new Date(),
  updated: new Date(),
  subtotal: [0],
  deliveryType: "",
};

export interface IAddress {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
  province: string;
  postal: string;
  // isLoaded?: boolean;
}
