import { Toaster } from 'sonner';

export default function AdminToaster() {
  return (
    <Toaster
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  );
}
