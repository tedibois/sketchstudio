
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type ArtworkType = {
  id: string;
  title: string;
  imageUrl: string;
  creator: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  likes: number;
  liked: boolean;
  createdAt: string;
};

type ArtCardProps = {
  artwork: ArtworkType;
  onLike: (artworkId: string, isLiked: boolean) => void;
};

const ArtCard = ({ artwork, onLike }: ArtCardProps) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(artwork.liked);
  const [likeCount, setLikeCount] = useState(artwork.likes);

  const handleLike = () => {
    if (!isAuthenticated) {
      return;
    }

    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    onLike(artwork.id, newLikedState);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-scale-in">
      <Link to={`/artwork/${artwork.id}`}>
        <CardContent className="p-0">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full aspect-square object-cover"
          />
        </CardContent>
      </Link>
      <CardFooter className="p-4 flex items-center justify-between">
        <Link to={`/user/${artwork.creator.id}`} className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={artwork.creator.profilePicture} />
            <AvatarFallback>
              {artwork.creator.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {artwork.creator.username}
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            disabled={!isAuthenticated}
            className="text-muted-foreground"
          >
            <Heart
              size={20}
              className={liked ? "fill-primary text-primary" : ""}
            />
          </Button>
          <span className="text-sm font-medium">{likeCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArtCard;
