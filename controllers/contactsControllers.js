import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,

  updateStatusContact,

} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

import { catchAsync } from "../helpers/catchAsync.js";

export const getAllContacts = catchAsync(async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

export const getOneContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    return next(HttpError(404, "Not found"));
  }
  res.status(200).json(contact);
});

export const deleteContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedContact = await removeContact(id);
  if (!deletedContact) {
    return next(HttpError(404, "Not found"));
  }
  res.status(200).json(deletedContact);
});

export const createContact = catchAsync(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate({ name, email, phone });
  if (error) {
    return next(HttpError(400, error.message));
  }
  const newContact = await addContact({ name, email, phone });
  res.status(201).json(newContact);
});

export const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;


export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    if (!contact) {
      return next(HttpError(404, "Not found"));
    }
    res.status(200).json(contact);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      return next(HttpError(404, "Not found"));
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const { error } = createContactSchema.validate({ name, email, phone });
    if (error) {
      return next(HttpError(400, error.message));
    }

    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;


  if (!name && !email && !phone) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }


  const updatedContact = await updateContactById(id, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Contact not found");
  }

  res.status(200).json(updatedContact);
});

export const updateStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const updatedContact = await updateStatusContact(id, { favorite });

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json(updatedContact);
});

  try {
    const { error } = updateContactSchema.validate({ name, email, phone });
    if (error) {
      return next(HttpError(400, error.message));
    }

    const existingContact = await getContactById(id);
    if (!existingContact) {
      return next(HttpError(404, "Contact not found"));
    }

    const updatedName = name || existingContact.name;
    const updatedEmail = email || existingContact.email;
    const updatedPhone = phone || existingContact.phone;

    const updatedContact = await updateContactById(id, {
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
    });

    res.status(200).json(updatedContact);
  } catch (error) {
    next(HttpError(500, "Internal Server Error"));
  }
};

