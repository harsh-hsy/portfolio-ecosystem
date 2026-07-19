import { apiRequest } from "./apiClient";

export function getAccount() {
  return apiRequest("/api/admin/account");
}

export function updateAccount(account) {
  return apiRequest("/api/admin/account", {
    method: "PUT",
    body: JSON.stringify(account),
  });
}

export function updatePassword(passwords) {
  return apiRequest("/api/admin/account/password", {
    method: "PUT",
    body: JSON.stringify(passwords),
  });
}
