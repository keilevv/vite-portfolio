import AvatarImage from "../../assets/avatar.jpg";
import Navbar from "../../components/Navbar";
import "./style.css";
function HeaderContainer() {
  return (
    <>
      <Navbar />
      <div className="header-container">
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title"> Caleb Villalba</h1>
            <h1 className="header-subtitle"> Fullstack web developer</h1>
            <h1 className="header-description">
              Making it better every day, what is already already done fine.
            </h1>
          </div>
          <div className="header-avatar">
            <img
              src={AvatarImage}
              className="avatar-image"
              alt="Avatar image"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderContainer;
