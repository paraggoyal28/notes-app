import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import PropTypes from "prop-types";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

Navbar.propTypes = {
  userInfo: PropTypes.object,
};

export default Navbar;
