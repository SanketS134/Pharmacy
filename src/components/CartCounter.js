import React from 'react';
import { Button, InputNumber, Space } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

function CartCounter({ max, initialQuantity, onQuantityChange }) {
  const handleIncrement = () => {
    if (initialQuantity < max) {
      onQuantityChange(initialQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (initialQuantity > 0) {
      onQuantityChange(initialQuantity - 1);
    }
  };

  const handleInputChange = (value) => {
    const newQuantity = Math.min(Math.max(0, value), max);
    onQuantityChange(newQuantity);
  };

  return (
    <Space>
      <Button icon={<MinusOutlined />} onClick={handleDecrement} disabled={initialQuantity === 0} />
      <InputNumber
        min={0}
        max={max}
        value={initialQuantity}
        onChange={handleInputChange}
        style={{ width: '50px' }}
      />
      <Button icon={<PlusOutlined />} onClick={handleIncrement} disabled={initialQuantity === max} />
    </Space>
  );
}

export default CartCounter;
