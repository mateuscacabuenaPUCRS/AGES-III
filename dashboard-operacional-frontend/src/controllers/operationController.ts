import endpoints from "../constants/endpoints";
import { Operation } from "../hooks/useOperations";
import { api } from "../server/service";

export async function createOperation(operation: Operation): Promise<Operation> {
    const response = await api.post<Operation>(endpoints.OPERATION.createOperation, operation);
    return response.data;
}