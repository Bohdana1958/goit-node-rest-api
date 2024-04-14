import { promises as fs } from "fs";
import path from "path";

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contactToRemove = contacts.find(
      (contact) => contact.id === contactId
    );
    if (!contactToRemove) {
      return null;
    }
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactToRemove.id
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return contactToRemove;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const newContacts = { id: contacts.length + 1, name, email, phone };
    contacts.push(newContacts);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContacts;
  } catch (error) {
    console.log(error);
  }
}

async function updateContactById(contactId, updateData) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex !== -1) {
      contacts[contactIndex] = { ...contacts[contactIndex], ...updateData };
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return contacts[contactIndex];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
