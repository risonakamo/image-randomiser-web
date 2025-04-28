import {mount} from "svelte";
import SessionCreate from "./session-create.svelte";

function main():void
{
    mount(SessionCreate,{target:document.body});
}

window.onload=main;