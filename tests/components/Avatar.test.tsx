import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders successfully", () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByRole("img", { name: /alice/i })).toBeDefined()
  })

  it("shows first letter for a simple name", () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText("A")).toBeDefined()
  })

  it("shows first two uppercase letters for a PascalCase name", () => {
    render(<Avatar name="JohnDoe" />)
    expect(screen.getByText("JD")).toBeDefined()
  })

  it("shows first letter for a single-word name", () => {
    render(<Avatar name="alice" />)
    expect(screen.getByText("a")).toBeDefined()
  })
})
