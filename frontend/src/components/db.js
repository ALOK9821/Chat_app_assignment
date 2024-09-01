// db.js
import { openDB } from 'idb';

const dbPromise = openDB('chat-app', 1, {
  upgrade(db) {
    db.createObjectStore('messages', {
      keyPath: 'id',
      autoIncrement: true,
    });
  },
});

export const addMessage = async (message) => {
  const db = await dbPromise;
  await db.add('messages', message);
};

export const getMessages = async () => {
  const db = await dbPromise;
  return await db.getAll('messages');
};

export const clearMessages = async () => {
  const db = await dbPromise;
  await db.clear('messages');
};

