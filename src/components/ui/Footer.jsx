import React from "react";

function Footer() {
  return (
    <footer className="bg-mainBg text-primaryText py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="font-bold">
          © {new Date().getFullYear()} My Website. All rights reserved.
        </p>
        <div className="mt-3 space-x-4">
          <a href="#" className="hover:text-accentDark text-accentLight">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-accentDark text-accentLight">
            Terms of Service
          </a>
          <a href="#" className="hover:text-accentDark text-accentLight">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
