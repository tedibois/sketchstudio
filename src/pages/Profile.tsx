
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import ArtCard, { ArtworkType } from "@/components/ArtCard";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Heart } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userArtworks, setUserArtworks] = useState<ArtworkType[]>([]);
  const [likedArtworks, setLikedArtworks] = useState<ArtworkType[]>([]);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    
    // Simulate fetching user's artworks
    const fetchUserArtworks = async () => {
      setIsLoadingArtworks(true);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Demo data
      const demoArtworks: ArtworkType[] = [
        {
          id: "user-art-1",
          title: "My First Drawing",
          imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
          creator: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture,
          },
          likes: 12,
          liked: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "user-art-2",
          title: "Abstract Thoughts",
          imageUrl: "https://images.unsplash.com/photo-1482160549825-59d1b23f3d73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
          creator: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture,
          },
          likes: 8,
          liked: false,
          createdAt: new Date().toISOString(),
        },
      ];
      
      // Demo liked artworks
      const demoLikedArtworks: ArtworkType[] = [
        {
          id: "liked-art-1",
          title: "Digital Portrait",
          imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
          creator: {
            id: "user-2",
            username: "creativegenius",
          },
          likes: 42,
          liked: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "liked-art-2",
          title: "Color Explosion",
          imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
          creator: {
            id: "user-4",
            username: "colormaster",
          },
          likes: 38,
          liked: true,
          createdAt: new Date().toISOString(),
        },
      ];
      
      setUserArtworks(demoArtworks);
      setLikedArtworks(demoLikedArtworks);
      setIsLoadingArtworks(false);
    };
    
    fetchUserArtworks();
  }, [user]);

  const handleLike = (artworkId: string, isLiked: boolean) => {
    // In a real app, this would call an API
    console.log(`Artwork ${artworkId} ${isLiked ? "liked" : "unliked"}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container py-8 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="flex-shrink-0">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="text-2xl">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
            <p className="text-muted-foreground mb-4">{user.email}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Button className="gap-2" onClick={() => navigate("/create")}>
                Create New Artwork
              </Button>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="artwork" className="w-full">
          <TabsList className="w-full max-w-md mb-8">
            <TabsTrigger
              value="artwork"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Image size={16} />
              My Artwork
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Heart size={16} />
              Liked
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="artwork">
            {isLoadingArtworks ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : userArtworks.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {userArtworks.map((artwork) => (
                  <ArtCard
                    key={artwork.id}
                    artwork={artwork}
                    onLike={handleLike}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  You haven't created any artwork yet
                </p>
                <Button onClick={() => navigate("/create")}>
                  Create Your First Artwork
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liked">
            {isLoadingArtworks ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : likedArtworks.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {likedArtworks.map((artwork) => (
                  <ArtCard
                    key={artwork.id}
                    artwork={artwork}
                    onLike={handleLike}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  You haven't liked any artwork yet
                </p>
                <Button onClick={() => navigate("/explore")}>
                  Explore Artwork
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
