import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Avatar, Button, Stack } from "@mui/material";

const UsersTable = ({
  title,
  usuarios,
  showRole = true,
  showActions = false,
  onApprove,
  onReject,
}) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Paper className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHead>
            <TableRow>
              <TableCell className="text-center"><strong>Nombre</strong></TableCell>
              <TableCell className="text-center"><strong>Username</strong></TableCell>
              <TableCell className="text-center"><strong>Email</strong></TableCell>
              {showRole && <TableCell className="text-center"><strong>Rol</strong></TableCell>}
              <TableCell className="text-center"><strong>Creación</strong></TableCell>
              {showActions && <TableCell className="text-center"><strong>Acciones</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => {
              // Color de fondo según verificación de correo
              let bgColor = u.emailVerified === false ? "#f8d7da" : "transparent"; // rojo suave si no verificado

              return (
                <TableRow key={u.id} style={{ backgroundColor: bgColor }}>
                  <TableCell className="p-3 text-center">
                    <div className="flex items-center gap-2">
                      <Avatar
                        alt={u.username || "User"}
                        src={
                          u.photoURL ||
                          `https://api.dicebear.com/6.x/adventurer/svg?seed=${u.nombre}`
                        }
                      />
                      <span>{u.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{u.username}</TableCell>
                  <TableCell className="text-center">{u.email}</TableCell>
                  {showRole && <TableCell className="text-center">{u.rol}</TableCell>}
                  <TableCell className="text-center">
                    {(() => {
                      if (!u.createdAt) return "Sin fecha";
                      let fecha;
                      if (u.createdAt._seconds !== undefined)
                        fecha = new Date(u.createdAt._seconds * 1000);
                      else fecha = new Date(u.createdAt);
                      if (isNaN(fecha)) return "Fecha inválida";
                      return fecha.toLocaleDateString("es-EC");
                    })()}
                  </TableCell>

                  {showActions && (
                    <TableCell className="text-center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => onApprove(u.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => onReject(u.id)}
                        >
                          Rechazar
                        </Button>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default UsersTable;
