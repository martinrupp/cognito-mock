import { createDataStore } from "../src/services/dataStore";
import fs from "fs";
import { promisify } from "util";

const mkdtemp = promisify(fs.mkdtemp);
const readFile = promisify(fs.readFile);
const rmdir = promisify(fs.rmdir);

describe("Data Store", () => {
  let path: string;

  beforeEach(async () => {
    path = await mkdtemp("/tmp/cognito-mock:");
  });

  afterEach(() =>
    rmdir(path, {
      recursive: true,
    })
  );

  it("creates a named database", async () => {
    await createDataStore("example", {}, path);

    expect(fs.existsSync(path + "/example.json")).toBe(true);
  });

  it("saves the default objects when a save occurs", async () => {
    const dataStore = await createDataStore(
      "example",
      { DefaultValue: true },
      path
    );

    await dataStore.set("key", 1);

    const file = JSON.parse(await readFile(path + "/example.json", "utf-8"));
    expect(file).toEqual({
      DefaultValue: true,
      key: 1,
    });
  });

  describe("set", () => {
    it("saves a value", async () => {
      const dataStore = await createDataStore("example", {}, path);

      await dataStore.set("key1", 1);
      await dataStore.set("key2", 2);

      const file = JSON.parse(await readFile(path + "/example.json", "utf-8"));

      expect(file).toEqual({
        key1: 1,
        key2: 2,
      });
    });

    it("saves a nested value", async () => {
      const dataStore = await createDataStore("example", {}, path);

      await dataStore.set("key.a.b", 1);

      const file = JSON.parse(await readFile(path + "/example.json", "utf-8"));

      expect(file).toEqual({
        key: {
          a: {
            b: 1,
          },
        },
      });
    });

    it("replaces a value", async () => {
      const dataStore = await createDataStore("example", {}, path);

      await dataStore.set("key", 1);

      let file = JSON.parse(await readFile(path + "/example.json", "utf-8"));

      expect(file).toEqual({
        key: 1,
      });

      await dataStore.set("key", 2);

      file = JSON.parse(await readFile(path + "/example.json", "utf-8"));

      expect(file).toEqual({
        key: 2,
      });
    });
  });

  describe("getRoot", () => {
    it("returns entire db", async () => {
      const dataStore = await createDataStore(
        "example",
        { DefaultValue: true },
        path
      );

      await dataStore.set("key", "value");

      const result = await dataStore.getRoot();

      expect(result).toEqual({ DefaultValue: true, key: "value" });
    });
  });

  describe("get", () => {
    it("returns a default", async () => {
      const dataStore = await createDataStore(
        "example",
        { DefaultValue: true },
        path
      );

      const result = await dataStore.get("DefaultValue");

      expect(result).toEqual(true);
    });

    it("returns null if key doesn't exist", async () => {
      const dataStore = await createDataStore("example", {}, path);

      const result = await dataStore.get("invalid");

      expect(result).toBeNull();
    });

    it("returns existing value", async () => {
      const dataStore = await createDataStore("example", {}, path);

      await dataStore.set("key", 1);

      const result = await dataStore.get("key");

      expect(result).toEqual(1);
    });
  });
});
