'use server';

import type { Order, Product } from '@/lib/types';

// Helper function to escape characters for Telegram's MarkdownV2 parse mode
function escapeMarkdownV2(text: string): string {
    // Chars to escape: _ * [ ] ( ) ~ ` > # + - = | { } . !
    return String(text).replace(/([_*\[\]()~`>#\+\-=|{}.!])/g, '\\$1');
}

function formatOrderMessage(order: Order, product: Product): string {
    const details = [
        `*Новый быстрый заказ!* 🎉`,
        `--------------------------`,
        `*Клиент:* ${escapeMarkdownV2(order.customerName)}`,
        `*Телефон:* \`${escapeMarkdownV2(order.phone)}\``,
        `*Адрес:* ${escapeMarkdownV2(order.address)}`,
        `--------------------------`,
        `*Товар:* ${escapeMarkdownV2(product.title)}`,
        `*Цена:* ${new Intl.NumberFormat('ru-RU').format(order.totalPrice)} ${order.currency}`, // currency is safe
        `--------------------------`,
        `*ID Заказа:* \`${escapeMarkdownV2(order.id)}\``,
    ];
    return details.join('\n');
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
            console.error('Telegram API error:', result.description, 'Raw message:', message);
            return { success: false, message: `Telegram API error: ${result.description}` };
        }

        return { success: true, message: 'Notification sent.' };

    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return { success: false, message: 'Failed to send notification.' };
    }
}
