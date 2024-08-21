import { FaFileAlt } from "react-icons/fa";
import { GoFileDirectory } from "react-icons/go";
import PropTypes from "prop-types";

const Render = ({ mp, path, setParentPath }) => {
  const notes = mp.get(path);
  return notes?.map((note) => {
    if (note.type === "File")
      return (
        <div key={note._id}>
          <FaFileAlt />
          <p>{note.title}</p>
        </div>
      );
    return (
      <>
        <GoFileDirectory
          onClick={() => {
            setParentPath(path + note.title + "/");
          }}
          className="cursor-pointer"
        />
        {note.title}
        <div key={note._id} className="ml-5">
          <Render
            path={path + note.title + "/"}
            mp={mp}
            setParentPath={setParentPath}
          />
        </div>
      </>
    );
  });
};

Render.propTypes = {
  mp: PropTypes.object,
  path: PropTypes.string,
  setParentPath: PropTypes.func,
};

export default Render;
