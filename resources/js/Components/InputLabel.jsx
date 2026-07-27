export default function InputLabel({
    value,
    required = false,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium lg:text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
            {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
    );
}
