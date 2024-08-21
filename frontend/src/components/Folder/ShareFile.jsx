import Multiselect from "multiselect-react-dropdown";
import PropTypes from "prop-types";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const ShareFile = ({ onClose, allUsers, shareFile, noteData, currentUser }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelect = (selectedList, selectedItem) => {
    setSelectedUsers([...selectedList]);
  };

  const handleRemove = (selectedList, removedItem) => {
    setSelectedUsers([...selectedList]);
  };

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
          htmlFor="users"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select Users to share
        </label>
        <Multiselect
          options={allUsers.filter((user) => user._id !== currentUser._id)}
          onSelect={handleSelect}
          onRemove={handleRemove}
          displayValue="fullName"
        />
      </form>

      <button
        className="btn btn-primary font-medium mt-5 p-3"
        data-testid="ShareFileBtn"
        onClick={() => {
          shareFile(noteData._id, selectedUsers);
          onClose();
        }}
      >
        Share
      </button>
    </div>
  );
};

ShareFile.propTypes = {
  onClose: PropTypes.func,
  shareFile: PropTypes.func,
  noteData: PropTypes.object,
  allUsers: PropTypes.array,
  currentUser: PropTypes.object,
};

export default ShareFile;
