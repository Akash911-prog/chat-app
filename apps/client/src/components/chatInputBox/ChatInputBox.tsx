import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps {
    className?: string;
    value?: string;
    setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

const Input = ({ className, value, setValue }: InputProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = e.target;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    const onSubmit = () => {
        const message = textAreaRef.current?.value.trim();
        if (!message) return;
        setValue((prev) => [...prev, message]);
        textAreaRef.current.value = "";
        textAreaRef.current?.focus();
    };

    return (
        <div
            className={twMerge(
                "flex items-center w-77.5 h-fit rounded-sm bg-surface-raised shadow-[5px_5px_0px_#34343f]",
                className,
            )}
        >
            <textarea
                ref={textAreaRef}
                title="Write Message"
                placeholder="Message.."
                value={value}
                onChange={handleChange}
                rows={1}
                className="flex-1 text-lg font-normal text-text-primary bg-transparent border-none outline-none px-3 placeholder:text-white/40 resize-none overflow-y-auto max-h-30"
            />

            {/* Divider */}
            <div className="w-px h-7.5 bg-text-muted" />

            {/* Send Button */}
            <button
                className="p-2 rounded-sm transition-colors duration-300 hover:bg-surface"
                onClick={onSubmit}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    width="30"
                    height="30"
                    viewBox="0 0 30.000000 30.000000"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <g
                        transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff70"
                        className="fill-accent active:translate-y-0.5 transition-all"
                        stroke="none"
                    >
                        <path d="M44 256 c-3 -8 -4 -29 -2 -48 3 -31 5 -33 56 -42 28 -5 52 -13 52 -16 0 -3 -24 -11 -52 -16 -52 -9 -53 -9 -56 -48 -2 -21 1 -43 6 -48 10 -10 232 97 232 112 0 7 -211 120 -224 120 -4 0 -9 -6 -12 -14z" />
                    </g>
                </svg>
            </button>
        </div>
    );
};

export default Input;
