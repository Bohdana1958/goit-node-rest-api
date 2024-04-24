import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContact,
} from "../services/contactsServices.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import { HttpError } from "../helpers/HttpError.js";

import { catchAsync } from "../helpers/catchAsync.js";

export const getAllContacts = catchAsync(async (req, res, next) => {
  const { _id: owner } = req.user;
  const contacts = await listContacts(owner);
  res.status(200).json(contacts);
});

export const getOneContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const contact = await getContactById(id, owner);
  if (!contact) {
    return next(HttpError(404, "Not found"));
  }
  res.status(200).json(contact);
});

export const deleteContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await removeContact(id, owner);
  if (!deletedContact) {
    return next(HttpError(404, "Not found"));
  }
  res.status(200).json(deletedContact);
});

export const createContact = catchAsync(async (req, res, next) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }
  const { _id: owner } = req.user;
  const newContact = await addContact(req.body, owner);
  res.status(201).json(newContact);
});

export const updateContact = catchAsync(async (req, res) => {
  if (Object.keys(req.body).length < 1) {
    throw HttpError(400, "Body must have at least one field");
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updatedContact = await updateContactById(id, owner, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Contact not found");
  }

  res.status(200).json(updatedContact);
});

export const updateStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const { favorite } = req.body;

  const updatedContact = await updateStatusContact(id, { favorite }, owner);

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json(updatedContact);
});
