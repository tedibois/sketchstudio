
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavBar from "@/components/NavBar";
import { ArtworkType } from "@/components/ArtCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const ArtworkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [artwork, setArtwork] = useState<ArtworkType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchArtwork = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // This would be a real API call in a production app
        const demoArtworks: Record<string, ArtworkType> = {
          "art-1": {
            id: "art-1",
            title: "Abstract Landscape",
            imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
            creator: {
              id: "user-1",
              username: "artist123",
            },
            likes: 24,
            liked: false,
            createdAt: new Date().toISOString(),
          },
          "art-2": {
            id: "art-2",
            title: "Digital Portrait",
            imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
            creator: {
              id: "user-2",
              username: "creativegenius",
            },
            likes: 42,
            liked: false,
            createdAt: new Date().toISOString(),
          },
          "art-3": {
            id: "art-3",
            title: "Geometric Patterns",
            imageUrl: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
            creator: {
              id: "user-3",
              username: "artlover",
            },
            likes: 15,
            liked: false,
            createdAt: new Date().toISOString(),
          },
          "art-4": {
            id: "art-4",
            title: "Color Explosion",
            imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
            creator: {
              id: "user-4",
              username: "colormaster",
            },
            likes: 38,
            liked: false,
            createdAt: new Date().toISOString(),
          },
        };
        
        const foundArtwork = id ? demoArtworks[id] : null;
        
        if (foundArtwork) {
          setArtwork(foundArtwork);
          setLiked(foundArtwork.liked);
          setLikeCount(foundArtwork.likes);
        }
      } catch (error) {
        console.error("Error fetching artwork:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtwork();
  }, [id]);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    
    // In a real app, this would call an API
    console.log(`Artwork ${id} ${newLikedState ? "liked" : "unliked"}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="aspect-square bg-muted rounded-lg mb-4" />
            <div className="h-6 bg-muted rounded w-1/4 mb-2" />
            <div className="h-4 bg-muted rounded w-full mb-1" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Artwork Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The artwork you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/explore")}>
            Explore Other Artwork
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-8">
        <Button
          variant="ghost"
          className="flex items-center mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-auto"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
            
            <Link
              to={`/user/${artwork.creator.id}`}
              className="flex items-center gap-3 mb-6"
            >
              <Avatar>
                <AvatarImage src={artwork.creator.profilePicture} />
                <AvatarFallback>
                  {artwork.creator.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{artwork.creator.username}</p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {format(new Date(artwork.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </Link>
            
            <div className="flex items-center gap-6 mb-8">
              <Button
                onClick={handleLike}
                variant={liked ? "default" : "outline"}
                className="gap-2"
              >
                <Heart
                  size={18}
                  className={liked ? "fill-primary-foreground" : ""}
                />
                {liked ? "Liked" : "Like"}
                <span className="ml-1">({likeCount})</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtworkDetails;
