import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DishInfo = ({ render }) => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [price, setPrice] = useState(0);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updatePriceBySize = (size) => {
    const selectedPrice = dish?.price[size];
    setPrice(selectedPrice !== undefined ? selectedPrice : dish.price[Object.keys(dish.price)[0]]);
  };

  useEffect(() => {
    const fetchDishDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3042/dish/${id}`);
        if (!response.ok) throw new Error(`${response.status}`);
        
        const result = await response.json();
        if (result?.data) {
          const dishData = result.data;
          setDish(dishData);

          const sizes = Object.keys(dishData.price);
          setAvailableSizes(sizes);
          const defaultSize = sizes[0];
          setSelectedSize(defaultSize);
          setPrice(dishData.price[defaultSize]);
        } else {
          setError("Data ikke fundet");
        }
      } catch (err) {
        setError(err.message || "Fejl ved indlæsning af ret");
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetails();
  }, [id]);

  useEffect(() => {
    if (selectedSize && dish) updatePriceBySize(selectedSize);
  }, [selectedSize, dish]);

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  if (loading) return <p>Indlæser ret...</p>;
  if (error) return <p>Der opstod en fejl: {error}</p>;
  if (!dish) return <p>Ret ikke fundet.</p>;

  return render({
    dish,
    selectedSize,
    handleSizeChange,
    price,
    availableSizes,
  });
};

export default DishInfo;
