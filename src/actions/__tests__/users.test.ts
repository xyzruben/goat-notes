import { loginAction, logOutAction, signUpAction } from "../users";
import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";

// Mock dependencies
jest.mock("@/auth/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/db/prisma", () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}));

const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();
const mockSignUp = jest.fn();

describe("User Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
        signUp: mockSignUp,
      },
    });
  });

  describe("loginAction", () => {
    it("should call signInWithPassword and return no error on success", async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null });
      const result = await loginAction("test@example.com", "password");
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(result.errorMessage).toBeNull();
    });

    it("should return an error message on failure", async () => {
      const mockError = new Error("Invalid login");
      mockSignInWithPassword.mockResolvedValue({ error: mockError });
      const result = await loginAction("test@example.com", "password");
      expect(result.errorMessage).toBe(mockError.message);
    });
  });

  describe("logOutAction", () => {
    it("should call signOut and return no error on success", async () => {
      mockSignOut.mockResolvedValue({ error: null });
      const result = await logOutAction();
      expect(mockSignOut).toHaveBeenCalled();
      expect(result.errorMessage).toBeNull();
    });

    it("should return an error message on failure", async () => {
      const mockError = new Error("Sign out failed");
      mockSignOut.mockResolvedValue({ error: mockError });
      const result = await logOutAction();
      expect(result.errorMessage).toBe(mockError.message);
    });
  });

  describe("signUpAction", () => {
    const mockUser = { id: "new-user-123" };
    it("should sign up a new user and create a db record", async () => {
      mockSignUp.mockResolvedValue({ data: { user: mockUser }, error: null });
      const result = await signUpAction("new@example.com", "new-password");

      expect(mockSignUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "new-password",
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: mockUser.id,
          email: "new@example.com",
        },
      });
      expect(result.errorMessage).toBeNull();
    });

    it("should return an error if sign up fails", async () => {
      const mockError = new Error("Could not sign up");
      mockSignUp.mockResolvedValue({ data: {}, error: mockError });
      const result = await signUpAction("new@example.com", "new-password");
      expect(result.errorMessage).toBe(mockError.message);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("should return an error if user data is missing after sign up", async () => {
      mockSignUp.mockResolvedValue({ data: { user: null }, error: null });
      const result = await signUpAction("new@example.com", "new-password");
      expect(result.errorMessage).toBe("Error Signing up.");
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
}); 