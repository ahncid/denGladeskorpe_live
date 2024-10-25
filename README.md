# Den Glade Skorpe

Author      : Søren Jung Henriksen  
Department  : WebH120-2
Year        : 2024  
Description : Eksamensopgave - Den Glade Skorpe + Vite + React  

## For at starte klienten

1. Installer pakker:

    ```
    npm install
    ```

2. Start Dev klient:

    ```
    npm run dev
    ```

## For at starte serveren

1. Installer pakker:

    ```
    npm install
    ```

2. Start server:

    ```
    npm run "Start Server"
    ```

## Applikation

URL til applikation : http://localhost:5173/

# Loginoplysninger til backoffice: 

Brugernavn : admin@mediacollege.dk
Password : admin

---

## Rapport

### Vurdering af egen indsats og gennemførelse af opgaven

Jeg har gennemført opgaven med en fokuseret tilgang og har lagt vægt på både koderenhed og funktionalitet. Min indsats har været fokuseret på at sikre, at komponenterne er skalerbare og at løsningen opfylder kravene til især mobile enheder. Applikationen indeholder alle obligatoriske og tilvalgs opgaver.
Overordnet er jeg tilfreds med min egen indsats.

## Projektforløb

- **Dag 1**: 
   - Startede med at teste alle endpoints i Postman for både at forstå datastrukturen og sikre forbindelsen.
   - Begyndte udviklingen af projektet ved at oprette grundlæggende sider og komponenter.
   - Kiggede på Figma-designet og identificerede genbrugelige komponenter.
   - Implementerede forside og filtreringsfunktionalitet.

- **Dag 2**: 
   - Lavede `DetailsPage`, hvor den valgte ret fra brugeren vises.
   - Implementerede funktionalitet til at vælge størrelse og ekstra ingredienser.
   - Oprettede en funktionel kurv (`Basket`) til at tilføje og håndtere valg af retter.

- **Dag 3**: 
   - Implementerede siderne for personale og kontakt.

- **Dag 4**: 
   - Arbejdede med autentificering (`Auth`) og begyndte på backoffice-funktionaliteten.

- **Dag 5**: 
   - Fuldførte backoffice-delen.
   - Arbejdede med responsivitet og færdiggjorde rapporten.


### Argumentation for valg 

Jeg har valgt React som frontend-framework, da det gør det muligt at skabe komponentbaserede og genanvendelige dele af applikationen. Dette giver en enkel måde at håndtere state management og dataflow gennem komponenter ved hjælp af hooks som `useState` og `useEffect`. Sammen med Vite som byggeværktøj, som er hurtigt og nemt at konfigurere, gør React det muligt at udvikle en brugervenlig og effektiv frontend.

### Oprindelsen af forskellige kodeelementer

Jeg har anvendt nogle eksterne værktøjer og hooks, som har gjort løsningen mere effektiv:

- **`useLocalStorage` Hook**: Anvendes til at gemme brugerens kurv (basket) i lokal opbevaring, så data forbliver, selv når brugeren opdaterer siden. Denne hook er hentet fra `@uidotdev/usehooks`.
- **`serverPath` Variabel**: Placeret i en separat fil og giver mulighed for hurtigt at ændre serverstien ét sted i koden, hvilket gør koden mere DRY (Don’t Repeat Yourself). Ved at have serverPath i en separat fil kan man også ændre base-URL’en ét sted, hvilket er nyttigt, hvis serveren flytter, eller hvis der er forskellige miljøer (f.eks. udvikling, test, produktion). Dette gør vedligeholdelsen meget lettere.

## `useTinyFetch` Hook

 `useTinyFetch` er en custom React-hook, som bruges til at hente data fra serveren. Hook'en gemmer dataen i en lokal state og muliggør genbrug af datahentning på tværs af komponenter. I mit projekt bruger jeg den til GET-forespørgsler. 

```javascript
import { useState } from "react";
import { serverPath } from "../services/settings"; 

const useTinyFetch = () => {
  const [data, setData] = useState([]);

  const fetchData = async (url) => {
    const response = await fetch(`${serverPath}${url}`);
    const result = await response.json();
    setData(result.data);
    return result;
  };

  return {
    data,
    fetchData,
  };
};

export default useTinyFetch;
```








