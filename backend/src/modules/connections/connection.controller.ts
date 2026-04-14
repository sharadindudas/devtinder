import { ConnectionModel } from "../../models/connection.model";
import { AsyncHandler } from "../../utils/handlers";

export const getAllConnections = AsyncHandler(async (req, res, next) => {
  const loggedInUser = res.locals.user;

  const allConnections = await ConnectionModel.find({ users: loggedInUser._id });
  console.log(allConnections);

  res.status(200).json({ success: true, data: allConnections });
});

export const removeConnection = AsyncHandler(async (req, res, next) => {});

