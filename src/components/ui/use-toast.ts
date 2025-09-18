import { useState } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastCounter = 0;

export const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
  // Untuk implementasi sederhana, kita bisa menggunakan browser alert
  // Atau bisa diintegrasikan dengan toast library yang sudah ada
  
  if (variant === 'destructive') {
    alert(`❌ ${title}\n${description || ''}`);
  } else {
    alert(`✅ ${title}\n${description || ''}`);
  }
  
  // Untuk implementasi yang lebih baik, Anda bisa menggunakan library seperti:
  // - react-hot-toast
  // - sonner
  // - atau membuat custom toast component
};

// Hook untuk menggunakan toast (opsional, untuk kompatibilitas)
export const useToast = () => {
  return { toast };
};