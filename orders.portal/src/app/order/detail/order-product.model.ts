export interface OrderProduct {
    customerId: number,
    orderId: number,
    Products: Array<Products>
}
export interface Products {
    price: number,
    productId: number,
    quantity: number

}