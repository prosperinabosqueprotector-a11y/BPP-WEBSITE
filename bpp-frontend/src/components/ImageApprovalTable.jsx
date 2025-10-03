import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const ImageApprovalTable = ({ items, showApproval = true, onAccept, onReject }) => {
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
                    className="h-16 w-20 object-cover rounded mx-auto"
                  />
                </td>
                <td className="p-3 text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={item.avatar}
                      alt={item.explorador}
                      className="h-8 w-8 rounded-full"
                    />
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
    </div>
  );
};

export default ImageApprovalTable;
