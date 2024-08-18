vi.mock("axios", () => {
  return {
    default: {
      post: vi.fn().mockImplementation(() => {
        return Promise.resolve({
          data: { note: { title: "My File" } },
        });
      }),
      get: vi.fn(() => {
        return Promise.resolve({
          data: {
            notes: [
              {
                title: "My File",
                content: "This is the content of my file",
                createdOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
                tags: [],
                parentDirectory: "/",
                type: "File",
                userId: "123",
              },
              {
                title: "My Folder",
                content: "This is my folder",
                createdOn: new Date().getTime(),
                modifiedAt: new Date().getTime(),
                tags: [],
                parentDirectory: "/",
                type: "Directory",
                userId: "123",
              },
            ],
            user: {
              _id: "123",
              fullName: "Parag",
              email: "parag@gmail.com",
              password: "parag@123",
            },
          },
        });
      }),
      delete: vi.fn(() => {
        return Promise.resolve({
          data: {
            error: false,
          },
        });
      }),
      put: vi.fn(() => {
        return Promise.resolve({
          data: {
            note: {},
          },
        });
      }),
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
import Home from "./Home";
import SignUp from "../SignUp/SignUp";
import { act } from "react";

describe("Home component", () => {
  beforeAll(() => {});
  afterAll(() => {
    cleanup();
  });

  it("should render component correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      const logoutElement = screen.getByTestId("Logout Button");
      expect(logoutElement).toBeInTheDocument();
      const noteElement = screen.getByTestId("NoteCard");
      expect(noteElement).toBeInTheDocument();
      const folderElement = screen.getByTestId("Folder");
      expect(folderElement).toBeInTheDocument();
    });
    const homeElement = screen.getByTestId("Home");
    expect(homeElement).toBeInTheDocument();
  });

  it("add new file", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    const addFileElement = screen.getByTestId("AddFile");

    fireEvent.click(addFileElement);

    const titleElement = screen.getByTestId("Title");
    expect(titleElement).toBeInTheDocument();

    const contentElement = screen.getByTestId("Content");
    expect(contentElement).toBeInTheDocument();

    const submitButtonElement = screen.getByTestId("SubmitBtn");
    expect(submitButtonElement).toBeInTheDocument();
    expect(submitButtonElement).toHaveTextContent("ADD");

    fireEvent.change(titleElement, { target: { value: "Go to Gym" } });
    fireEvent.change(contentElement, {
      target: { value: "Get to Cult Kalyan nagar tomorrow sharp at 9:00 am" },
    });

    fireEvent.click(submitButtonElement);

    const toastElement = screen.getByTestId("Toast");
    expect(toastElement).toBeInTheDocument();

    const toastMessageElement = screen.getByTestId("Toast-Message");
    expect(toastMessageElement).toBeInTheDocument();
  });

  it("add new folder", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    const addFileElement = screen.getByTestId("AddFolder");

    fireEvent.click(addFileElement);

    const titleElement = screen.getByTestId("Title");
    expect(titleElement).toBeInTheDocument();

    const submitButtonElement = screen.getByTestId("SubmitBtn");
    expect(submitButtonElement).toBeInTheDocument();
    expect(submitButtonElement).toHaveTextContent("ADD");

    fireEvent.change(titleElement, { target: { value: "My Tasks" } });

    fireEvent.click(submitButtonElement);

    const toastElement = screen.getByTestId("Toast");
    expect(toastElement).toBeInTheDocument();

    const toastMessageElement = screen.getByTestId("Toast-Message");
    expect(toastMessageElement).toBeInTheDocument();
  });

  it("edit file successfully", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const editFileButton = screen.getByTestId("EditBtn");

      fireEvent.click(editFileButton);

      const titleElement = screen.getByTestId("Title");
      expect(titleElement).toBeInTheDocument();

      const contentElement = screen.getByTestId("Content");
      expect(contentElement).toBeInTheDocument();

      const submitButtonElement = screen.getByTestId("SubmitBtn");
      expect(submitButtonElement).toBeInTheDocument();
      expect(submitButtonElement).toHaveTextContent("UPDATE");

      fireEvent.change(titleElement, { target: { value: "Modified value" } });

      fireEvent.click(submitButtonElement);

      const toastElement = screen.getByTestId("Toast");
      expect(toastElement).toBeInTheDocument();

      const toastMessageElement = screen.getByTestId("Toast-Message");
      expect(toastMessageElement).toBeInTheDocument();
    });
  });

  it("delete file successfully", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const deleteFileButton = screen.getByTestId("DeleteBtn");

      fireEvent.click(deleteFileButton);

      const toastElement = screen.getByTestId("Toast");
      expect(toastElement).toBeInTheDocument();

      const toastMessageElement = screen.getByTestId("Toast-Message");
      expect(toastMessageElement).toBeInTheDocument();
    });
  });

  it("move file to another Folder successfully", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const moveFileButton = screen.getByTestId("MoveBtn");

      fireEvent.click(moveFileButton);

      const folderSelectElement = screen.getByTestId("FolderSelect");

      fireEvent.change(folderSelectElement, {
        target: { value: "/MyFolder/" },
      });

      const moveButton = screen.getByTestId("MoveFileBtn");

      fireEvent.click(moveButton);

      const toastElement = screen.getByTestId("Toast");
      expect(toastElement).toBeInTheDocument();

      const toastMessageElement = screen.getByTestId("Toast-Message");
      expect(toastMessageElement).toBeInTheDocument();
    });
  });
});
