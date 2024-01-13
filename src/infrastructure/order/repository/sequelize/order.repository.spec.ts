import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async() => {
        await sequelize.close();
    });
    
    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id} , 
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    product_id: "123",
                    quantity: ordemItem.quantity,
                    order_id: "123",
                }
            ]
        });

    });

    it("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        // criando novo cliente
        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
        order.changeCustomer(customer2.id);
        
        // criando novo produto
        const product2 = new Product("789", "Product 2", 10);
        await productRepository.create(product2);
        ordemItem.changeProduct(product2.id);

        await orderRepository.update(order);
        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id} , 
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "456",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    product_id: "789",
                    quantity: ordemItem.quantity,
                    order_id: "123",
                }
            ]
        });

    });

    it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        
        const ordemItem2 = new OrderItem("2", product.name, product.price, product.id, 2);
        const order2 = new Order("456", "123", [ordemItem2]);

        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);
    });

    
})