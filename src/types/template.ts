export interface Template {
  id: string;
  name: string;
  category: string;
  bodyText: string;
}

export interface ConfigurableItem {
  key: string;
  label: string;
}

export interface VariableMapping {
  [variableName: string]: string;
}

export const configurableItems: ConfigurableItem[] = [
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'order_id', label: 'Order ID' },
  { key: 'total_amount', label: 'Total Amount' },
  { key: 'support_link', label: 'Support Link' },
  { key: 'tracking_number', label: 'Tracking Number' },
  { key: 'delivery_date', label: 'Delivery Date' },
  { key: 'product_name', label: 'Product Name' },
  { key: 'discount_code', label: 'Discount Code' },
];

export const sampleTemplates: Template[] = [
  {
    id: '1',
    name: 'Order Confirmation',
    category: 'transactional',
    bodyText: 'Hello {{customer_name}}, thank you for your order! Your order {{order_id}} has been confirmed. Total amount: {{total_amount}}. You can track your order using this link: {{support_link}}',
  },
  {
    id: '2',
    name: 'Shipping Update',
    category: 'transactional',
    bodyText: 'Hi {{customer_name}}! Great news! Your order {{order_id}} has been shipped. Tracking number: {{tracking_number}}. Expected delivery: {{delivery_date}}',
  },
  {
    id: '3',
    name: 'Welcome Message',
    category: 'marketing',
    bodyText: 'Welcome {{customer_name}}! We\'re excited to have you. Here\'s a special discount code just for you: {{discount_code}}. Use it on your next purchase!',
  },
  {
    id: '4',
    name: 'Product Recommendation',
    category: 'marketing',
    bodyText: 'Hi {{customer_name}}, we think you\'ll love our {{product_name}}! Get {{total_amount}} off your first order with code {{discount_code}}',
  },
  {
    id: '5',
    name: 'Support Follow-up',
    category: 'utility',
    bodyText: 'Hello {{customer_name}}, this is a follow-up on your support ticket {{order_id}}. Need more help? Contact us at {{support_link}}',
  },
];
