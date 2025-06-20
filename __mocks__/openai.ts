const mockOpenAI = jest.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: "This is a mocked AI response.",
            },
          },
        ],
      }),
    },
  },
}));

export default mockOpenAI;
  