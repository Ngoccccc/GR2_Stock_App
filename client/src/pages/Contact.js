import React from "react";
import Layout from "./../components/Layout/Layout";
const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            Mọi thắc mắc về sản phẩm, vui lòng liên hệ với chúng tôi
          </p>
          <p className="mt-3">
            : www.cnwweb@cnweb.com
          </p>
          <p className="mt-3">
            : 0123456789
          </p>
          <p className="mt-3">
            : 123-456-789 (hotline)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
