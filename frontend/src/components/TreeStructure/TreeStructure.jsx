import PropTypes from "prop-types";
import Render from "./Render";
import { GoFileDirectory } from "react-icons/go";

const TreeStructure = ({ mp, setParentPath }) => {
  return (
    <div className="flex flex-col justify-center">
      <GoFileDirectory
        onClick={() => {
          setParentPath("/");
        }}
        className="cursor-pointer"
      />
      Home Directory
      <div className="ml-5">
        <Render path={"/"} mp={mp} setParentPath={setParentPath} />
      </div>
    </div>
  );
};

TreeStructure.propTypes = {
  mp: PropTypes.object,
  setParentPath: PropTypes.func,
};

export default TreeStructure;
