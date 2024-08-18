vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn(() => {
        return Promise.resolve({ data: { accessToken: "abc" } });
      }),
      get: vi.fn(() => {
        return Promise.resolve({
          data: {
            notes: [],
            user: {
              fullName: "Parag",
              email: "parag@gmail.com",
              password: "parag@123",
            },
          },
        });
      }),
      delete: vi.fn(),
      put: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});
import {
  fireEvent,
  render,
  screen,
  cleanup,
  waitFor,
} from "@testing-library/react";
import Login from "../Login/Login";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import SignUp from "./SignUp";
import { act } from "react";

describe("SignUp component", () => {
  afterAll(() => {
    cleanup();
  });

  it("should render component correctly", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );
    const element = screen.getByTestId("Sign Up Button");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Create Account");
  });

  it("sign up successful", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    const emailElement = screen.getByTestId("Email");
    const nameElement = screen.getByTestId("Name");
    const passwordElement = screen.getByTestId("Password");
    const submitButton = screen.getByTestId("Sign Up Button");

    act(() => {
      fireEvent.change(emailElement, {
        target: { value: "parag@gmail.com" },
      });
      fireEvent.change(nameElement, {
        target: { value: "Parag" },
      });

      fireEvent.change(passwordElement, { target: { value: "parag@28" } });
      fireEvent.click(submitButton);
    });
    await waitFor(
      () => {
        const element = screen.getByTestId("Logout Button");
        expect(element).toBeInTheDocument();
        expect(screen.getByTestId("Home")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("signup password is empty", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    const emailElement = screen.getByTestId("Email");
    const passwordElement = screen.getByTestId("Password");
    const nameElement = screen.getByTestId("Name");
    const submitButton = screen.getByTestId("Sign Up Button");

    fireEvent.change(emailElement, {
      target: { value: "testuser2@gmail.com" },
    });

    fireEvent.change(nameElement, { target: { value: "parag" } });

    fireEvent.change(passwordElement, { target: { value: "" } });
    fireEvent.click(submitButton);
    await waitFor(
      () => {
        expect(screen.getByTestId("Error")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
