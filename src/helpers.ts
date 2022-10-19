/*To escape the HTML tags and special characters*/

import {isArray, isPlainObject} from "lodash";

export const escapeHtml = unsafe => unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const validateEmail = string => !!string.trim().match(/^([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z]{2,4})$/i);

export const currency = number => `$${Number(number).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const extractNumbers = (value: string = "") => {
    return Number(value.replace(/[^0-9.-]/g, ""));
};

export function generateFormData(data, {
    formData = new FormData(),
    insideKey = ""
}: { formData?: FormData, insideKey?: string } = {}) {
    if (isPlainObject(data)) {
        Object.keys(data).forEach((key) => {
            const value = data[key];

            generateFormData(value, {
                formData,
                insideKey: insideKey ? `${insideKey}[${key}]` : key
            });
        });
    } else if (isArray(data)) {
        data.forEach((value, key) => {
            generateFormData(value, {
                formData,
                insideKey: insideKey ? `${insideKey}[${key}]` : String(key)
            });
        });
    } else {
        if (data !== null && data !== undefined) {
            formData.append(insideKey, data);
        }
    }

    return formData;
}