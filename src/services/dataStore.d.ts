export interface DataStore {
  getRoot<T>(): Promise<T | null>;
  get<T>(key: string | string[]): Promise<T | null>;
  get<T>(key: string | string[], defaultValue: T): Promise<T>;
  set<T>(key: string | string[], value: T): Promise<void>;
}
export declare type CreateDataStore = (id: string, defaults: object, directory?: string) => Promise<DataStore>;
export declare const createDataStore: CreateDataStore;
