export const formatName = (nama) => {
  return nama
    .replace(/,.*/g, "") // Menghapus semua gelar setelah koma
    .trim() // Menghapus spasi di awal/akhir
    .replace(/\s+/g, "-") // Mengganti spasi dengan "-"
    .toLowerCase(); // Mengubah ke lowercase
};
