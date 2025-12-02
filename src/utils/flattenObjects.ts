export type JSONValue =
  | string
  | number
  | boolean
  | null
  | Array<JSONValue>
  | JSONObject;

interface JSONObject {
  [key: string]: JSONValue;
}



export function flattenObject(
    obj: JSONValue,
    prefix = ""
  ): Record<string, JSONValue> {
    const result: Record<string, JSONValue> = {};
  
    // Si no es un objeto, terminar
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
      return result;
    }
  
    for (const key of Object.keys(obj)) {
      const value = (obj as JSONObject)[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
  
      if (value === null || value === undefined || value === "") {
        continue;
      }
  
      if (Array.isArray(value)) {
        if (value.every(v => v === null || typeof v !== "object")) {
          result[newKey] = value.join(", ");
        } else {
          value.forEach((item, index) => {
            if (item !== null && typeof item === "object") {
              Object.assign(
                result,
                flattenObject(item, `${newKey}[${index}]`)
              );
            } else {
              result[`${newKey}[${index}]`] = item;
            }
          });
        }
      }
  
      else if (typeof value === "object") {
        Object.assign(result, flattenObject(value, newKey));
      }
  
      else {
        result[newKey] = value;
      }
    }
  
    return result;
}  
  