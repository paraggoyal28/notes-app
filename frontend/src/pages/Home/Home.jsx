import { MdAdd, MdCreateNewFolder } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNote from "../../assets/addNote.png";
import Folder from "../../components/Folder/Folder";
import TreeStructure from "../../components/TreeStructure/TreeStructure";
import MoveFile from "../../components/Folder/MoveFile";
import ShareFile from "../../components/Folder/ShareFile";

const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
    fileType: "File",
  });

  const [openMoveModel, setOpenMoveModel] = useState({
    isShown: false,
    data: null,
  });

  const [openShareModel, setOpenShareModel] = useState({
    isShown: false,
    data: null,
  });

  const [mp, setMp] = useState(new Map());

  const [parentPath, setParentPath] = useState("/");

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [fullNotes, setFullNotes] = useState([]);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    if (noteDetails.userId !== userInfo._id) {
      showToastMessage("User not allowed to edit", "delete");
      return;
    }
    setOpenAddEditModel({
      isShown: true,
      type: "edit",
      data: noteDetails,
      fileType: "File",
    });
  };

  const handleMove = (noteDetails) => {
    if (noteDetails.userId !== userInfo._id) {
      showToastMessage("User not allowed to move", "delete");
      return;
    }
    setOpenMoveModel({
      isShown: true,
      data: noteDetails,
    });
  };

  const handleShare = (noteDetails) => {
    if (noteDetails.userId !== userInfo._id) {
      showToastMessage("User not allowed to share", "delete");
      return;
    }
    setOpenShareModel({
      isShown: true,
      data: noteDetails,
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/get-all-users");
      if (response?.data?.users) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(error.response.message);
      }
    }
  };

  // Get all notes
  const getFullNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes?parentPath=");

      if (response.data && response.data.notes) {
        setFullNotes(response.data.notes);
      }
    } catch (error) {
      if (error) {
        console.log(error);
      }
      console.log("An unexpected error occurred. Try again later.");
    }
  };

  // Move Note
  const moveNote = async (noteId, newParentPath) => {
    try {
      const response = await axiosInstance.put("/move-note/" + noteId, {
        newFolderPath: newParentPath,
      });

      if (response?.data?.note) {
        showToastMessage("Note Moved Successfully");
        getFullNotes();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.log(error.response.data.message);
      }
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    if (data.userId !== userInfo.id) {
      showToastMessage("User not allowed to delete", "delete");
    }
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getFullNotes();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.log(error.response.data.message);
      }
    }
  };

  // Share Note
  const shareNote = async (noteId, users) => {
    try {
      const response = await axiosInstance.put("/share-note/" + noteId, {
        users: users,
      });

      if (response?.data?.note) {
        showToastMessage("Note Shared Successfully");
        getFullNotes();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.log(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getAllUsers();
    getUserInfo();
    getFullNotes();
  }, []);

  useEffect(() => {
    let aMp = new Map();

    fullNotes.forEach((note) => {
      let ls = [];
      const parentPath =
        userInfo && note.userId !== userInfo._id ? "/" : note.parentPath;
      if (aMp.has(parentPath)) {
        ls = aMp.get(parentPath);
      }

      ls.push(note);
      aMp.set(parentPath, ls);
    });
    setMp(aMp);
  }, [fullNotes]);

  const sharedNotes = fullNotes?.filter(
    (note) =>
      note.type === "File" &&
      parentPath === "/" &&
      userInfo &&
      note.userId !== userInfo._id
  );

  const sameUserNotes = mp
    .get(parentPath)
    ?.filter((note) => userInfo && note.userId === userInfo._id);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="flex" data-testid="Home">
        <div className="container basis-1/3  ml-5 mt-5">
          {fullNotes?.length > 0 && (
            <TreeStructure mp={mp} setParentPath={setParentPath} />
          )}
        </div>
        <div className="container basis-2/3 mx-auto">
          {sameUserNotes?.length > 0 || sharedNotes?.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {sameUserNotes?.map((item) => {
                  return item.type === "File" ? (
                    <NoteCard
                      key={item._id}
                      title={item.title}
                      date={item.createdOn}
                      content={item.content}
                      updatedAt={item.updatedAt}
                      tags={item.tags}
                      isShared={false}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => deleteNote(item)}
                      onMoveFile={() => handleMove(item)}
                      onShare={() => handleShare(item)}
                    />
                  ) : (
                    <Folder
                      key={item._id}
                      title={item.title}
                      handleOpenFolder={() => {
                        setParentPath(parentPath + item.title + "/");
                      }}
                    />
                  );
                })}
              </div>
              {parentPath == "/" && (
                <>
                  <h1 className="mt-8"> Shared Files </h1>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {sharedNotes.map((item) => (
                      <NoteCard
                        key={item._id}
                        title={item.title}
                        date={item.createdOn}
                        content={item.content}
                        updatedAt={item.updatedAt}
                        tags={item.tags}
                        isShared={true}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => deleteNote(item)}
                        onMoveFile={() => handleMove(item)}
                        onShare={() => handleShare(item)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyCard
              imgSrc={AddNote}
              message="Start creating your first note! Click the Add button to get started."
            />
          )}
        </div>

        <div className="flex justify-end absolute bottom-10 right-10 gap-2">
          <button
            className="w-16 h-16 flex justify-center items-center rounded-2xl bg-primary hover:bg-blue-600"
            data-testid="AddFile"
            onClick={() => {
              setOpenAddEditModel({
                isShown: true,
                type: "add",
                data: null,
                fileType: "File",
              });
            }}
          >
            <MdAdd className="text-[32px] text-white" />
          </button>

          <button
            className="w-16 h-16 flex justify-center items-center rounded-2xl bg-primary hover:bg-blue-600"
            data-testid="AddFolder"
            onClick={() => {
              setOpenAddEditModel({
                isShown: true,
                type: "add",
                data: null,
                fileType: "Directory",
              });
            }}
          >
            <MdCreateNewFolder className="text-[32px] text-white" />
          </button>

          <button
            className="w-16 h-16 flex justify-center items-center rounded-2xl bg-primary hover:bg-blue-600"
            data-testid="BackBtn"
            onClick={() => {
              const path = parentPath.split("/").slice(0, -2).join("/") + "/";
              setParentPath(path);
            }}
          >
            <IoMdArrowBack className="text-[32px] text-white" />
          </button>
        </div>
      </div>
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        ariaHideApp={false}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({
              isShown: false,
              type: "add",
              data: null,
              fileType: "File",
            });
          }}
          fileType={openAddEditModel.fileType}
          getFullNotes={getFullNotes}
          showToastMessage={showToastMessage}
          parentPath={parentPath}
        />
      </Modal>

      <Modal
        isOpen={openMoveModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        ariaHideApp={false}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <MoveFile
          noteData={openMoveModel.data}
          onClose={() => setOpenMoveModel({ isShown: false, data: null })}
          fullNotes={fullNotes}
          parentPath={parentPath}
          moveFile={moveNote}
        />
      </Modal>

      <Modal
        isOpen={openShareModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        ariaHideApp={false}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <ShareFile
          noteData={openShareModel.data}
          onClose={() => setOpenShareModel({ isShown: false, data: null })}
          currentUser={userInfo}
          allUsers={allUsers}
          shareFile={shareNote}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
