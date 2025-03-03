import { FileText, Users, DatabaseBackup } from "lucide-react";

export const navigation = [
  {
    id: 1,
    icon: <FileText className="icon" strokeWidth={1.25} />,
    text: "PBM",
    url: "/",
  },
  {
    id: 2,
    icon: <Users className="icon" strokeWidth={1.25} />,
    text: "Perwalian",
    url: "/perwalian",
  },
  {
    id: 3,
    icon: <DatabaseBackup className="icon" strokeWidth={1.25} />,
    text: "Sinkronisasi",
    url: "/sinkronisasi",
  },
];
