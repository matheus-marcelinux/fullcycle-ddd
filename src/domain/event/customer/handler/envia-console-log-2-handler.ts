import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../event.interface";

export default class EnviaConsoleLog2Handler implements EventHandlerInterface {
    handle(event: EventInterface): void {
        console.log("Esse é o segundo console.log do evento: CustomerCreated");
    }
}
    