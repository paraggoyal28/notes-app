import { MdCreate, MdDelete, MdOutlineDriveFileMove } from "react-icons/md";

import moment from "moment";
import PropTypes from "prop-types";

const NoteCard = ({
  title,
  date,
  updatedAt,
  content,
  tags,
  onEdit,
  onDelete,
  onMoveFile,
}) => {
  return (
    <div
      className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out"
      data-testid="NoteCard"
    >
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-500">
            {moment(updatedAt).format("Do MMM YYYY")}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.map((item) => `#${item} `)}
        </div>
        <div className="flex items-center gap-2">
          <MdOutlineDriveFileMove
            className="icon-btn hover:text-blue-600"
            data-testid="MoveBtn"
            onClick={onMoveFile}
          />
          <MdCreate
            data-testid="EditBtn"
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            data-testid="DeleteBtn"
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  title: PropTypes.string,
  date: PropTypes.number,
  content: PropTypes.string,
  tags: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  updatedAt: PropTypes.string,
  onMoveFile: PropTypes.func,
};

export default NoteCard;
