import { Contact } from "../models/contactModel.js";

async function listContacts(owner) {
  const contact = await Contact.find({ owner }, "-createdAt -updatedAt");
  return contact;
}

async function getContactById(contactId, owner) {
  const contact = await Contact.findOne({ _id: contactId, owner: owner });
  return contact || null;
}

async function removeContact(contactId, owner) {
  const contactToRemove = await Contact.findOneAndDelete({
    _id: contactId,
    owner: owner,
  });
  return contactToRemove;
}

async function addContact(data, owner) {
  const newContacts = await Contact.create({ ...data, owner });
  return newContacts;
}

async function updateContactById(contactId, updateData, owner) {
  const updatedContact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: owner,
    },
    updateData,
    { new: true }
  );
  return updatedContact;
}
async function updateStatusContact(contactId, updateData, owner) {
  const updatedContact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: owner,
    },
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
