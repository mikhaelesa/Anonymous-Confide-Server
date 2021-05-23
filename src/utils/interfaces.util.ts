import { setHeaderType } from "./types.utils";

export interface ICors {
  origins: setHeaderType;
  methods: setHeaderType;
  allowedHeaders: setHeaderType;
}

export interface IJSONResponse {
  status: number;
  message: string;
}

export interface IJSONResponseError extends IJSONResponse {
  error?: any;
}
