import { Contact } from "../models/contactModel.js";

async function listContacts() {
  const contact = await Contact.find();
  return contact;
}

async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contactToRemove = await Contact.findByIdAndDelete(contactId);
  return contactToRemove;
}

async function addContact(data) {
  const newContacts = await Contact.create(data);
  return newContacts;
}

async function updateContactById(contactId, updateData) {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );
  return updatedContact;
}
async function updateStatusContact(contactId, updateData) {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    {
      new: true,
    }
  );
  return updatedContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
  updateStatusContact,
};
