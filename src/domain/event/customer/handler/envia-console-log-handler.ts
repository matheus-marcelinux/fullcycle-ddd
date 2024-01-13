import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../event.interface";
import ChangeAddressEvent from "../change-address-event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<ChangeAddressEvent> {
    handle(event: EventInterface): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.street}`);
    }
}
    