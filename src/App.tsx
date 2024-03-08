import HeaderContainer from "./containers/Header";
import AboutContainer from "./containers/About";
import "./style.css";

function App() {
  return (
    <>
      <div className="app-container">
        <section id="header">
          <HeaderContainer />
        </section>
        <section id="about">
          <AboutContainer />
        </section>
        <section id="footer">Footer</section>
      </div>
    </>
  );
}

export default App;
