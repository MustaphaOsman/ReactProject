import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({ id: '', name: '', ID: '', crse: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [totals, setTotals] = useState([]);
  const [checkOutError, setCheckOutError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const addRow = () => {
    const newItem = { ...newRow, id: data.length + 1 };
    setData((prevData) => [...prevData, newItem]);
    setNewRow({ id: '', name: '', ID: '', crse: '' });

    // Check if quantity is a positive number before adding to the total

      const itemTotal = parseFloat(newRow.ID) * parseFloat(newRow.crse);
      setTotals((prevTotals) => [...prevTotals, itemTotal]);
      console.log('Updated Total:', itemTotal);
    
  };

  const removeRow = (id) => {
    const removedItem = data.find((item) => item.id === id);
    setData((prevData) => prevData.filter((row) => row.id !== id));
    // Access the 'qnty' property of the removed item to correctly calculate the total
    const removedTotal = parseFloat(removedItem.ID) * parseFloat(removedItem.crse);
    setTotals((prevTotals) => prevTotals.slice(0, -1)); // Remove the last total
    console.log('Removed Total:', removedTotal);
  };
  const getDataFromLocal= async () => {
    try{
      const response = await fetch();
      const final = await response.json();
      console.log(JSON.stringify(final.movies));
    }catch(exception){
      console.log(exception);
    }
  }
  const ReturntoLog =()=>{
    navigate('/');
  }
  const checkOut = () => {
    if (totals.length === 0) {
      console.log('Empty Cart');
      setCheckOutError(true);
    } else {
      console.log('There are items in Cart');

      // Calculate the total sum of all products
      const totalSum = totals.reduce((acc, val) => acc + val, 0);
      console.log('Total Sum of Products:', totalSum);
      setCheckOutError(false);
      navigate('/Cart', { state: { data, totalSum } });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(
    (row) => row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <h2 className="welcome-message">Welcome, Student</h2>
      <div>
        <input
          className="search-input"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newRow.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="ID"
            placeholder="Enter ID"
            value={newRow.ID}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="crse"
            placeholder="Quantity"
            value={newRow.crse}
            onChange={handleInputChange}
          />
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course Name </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.ID} </td>
                    <td>{row.name}</td>
                    <td>{row.crse} </td>
                    <td>
                      <button
                        onClick={() => removeRow(row.id)}
                        className="actions-button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="items-in-cart">Students</h2>
          <ul>
            {filteredData.map((row) => (
              <li key={row.id}>{row.name}</li>
            ))}
          </ul>

          <button onClick={addRow} className="add-row-button">
            Add Row
          </button>
          <button onClick={checkOut} className="checkout-button">
            CheckOut
          </button>
          <button onClick={ReturntoLog}>
            RETURN
          </button>
          {checkOutError && (
            <div className="error-message">Empty Cart. Please add items.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
