import { useEffect, useRef, useState } from "react";

export default function App() {
  const [productsData, setProductsData] = useState([]);

  function addProduct(newProduct) {
    localStorage.setItem(newProduct.productId, JSON.stringify(newProduct));
    setProductsData((prevData) => [...prevData, newProduct]);
  }

  useEffect(() => {
    const data = [];
    Object.keys(localStorage).forEach((key) => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item && item.productId) {
          data.push(item);
        }
      } catch (error) {
        console.error(`Error parsing item with key "${key}":`, error);
      }
    });

    setProductsData(data);
  }, []);

  function deleteProduct(id) {
    localStorage.removeItem(id);
    setProductsData(productsData.filter((product) => product.productId !== id));
  }

  return (
    <div>
      <AddProduct onaddProduct={addProduct} />
      <ProductsList
        productsData={productsData}
        onDeleteProduct={deleteProduct}
      />
    </div>
  );
}

function AddProduct({ onaddProduct }) {
  const intialState = {
    productId: "",
    productPrice: 0,
    productName: "",
  };

  const [product, setProduct] = useState(intialState);

  function handleFormSubmit(e) {
    e.preventDefault();

    onaddProduct(product);

    setProduct(intialState);
  }

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // setProduct((prev) => {
    //   return {
    //     ...prev,
    //     [e.target.name]: e.target.value,
    //   };
    // });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label htmlFor="product">Product ID:</label>
      <input
        type="text"
        id="product"
        name="productId"
        value={product.productId}
        onChange={handleChange}
      />
      <label htmlFor="sellingPrice">Selling Price:</label>
      <input
        type="number"
        id="sellingPrice"
        name="productPrice"
        value={product.productPrice}
        onChange={handleChange}
      />
      <label htmlFor="productName">Product Name:</label>
      <input
        type="text"
        id="productName"
        name="productName"
        value={product.productName}
        onChange={handleChange}
      />
      <button>Add Product</button>
    </form>
  );
}

function ProductsList({ productsData, onDeleteProduct }) {
  const calculatePrice =
    productsData &&
    productsData
      .reduce((acc, curr) => {
        acc += parseInt(curr.productPrice);
        return acc;
      }, 0)
      .toFixed(2);
  console.log(productsData);

  return (
    <ul>
      {productsData.map((product) => (
        <DisplayProduct
          product={product}
          key={product.productId}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
      <h1>Products</h1>
      <p>
        Total Value Worth of Products: {calculatePrice > 0 && calculatePrice}
      </p>
    </ul>
  );
}
function DisplayProduct({ product, onDeleteProduct }) {
  return (
    <>
      <li>
        {product.productName}
        {product.productPrice}
        <button onClick={() => onDeleteProduct(product.productId)}>
          Delete
        </button>
      </li>
    </>
  );
}
