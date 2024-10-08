import PropType from "prop-types";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div
      className="flex flex-col items-center justify-center mt-8"
      data-testid="EmptyCard"
    >
      <img src={imgSrc} alt="No notes" className="w-60" />

      <p className="w-1/2 text-sm font-medium text-slate-700 text-center loading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

EmptyCard.propTypes = {
  imgSrc: PropType.string,
  message: PropType.string,
};

export default EmptyCard;
