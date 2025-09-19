export interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
}

export interface Feedback {
  id: string;
  userId: string;
  message: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}