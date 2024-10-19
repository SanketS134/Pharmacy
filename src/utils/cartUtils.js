export const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const clearCartFromLocalStorage = () => {
  localStorage.removeItem('cart');
};

export const calculateTotalCartValue = (cart) => {
  return cart.reduce((total, item) => total + item.unitPrice * item.orderedQuantity, 0);
};
