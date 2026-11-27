import { FormattedMessage } from "react-intl";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/keilevv",
    iconClass: "fa-brands fa-square-github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/caleb-villalba/",
    iconClass: "fa-brands fa-linkedin",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/calvihe/",
    iconClass: "fa-brands fa-square-facebook",
  },
];

const NAV_LINKS = [
  { href: "#header", label: "Home" },
  { href: "#experience", labelId: "navbar.experience" },
  { href: "#about", labelId: "navbar.about" },
  { href: "#projects", labelId: "navbar.projects" },
];

export default function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#f3d9b1]/15 bg-[#121110]/85 backdrop-blur-md text-[#e5e5e5]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="text-xl font-bold tracking-wide text-[#df7a26]">
              Caleb Villalba
            </h3>
            <p className="mt-1.5 text-sm text-[#f3d9b1]/85">
              <FormattedMessage id="banner.subtitle" />
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
              <i className="fa-solid fa-location-dot text-[#df7a26]" />
              <span>Cartagena, Colombia</span>
            </p>
            <a
              href="mailto:calvihe@gmail.com"
              className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-300 transition-colors duration-200 hover:text-[#df7a26]"
            >
              <i className="fa-solid fa-envelope text-[#df7a26]" />
              <span>calvihe@gmail.com</span>
            </a>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col items-center md:items-center">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f3d9b1]/70">
              Navigation
            </h4>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-300 transition-colors duration-200 hover:text-[#df7a26]"
                  >
                    {link.labelId ? (
                      <FormattedMessage id={link.labelId} />
                    ) : (
                      link.label
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#f3d9b1]/70">
              Connect
            </h4>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-2xl text-[#f3d9b1] transition-all duration-200 hover:-translate-y-0.5 hover:text-[#df7a26]"
                >
                  <i className={social.iconClass} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#f3d9b1]/10 pt-6 text-xs text-neutral-400 sm:flex-row">
          <p>
            <FormattedMessage id="footer.text" />
          </p>
          <p>&copy; {currentYear} Caleb Villalba. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
