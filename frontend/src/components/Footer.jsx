import React from "react";
import "./../../public/css/footer.css";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <p>
          &copy; {new Date().getFullYear()} React PHP Project Backend. All
          rights reserved.
        </p>
        <div className="d-flex justify-content-center gap-3 fs-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icons"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icons"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icons"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
