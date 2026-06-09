function useAdmin(auth) {
  const normalizedUsername = auth?.username?.trim().toLowerCase() || ""
  const normalizedRole = auth?.role?.trim().toLowerCase() || ""

  const isAdmin =
    auth?.isAdmin === true ||
    normalizedRole === "admin" ||
    normalizedRole === "administrator" ||
    normalizedUsername === "admin"

  return {
    isAdmin,
    label: isAdmin ? "Administrador" : "Usuario autenticado",
  }
}

export default useAdmin
