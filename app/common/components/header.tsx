import HeaderNav from "./headerNav";
import HeaderOptions from "./headerOptions";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-16 flex items-center px-4 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <HeaderNav />
      <div className="flex flex-1 items-center space-x-2 justify-end">
        <HeaderOptions />
      </div>
    </header>
  );
};

export default Header;
