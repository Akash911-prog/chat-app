import React from "react";

const Searchbar = ({
    setQuery = () => {},
}: {
    setQuery?: (value: string) => void;
}) => {
    return (
        <div className="px-2 w-full max-w-full">
            <label
                className="mb-2 text-sm font-medium text-text-primary sr-only"
                htmlFor="default-search"
            >
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-4 h-4 text-text-muted"
                    >
                        <path
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            strokeWidth={2}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            stroke="currentColor"
                        />
                    </svg>
                </div>
                <input
                    required
                    placeholder="Search"
                    className="block w-full p-4 py-2 ps-10 text-lg text-text-primary border border-border rounded-lg bg-bg-subtle focus:ring-accent outline-none focus:border-accent"
                    id="default-search"
                    type="search"
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Searchbar;
