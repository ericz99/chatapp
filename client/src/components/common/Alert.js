import React from 'react'

export default function Alert({ message, type }) {
    return (
        <div
            className={type === "success" || type === "error" || type === "warning" ? `alert alert-${type}` : "alert alert-secondary"}
            role="alert">
            {message}
        </div>
    )
}
