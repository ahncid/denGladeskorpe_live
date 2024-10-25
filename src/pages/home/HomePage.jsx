import { useState } from "react";
import DynamicHeader from "../../components/common/Header/Header";
import SubHeader from "../../components/common/Subheader/SubHeader";
import SubHeaderHeadline from "../../components/common/Subheader/SubHeaderHeadline";
import Categories from "../../components/category/Category";
import Dishes from "../../components/dishes/Dishes";
import styles from "./HomePage.module.css";

const HomePage = () => {
 
  const [selectedCategory, setSelectedCategory] = useState("");

 
  const handleCategorySelect = (category) => {
    setSelectedCategory(category); 
  };

  return (
    <div>
      <DynamicHeader 
        backgroundImage="/headerImg.png" 
        dynamicWord="skorpe"  
      />

      <SubHeader
        title="Velkommen til Den Glade Skorpe" 
        paragraph={`Hos os handler det om den perfekte pizza med den sprødeste skorpe. Vi bruger kun de bedste råvarer til både klassiske favoritter og spændende specialiteter som "Parma Drama" og "Rabbit Royale". Uanset om du er til en lille, personlig pizza eller en stor familiedeling, så finder du det hos os. Kom forbi og nyd en pizza lavet med kærlighed, eller bestil den, hent den og nyd den derhjemme!`}
      />

      <SubHeaderHeadline title="Vælg kategori" />

      {/* Send handleCategorySelect som prop til Categories */}
      <Categories CategorySelect={handleCategorySelect} />

      {/* Send den valgte kategori som prop til Dishes */}
      <Dishes selectedCategory={selectedCategory} />
    </div>
  );
};

export default HomePage;
