import { FormattedMessage } from "react-intl";
import AvatarImage from "../../assets/me.jpg";
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
              <FormattedMessage id="banner.subtitle" />
            </h1>
            <h1 className="header-description">
              <FormattedMessage id="banner.description" />
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
            onClick={() => window.open("https://github.com/keilevv")}
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
