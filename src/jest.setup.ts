import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;
global.ResizeObserver = ResizeObserver;

// Simple polyfill for fetch
global.fetch = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Element.prototype.scrollTo = jest.fn();