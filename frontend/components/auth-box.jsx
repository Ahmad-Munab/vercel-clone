import {
  ClerkLoaded,
  ClerkLoading,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";

import { Button } from "./ui/button";
import Link from "next/link";
// import { cn } from "@/lib/utils";
// import ThemeToggler from "./theme-toggler";

const AuthBox = () => {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center sm:gap-x-4 gap-x-2 ml-auto">
      {/* <div className={cn("sm:block hidden", noSideBar && "block")}>
        <ThemeToggler />
      </div> */}
      {isSignedIn ? (
        <>
          <ClerkLoading>
            <Skeleton className="h-10 w-10 rounded-full" />
          </ClerkLoading>
          <ClerkLoaded>
            <p className="sm:block hidden text-2xl  text-black/70 dark:text-white/90 font-semibold">
              {user?.fullName}
            </p>
            <UserButton afterSignOutUrl="/sign-in" />
          </ClerkLoaded>
        </>
      ) : (
        <>
          <Link href="/sign-in" className="lg:block hidden">
            <Button
              variant="outline"
              className="md:text-lg text-sm w-max font-bold "
            >
              Log in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              variant="secondary"
              className="relative bg-slate-100 hover:bg-white text-black md:text-lg text-sm w-max font-bold shadow-lg"
            >
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthBox;
