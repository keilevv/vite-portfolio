import HeaderContainer from "./containers/Header";
import "./style.css";

function App() {
  return (
    <>
      <div className="app-container">
        <section id="header">
          <HeaderContainer />
        </section>
        <section id="content">Content</section>
        <section id="footer">Footer</section>
      </div>
    </>
  );
}

export default App;
