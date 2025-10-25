import { User, UserStore } from "../../models/user";

const store = new UserStore();

describe("User Model", () => {
  let userId: number;

  beforeAll(async () => {
    const setupUser: User = {
      username: "testuser1",
      firstname: "Test",
      lastname: "User",
      password: "password123",
    };
    const created = await store.create(setupUser);
    userId = created.id as number;
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have an authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("create method should add a user", async () => {
    const tmpUser: User = {
      username: `tmpuser_${Date.now()}`,
      firstname: "Tmp",
      lastname: "User",
      password: "tmpPass123",
    };
    const result = await store.create(tmpUser);
    const tmpId = result.id as number;

    expect(result.username).toBe(tmpUser.username);
    expect(result.firstname).toBe("Tmp");
    expect(result.lastname).toBe("User");
    expect(result.password).toBeUndefined(); // password should not be returned

    // cleanup the temporary user
    await store.delete(tmpId.toString());
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(userId.toString());
    expect(result.username).toBe("testuser1");
    expect(result.firstname).toBe("Test");
    expect(result.lastname).toBe("User");
  });

  it("authenticate method should return user when credentials are correct", async () => {
    const result = await store.authenticate("testuser1", "password123");
    expect(result).not.toBeNull();
    if (result) {
      expect(result.username).toBe("testuser1");
    }
  });

  it("authenticate method should return null when credentials are incorrect", async () => {
    const result = await store.authenticate("testuser1", "wrongpassword");
    expect(result).toBeNull();
  });

  // Clean up: delete test user
  afterAll(async () => {
    await store.delete(userId.toString());
  });
});
