import { createContext, useContext, useState } from "react";
import api from "../shared/api";

const PlantaContext = createContext(undefined);

export const PlantaContextProvider = ({ children }) => { 
  const [filterPlanta, setFilterPlanta] = useState([]);
  
  const obtenerPlanta = async (plantaId) => {
    const response = await api.get(`/plantas/${plantaId}`);
    return response.data;
  }
  

  const filterPlant = async (filter) => {
    const query = new URLSearchParams(filter).toString(); 
    const response = await api.get(`/plantas/filter/query?${query}`);

    setFilterPlanta(response.data);
  };

  return (
    <PlantaContext.Provider value={{ filterPlanta, filterPlant, obtenerPlanta }}>
      {children}
    </PlantaContext.Provider>
  );
}


// eslint-disable-next-line react-refresh/only-export-components
export const usePlanta = () => {
  const context = useContext(PlantaContext);
  if (context === undefined) {
    throw new Error("usePlanta must be used within a PlantaContextProvider");
  }
  return context;
};