import { AvisoProvider } from "./componentes/Aviso";
import { RecorridoProvider } from "./componentes/Recorrido";
import { VisorProvider } from "./componentes/Visor";
import { Riel } from "./componentes/Riel";
import { Portada } from "./componentes/Portada";
import { Mercado } from "./componentes/Mercado";
import { Comerciante } from "./componentes/Comerciante";
import { Inventario } from "./componentes/Inventario";
import { Trato } from "./componentes/Trato";
import { Pie } from "./componentes/Pie";
import { LuzProvider } from "./luz/Luz";
import { PaseoProvider } from "./movimiento/Paseo";

// Bazar de sombras: un tianguis de noche. La luz la dan los focos, y cada proyecto es un puesto.

export function App() {
  return (
    <AvisoProvider>
      <LuzProvider>
        <RecorridoProvider>
          <PaseoProvider>
            <VisorProvider>
              <a className="skip" href="#puestos">Saltar a los proyectos</a>
              <div className="sky" aria-hidden="true" />
              <Riel />
              <main>
                <Portada />
                <Mercado />
                <Comerciante />
                <Inventario />
                <Trato />
              </main>
              <Pie />
            </VisorProvider>
          </PaseoProvider>
        </RecorridoProvider>
      </LuzProvider>
    </AvisoProvider>
  );
}
