const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p className="text-sm">
          © {new Date().getFullYear()} Dog Finder. All rights reserved.
        </p>
        <div className="mt-2">
          <a href="#" className="text-blue-400 hover:underline mx-2">
            Terms of Service
          </a>
          <a href="#" className="text-blue-400 hover:underline mx-2">
            Privacy Policy
          </a>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  