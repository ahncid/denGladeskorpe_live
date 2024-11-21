import { useLocalStorage } from '@uidotdev/usehooks';

// Custom hook til håndtering af kurven
const useBasket = () => {
  // Brug af useLocalStorage til at gemme kurven i localStorage
  const [basket, saveBasket] = useLocalStorage("basket", []);

  // Funktion til at sammenligne om to arrays er ens
  const arraysEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false; // Hvis længderne ikke matcher, er de ikke ens
    // Sorterer og sammenligner alle værdierne i de to arrays
    return [...a].sort().every((val, index) => val === [...b].sort()[index]);
  };

  // Funktion til at tilføje en ret til kurven
  const addToBasket = (dish, selectedSize, selectedExtras = []) => {
    const extras = selectedExtras || []; // Sikrer at extras altid er et array
    const itemPrice = dish.price[selectedSize]; // Henter prisen for den valgte størrelse

    // Finder ud af om en lignende vare allerede findes i kurven
    const existingItemIndex = basket.findIndex(
      (item) =>
        item.id === dish._id &&
        item.size === selectedSize &&
        arraysEqual(item.extras, extras)
    );

    // Kopierer det nuværende indhold af kurven
    const updatedBasket = [...basket];

    // Hvis varen ikke findes i kurven, tilføjes den som ny
    if (existingItemIndex === -1) {
      updatedBasket.push({
        id: dish._id,
        title: dish.title,
        price: itemPrice,
        size: selectedSize,
        quantity: 1,
        ingredients: dish.ingredients,
        extras,
        image: dish.image,
      });
    } else {
      // Hvis varen allerede findes i kurven, øges mængden med 1
      updatedBasket[existingItemIndex].quantity += 1;
    }

    // Gemmer den opdaterede kurv i localStorage
    saveBasket(updatedBasket);
  };

  // Funktion til at fjerne en ret fra kurven baseret på id, størrelse og extras
  const removeFromBasket = (itemId, size, extras = []) => {
    // Filtrerer kurven og fjerner det item, der matcher kriterierne
    const updatedBasket = basket.filter(
      (item) =>
        !(
          item.id === itemId &&
          item.size === size &&
          arraysEqual(item.extras, extras)
        )
    );
    // Gemmer den opdaterede kurv
    saveBasket(updatedBasket);
  };

  // Funktion til at beregne det totale antal varer i kurven
  const getTotalItems = () => basket.reduce((total, item) => total + item.quantity, 0);

  // Funktion til at tømme hele kurven
  const clearBasket = () => saveBasket([]);

  // Returnerer funktionerne og data til brug andre steder i applikationen
  return { addToBasket, getTotalItems, removeFromBasket, basket, clearBasket };
};

export default useBasket;
