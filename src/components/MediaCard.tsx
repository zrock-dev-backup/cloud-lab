import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

interface MediaCardProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
}

export default function MediaCard({ name, imageUrl, onClick }: MediaCardProps) {
  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="160"
          image={imageUrl}
          alt={name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
