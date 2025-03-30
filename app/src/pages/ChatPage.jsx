import { useChatStore } from "../store/useChatStore"
import SideBar from "../components/ui/SideBar";
import ChatContainer from "../components/ui/ChatContainer";
import NoChatSelected from "../components/ui/NoChatSelected";

const ChatPage = () => {
    const { selectedUser } = useChatStore();

    return (
        <div className="h-screen">
            <div className="flex items-center justify-center pt-20 px-4">
                <div 
                    className="text-black drop-shadow-md border-2
                    border-black/20 rounded-lg shadow-cl w-full max-w-7xl 
                    h-[calc(100vh-8rem)] bg-white"
                >
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <SideBar />     
                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage;