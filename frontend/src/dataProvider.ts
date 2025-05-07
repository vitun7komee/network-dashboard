// src/dataProvider.ts
import DataProvider from "@refinedev/simple-rest";
import { axiosInstance } from "./api/axiosInstance";

export const dataProvider = DataProvider("http://localhost:4000", axiosInstance);
