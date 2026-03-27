import { Send } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "Sarah M.",
    avatar: "SM",
    text: "¡Hola! El contrato para el Neon Horizon Festival acaba de llegar. ¿Puedes revisar los ajustes del rider antes del final del día?",
    time: "10:42 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Tú",
    avatar: "AN",
    text: "Claro. Necesito asegurarme de que la configuración de audio maneje mejor los sub-graves que el año pasado.",
    time: "10:45 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Mark R.",
    avatar: "MR",
    text: "Pregunta rápida: ¿tenemos la lista final de canciones para la gala de Chicago?",
    time: "11:15 AM",
    isMe: false,
  },
];

const ClientChat = () => {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Chat Clientes
        </h3>
        <div className="flex -space-x-2">
          {["SM", "MR", "+3"].map((av) => (
            <div
              key={av}
              className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center"
            >
              <span className="text-[10px] font-medium text-muted-foreground">{av}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
            {!msg.isMe && (
              <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                <span className="text-[10px] font-medium text-muted-foreground">{msg.avatar}</span>
              </div>
            )}
            <div className={`max-w-[80%] ${msg.isMe ? "items-end" : ""}`}>
              <div
                className={`rounded-xl px-3 py-2 text-sm ${
                  msg.isMe
                    ? "bg-secondary text-secondary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
              <p className={`text-[10px] text-muted-foreground mt-1 ${msg.isMe ? "text-right" : ""}`}>
                {msg.sender} • {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="text-primary hover:text-primary/80 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
