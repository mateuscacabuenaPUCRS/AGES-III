import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../layout/SearchBar/SearchBar";
import { describe, expect, vi, it } from "vitest";

describe("SearchBar Component", () => {
  it("Renderiza com o placeholder correto", () => {
    render(
      <SearchBar
        onSearchChange={() => {}}
        placeholder="Procure aqui pelos alvos"
      />
    );

    const inputElement = screen.getByPlaceholderText(
      "Procure aqui pelos alvos"
    );
    expect(inputElement).toBeInTheDocument();
  });

  it("Chama a função onSearchChange ao digitar", () => {
    const handleChange = vi.fn();
    render(
      <SearchBar
        onSearchChange={handleChange}
        placeholder="Procure aqui pelos alvos"
      />
    );

    const inputElement = screen.getByPlaceholderText(
      "Procure aqui pelos alvos"
    );
    fireEvent.change(inputElement, { target: { value: "Novo texto" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
