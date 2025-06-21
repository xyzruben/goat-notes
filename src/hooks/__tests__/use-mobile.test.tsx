import { renderHook, act } from "@testing-library/react"
import { useIsMobile } from "../use-mobile"

describe("useIsMobile", () => {
  function setWindowWidth(width: number) {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    })
    window.dispatchEvent(new Event("resize"))
  }

  beforeAll(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }
    })
  })

  it("returns true if window width is less than 768", () => {
    setWindowWidth(500)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it("returns false if window width is 768 or more", () => {
    setWindowWidth(900)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
}) 