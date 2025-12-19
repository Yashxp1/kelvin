const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <p className="text-sm">
            Automate GitHub and Notion workflows using AI.
          </p>

          <div className="flex gap-4 text-zinc-500">
            <a
              href="https://github.com/Yashxp1/kelvin"
              className="hover:text-black transition"
            >
              GitHub
            </a>
            <a
              href="https://x.com/yashxp1"
              className="hover:text-black transition"
            >
              X
            </a>
          </div>
          <div className=" py-4 text-sm text-zinc-500">
            © {new Date().getFullYear()} Kelvin
          </div>
        </div>

        <div>
          <h4 className="font-medium text-black mb-3">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-black">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Integrations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                History
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-black mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-black">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Changelog
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Yashxp1/kelvin"
                className="hover:text-black"
              >
                GitHub Repo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-black mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-black">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
