const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

export const getUsernameDisplay = (log: any): string => {
  if (!log) return "Unknown User";

  if (
    log.username &&
    log.username !== "undefined undefined" &&
    log.username !== "null null" &&
    log.username !== "undefined" &&
    log.username !== "null"
  ) {
    return log.username.trim();
  }

  // Safely handle response_body
  if (log.response_body) {
    // Handle the case where response_body is a string (JSON string)
    let responseBody = log.response_body;
    if (typeof responseBody === "string") {
      try {
        responseBody = JSON.parse(responseBody);
      } catch (e) {
        // If parsing fails, continue with the original value
      }
    }

    // Check if we have a users array
    if (
      isObject(responseBody) &&
      responseBody.users &&
      isArray(responseBody.users)
    ) {
      // Safe to iterate over users array
      for (const user of responseBody.users) {
        if (user && user.id === log.user_id) {
          const firstName = user.first_name || "";
          const lastName = user.last_name || "";
          return (
            `${firstName} ${lastName}`.trim() || user.username || "Unknown User"
          );
        }
      }
    }

    // Check for contacts in response body
    if (
      isObject(responseBody) &&
      responseBody.contacts &&
      isArray(responseBody.contacts)
    ) {
      if (responseBody.contacts.length > 0) {
        const contact = responseBody.contacts[0];
        if (isObject(contact) && isObject(contact.user_details)) {
          const userDetails = contact.user_details;
          const firstName = userDetails.first_name || "";
          const lastName = userDetails.last_name || "";
          return (
            `${firstName} ${lastName}`.trim() ||
            userDetails.username ||
            "Unknown User"
          );
        }
      }
    }

    // Check for results array (friend requests structure)
    if (
      isObject(responseBody) &&
      responseBody.results &&
      isArray(responseBody.results)
    ) {
      if (responseBody.results.length > 0) {
        const result = responseBody.results[0];
        if (isObject(result) && isObject(result.user_detail)) {
          const userDetail = result.user_detail;
          const firstName = userDetail.first_name || "";
          const lastName = userDetail.last_name || "";
          return (
            `${firstName} ${lastName}`.trim() ||
            userDetail.username ||
            "Unknown User"
          );
        }
      }
    }
  }

  // Fallback to showing truncated user ID
  if (log.user_id && typeof log.user_id === "string") {
    return `User ${log.user_id.substring(0, 8)}...`;
  }

  return "Unknown User";
};

export const cleanIpAddress = (ipAddress: string): string => {
  if (!ipAddress || typeof ipAddress !== "string") {
    return "Unknown IP";
  }
  return ipAddress.replace("::ffff:", "");
};

export const formatJSON = (json: any): string => {
  if (!json) return "No data";

  if (typeof json === "string") {
    try {
      json = JSON.parse(json);
    } catch (e) {
      return json;
    }
  }

  try {
    if (Array.isArray(json) && json.length === 0) {
      return "[]";
    }

    const sanitized = JSON.parse(JSON.stringify(json));

    const sanitizeObject = (obj: any) => {
      if (!isObject(obj)) return obj;

      Object.keys(obj).forEach((key) => {
        // Sanitize sensitive fields
        if (key === "fcm_token" || key === "password" || key === "api_key") {
          obj[key] = "********";
        }
        // Recursively process nested objects
        else if (isObject(obj[key])) {
          obj[key] = sanitizeObject(obj[key]);
        }
        // Process arrays
        else if (Array.isArray(obj[key])) {
          obj[key] = obj[key].map((item: any) =>
            isObject(item) ? sanitizeObject(item) : item
          );
        }
      });

      return obj;
    };

    return JSON.stringify(sanitizeObject(sanitized), null, 2);
  } catch (e) {
    console.error("Error formatting JSON:", e);
    // Return a simple stringified version as fallback
    return typeof json === "object" ? JSON.stringify(json) : String(json);
  }
};

export const getEventTypeIcon = (eventType: string): string => {
  if (!eventType || typeof eventType !== "string") {
    return "default";
  }

  const type = eventType.toLowerCase();

  if (
    type.includes("login") ||
    type.includes("signin") ||
    type.includes("auth")
  ) {
    return "login";
  } else if (type.includes("fetch") || type.includes("get")) {
    return "fetch";
  } else if (type.includes("create")) {
    return "create";
  } else if (type.includes("update")) {
    return "update";
  } else if (type.includes("delete")) {
    return "delete";
  }

  return "default";
};

