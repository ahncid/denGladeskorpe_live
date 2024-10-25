import { useLocalStorage } from '@uidotdev/usehooks';

const useBasket = () => {
  const [basket, saveBasket] = useLocalStorage("basket", []);

  const arraysEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return [...a].sort().every((val, index) => val === [...b].sort()[index]);
  };

  const addToBasket = (dish, selectedSize, selectedExtras = []) => {
    const extras = selectedExtras || [];
    const itemPrice = dish.price[selectedSize];

    const existingItemIndex = basket.findIndex(
      (item) =>
        item.id === dish._id &&
        item.size === selectedSize &&
        arraysEqual(item.extras, extras)
    );

    const updatedBasket = [...basket];
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
      updatedBasket[existingItemIndex].quantity += 1;
    }
    saveBasket(updatedBasket);
  };

  const removeFromBasket = (itemId, size, extras = []) => {
    const updatedBasket = basket.filter(
      (item) =>
        !(
          item.id === itemId &&
          item.size === size &&
          arraysEqual(item.extras, extras)
        )
    );
    saveBasket(updatedBasket);
  };

  const getTotalItems = () => basket.reduce((total, item) => total + item.quantity, 0);

  // Tilføj denne funktion til at tømme kurven
  const clearBasket = () => saveBasket([]);

  return { addToBasket, getTotalItems, removeFromBasket, basket, clearBasket };
};

export default useBasket;
