import "express";
import type { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Locals {
      user: User;
      body?: unknown;
      query?: unknown;
      params?: unknown;
      headers?: unknown;
      cookies?: unknown;
    }
  }
}

type JwtUserPayload = {
  _id: string;
};
