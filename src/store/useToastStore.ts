import { create } from "zustand";


interface ToastState{
    open : boolean,
    message: string,
    type : 'success' | 'error' | 'info';
    showToast : (message: string, type?:'success' | 'error' | 'info') => void;
    setOpen : () => void;
}

export const useToastStore = create<ToastState>((set)=>({
    open : false,
    message : '',
    type : 'info',
    showToast : (message, type='info') => set({open : true, message, type}),
    setOpen : () => set({open : false}),
}));