export const formatEventType = (eventType: string): string => {
  if (!eventType || typeof eventType !== "string") {
    return "Unknown Event";
  }

  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getDeviceInfo = (log: any): string => {
  if (!log) return "Unknown Device";

  // Build device info string with available data
  const parts = [];

  if (log.device_model && log.device_model !== "Unknown") {
    parts.push(log.device_model);
  }

  if (log.os && log.os !== "Unknown") {
    parts.push(log.os);
  }

  if (log.browser && log.browser !== "Unknown") {
    parts.push(log.browser);
  }

  // If we have parts, join them
  if (parts.length > 0) {
    return parts.join(" • ");
  }

  // Check for device info in request body
  if (isObject(log.request_body) && log.request_body.device_name) {
    return log.request_body.device_name;
  }

  // Fallback to device type
  if (log.device_type && log.device_type !== "Unknown") {
    return log.device_type;
  }

  return "Unknown device";
};

/**
 * Extract user email from log
 */
export const getUserEmail = (log: any): string | null => {
  if (!log) return null;

  if (log.user_email) return log.user_email;

  // Try to find email in response body
  if (log.response_body) {
    let responseBody = log.response_body;

    // If string, try to parse it
    if (typeof responseBody === "string") {
      try {
        responseBody = JSON.parse(responseBody);
      } catch (e) {
        // Continue with original
      }
    }

    // Check various response structures
    if (isObject(responseBody)) {
      // Check users array
      if (responseBody.users && isArray(responseBody.users)) {
        for (const user of responseBody.users) {
          if (user && user.id === log.user_id && user.email) {
            return user.email;
          }
        }
      }

      // Check contact structure
      if (
        responseBody.contacts &&
        isArray(responseBody.contacts) &&
        responseBody.contacts.length > 0
      ) {
        const contact = responseBody.contacts[0];
        if (
          isObject(contact) &&
          isObject(contact.user_details) &&
          contact.user_details.email
        ) {
          return contact.user_details.email;
        }
      }

      // Check friend requests structure
      if (
        responseBody.results &&
        isArray(responseBody.results) &&
        responseBody.results.length > 0
      ) {
        const result = responseBody.results[0];
        if (
          isObject(result) &&
          isObject(result.user_detail) &&
          result.user_detail.email
        ) {
          return result.user_detail.email;
        }
      }
    }
  }

  // Check request body
  if (isObject(log.request_body) && log.request_body.email) {
    return log.request_body.email;
  }

  return null;
};

export const safeGetUserEmailDisplay = (log) => {
  if (!log) return "";

  if (log.user_email) {
    return log.user_email;
  }

  // Safely handle response_body
  if (log.response_body) {
    let responseBody = log.response_body;

    // Handle the case where response_body is a string (JSON string)
    if (typeof responseBody === "string") {
      try {
        responseBody = JSON.parse(responseBody);
      } catch (e) {
        // If parsing fails, continue with the original value
      }
    }

    // Check if responseBody is an object and has users property that is an array
    if (
      responseBody &&
      typeof responseBody === "object" &&
      !Array.isArray(responseBody) &&
      responseBody.users &&
      Array.isArray(responseBody.users)
    ) {
      // Safe to iterate over users array
      for (const user of responseBody.users) {
        if (user && user.id === log.user_id && user.email) {
          return user.email;
        }
      }
    }
  }

  return "";
};

export const safeGetUsernameDisplay = (log) => {
  if (!log) return "Unknown User";

  // Use username if it exists and is valid
  if (
    log.username &&
    log.username !== "undefined undefined" &&
    log.username !== "null null"
  ) {
    return log.username.trim();
  }

  // Safely handle response_body with type checking before iteration
  if (log.response_body) {
    let responseBody = log.response_body;

    // Parse if string
    if (typeof responseBody === "string") {
      try {
        responseBody = JSON.parse(responseBody);
      } catch (e) {
        // Continue if parse fails
      }
    }

    // Only iterate if we have a proper structure
    if (
      responseBody &&
      typeof responseBody === "object" &&
      responseBody.users &&
      Array.isArray(responseBody.users)
    ) {
      for (const user of responseBody.users) {
        if (user && user.id === log.user_id) {
          const firstName = user.first_name || "";
          const lastName = user.last_name || "";
          return (
            `${firstName} ${lastName}`.trim() || user.username || "Unknown User"
          );
        }
      }
    }
  }

  return `User ${log.user_id.substring(0, 8)}...`;
};

export const auditUtils = {
  getUsernameDisplay,
  cleanIpAddress,
  formatJSON,
  getEventTypeIcon,
  formatEventType,
  getDeviceInfo,
  getUserEmail,
  isArray,
  isObject,
  safeGetUsernameDisplay,
};

export default auditUtils;
