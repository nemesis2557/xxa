
import { requestMiddleware } from "@/lib/api-utils";
import { createSuccessResponse, createErrorResponse } from "@/lib/create-response";
import CrudOperations from "@/lib/crud-operations";

export const GET = requestMiddleware(async (request, context) => {
  try {
    const userId = context.payload?.sub;
    
    if (!userId) {
      return createErrorResponse({
        errorMessage: "Usuario no autenticado",
        status: 401,
      });
    }

    const usersCrud = new CrudOperations("users", context.token);
    const user = await usersCrud.findById(userId);

    if (!user) {
      return createErrorResponse({
        errorMessage: "Usuario no encontrado",
        status: 404,
      });
    }

    const employeesCrud = new CrudOperations("employees", context.token);
    const employees = await employeesCrud.findMany({ user_id: parseInt(userId) });
    const employee = employees?.[0];

    const userData = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
      isAdmin: user.role === process.env.SCHEMA_ADMIN_USER,
      role_type: user.role_type || employee?.role_type || 'mesero',
      employee_id: employee?.id,
      nombre: employee?.nombre,
      apellido: employee?.apellido,
      avatar_url: employee?.avatar_url,
    };

    return createSuccessResponse(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return createErrorResponse({
      errorMessage: "Error al obtener información del usuario",
      status: 500,
    });
  }
}, true);
