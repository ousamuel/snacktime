import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
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
      <div className="mx-4 sm:mx-8 flex h-16 flex justify-between">
        <div className="flex items-center">
          <SheetMenu />
        </div>
        {/* <div className="hidden lg:flex"></div> */}
        <h1 className="font-bold rubik-font uppercase text-4xl flex bounce-container">
          {brandName.map((char: string, i: number) => (
            <p key={i} className="flex items-end pb-2">
              {char}
            </p>
          ))}
        </h1>
        <div className="flex items-center space-x-2 justify-end">
          <Link href="/verified/check-out">
            <ShoppingCart size={30} className="cursor-pointer" />
          </Link>
          <ModeToggle />
          {/* <UserNav /> */}
        </div>
      </div>
    </header>
  );
}
