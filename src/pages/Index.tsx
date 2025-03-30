
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import ArtCard, { ArtworkType } from "@/components/ArtCard";
import { Paintbrush, Image, UserRound } from "lucide-react";

const Index = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<ArtworkType[]>([]);
  
  useEffect(() => {
    // Simulating fetching featured artworks
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
    ];
    
    setFeaturedArtworks(demoArtworks);
  }, []);

  const handleLike = (artworkId: string, isLiked: boolean) => {
    // In a real app, this would call an API
    console.log(`Artwork ${artworkId} ${isLiked ? "liked" : "unliked"}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-12">
        {/* Hero section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Create, Share, Connect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Sketchstudio is where artists gather to create digital art, 
            share their masterpieces, and connect with other artists.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/create">
              <Button size="lg" className="gap-2">
                <Paintbrush size={18} />
                Start Drawing
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="gap-2">
                <Image size={18} />
                Explore Artwork
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Features section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What You Can Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Paintbrush size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Draw Anything</h3>
              <p className="text-muted-foreground">
                Use our powerful yet simple drawing tools to create digital masterpieces.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share Your Art</h3>
              <p className="text-muted-foreground">
                Upload your artwork to showcase your talent with the world.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserRound size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Community</h3>
              <p className="text-muted-foreground">
                Connect with other artists, like their work, and grow together.
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured artwork section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Artwork</h2>
            <Link to="/explore">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredArtworks.map((artwork) => (
              <ArtCard
                key={artwork.id}
                artwork={artwork}
                onLike={handleLike}
              />
            ))}
          </div>
        </section>
      </main>
      
      <footer className="bg-card border-t border-border py-8">
        <div className="container text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Sketchstudio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
