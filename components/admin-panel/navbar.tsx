import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const brandName = ["s", "n", "a", "c", "k", "t", "i", "m", "e"];
  return (
    <header
      className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur 
    supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary"
    >
      <div className="mx-4 sm:mx-8 flex h-16 flex justify-between items-end pb-2">
        <SheetMenu />
        <div className="hidden lg:flex"></div>
        <h1 className="font-bold rubik-font uppercase text-4xl flex bounce-container">
          {brandName.map((char: string, i: number) => (
            <p key={i}>{char}</p>
          ))}
        </h1>
        {/* <div className="flex items-center space-x-4 lg:space-x-0">
        </div> */}
        <div className="flex items-center space-x-2 justify-end">
          <ModeToggle />
          {/* <UserNav /> */}
        </div>
      </div>
    </header>
  );
}
