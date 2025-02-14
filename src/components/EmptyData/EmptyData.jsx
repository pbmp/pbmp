function EmptyData({ data }) {
  return (
    <>
      {data.length === 0 && (
        <div className="empty-data">Data tidak ditemukan</div>
      )}
    </>
  );
}

export default EmptyData;
