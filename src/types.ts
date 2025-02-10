export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
  category: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Filters {
  search: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  category: string;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation';