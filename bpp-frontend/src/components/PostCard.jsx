import { Card, CardMedia, CardContent, Avatar, Typography, Box, IconButton, Button, Switch, Tooltip } from "@mui/material";
import { Favorite, ChatBubbleOutline, Delete } from "@mui/icons-material";

export default function PostCard({
  post,
  type,        // "feed", "my", "pending"
  role,
  user,
  onLike,
  onComment,
  onDelete,    // Esta función llega solo si es profesor en el feed o dueño en "my"
  onApprove,
  onTogglePublic
}) {
  return (
    <Card className="bg-sky-100 rounded-xl overflow-hidden h-full flex flex-col">
      <CardMedia
        component="img"
        image={post.image}
        alt={post.description || "Publicación"}
        sx={{ objectFit: "cover", height: 200 }}
      />
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <Box>
            {/* Avatar + Usuario */}
            {type !== "my" && (
            <Box className="flex items-center mb-2">
                <Avatar
                src={post.userPhoto || `https://api.dicebear.com/6.x/adventurer/svg?seed=${post.userName}`}
                className="mr-2"
                />
                <Typography variant="subtitle1" fontWeight="bold">{post.userName}</Typography>
            </Box>
            )}

            {/* Descripción */}
            <Typography variant="body2" color="text.secondary" className="mb-4 line-clamp-3">
            {post.description}
            </Typography>
        </Box>

        {/* --- LÓGICA POR TIPO DE TARJETA --- */}

        {/* 1. MI ESPACIO */}
        {type === "my" && (
          <Box mb={2}>
            {role === "estudiante" && !post.approved ? (
                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 'bold', display: 'block', mb: 1 }}>
                    ⚠️ Pendiente de aprobación
                </Typography>
            ) : (
                <Box className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <Typography variant="caption" className="text-gray-600">
                        {post.public ? "Público 🌍" : "Privado 🔒"}
                    </Typography>
                    <Switch
                        size="small"
                        checked={post.public || false}
                        onChange={() => onTogglePublic?.(post.id, post.public)}
                    />
                </Box>
            )}
          </Box>
        )}

        {/* 2. PENDIENTES (Solo info extra) */}
        {type === "pending" && (
          <Typography variant="caption" display="block" mb={2}>
            Subido por: <strong>{post.userName}</strong>
          </Typography>
        )}

        {/* --- BOTONERA INFERIOR --- */}
        <Box className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          
          {/* A. Feed y Mis Publicaciones (Likes y Comentarios) */}
          {type !== "pending" && (
            <>
              <Box className="flex items-center space-x-3">
                <Box className="flex items-center">
                    <IconButton size="small" onClick={() => onLike?.(post.id, post.likes)}>
                    <Favorite
                        fontSize="small"
                        color={post.likes?.includes(user?.uid) ? "error" : "inherit"}
                    />
                    </IconButton>
                    <Typography variant="caption" ml={0.5}>{post.likes?.length || 0}</Typography>
                </Box>
                <Box className="flex items-center">
                    <IconButton size="small" onClick={() => onComment?.(post)}>
                    <ChatBubbleOutline fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" ml={0.5}>{post.commentCount || 0}</Typography>
                </Box>
              </Box>

              {/* Botón de Borrar (Para el dueño O para el profesor en el feed) */}
              {onDelete && (
                  <Tooltip title="Eliminar publicación">
                    <IconButton size="small" color="error" onClick={() => onDelete(post.id)}>
                        <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
              )}
            </>
          )}

          {/* B. Pendientes (Aprobar / Rechazar) */}
          {type === "pending" && (
            <Box className="flex space-x-2 w-full justify-end">
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => onDelete?.(post.id)}
              >
                Rechazar
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => onApprove?.(post.id)}
              >
                Aprobar
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}