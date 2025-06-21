import {
  createNoteAction,
  updateNoteAction,
  deleteNoteAction,
  askAIAboutNotesAction,
} from "../notes";
import { prisma } from "@/db/prisma";
import { getUser } from "@/auth/server";
import openai from "@/openai";

// Mock dependencies
jest.mock("@/db/prisma", () => ({
  prisma: {
    note: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/auth/server", () => ({
  getUser: jest.fn(),
}));

jest.mock("@/openai", () => ({
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
}));

const mockUser = { id: "user-123", email: "test@example.com" };

describe("Note Server Actions", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (getUser as jest.Mock).mockResolvedValue(mockUser);
  });

  describe("createNoteAction", () => {
    it("should create a new note for a logged-in user", async () => {
      await createNoteAction("note-id-123");
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: {
          id: "note-id-123",
          authorId: mockUser.id,
          text: "",
        },
      });
    });

    it("should return an error if the user is not logged in", async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await createNoteAction("note-id-123");
      expect(result.errorMessage).toBe("You must be logged in to create a note.");
      expect(prisma.note.create).not.toHaveBeenCalled();
    });
  });

  describe("updateNoteAction", () => {
    it("should update an existing note", async () => {
      await updateNoteAction("note-id-123", "Updated text");
      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: "note-id-123" },
        data: { text: "Updated text" },
      });
    });

    it("should return an error if user is not logged in", async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await updateNoteAction("note-id-123", "Updated text");
      expect(result.errorMessage).toBe("You must be logged in to update a note.");
    });
  });

  describe("deleteNoteAction", () => {
    it("should delete a note for a logged-in user", async () => {
      await deleteNoteAction("note-id-123");
      expect(prisma.note.delete).toHaveBeenCalledWith({
        where: { id: "note-id-123", authorId: mockUser.id },
      });
    });

    it("should return an error if user is not logged in", async () => {
      (getUser as jest.Mock).mockResolvedValue(null);
      const result = await deleteNoteAction("note-id-123");
      expect(result.errorMessage).toBe("You must be logged in to delete a note.");
    });
  });

  describe("askAIAboutNotesAction", () => {
    it("should call the OpenAI API with formatted notes and return a response", async () => {
      const mockNotes = [
        { text: "Note 1", createdAt: new Date(), updatedAt: new Date() },
        { text: "Note 2", createdAt: new Date(), updatedAt: new Date() },
      ];
      const mockResponse = "This is the AI response.";

      (prisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);
      (openai.chat.completions.create as jest.Mock).mockResolvedValue({
        choices: [{ message: { content: mockResponse } }],
      });

      const response = await askAIAboutNotesAction(["What is my first note?"], []);
      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: { authorId: mockUser.id },
        orderBy: { createdAt: "desc" },
        select: { text: true, createdAt: true, updatedAt: true },
      });
      expect(openai.chat.completions.create).toHaveBeenCalled();
      expect(response).toBe(mockResponse);
    });

    it("should return a message if user has no notes", async () => {
      (prisma.note.findMany as jest.Mock).mockResolvedValue([]);
      const response = await askAIAboutNotesAction(["Question?"], []);
      expect(response).toBe("You don't have any notes yet.");
      expect(openai.chat.completions.create).not.toHaveBeenCalled();
    });
  });
}); 