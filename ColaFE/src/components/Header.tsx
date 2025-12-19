import Logo from "@/public/logo/logo.png";
import Image from "next/image";

export default function Header() {
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const navlinks = links.map((link) => (
    <a key={link.name} href={link.href} className="nav-link">
      {link.name}
    </a>
  ));

  return (
    <header>
      <div className="sticky w-full flex z-10 p-10">
        <div className="flex-3 justify-start flex">
          <div className="logo-wrapper justify-start">
            <Image
              src={Logo.src}
              alt="Logo"
              className="logo-image"
              width={150}
              height={43}
            />
          </div>
          <nav className="nav-links flex gap-5">{navlinks}</nav>
        </div>
        <div className="flex-1 justify-end">Cart</div>
      </div>
    </header>
  );
}
