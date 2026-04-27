import { useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

const NewChat = () => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);

    const { data: users = [] } = useQuery<>({
        queryKey: ["users", "search", debouncedQuery],
        queryFn: async () => {
            const res = await fetch(`/users/search?q=${debouncedQuery}`);
            return res.json();
        },
        enabled: debouncedQuery.trim().length > 0, // don't fetch if empty
    });

    return (
        <div>
            <SearchBar setQuery={setQuery} />
            {users}
            <div></div>
        </div>
    );
};

export default NewChat;
