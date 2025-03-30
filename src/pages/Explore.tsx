
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import ArtCard, { ArtworkType } from "@/components/ArtCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Explore = () => {
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching artworks from API
    const fetchArtworks = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const demoArtworks: ArtworkType[] = [
        {
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
        {
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
        {
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
        {
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
        {
          id: "art-5",
          title: "Minimalist Design",
          imageUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
          creator: {
            id: "user-5",
            username: "minimalist",
          },
          likes: 29,
          liked: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "art-6",
          title: "Nature Inspired",
          imageUrl: "https://images.unsplash.com/photo-1501472312651-726afe119ff1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
          creator: {
            id: "user-6",
            username: "natureartist",
          },
          likes: 52,
          liked: false,
          createdAt: new Date().toISOString(),
        },
      ];
      
      setArtworks(demoArtworks);
      setIsLoading(false);
    };
    
    fetchArtworks();
  }, []);

  const handleLike = (artworkId: string, isLiked: boolean) => {
    // In a real app, this would call an API
    console.log(`Artwork ${artworkId} ${isLiked ? "liked" : "unliked"}`);
  };

  const filteredArtworks = artworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artwork.creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Artwork</h1>
        
        {/* Search bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {isLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-4 flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    <div className="w-20 h-4 bg-muted animate-pulse" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArtworks.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredArtworks.map((artwork) => (
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
              No artworks found matching your search.
            </p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
