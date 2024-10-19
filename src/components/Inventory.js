import React from 'react';

function Inventory() {
  // Sample data for the table
  const inventoryData = [
    { id: 1, name: 'Aspirin', category: 'Pain Relief', quantity: 500, unit: 'tablets', price: 9.99, supplier: 'PharmaCorp', expiryDate: '2024-12-31', reorderLevel: 100, lastRestocked: '2023-05-15' },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', quantity: 200, unit: 'capsules', price: 15.99, supplier: 'MediSupply', expiryDate: '2024-06-30', reorderLevel: 50, lastRestocked: '2023-04-20' },
    { id: 3, name: 'Lisinopril', category: 'Blood Pressure', quantity: 300, unit: 'tablets', price: 12.50, supplier: 'HealthPharm', expiryDate: '2025-03-31', reorderLevel: 75, lastRestocked: '2023-05-01' },
  ];

  return (
    <div className="Inventory">
      <h1>Inventory Management</h1>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price ($)</th>
            <th>Supplier</th>
            <th>Expiry Date</th>
            <th>Reorder Level</th>
            <th>Last Restocked</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.supplier}</td>
              <td>{item.expiryDate}</td>
              <td>{item.reorderLevel}</td>
              <td>{item.lastRestocked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
