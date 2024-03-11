import { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import englishTranslations from "./translations/en";
import spanishTranslations from "./translations/es";
/* Components */
import HeaderContainer from "./containers/Header";
import AboutContainer from "./containers/About";
import ExperienceContainer from "./containers/Experience";
/* Hooks */
import { useStore } from "./store/useStore";
import "./style.css";

function App() {
  const { language } = useStore();
  const [messages, setMessages] = useState(englishTranslations.messages);

  useEffect(() => {
    if (language === "en") {
      setMessages(englishTranslations.messages);
    } else {
      setMessages(spanishTranslations.messages);
    }
  });
  return (
    <IntlProvider messages={messages} locale={language} defaultLocale="en">
      <ConfigProvider dropdown={{ className: "dropdown" }}>
        <div className="app-container">
          <section id="header">
            <HeaderContainer />
          </section>
          <section id="about">
            <AboutContainer />
          </section>
          <section id="experience">
            <ExperienceContainer />
          </section>
          <section id="footer">Footer</section>
        </div>
      </ConfigProvider>
    </IntlProvider>
  );
}

export default App;
