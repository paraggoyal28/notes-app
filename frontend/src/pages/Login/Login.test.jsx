vi.mock("axios", () => {
  return {
    default: {
      post: vi
        .fn()
        .mockImplementationOnce(() => {
          return Promise.resolve({
            data: { accessToken: "abc" },
          });
        })
        .mockImplementation(() => {
          return Promise.reject({
            response: { data: { message: "Wrong username and password" } },
          });
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
import Login from "./Login";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import SignUp from "../SignUp/SignUp";
import { act } from "react";

describe("Login component", () => {
  beforeAll(() => {});
  afterAll(() => {
    cleanup();
  });

  it("should render component correctly", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );
    const element = screen.getByTestId("Login Button");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Login");
  });

  it("login successful", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    const emailElement = screen.getByTestId("Email");
    const passwordElement = screen.getByTestId("Password");
    const submitButton = screen.getByTestId("Login Button");

    act(() => {
      fireEvent.change(emailElement, {
        target: { value: "testuser3@gmail.com" },
      });

      fireEvent.change(passwordElement, { target: { value: "testuser@3" } });
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

  it("login unsuccessful", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    const emailElement = screen.getByTestId("Email");
    const passwordElement = screen.getByTestId("Password");
    const submitButton = screen.getByTestId("Login Button");

    fireEvent.change(emailElement, {
      target: { value: "testuser2@gmail.com" },
    });

    fireEvent.change(passwordElement, { target: { value: "testuser@2" } });
    fireEvent.click(submitButton);
    await waitFor(
      () => {
        expect(screen.getByTestId("Error")).toBeInTheDocument();
        expect(screen.getByTestId("Error")).toHaveTextContent(
          "Wrong username and password"
        );
      },
      { timeout: 5000 }
    );
  });
});
