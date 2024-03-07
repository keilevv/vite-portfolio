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
            <h1 className="header-subtitle transition-brown ">
              Fullstack web developer
            </h1>
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
        <div className="social-icons-container">
          <i
            className="fa-brands fa-square-github social-icon transition-brown"
            onClick={() => window.open("https://github.com/caleb-villalba")}
          ></i>
          <i
            className="fa-brands fa-linkedin social-icon transition-brown"
            onClick={() =>
              window.open("https://www.linkedin.com/in/caleb-villalba/")
            }
          ></i>
          <i
            className="fa-brands fa-square-facebook social-icon transition-brown"
            onClick={() => window.open("https://www.facebook.com/calvihe/")}
          ></i>
        </div>
      </div>
    </>
  );
}

export default HeaderContainer;
