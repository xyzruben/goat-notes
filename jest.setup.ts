// jest.setup.ts
import "@testing-library/jest-dom";
jest.mock("@/lib/openai", () => require("../../__mocks__/openai"));

// Mock window.matchMedia for next-themes and other browser APIs
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      dispatchEvent: jest.fn(),
    };
  };
}

// Polyfill scrollTo for jsdom
defineScrollToPolyfill();

function defineScrollToPolyfill() {
  if (typeof window !== "undefined" && window.HTMLElement && !window.HTMLElement.prototype.scrollTo) {
    window.HTMLElement.prototype.scrollTo = function () {};
  }
}
