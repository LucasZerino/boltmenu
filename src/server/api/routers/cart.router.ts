import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";

interface CartItem {
    categoryId: string;
    itemId: string;
    menuId: string;
    quantity: number;
}

interface Cart {
    items: CartItem[];
    userId: string;
}

const userCarts = new Map<string, Cart>();

function createCart(userId: string): Cart {
    return {
        items: [],
        userId,
    };
}

function getCart(userId: string): Cart {
    let cart = userCarts.get(userId);

    if (!cart) {
        cart = createCart(userId);
        userCarts.set(userId, cart);
    }

    return cart;
}

function addToCart(userId: string, menuId: string, categoryId: string, itemId: string, quantity: number): Cart {
    const cart = getCart(userId);

    const existingItem = cart.items.find(
        (item) => item.menuId === menuId && item.categoryId === categoryId && item.itemId === itemId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ categoryId, itemId, menuId, quantity });
    }

    return cart;
}

function removeFromCart(userId: string, menuId: string, categoryId: string, itemId: string): Cart {
    const cart = getCart(userId);

    const itemIndex = cart.items.findIndex(
        (item) => item.menuId === menuId && item.categoryId === categoryId && item.itemId === itemId
    );

    if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
    }

    return cart;
}

function clearCart(userId: string): Cart {
    const cart = getCart(userId);
    cart.items = [];
    return cart;
}

export const cartRouter = createTRPCRouter({
    addToCart: protectedProcedure
        .input(
            z.object({
                categoryId: z.string(),
                itemId: z.string(),
                menuId: z.string(),
                quantity: z.number(),
                userId: z.string(),
            })
        )
        .mutation(({ input }) => {
            const { userId, menuId, categoryId, itemId, quantity } = input;
            const cart = addToCart(userId, menuId, categoryId, itemId, quantity);
            return cart;
        }),

    clearCart: protectedProcedure.input(z.string()).mutation(({ input }) => {
        const cart = clearCart(input);
        return cart;
    }),

    removeFromCart: protectedProcedure
        .input(
            z.object({
                categoryId: z.string(),
                itemId: z.string(),
                menuId: z.string(),
                userId: z.string(),
            })
        )
        .mutation(({ input }) => {
            const { userId, menuId, categoryId, itemId } = input;
            const cart = removeFromCart(userId, menuId, categoryId, itemId);
            return cart;
        }),
});

export default cartRouter;
