import { Card, CardMedia, CardContent, Avatar, Typography, Box, IconButton, Button, Switch } from "@mui/material";
import { Favorite, ChatBubbleOutline } from "@mui/icons-material";

export default function PostCard({
  post,
  type,        // "feed", "my", "pending"
  role,
  user,
  onLike,
  onComment,
  onDelete,
  onApprove,
  onTogglePublic
}) {
  return (
    <Card className="bg-sky-100 rounded-xl overflow-hidden h-full">
      <CardMedia
        component="img"
        image={post.image}
        alt={post.description || "Publicación"}
        sx={{ objectFit: "cover", height: 200 }}
      />
      <CardContent className="p-4">
        {/* Avatar + Usuario */}
        {type !== "my" && (
          <Box className="flex items-center mb-2">
            <Avatar
              src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${post.userName}`}
              className="mr-2"
            />
            <Typography variant="subtitle1">{post.userName}</Typography>
          </Box>
        )}

        {/* Título generalizado = descripción */}
        <Typography variant="p" className="mb-2">
          {post.description}
        </Typography>

        {/* Tipo de tarjeta */}
        {type === "my" && (
          <>
          {role === "estudiante" && !post.approved ? (
            <Typography variant="body2" color="warning.main">
              ⚠️ Publicación pendiente de aprobación
            </Typography>
          ) : (
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="text-gray-600">
                {post.public ? "Público para la comunidad" : "Privado"}
              </Typography>
              <Switch
                size="small"
                checked={post.public || false}
                onChange={() => onTogglePublic?.(post.id, post.public)}
              />
            </Box>
          )}
        </>
        
        )}

        {type === "pending" && (
          <Typography variant="body2" className="mb-2">
            Subido por: {post.userName}
          </Typography>
        )}

        {/* Botones principales */}
        <Box className="flex justify-between items-center">
          {type !== "pending" && (
            <>
              <Box className="flex items-center space-x-1">
                <IconButton size="small" onClick={() => onLike?.(post.id, post.likes)}>
                  <Favorite
                    fontSize="small"
                    color={post.likes?.includes(user?.uid) ? "error" : "inherit"}
                  />
                </IconButton>
                <Typography variant="body2">{post.likes?.length || 0}</Typography>
              </Box>
              <Box className="flex items-center space-x-1">
                <IconButton size="small" onClick={() => onComment?.(post)}>
                  <ChatBubbleOutline fontSize="small" />
                </IconButton>
                <Typography variant="body2">{post.commentCount || 0}</Typography>
              </Box>
            </>
          )}

          {type === "my" && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete?.(post.id)}
            >
              Eliminar
            </Button>
          )}

          {type === "pending" && (
            <Box className="flex space-x-2">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onApprove?.(post.id)}
              >
                Aprobar
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onDelete?.(post.id)}
              >
                Rechazar
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
