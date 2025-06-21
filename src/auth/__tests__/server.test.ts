import { getUser } from "../server";
import { createServerClient } from "@supabase/ssr";

// Mock dependencies
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(),
    set: jest.fn(),
  })),
}));

const mockUser = { id: "user-123", email: "test@example.com" };

describe("Auth Server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return the user object when a user is authenticated", async () => {
      const mockGetUer = jest.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (createServerClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: mockGetUer,
        },
      });

      const user = await getUser();
      expect(user).toEqual(mockUser);
    });

    it("should return null when no user is authenticated", async () => {
      const mockGetUer = jest.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (createServerClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: mockGetUer,
        },
      });

      const user = await getUser();
      expect(user).toBeNull();
    });

    it("should return null and log an error if the auth call fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const mockError = new Error("Auth failed");
      const mockGetUer = jest.fn().mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      (createServerClient as jest.Mock).mockReturnValue({
        auth: {
          getUser: mockGetUer,
        },
      });

      const user = await getUser();
      expect(user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

      consoleErrorSpy.mockRestore();
    });
  });
}); 