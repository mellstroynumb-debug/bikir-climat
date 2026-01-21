'use server';

import type { Order, Product } from '@/lib/types';

function formatOrderMessage(order: Order, product: Product): string {
    const details = [
        `*Новый быстрый заказ!* 🎉`,
        `--------------------------`,
        `*Клиент:* ${order.customerName}`,
        `*Телефон:* \`${order.phone}\``,
        `*Адрес:* ${order.address}`,
        `--------------------------`,
        `*Товар:* ${product.title}`,
        `*Цена:* ${new Intl.NumberFormat('ru-RU').format(order.totalPrice)} ${order.currency}`,
        `--------------------------`,
        `*ID Заказа:* \`${order.id}\``,
    ];
    // Escape markdown characters for safe rendering
    return details.join('\n').replace(/([_*\[\]()~`>#\+\-=|{}.!])/g, '\\$1');
}

export async function sendTelegramNotification(orderId: string, orderData: Omit<Order, 'id'| 'createdAt'> & { createdAt: any }, product: Product) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram bot token or chat ID is not configured.');
        return { success: false, message: 'Telegram bot is not configured.' };
    }

    const fullOrder: Order = { ...orderData, id: orderId };
    const message = formatOrderMessage(fullOrder, product);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'MarkdownV2',
            }),
        });

        const result = await response.json();

        if (!result.ok) {
            console.error('Telegram API error:', result.description);
            return { success: false, message: `Telegram API error: ${result.description}` };
        }

        return { success: true, message: 'Notification sent.' };

    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return { success: false, message: 'Failed to send notification.' };
    }
}
