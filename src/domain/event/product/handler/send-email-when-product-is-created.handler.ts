import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../event.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface {
    
    handle(event: ProductCreatedEvent): void {
        console.log(`Sending email to ......`);
    }

}