'use server';

import type { Order } from '@/lib/types';

// Helper function to escape characters for Telegram's MarkdownV2 parse mode
function escapeMarkdownV2(text: string): string {
    // Chars to escape: _ * [ ] ( ) ~ ` > # + - = | { } . !
    return String(text).replace(/([_*\[\]()~`>#\+\-=|{}.!])/g, '\\$1');
}

function formatOrderMessage(order: Partial<Order>, items: { title: string; quantity: number }[], type: 'quick' | 'cart' | 'callback'): string {
    const title = type === 'quick' 
        ? '*Новый быстрый заказ!* 🎉' 
        : type === 'cart' 
        ? '*Новый заказ из корзины!* 🛒'
        : '*Новая заявка на обратный звонок!* 📞';

    const clientDetails = [
        `*Клиент:* ${escapeMarkdownV2(order.customerName || 'Не указано')}`,
        `*Телефон:* \`${escapeMarkdownV2(order.phone || 'Не указано')}\``,
    ];

    if (type !== 'callback') {
        const itemLines = items.map(item => 
            `\\- ${escapeMarkdownV2(item.title)} (x${item.quantity})`
        ).join('\n');
        
        const orderDetails = [
            `*Адрес:* ${escapeMarkdownV2(order.address || 'Не указан')}`,
            `--------------------------`,
            `*Товары:*\n${itemLines}`,
            `--------------------------`,
            `*Общая сумма:* ${new Intl.NumberFormat('ru-RU').format(order.totalPrice || 0)} ${order.currency}`,
            `--------------------------`,
            `*ID Заказа:* \`${escapeMarkdownV2(order.id || 'N/A')}\``,
        ];
        return [title, `--------------------------`, ...clientDetails, ...orderDetails].join('\n');
    }

    // Simplified message for callbacks
    return [title, `--------------------------`, ...clientDetails].join('\n');
}

export async function sendTelegramNotification(
    orderId: string, 
    orderData: Partial<Omit<Order, 'id'| 'createdAt'>> & { createdAt: any }, 
    items: { title: string, quantity: number }[],
    type: 'quick' | 'cart' | 'callback'
) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram bot token or chat ID is not configured.');
        return { success: false, message: 'Telegram bot is not configured.' };
    }

    const fullOrder: Partial<Order> = { ...orderData, id: orderId };
    const message = formatOrderMessage(fullOrder, items, type);
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
