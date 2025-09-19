import React from "react";
import "./CardWrapper.css";

function CardWrapper({
    children,
    className = "",
    header = null,
    footer = null,
    variant = "default", // default, primary, success, warning, danger, info
    size = "default", // small, default, large
    hover = false,
    loading = false
}) {
    const getVariantClasses = () => {
        const variants = {
            default: "border-primary border-opacity-25",
            primary: "border-primary bg-primary bg-opacity-5",
            success: "border-success bg-success bg-opacity-5",
            warning: "border-warning bg-warning bg-opacity-5",
            danger: "border-danger bg-danger bg-opacity-5",
            info: "border-info bg-info bg-opacity-5"
        };
        return variants[variant] || variants.default;
    };

    const getSizeClasses = () => {
        const sizes = {
            small: "card-sm",
            default: "",
            large: "card-lg"
        };
        return sizes[size] || sizes.default;
    };

    const getShadowClass = () => {
        if (hover) return "shadow-sm shadow-hover";
        return "shadow-sm";
    };

    return (
        <div className={`card ${getVariantClasses()} ${getSizeClasses()} ${getShadowClass()} ${className}`}>
            {header && (
                <div className={`card-header ${variant === 'default' ? 'bg-white' : `bg-${variant} bg-opacity-10`} border-bottom border-opacity-25`}>
                    <div className="d-flex align-items-center">
                        {header}
                    </div>
                </div>
            )}

            <div className="card-body position-relative">
                {loading && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="text-muted">Loading...</span>
                        </div>
                    </div>
                )}

                <div className={loading ? "opacity-50" : ""}>
                    {children}
                </div>
            </div>

            {footer && (
                <div className={`card-footer ${variant === 'default' ? 'bg-light' : `bg-${variant} bg-opacity-10`} border-top border-opacity-25`}>
                    {footer}
                </div>
            )}
        </div>
    );
}

export default CardWrapper;
