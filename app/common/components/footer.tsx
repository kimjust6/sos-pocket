import Link from "next/link";
import { footerItems } from "@/app/common/data/data";
import { Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background mt-10 pt-10 w-full ">
      <div className="flex justify-around">
        {footerItems.map((footer) => {
          return (
            <div key={footer.name}>
              <h2 className="mb-6 text-xs lg:text-sm font-bold uppercase">
                {footer.name}
              </h2>
              <ul className="text-muted-foreground text-xs lg:text-sm mb-8">
                {footer.items.map((item) => {
                  return (
                    <li className="mb-4" key={item.name}>
                      <Link href={item.link} className="hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="lg:px-24 sm:px-10 py-6 bg-secondary flex flex-col items-center md:justify-between md:flex-row">
        <span className="text-sm text-muted-secondary text-center">
          <Link href="https://summitoutdoorstore.ca/">
            Summit Outdoor Store{" "}
          </Link>
          © {new Date().getFullYear()}. All Rights Reserved.
        </span>
        <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
          <Link href="#" className="text-muted-foreground">
            <Mail />
            <span className="sr-only">Email</span>
          </Link>
          <Link href="#" className="text-muted-foreground">
            <Twitter />
            <span className="sr-only">Twitter page</span>
          </Link>
          <Link href="#" className="text-muted-foreground">
            <Instagram />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
