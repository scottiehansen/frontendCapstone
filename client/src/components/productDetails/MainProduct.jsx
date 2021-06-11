import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductFeatures from './ProductFeatures.jsx';
const key = require('/client/src/config/config.js');
import ProductImages from './ProductImages.jsx';
import Styles from './Styles.jsx';
import SizeAndQuantity from './SizeAndQuantity';
import "core-js/stable";
import "regenerator-runtime/runtime";

function MainProduct (props) {
  const [item, setItem] = useState({});
  const [features, setFeatures] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [subImages, setSubImages] = useState([]);
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [availableStyles, setAvailableStyles] = useState([]);
  const [styleId, setStyleId] = useState('')
  const [sizes, setSizes] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [resultIndex, setResultIndex] = useState(0);

  const getSizesAndQuantities = (object) => {
    let sizesArray = [];
    let quantitiesArray = [];
    for (var keys in object) {
      for (var innerKeys in object.keys) {
        if (innerKeys === 'quantity') {
          quantities.push(object.keys.innerKeys)
        } else if (innerKeys === 'size') {
          quantities.push(object.keys.innerkeys);
        }
      }
    }
    setSizes(sizesArray);
    setQuantities(quantitiesArray);
  }

  useEffect(async (index = 0) => {
    setItem(props.item);
    const config = {
      headers: {Authorization: `${key.API_KEY}`}
    };
    const [featureResponse, imageStyleResponse] = await Promise.all([
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/products/${props.item.id}`, config),
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/products/${props.item.id}/styles`, config)
    ]);
    setFeatures(featureResponse.data.features);
    setMainImage(imageStyleResponse.data.results[index].photos[index].url);
    setSubImages(imageStyleResponse.data.results[index].photos);
    setAvailableStyles(imageStyleResponse.data.results);
    setStyleId(imageStyleResponse.data.results[index].style_id);
    if (imageStyleResponse.data.results[index].sale_price === null) {
      setOriginalPrice(imageStyleResponse.data.results[0].original_price);
    } else {
      setOriginalPrice(imageStyleResponse.data.results[0].original_price);
      setSalePrice(imageStyleResponse.data.results[0].sale_price);
    }
    getSizesAndQuantities(imageStyleResponse.data.results[0].skus)
  }, [])


  const handleImageClick = (index) => {
    const config = {
      headers: {Authorization: `${key.API_KEY}`}
    };
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/products/${props.item.id}/styles`, config)
      .then (response => {
        setMainImage(response.data.results[resultIndex].photos[index].url);
        setSubImages(response.data.results[resultIndex].photos);
      })
  }

  const handleStyleChange = (index) => {
    const config = {
      headers: {Authorization: `${key.API_KEY}`}
    };
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/products/${props.item.id}/styles`, config)
      .then (response => {
        setMainImage(response.data.results[index].photos[0].url);
        setSubImages(response.data.results[index].photos);
        setStyleId(response.data.results[index].style_id);
        if (response.data.results[index].sale_price === null) {
          setOriginalPrice(response.data.results[index].original_price);
          setSalePrice('');
        } else {
          setOriginalPrice(response.data.results[index].original_price);
          setSalePrice(response.data.results[index].sale_price);
        }
        setResultIndex(index);
      })
  }

  return (
    <div>
      <img src={mainImage} />
      {subImages.map((image, index) => <ProductImages image={image} key={index} index={index} onClick={handleImageClick}/>)}
      <h1>{item.name}</h1>
      <h3>$ {originalPrice} {salePrice}</h3>
      <button>Add to Cart</button>
      {sizes.map((size, index) => <SizeAndQuantity sizes={sizes} key={index} /> ) }
      {availableStyles.map((style, index) => <Styles style={style} key={index} index={index} onClick={handleStyleChange}/>)}
      <h4>category: {item.category}</h4>
      <p>description: {item.description} style ID: {styleId}</p>
      {features.map((feature, index) => <ProductFeatures feature={feature} key={index} />)}
    </div>
  )
}

export default MainProduct;