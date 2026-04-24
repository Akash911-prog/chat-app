import ChatListItem from "../components/ChatListItem/ChatListItem";
import Searchbar from "../components/ui/SearchBar";
import { useRoomStore } from "../store/room";

const ChatList = () => {
    const rooms = useRoomStore().rooms;

    return (
        <div className="flex flex-col gap-2">
            <header className="w-full flex flex-col">
                <div className="text-center w-full text-2xl my-3">Chattie</div>
                <div className="searchbar">
                    <div className="self-center">
                        <Searchbar />
                    </div>
                </div>
            </header>
            <div className="border max-h-[80vh] h-[80vh] w-[95%] mx-auto">
                {rooms.map((item) => {
                    return (
                        <ChatListItem
                            key={item.id}
                            username={item.username}
                            timeStamp={item.lastMessageAt.toLocaleTimeString(
                                undefined,
                                {
                                    timeStyle: "short",
                                },
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ChatList;
