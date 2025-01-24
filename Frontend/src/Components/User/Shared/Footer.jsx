import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#efe4d5] pt-16  pb-6 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Get In Touch Section */}
          <div className="space-y-4">
            <h3 className="text-[#312f2d] text-base font-thin mb-6">
              Get In Touch
            </h3>
            <nav className="flex flex-col space-y-3">
              {[
                "My account",
                "Connect",
                "Terms & Conditions",
                "Privacy policy",
                "FAQs",
                "Shipping & payments",
                "Returns & exchanges",
                "Track your order",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light hover:underline">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h3 className="text-[#312f2d] text-base font-thin mb-6">Social</h3>
            <nav className="flex flex-col space-y-3">
              {["Instagram", "Facebook", "YouTube", "LinkedIn"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light hover:underline">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <p className="text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light">
              A window to our world, delivered weekly.
              <br />
              Do sign up.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-b border-[#312f2d] py-2 text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light placeholder-[#312f2d] focus:outline-none focus:border-[#8b5d4b]"
              />
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2"
                aria-label="Subscribe to newsletter">
                <ArrowRight className="h-5 w-5 text-[#312f2d]" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright and WhatsApp */}
        <div className="mt-16 flex justify-between items-center">
          <button
            className="bg-[#713d28] p-3 rounded-lg hover:bg-[#48291d] transition-colors"
            aria-label="Contact us on WhatsApp">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6">
              <path
                fillRule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.83L2.2 22l4.17-1.69c1.64 1.19 3.66 1.89 5.83 1.89 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.85 0-3.58-.59-5-1.59l-3.12 1.27L5.15 17c-1-1.42-1.59-3.15-1.59-5 0-4.67 3.83-8.5 8.5-8.5s8.5 3.83 8.5 8.5-3.83 8.5-8.5 8.5z"
              />
            </svg>
          </button>
        </div>
        <br />
      </div>
      <div className="w-full h-10 bg-[#733519] flex justify-center items-center">
        <p className="text-sm text-[#eeebe9] font-thin leading-relaxed font-Futura-Light">
          © 2025 𝙿𝚘𝚌𝚔𝚎𝚝 𝙼𝚊𝚛𝚝
        </p>
      </div>
    </footer>
  );
}
