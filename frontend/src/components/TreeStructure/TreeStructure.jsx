import PropTypes from "prop-types";
import Render from "./Render";
import { useState, useEffect } from "react";
import { GoFileDirectory } from "react-icons/go";

const TreeStructure = ({ fullNotes, setParentPath, getAllNotes }) => {
  const [mp, setMp] = useState(new Map());

  useEffect(() => {
    let aMp = new Map();
    console.log(fullNotes);
    fullNotes.forEach((note) => {
      let ls = [];
      if (aMp.has(note.parentPath)) {
        ls = aMp.get(note.parentPath);
        console.log(ls);
      }
      ls.push(note);
      aMp.set(note.parentPath, ls);
    });
    console.log(aMp);
    setMp(aMp);
  }, [fullNotes]);

  return (
    <div className="flex flex-col justify-center">
      <GoFileDirectory
        onClick={() => {
          setParentPath("/");
          getAllNotes("/");
        }}
        className="cursor-pointer"
      />
      Home Directory
      <div className="ml-5">
        <Render
          path={"/"}
          mp={mp}
          setParentPath={setParentPath}
          getAllNotes={getAllNotes}
        />
      </div>
    </div>
  );
};

TreeStructure.propTypes = {
  fullNotes: PropTypes.array,
  setParentPath: PropTypes.func,
  getAllNotes: PropTypes.func,
};

export default TreeStructure;
