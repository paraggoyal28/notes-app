import {
  MdCreate,
  MdDelete,
  MdOutlineDriveFileMove,
  MdShare,
} from "react-icons/md";

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
  onShare,
  isShared,
}) => {
  return (
    <div
      className="border rounded outline-warning p-4 bg-white hover:shadow-xl transition-all ease-in-out"
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
        {!isShared && (
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
            <MdShare
              data-testid="ShareBtn"
              className="icon-btn"
              onClick={onShare}
            />
            <MdDelete
              data-testid="DeleteBtn"
              className="icon-btn hover:text-red-500"
              onClick={onDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  content: PropTypes.string,
  tags: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  updatedAt: PropTypes.string,
  onMoveFile: PropTypes.func,
  onShare: PropTypes.func,
  isShared: PropTypes.bool,
};

export default NoteCard;
