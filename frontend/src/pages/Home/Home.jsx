import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        <NoteCard
          title="Meeting on 7th April"
          date="3rd Apr 2024"
          content="Meeting on 7th AprilMeeting on 7th April"
          tags="#Meeting"
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </>
  );
};

export default Home;
