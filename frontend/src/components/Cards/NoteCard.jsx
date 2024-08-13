const NoteCard = ({ title, date, content, tags, onEdit, onDelete }) => {
  return (
    <div>
      <div className="">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
      </div>
      <p className="">{content?.slice(0, 60)}</p>
    </div>
  );
};

export default NoteCard;
