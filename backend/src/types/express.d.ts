import "express";
import type { User } from "../models/user.model";

declare global {
  namespace Express {
    interface Locals {
      user: User;
      validatedData?: unknown;
    }
  }
}
