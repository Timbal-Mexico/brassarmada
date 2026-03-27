import DashboardLayout from "@/components/DashboardLayout";
import { Upload, Save } from "lucide-react";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground mb-8">Actualiza tu información personal y CV</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar & CV */}
          <div className="glass-card p-6 flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">AN</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Artist Name</p>
              <p className="text-sm text-muted-foreground">Pro Studio Member</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full justify-center">
              <Upload className="h-4 w-4" />
              Subir CV
            </button>
            <p className="text-xs text-muted-foreground text-center">PDF, DOC, DOCX • Max 5MB</p>
          </div>

          {/* Info Form */}
          <div className="md:col-span-2 glass-card p-6 space-y-4">
            {[
              { label: "Nombre Completo", placeholder: "Tu nombre" },
              { label: "Nombre Artístico", placeholder: "Tu nombre artístico" },
              { label: "Email", placeholder: "tu@email.com" },
              { label: "Teléfono", placeholder: "+52 000 000 0000" },
              { label: "Instrumento Principal", placeholder: "Guitarra, Batería, Voz..." },
              { label: "Géneros", placeholder: "Rock, Jazz, Pop..." },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  {field.label}
                </label>
                <input
                  className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
              <textarea
                rows={3}
                className="w-full rounded-lg bg-muted/50 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
