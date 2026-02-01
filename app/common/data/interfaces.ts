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
  id?: string;
  size: string;
  manufacturer: string;
  model: string;
  service_type: string;
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
  id: "",
  size: "",
  manufacturer: "",
  model: "",
  service_type: "",
  addons: [{ name: "", price: 0 }],
  image: "",
  location: "",
  status: "",
  price: 0,
};

export interface IResoleOrdersDB {
  id: string; // PocketBase uses string IDs (15 chars)
  first_name: string;
  last_name: string;
  email: string;
  street_address: string;
  city: string;
  province: string;
  provider: string;
  postal_code: string;
  country: string;
  phone: string;
  status: string;
  shoes: any[]; // Changed to any[] to accommodate expanded records or IDs. Ideally should be ResoleShoesResponse[]
  created: string; // Changed to string to match IsoDateString
  updated: string; // Changed to string to match IsoDateString
  subtotals: number[];
  delivery_type: string;
  expand?: any; // PocketBase expansion
}

// this is strictly to iterate over the keys of the interface object when checking for puts
// this is strictly to iterate over the keys of the interface object when checking for puts
export const sampleResoleOrders: IResoleOrdersDB = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  street_address: "",
  city: "",
  province: "",
  provider: "",
  postal_code: "",
  country: "",
  phone: "",
  status: "",
  shoes: [],
  created: "",
  updated: "",
  subtotals: [0],
  delivery_type: "",
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
