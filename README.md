![Bottery Logo](https://i.imgur.com/BM3SlSU.png)
### The simple way to create AI agents for your needs
----

## Getting started

1) Install the module via npm: `npm i @botterylabs/bottery-api`
2) Create an instance of `BotteryClient`:
```ts
const client = new BotteryClient();
```
3) Authenticate with the Bottery API:
```ts
await client.Connect(process.env.BOTTERY_API_KEY);
```

That's it, you're good to start using the API!

----

## Example

```ts
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
    const response = await client.GetAgents();
    console.log(`Agents found: `, response)
})()
```