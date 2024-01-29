import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <h1 className="text-center">VERSACE</h1>
      <p className="text-center mt-3">
        <Link to="/about">Giới thiệu</Link>|<Link to="/contact">Liên hệ</Link>|
        <Link to="/policy">Quyền riêng tư</Link>
      </p>
    </div>
  );
};

export default Footer;
