import { useState } from "react";

export const useScannedData = () => {
  const [scannedData, setScannedData] = useState<string[]>([]);

  const addData = (data: string) => setScannedData(prev => [...prev, data]);

  const deleteData = (dataToDelete: string) =>
    setScannedData(prev => prev.filter(item => item !== dataToDelete));

  return { scannedData, addData, deleteData };
};
