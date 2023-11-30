import { create } from "zustand";

const initialState = {};

const tradesStore = create((set, get) => ({
  ...initialState,
}));
