import DashboardLayout from "@/components/DashboardLayout";
import { Send, Search } from "lucide-react";
import { useState } from "react";

const contacts = [
  { name: "Sarah M.", role: "Manager", lastMsg: "¿Puedes revisar el rider?", time: "10:42 AM", unread: 2 },
  { name: "Mark R.", role: "Promotor", lastMsg: "¿Tenemos el setlist final?", time: "11:15 AM", unread: 1 },
  { name: "Luna V.", role: "Cliente", lastMsg: "Confirmado para el evento", time: "Ayer", unread: 0 },
  { name: "Carlos D.", role: "Venue", lastMsg: "Los horarios están listos", time: "Ayer", unread: 0 },
];

const chatMessages = [
  { id: 1, sender: "Sarah M.", text: "¡Hola! El contrato para el Neon Horizon Festival acaba de llegar.", time: "10:40 AM", isMe: false },
  { id: 2, sender: "Sarah M.", text: "¿Puedes revisar los ajustes del rider antes del final del día?", time: "10:42 AM", isMe: false },
  { id: 3, sender: "Tú", text: "Claro, lo reviso ahora mismo. ¿Hay cambios en el setup de audio?", time: "10:45 AM", isMe: true },
  { id: 4, sender: "Sarah M.", text: "Sí, actualizaron las especificaciones del sistema de monitores.", time: "10:47 AM", isMe: false },
  { id: 5, sender: "Tú", text: "Perfecto. Necesito asegurarme de que la configuración de audio maneje mejor los sub-graves.", time: "10:48 AM", isMe: true },
];

const Messages = () => {
  const [activeContact, setActiveContact] = useState(0);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Mensajes</h1>
      <p className="text-muted-foreground mb-6">Comunícate con tus clientes y colaboradores</p>

      <div className="glass-card flex h-[calc(100vh-220px)] overflow-hidden">
        {/* Contacts */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full" placeholder="Buscar contactos..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {contacts.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActiveContact(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeContact === i ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-muted/30"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">{c.name.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">Sa</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{contacts[activeContact].name}</p>
              <p className="text-[10px] text-muted-foreground">{contacts[activeContact].role}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                <div className={`max-w-[70%]`}>
                  <div className={`rounded-xl px-3 py-2 text-sm ${
                    msg.isMe ? "bg-secondary text-secondary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-muted-foreground mt-1 ${msg.isMe ? "text-right" : ""}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <input className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" placeholder="Escribe un mensaje..." />
              <button className="text-primary hover:text-primary/80 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
