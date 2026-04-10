import { twMerge } from "tailwind-merge";
import Eye from "../../icons/Eye";

type FloatingInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string | null;
    type: string;
    closed?: boolean;
    onClick?: () => void;
};

export function FloatingInput({
    label,
    id,
    className,
    type = "text",
    closed,
    onClick,
    error,
    ...props
}: FloatingInputProps) {
    return (
        <div className="flex gap-1.5 group">
            <div className="transition-opacity mt-1 h-2 relative top-4.5 pointer-events-none">
                {">"}
            </div>
            <div className="relative flex flex-col flex-1">
                <input
                    id={id}
                    placeholder=" "
                    type={type === "password" && closed ? "password" : "text"}
                    className={twMerge(
                        "peer outline-none bg-transparent border-b border-border w-full pt-5 font-mono text-[16px] text-text-primary focus:border-accent transition-colors",
                        error && "border-b-danger! focus:border-b-danger!",
                        className,
                    )}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={twMerge(
                        "absolute left-0 top-5 font-mono text-[16px] text-text-muted transition-all duration-150 peer-focus:top-0 peer-focus:-left-1.5 peer-focus:text-[13px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-left-1.5 peer-[:not(:placeholder-shown)]:text-[13px]",
                        error && "peer-focus:text-danger text-danger!",
                        className,
                    )}
                >
                    {label}
                </label>
                {type === "password" && (
                    <div onClick={onClick}>
                        <Eye
                            closed={closed}
                            className="absolute right-1.5 top-4.5 size-5"
                        />
                    </div>
                )}
                {error && (
                    <p className="text-danger font-mono text-left mt-1 text-sm">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
