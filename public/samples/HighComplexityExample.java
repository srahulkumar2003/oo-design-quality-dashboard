public class HighComplexityExample {
    private OrderRepository orderRepository;
    private PaymentClient paymentClient;
    private MailService mailService;

    public void processOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order is required");
        }
        if (order.isPaid()) {
            mailService.sendSuccess(order);
        } else {
            if (order.getTotal() > 1000) {
                paymentClient.verifyLimit(order);
            }
            paymentClient.charge(order);
            orderRepository.save(order);
            mailService.sendInvoice(order);
        }
    }

    public void cancelOrder(Order order) {
        if (order.isShipped()) {
            throw new IllegalStateException("Cannot cancel shipped order");
        }
        paymentClient.refund(order);
        orderRepository.delete(order);
        mailService.sendCancellation(order);
    }
}
