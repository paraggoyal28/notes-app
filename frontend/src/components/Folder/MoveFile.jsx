import PropTypes from "prop-types";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const MoveFile = ({ onClose, fullNotes, parentPath, moveFile, noteData }) => {
  const paths = fullNotes
    .filter(
      (note) => note.type === "Directory" && note.parentPath != parentPath
    )
    .map((note) => note.parentPath);
  const folderPaths = [...new Set(paths)];

  const [pathSelected, setPathSelected] = useState(parentPath);
  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <form className="max-w-sm mx-auto">
        <label
          htmlFor="folderPath"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select a Folder to move the File to
        </label>
        <select
          id="folderPath"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={pathSelected}
          data-testid="FolderSelect"
          onChange={(e) => setPathSelected(e.target.value)}
        >
          <option value={parentPath}>{parentPath}</option>
          {folderPaths.map((folderPath) => (
            <option key={folderPath} value={folderPath}>
              {folderPath}
            </option>
          ))}
        </select>
      </form>

      <button
        className="btn btn-primary font-medium mt-5 p-3"
        data-testid="MoveFileBtn"
        onClick={() => {
          moveFile(noteData._id, pathSelected);
          onClose();
        }}
      >
        Move
      </button>
    </div>
  );
};

MoveFile.propTypes = {
  onClose: PropTypes.func,
  fullNotes: PropTypes.array,
  parentPath: PropTypes.string,
  moveFile: PropTypes.func,
  noteData: PropTypes.object,
};

export default MoveFile;
