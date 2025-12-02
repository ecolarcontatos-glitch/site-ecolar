'use client';

interface WhatsappButtonProps {
  phone?: string;
  message?: string;
}

export default function WhatsappButton({
  phone = '558393661690', // Número oficial da ECOLAR
  message = 'Olá! Vim pelo site da ECOLAR e gostaria de tirar uma dúvida.'
}: WhatsappButtonProps) {

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-4 right-4
        z-50
        w-16 h-16
        rounded-full
        bg-[#7FBA3D]
        flex items-center justify-center
        shadow-md
        active:scale-95
        transition-all duration-200
        "

      aria-label="Falar com a ECOLAR pelo WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8"
        fill="white"
      >
        <path d="M16.04 3C9.4 3 4 8.16 4 14.68c0 2.6.86 5 2.34 6.98L4 29l7.6-2.38c1.9 1.04 4.08 1.64 6.44 1.64 6.64 0 12.04-5.16 12.04-11.68C30.08 8.16 22.68 3 16.04 3zm0 2.64c5.26 0 9.52 3.98 9.52 9.04 0 5.06-4.26 9.16-9.52 9.16-2.1 0-4.06-.66-5.66-1.78l-.4-.26-4.52 1.42 1.48-4.2-.26-.44A8.37 8.37 0 0 1 6.48 14.6c0-5.06 4.3-9 9.56-9zm-4.32 4.1c-.24 0-.62.08-.94.4-.32.32-1.24 1.18-1.24 2.88 0 1.7 1.28 3.34 1.46 3.58.18.24 2.44 3.9 6.02 5.3 2.98 1.18 3.58.94 4.22.88.64-.06 2.08-.86 2.38-1.7.3-.84.3-1.56.22-1.7-.08-.14-.26-.22-.54-.38-.28-.16-1.66-.9-1.92-1-.26-.1-.46-.16-.66.16-.2.32-.76 1-.94 1.2-.18.2-.34.22-.62.08-.28-.14-1.18-.44-2.24-1.4-.82-.74-1.38-1.66-1.54-1.94-.16-.28-.02-.44.12-.6.12-.12.28-.32.42-.48.14-.16.18-.28.28-.48.1-.2.06-.36 0-.52-.06-.16-.54-1.34-.76-1.84-.2-.48-.4-.42-.54-.42z" />
      </svg>
    </a>
  );
}
