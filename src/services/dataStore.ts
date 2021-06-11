import fs from 'fs';
import { promisify } from 'util';
import StormDB from 'stormdb';

const mkdir = promisify(fs.mkdir);

export interface DataStore {
  getRoot<T>(): Promise<T | null>;
  get<T>(key: string | string[]): Promise<T | null>;
  get<T>(key: string | string[], defaultValue: T): Promise<T>;
  set<T>(key: string | string[], value: T): Promise<void>;
  delete(key: string | string[]): Promise<void>;
}

export type CreateDataStore = (id: string, defaults: object, directory?: string) => Promise<DataStore>;

export const createDataStore: CreateDataStore = async (id, defaults, directory = '.cognito/db'): Promise<DataStore> => {
  await mkdir(directory, { recursive: true });
  const engine = new StormDB.localFileEngine(`${directory}/${id}.json`, {
    async: true,
    serialize: (obj: unknown) => JSON.stringify(obj, undefined, 2),
  });
  const db = new StormDB(engine);

  db.default(defaults);

  return {
    async getRoot() {
      return (await db.value()) ?? null;
    },

    async get(key: string | string[], defaultValue?: unknown) {
      return (
        (await (key instanceof Array ? key : [key]).reduce((acc, k) => acc.get(k), db).value()) ?? defaultValue ?? null
      );
    },

    async set(key: string | string[], value) {
      await db.set((key instanceof Array ? key : [key]).join('.'), value).save();
    },

    async delete(key: string | string[]) {
      (key instanceof Array ? key : [key]).reduce((acc, k) => acc.get(k), db).delete();
      return await db.save();
    },
  };
};
