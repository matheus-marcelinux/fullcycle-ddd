
import EventDispatcher from "../../@shared/event/event-dispatcher";
import ChangeAddressEvent from "./change-address-event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log-handler";

describe("Customer EventHandlers Tests", () => {

    it("should call EnviaConsoleLog1Handler and EnviaConsoleLog2Handler", () => {

        const eventDispatcher = new EventDispatcher();
        const handler1 = new EnviaConsoleLog1Handler();
        const handler2 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", handler1);
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(1);

        eventDispatcher.register("CustomerCreatedEvent", handler2);
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(2);

        const spyHandler1 = jest.spyOn(handler1, "handle");
        const spyHandler2 = jest.spyOn(handler2, "handle");

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            address: {
                street: "st 1",
                number: "1",
                zip: "1111-111",
                cty: "Sao paulo",
            },
            active: true,
            rewardPoints: 10,
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyHandler1).toHaveBeenCalled();
        expect(spyHandler2).toHaveBeenCalled();
    });

    it("should call EnviaConsoleLogHandler", () => {
        const eventDispatcher = new EventDispatcher();
        const handler = new EnviaConsoleLogHandler();

        eventDispatcher.register("ChangeAddressEvent", handler);
        expect(eventDispatcher.getEventHandlers['ChangeAddressEvent'].length).toBe(1);

        const spyHandler = jest.spyOn(handler, "handle");

        const changeAddressEvent = new ChangeAddressEvent({
            id: "123",
            name: "Customer 1",
            address: {
                street: "st 1",
                number: "1",
                zip: "1111-111",
                cty: "Sao paulo",
            },
            active: true,
            rewardPoints: 10,
        });

        eventDispatcher.notify(changeAddressEvent);

        expect(spyHandler).toHaveBeenCalled();
    }) 

})