import React from "react";

export default function ToggleBrandApproval({ value, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition 
                ${value ? "bg-green-500" : "bg-red-500"}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition 
                    ${value ? "translate-x-5" : "translate-x-1"}`}
            />
        </button>
    );
}
