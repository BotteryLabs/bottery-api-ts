import dotenv from "dotenv";
dotenv.config();
import BotteryClient from "./src";

const client = new BotteryClient();

(async () => {
    const authRes = await client.Connect(process.env.API_KEY!);
    if(!authRes){
        console.error("Failed to authenticate");
        return;
    }
    
    const response = await client.NewConversation(46);
    console.log(response);
})()