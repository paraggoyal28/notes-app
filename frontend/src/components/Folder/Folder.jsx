import { GoFileDirectory } from "react-icons/go";
import PropTypes from "prop-types";

const Folder = ({ title, handleOpenFolder }) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out cursor-pointer">
      <div
        className="flex items-center justify-center"
        onClick={handleOpenFolder}
        data-testid="Folder"
      >
        <GoFileDirectory className="w-20 h-20" />
        <p>{title}</p>
      </div>
    </div>
  );
};

Folder.propTypes = {
  title: PropTypes.string,
  handleOpenFolder: PropTypes.func,
};

export default Folder;
