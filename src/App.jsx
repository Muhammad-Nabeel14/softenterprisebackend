import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Navbar from './Navbar';
import Login from './AuthForm';
import ProductForm from './ProductForm';
import Entries from './Entries';


function App() {

  return (
    <>
    <Navbar/>
    <Routes>
    <Route exact path="/" element={<Login />} />
    <Route exact path="/product" element={<ProductForm />} />
    <Route exact path="/entries" element={<Entries />} />
    </Routes>
    </>
  )
}

export default App
