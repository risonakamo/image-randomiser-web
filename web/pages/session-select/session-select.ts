import {mount} from "svelte";
import SessionSelect from "./session-select.svelte";

function main():void
{
    mount(SessionSelect,{target:document.body});
}

window.onload=main;