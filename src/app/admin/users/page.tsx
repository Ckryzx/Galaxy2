import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { UserRoleManager } from "@/components/UserRoleManager";

export default async function AdminUsersPage() {
  const admin = await requireRole(["ADMIN"]);

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Usuarios</h1>
      <p className="mb-6 text-sm text-muted">
        Dale el rol de STREAMER a tus amigos para que puedan entrar al Panel
        Streamer y poner notas. Solo un ADMIN puede cambiar roles.
      </p>
      <UserRoleManager
        currentUserId={admin.id}
        users={users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }))}
      />
    </div>
  );
}
