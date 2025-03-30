
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/hooks/useAuth";

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          SketchSocial
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
            Explore
          </Link>
          <Link to="/create" className="text-foreground hover:text-primary transition-colors">
            Create
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture} alt={user?.username} />
                  <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-foreground">{user?.username}</span>
              </Link>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-foreground hover:text-primary"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
          <ModeToggle />
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto mt-2 pb-4 space-y-3 flex flex-col animate-fade-in">
          <Link to="/explore" className="text-foreground hover:text-primary py-2 transition-colors">
            Explore
          </Link>
          <Link to="/create" className="text-foreground hover:text-primary py-2 transition-colors">
            Create
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-foreground hover:text-primary py-2 transition-colors">
                Profile
              </Link>
              <Button
                variant="ghost"
                onClick={logout}
                className="justify-start px-0 text-foreground hover:text-primary"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
          <div className="pt-2">
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
