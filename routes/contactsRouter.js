import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatus,
} from "../controllers/contactsControllers.js";
import { isValidId } from "../helpers/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { protect } from "../middelwares/authMiddelwares.js";

const contactsRouter = express.Router();

contactsRouter.get("/", protect, getAllContacts);

contactsRouter.get("/:id", protect, isValidId, getOneContact);

contactsRouter.delete("/:id", protect, isValidId, deleteContact);

contactsRouter.post(
  "/",
  protect,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  protect,
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  protect,
  isValidId,
  validateBody(updateStatusSchema),
  updateStatus
);

export default contactsRouter;
