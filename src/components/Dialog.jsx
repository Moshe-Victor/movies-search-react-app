import React from "react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export function Dialog({ isOpen, onClose, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialogNode = dialogRef.current
        if (isOpen && dialogNode) {
            dialogNode.focus()
        }
    }, [isOpen])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [onClose])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0  flex items-center justify-center z-50">
            <div
                 ref={dialogRef}
                 className="bg-white p-6 rounded-lg shadow-xl w-[500px]"
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                {children}
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Close
                </button>
            </div>
        </div>,
        document.body,
    )
}

