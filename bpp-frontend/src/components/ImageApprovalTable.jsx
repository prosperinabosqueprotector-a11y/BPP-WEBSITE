import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageApprovalTable = ({ items, showApproval = true, onAccept, onReject }) => {
  // Nuevo estado para previsualización
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePreview = (imageUrl) => {
    setSelectedImage(imageUrl);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-3 text-center">Archivo</th>
              <th className="p-3 text-center">Explorador</th>
              <th className="p-3 text-center">Fecha</th>
              <th className="p-3 text-center">Hora</th>
              {showApproval && <th className="p-3 text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="bg-white border rounded-lg shadow-sm my-2"
              >
                <td className="p-3 text-center align-middle">
                  <img
                    src={item.archivo}
                    alt="archivo"
                    className="h-16 w-20 object-cover rounded mx-auto cursor-pointer"
                    onClick={() => handlePreview(item.archivo)} // abrir preview
                  />
                </td>
                <td className="p-3 text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <span>{item.explorador}</span>
                  </div>
                </td>
                <td className="p-3 text-center align-middle">{item.fecha}</td>
                <td className="p-3 text-center align-middle">{item.hora}</td>
                {showApproval && (
                  <td className="p-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-5">
                      <button className="text-green-600 hover:scale-110 transition" onClick={() => onAccept(item)}>
                        <ThumbUpIcon />
                      </button>
                      <button className="text-red-600 hover:scale-110 transition" onClick={() => onReject(item)}>
                        <ThumbDownIcon />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diálogo de previsualización */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0,0,0,0.8)',
            boxShadow: 'none',
          },
        }}
      >
        <IconButton
          onClick={handleClosePreview}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
            cursor: 'zoom-out',
          }}
          onClick={handleClosePreview}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="preview"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageApprovalTable;
