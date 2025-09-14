import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ToggleContainer } from "./toggle-container";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Loader, LogOut, User, Settings, Sparkles } from "lucide-react";

const Header = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex items-center gap-4 w-full py-4">
          {/* logo section */}
          <LogoContainer />

          {/* navigation section */}
          <nav className="hidden md:flex items-center gap-6">
            <NavigationRoutes />
            {user && (
              <NavLink
                to={"/generate"}
                className={({ isActive }) =>
                  cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )
                }
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Take An Interview
                </span>
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            {/* profile section */}
            {loading ? (
              <div className="flex items-center">
                <Loader className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                        {user.displayName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.photoURL || ""}
                        alt={user.displayName || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                        {user.displayName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-semibold text-foreground">
                          {user.displayName}
                        </p>
                      )}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 rounded-lg hover:bg-muted/50">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 rounded-lg hover:bg-muted/50">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="p-3 rounded-lg hover:bg-destructive/10 text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted/50"
                  >
                    Sign In
                  </Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button size="sm" className="btn-premium">
                    Get Started
                  </Button>
                </NavLink>
              </div>
            )}

            {/* mobile toggle section */}
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
