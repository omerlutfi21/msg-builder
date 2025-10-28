export type ButtonType = 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY';

export interface TemplateButton {
  type: ButtonType;
  text: string;
  url?: string;
  phoneNumber?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  header?: {
    type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    mediaUrl?: string;
  };
  bodyText: string;
  footer?: string;
  buttons?: TemplateButton[];
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
    header: {
      type: 'TEXT',
      text: '✅ Order Confirmed',
    },
    bodyText: 'Hello {{customer_name}}, thank you for your order! Your order {{order_id}} has been confirmed. Total amount: {{total_amount}}.',
    footer: 'Thanks for shopping with us!',
    buttons: [
      {
        type: 'URL',
        text: 'Track Order',
        url: 'https://example.com/track/{{order_id}}',
      },
      {
        type: 'PHONE_NUMBER',
        text: 'Call Support',
        phoneNumber: '+1234567890',
      },
    ],
  },
  {
    id: '2',
    name: 'Shipping Update',
    category: 'transactional',
    header: {
      type: 'TEXT',
      text: '📦 Shipping Update',
    },
    bodyText: 'Hi {{customer_name}}! Great news! Your order {{order_id}} has been shipped. Tracking number: {{tracking_number}}. Expected delivery: {{delivery_date}}',
    footer: 'You can track your package anytime',
    buttons: [
      {
        type: 'URL',
        text: 'Track Package',
        url: 'https://tracking.example.com/{{tracking_number}}',
      },
    ],
  },
  {
    id: '3',
    name: 'Welcome Message',
    category: 'marketing',
    header: {
      type: 'TEXT',
      text: '🎉 Welcome!',
    },
    bodyText: 'Welcome {{customer_name}}! We are excited to have you. Here is a special discount code just for you: {{discount_code}}. Use it on your next purchase!',
    footer: 'Valid for 30 days',
    buttons: [
      {
        type: 'URL',
        text: 'Shop Now',
        url: 'https://shop.example.com',
      },
      {
        type: 'QUICK_REPLY',
        text: 'View Catalog',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Contact Us',
      },
    ],
  },
  {
    id: '4',
    name: 'Product Recommendation',
    category: 'marketing',
    header: {
      type: 'IMAGE',
      text: 'Special Offer',
      mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    },
    bodyText: 'Hi {{customer_name}}, we think you will love our {{product_name}}! Get {{total_amount}} off your first order with code {{discount_code}}',
    footer: 'Limited time offer',
    buttons: [
      {
        type: 'URL',
        text: 'View Product',
        url: 'https://shop.example.com/product/{{product_name}}',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Add to Cart',
      },
    ],
  },
  {
    id: '5',
    name: 'Support Follow-up',
    category: 'utility',
    header: {
      type: 'TEXT',
      text: 'Support Update',
    },
    bodyText: 'Hello {{customer_name}}, this is a follow-up on your support ticket {{order_id}}. We are here to help!',
    footer: 'Our team is available 24/7',
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Issue Resolved',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Need More Help',
      },
      {
        type: 'PHONE_NUMBER',
        text: 'Call Us',
        phoneNumber: '+1234567890',
      },
    ],
  },
  {
    id: '6',
    name: 'Appointment Reminder',
    category: 'utility',
    header: {
      type: 'TEXT',
      text: '📅 Reminder',
    },
    bodyText: 'Hi {{customer_name}}, this is a reminder for your appointment on {{delivery_date}}. We look forward to seeing you!',
    footer: 'Reply CONFIRM to confirm your appointment',
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Confirm',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Reschedule',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Cancel',
      },
    ],
  },
];
