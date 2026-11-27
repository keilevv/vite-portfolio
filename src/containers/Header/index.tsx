import { FormattedMessage } from "react-intl";
import AvatarImage from "../../assets/me.webp";
import Navbar from "../../components/Navbar";
import "./style.css";
function HeaderContainer() {
  return (
    <>
      <Navbar />
      <div className="header-container pb-10">
        <div className="header-content">
          <div className="header-text" data-parallax-speed="0.12">
            <h1 className="header-title">Caleb Villalba</h1>
            <h2 className="header-subtitle transition-brown">
              <FormattedMessage id="banner.subtitle" />
            </h2>
            <p className="header-description">
              <FormattedMessage id="banner.description" />
            </p>
          </div>
          <div className="header-avatar" data-parallax-speed="-0.08">
            <div className="avatar-frame">
              <img
                src={AvatarImage}
                className="avatar-image"
                alt="Caleb Villalba"
                width={320}
                height={380}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
        <div className="social-icons-container" data-parallax-speed="0.18">
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
